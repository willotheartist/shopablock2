import "server-only";
import { paymentsConfigured } from "@/lib/kompipay";
import { prisma } from "@/lib/db";
import { Prisma, type Block, type BlockMedia } from "@prisma/client";
import {
  draftSchema,
  type Draft,
  launchChecks,
  minorUnits,
  productOptions,
  reservedHandles,
  slugify,
} from "./product";
import { AppError } from "./http";
export function toDraft(b: Block & { media: BlockMedia[] }): Draft {
  return {
    title: b.title,
    description: b.description,
    handle: b.handle,
    brandName: b.brandName,
    price: (b.price / 100).toFixed(2),
    quantity: b.quantity === null ? "" : String(b.quantity),
    deliveryType: b.deliveryType,
    shippingPrice: (b.shippingPrice / 100).toFixed(2),
    deliveryNote: b.deliveryNote,
    options: Array.isArray(b.options) ? b.options.join(", ") : "",
    digitalAssetId: b.digitalAssetId,
    media: b.media.map((m) => ({ url: m.url, id: m.id })),
  };
}
export async function saveProduct(
  ownerId: string,
  input: unknown,
  id?: string,
) {
  const parsed = draftSchema.safeParse((input as { draft?: unknown })?.draft);
  if (!parsed.success)
    throw new AppError("Check your product details and try again.");
  const body = input as {
    publish?: boolean;
    archive?: boolean;
    updatedAt?: string;
  };
  const d = parsed.data;
  const handle = slugify(d.handle || d.title);
  if (!handle || reservedHandles.has(handle))
    throw new AppError("Choose a different shop link.");
  const price = d.price === "" ? 0 : minorUnits(d.price);
  const shipping = d.shippingPrice === "" ? 0 : minorUnits(d.shippingPrice);
  if (price === null || shipping === null)
    throw new AppError("Enter prices with no more than two decimal places.");
  if (
    d.quantity !== "" &&
    (!/^\d+$/.test(d.quantity) || Number(d.quantity) > 1000000)
  )
    throw new AppError("Enter a whole number for quantity.");
  const quantity = d.quantity === "" ? null : Number(d.quantity);
  const owner = await prisma.user.findUniqueOrThrow({ where: { id: ownerId } });
  const existing = id
    ? await prisma.block.findFirst({
        where: { id, ownerId },
        include: { media: true },
      })
    : null;
  if (id && !existing) throw new AppError("Product not found.", 404);
  if (existing && body.updatedAt !== existing.updatedAt.toISOString())
    throw new AppError(
      "This product changed in another tab. Reload before saving.",
      409,
    );
  if (
    existing &&
    quantity !== null &&
    quantity < existing.soldCount + existing.reservedCount
  )
    throw new AppError(
      "Quantity cannot be lower than sold and reserved units.",
    );
  const assets = await prisma.asset.findMany({ where: { ownerId } });
  const photos = new Set(
    assets.filter((a) => a.kind === "image").map((a) => `/api/assets/${a.id}`),
  );
  const oldMedia = new Set(existing?.media.map((m) => m.url) || []);
  if (d.media.some((m) => !photos.has(m.url) && !oldMedia.has(m.url)))
    throw new AppError("Upload your own product photos before saving.");
  if (
    d.digitalAssetId &&
    !assets.some((a) => a.id === d.digitalAssetId && a.kind === "digital")
  )
    throw new AppError("The download file does not belong to your account.");
  const active = body.publish === true;
  if (active) {
    if (!paymentsConfigured())
      throw new AppError(
        "Payments are still being connected. Your product can be saved as a draft.",
        503,
      );
    const missing = launchChecks(
      d,
      owner.payoutsStatus === "active" && !!owner.kompipayAccountId,
    ).filter((c) => !c.ok);
    if (missing.length)
      throw new AppError(
        `Before publishing: ${missing.map((c) => c.label.toLowerCase()).join(", ")}.`,
      );
  }
  const data = {
    title: d.title.trim() || "Untitled product",
    description: d.description.trim(),
    handle,
    brandName: d.brandName.trim(),
    price,
    currency: "GBP",
    quantity,
    deliveryType: d.deliveryType,
    shippingPrice: d.deliveryType === "digital" ? 0 : shipping,
    deliveryNote: d.deliveryNote.trim(),
    options: productOptions(d),
    digitalAssetId: d.deliveryType === "digital" ? d.digitalAssetId : null,
    status: active ? ("active" as const) : ("draft" as const),
    archivedAt: body.archive ? new Date() : null,
  };
  try {
    return await prisma.$transaction(async (tx) => {
      if (existing) {
        const result = await tx.block.updateMany({
          where: {
            id: existing.id,
            ownerId,
            updatedAt: existing.updatedAt,
            soldCount: existing.soldCount,
            reservedCount: existing.reservedCount,
          },
          data,
        });
        if (result.count !== 1)
          throw new AppError(
            "This product changed. Reload before saving.",
            409,
          );
        await tx.blockMedia.deleteMany({ where: { blockId: existing.id } });
        await tx.blockMedia.createMany({
          data: d.media.map((m, sort) => ({
            blockId: existing.id,
            url: m.url,
            sort,
          })),
        });
        return tx.block.findUniqueOrThrow({
          where: { id: existing.id },
          include: { media: { orderBy: { sort: "asc" } } },
        });
      }
      return tx.block.create({
        data: {
          ...data,
          ownerId,
          media: { create: d.media.map((m, sort) => ({ url: m.url, sort })) },
        },
        include: { media: { orderBy: { sort: "asc" } } },
      });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      throw new AppError("That shop link is already taken. Try another.");
    throw e;
  }
}
