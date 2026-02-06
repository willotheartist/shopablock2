//·src/app/api/kompipay/webhook/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OrderStatus, PayoutsStatus } from "@prisma/client";
import { kompipayVerifyWebhook } from "@/lib/kompipay";

export const runtime = "nodejs";

type WebhookEvent = {
  type: string;
  data: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getString(rec: Record<string, unknown>, key: string): string | null {
  const v = rec[key];
  return typeof v === "string" ? v : null;
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sig = req.headers.get("kompipay-signature");

  const ok = kompipayVerifyWebhook({ rawBody, signatureHeader: sig });
  if (!ok.ok) {
    return NextResponse.json({ error: ok.error }, { status: 400 });
  }

  let evt: WebhookEvent;
  try {
    evt = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ---- payouts ----
  if (evt.type === "seller.payouts.active") {
    if (!isRecord(evt.data)) return NextResponse.json({ received: true });

    const kompipayAccountId = getString(evt.data, "kompipayAccountId");
    const stripeConnectedAccountId = getString(evt.data, "stripeConnectedAccountId");

    if (!kompipayAccountId) return NextResponse.json({ received: true });

    await prisma.user.updateMany({
      where: { kompipayAccountId },
      data: {
        payoutsStatus: PayoutsStatus.active,
        payoutsEnabledAt: new Date(),
        stripeConnectedAccountId: stripeConnectedAccountId ?? undefined,
      },
    });

    return NextResponse.json({ received: true });
  }

  if (evt.type === "seller.payouts.restricted") {
    if (!isRecord(evt.data)) return NextResponse.json({ received: true });

    const kompipayAccountId = getString(evt.data, "kompipayAccountId");
    if (!kompipayAccountId) return NextResponse.json({ received: true });

    await prisma.user.updateMany({
      where: { kompipayAccountId },
      data: { payoutsStatus: PayoutsStatus.restricted },
    });

    return NextResponse.json({ received: true });
  }

  // ---- payments ----
  if (evt.type === "payment.succeeded") {
    if (!isRecord(evt.data)) return NextResponse.json({ received: true });

    const orderId = getString(evt.data, "orderId");
    const kompipayPaymentId = getString(evt.data, "kompipayPaymentId");
    const stripePaymentIntentId = getString(evt.data, "stripePaymentIntentId");

    if (!orderId) return NextResponse.json({ received: true });

    await prisma.order.updateMany({
      where: { id: orderId },
      data: {
        status: OrderStatus.paid,
        kompipayPaymentId: kompipayPaymentId ?? undefined,
        stripePaymentIntentId: stripePaymentIntentId ?? undefined,
      },
    });

    return NextResponse.json({ received: true });
  }

  if (evt.type === "payment.failed") {
    if (!isRecord(evt.data)) return NextResponse.json({ received: true });

    const orderId = getString(evt.data, "orderId");
    if (!orderId) return NextResponse.json({ received: true });

    await prisma.order.updateMany({
      where: { id: orderId },
      data: { status: OrderStatus.cancelled },
    });

    return NextResponse.json({ received: true });
  }

  return NextResponse.json({ received: true });
}
