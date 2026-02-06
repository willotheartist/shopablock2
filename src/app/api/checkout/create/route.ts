//·src/app/api/checkout/create/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOrder } from "@/lib/orders";
import { kompipayCreateCheckout } from "@/lib/kompipay";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const blockId = String(body?.blockId || "").trim();
    const buyerEmail = String(body?.email || "").trim();

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

    // Create ShopaBlock order first (DB record)
    const order = await createOrder({
      blockId: block.id,
      sellerId: block.ownerId,
      email: buyerEmail,
    });

    // KompiPay v1: Create Checkout -> Redirect (NO seller onboarding API)
    const checkout = await kompipayCreateCheckout({
      title: `ShopaBlock Order`,
      price: order.amount,
      currency: order.currency,
      quantity: 1,
      metadata: {
        shopablockOrderId: order.id,
        blockId: block.id,
        sellerId: block.ownerId,
      },
    });

    // Store KompiPay orderId in existing field
    await prisma.order.update({
      where: { id: order.id },
      data: {
        kompipayPaymentId: checkout.orderId,
      },
    });

    return NextResponse.json({ url: checkout.checkoutUrl, orderId: order.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
