import "server-only";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { kp, type KpPayment, paymentsConfigured } from "./kompipay";
import { AppError } from "./v2/http";
import { tokenHash, tokenMatches } from "./v2/security";
import { paymentMatches, paymentState } from "./v2/payments";
export const checkoutSchema = z.object({
  blockId: z.string().min(1).max(80),
  email: z.email().max(254),
  checkoutKey: z.uuid(),
  accessToken: z.string().regex(/^[a-zA-Z0-9_-]{43}$/),
  option: z.string().max(100).default(""),
  shipName: z.string().max(100).default(""),
  shipLine1: z.string().max(150).default(""),
  shipLine2: z.string().max(150).default(""),
  shipCity: z.string().max(80).default(""),
  shipPostcode: z.string().max(16).default(""),
  shipCountry: z.literal("GB").default("GB"),
});
export async function createOrder(input: z.infer<typeof checkoutSchema>) {
  if (!paymentsConfigured())
    throw new AppError(
      "This shop is not accepting payments yet. Please check back soon.",
      503,
    );
  const previous = await prisma.order.findUnique({
    where: { checkoutKey: input.checkoutKey },
  });
  if (previous) {
    if (
      !tokenMatches(input.accessToken, previous.accessTokenHash) ||
      previous.blockId !== input.blockId
    )
      throw new AppError("Checkout session could not be verified.", 403);
    return previous;
  }
  try {
    return await prisma.$transaction(async (tx) => {
      const b = await tx.block.findUnique({
        where: { id: input.blockId },
        include: { owner: true },
      });
      if (!b || b.archivedAt || b.status !== "active")
        throw new AppError("This product is not available.", 409);
      if (b.owner.payoutsStatus !== "active" || !b.owner.kompipayAccountId)
        throw new AppError("This shop is not accepting payments yet.", 409);
      const options = Array.isArray(b.options) ? b.options : [];
      if (options.length && !options.includes(input.option))
        throw new AppError("Choose a product option.");
      if (
        b.deliveryType === "physical" &&
        (!input.shipName.trim() ||
          !input.shipLine1.trim() ||
          !input.shipCity.trim() ||
          !/^[A-Z0-9 ]{5,10}$/i.test(input.shipPostcode))
      )
        throw new AppError("Add your full UK delivery address.");
      if (b.deliveryType === "digital" && !b.digitalAssetId)
        throw new AppError("This download is unavailable.", 409);
      const changed =
        await tx.$executeRaw`UPDATE "Block" SET "reservedCount"="reservedCount"+1 WHERE "id"=${b.id} AND "status"='active' AND "archivedAt" IS NULL AND ("quantity" IS NULL OR "soldCount"+"reservedCount"<"quantity")`;
      if (changed !== 1)
        throw new AppError("This product has just sold out.", 409);
      const shipping = b.deliveryType === "physical" ? b.shippingPrice : 0;
      return tx.order.create({
        data: {
          blockId: b.id,
          sellerId: b.ownerId,
          amount: b.price + shipping,
          shippingAmount: shipping,
          currency: b.currency,
          email: input.email.toLowerCase(),
          checkoutKey: input.checkoutKey,
          accessTokenHash: tokenHash(input.accessToken),
          option: input.option || null,
          productTitle: b.title,
          digitalAssetId:
            b.deliveryType === "digital" ? b.digitalAssetId : null,
          ...(b.deliveryType === "physical"
            ? {
                shipName: input.shipName,
                shipLine1: input.shipLine1,
                shipLine2: input.shipLine2,
                shipCity: input.shipCity,
                shipPostcode: input.shipPostcode.toUpperCase(),
                shipCountry: "GB",
              }
            : {}),
        },
      });
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const o = await prisma.order.findUnique({
        where: { checkoutKey: input.checkoutKey },
      });
      if (
        o &&
        tokenMatches(input.accessToken, o.accessTokenHash) &&
        o.blockId === input.blockId
      )
        return o;
    }
    throw e;
  }
}
export async function preparePayment(orderId: string) {
  const order = await prisma.order.findUniqueOrThrow({
    where: { id: orderId },
    include: { seller: true },
  });
  if (order.status !== "pending") return { completed: true };
  if (!order.seller.kompipayAccountId)
    throw new AppError("Payment account unavailable.", 503);
  const result = await kp<KpPayment>(
    "/payments",
    {
      sellerId: order.seller.kompipayAccountId,
      amount: order.amount,
      currency: order.currency.toLowerCase(),
      metadata: { shopablockOrderId: order.id, blockId: order.blockId },
      idempotencyKey: `shopablock-${order.id}`,
    },
    `shopablock-${order.id}`,
  );
  if (!result.clientSecret || !result.id)
    throw new AppError("Unable to prepare payment. Please try again.", 503);
  await prisma.order.update({
    where: { id: order.id },
    data: {
      kompipayPaymentId: result.id,
      stripePaymentIntentId: result.stripePaymentIntentId,
    },
  });
  return { clientSecret: result.clientSecret, completed: false };
}
export async function syncOrder(id: string) {
  const o = await prisma.order.findUnique({
    where: { id },
    include: { seller: { select: { kompipayAccountId: true } } },
  });
  if (!o || o.status !== "pending" || !o.kompipayPaymentId) return o;
  const p = await kp<KpPayment>(
    `/payments/${encodeURIComponent(o.kompipayPaymentId)}`,
  );
  if (
    !o.seller.kompipayAccountId ||
    !paymentMatches(p, o, o.seller.kompipayAccountId) ||
    p.stripePaymentIntentId !== o.stripePaymentIntentId
  )
    throw new AppError(
      "Payment details could not be verified. Please contact the seller.",
      409,
    );
  const state = paymentState(p.status);
  if (state === "pending") return o;
  await prisma.$transaction(async (tx) => {
    const claimed = await tx.order.updateMany({
      where: { id: o.id, status: "pending" },
      data: {
        status: state === "paid" && o.digitalAssetId ? "fulfilled" : state,
        fulfilledAt: state === "paid" && o.digitalAssetId ? new Date() : null,
      },
    });
    if (!claimed.count) return;
    await tx.block.update({
      where: { id: o.blockId },
      data: {
        reservedCount: { decrement: 1 },
        ...(state === "paid" ? { soldCount: { increment: 1 } } : {}),
      },
    });
  });
  return prisma.order.findUnique({ where: { id } });
}
export async function listOrdersForSeller(sellerId: string) {
  return prisma.order.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    include: { block: true },
    take: 100,
  });
}
