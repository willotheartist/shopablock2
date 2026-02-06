//·src/app/api/checkout/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOrder } from "@/lib/orders";
import { kompipayCreateCheckout } from "@/lib/kompipay";

export async function POST(req: Request) {
  const body = await req.json();

  const blockId = String(body?.blockId || "");
  const buyerEmail = String(body?.email || "");

  if (!blockId || !buyerEmail) {
    return NextResponse.json(
      { error: "Missing blockId or email" },
      { status: 400 }
    );
  }

  const block = await prisma.block.findUnique({
    where: { id: blockId },
    include: { owner: true },
  });

  if (!block) {
    return NextResponse.json({ error: "Block not found" }, { status: 404 });
  }

  if (!block.owner.kompipayAccountId) {
    return NextResponse.json(
      { error: "Seller payouts not connected" },
      { status: 400 }
    );
  }

  const order = await createOrder({
    blockId: block.id,
    sellerId: block.ownerId,
    email: buyerEmail,
  });

  const origin =
    process.env.NEXT_PUBLIC_APP_ORIGIN ||
    req.headers.get("origin") ||
    "http://localhost:3000";

  const successUrl = `${origin}/receipt/${order.id}`;
  const cancelUrl = `${origin}/${block.handle}?cancelled=1`;

  const checkout = await kompipayCreateCheckout({
    orderId: order.id,
    kompipayAccountId: block.owner.kompipayAccountId,
    amount: order.amount,
    currency: order.currency,
    buyerEmail,
    successUrl,
    cancelUrl,
    metadata: {
      orderId: order.id,
      blockId: block.id,
      sellerId: block.ownerId,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      kompipayPaymentId: checkout.kompipayPaymentId ?? null,
      stripeCheckoutSessionId: checkout.stripeCheckoutSessionId ?? null,
      stripePaymentIntentId: checkout.stripePaymentIntentId ?? null,
    },
  });

  return NextResponse.json({ url: checkout.checkoutUrl, orderId: order.id });
}
