//·src/app/api/kompipay/connect/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  kompipayCreateOnboardingLink,
  kompipayCreateSellerAccount,
} from "@/lib/kompipay";
import { PayoutsStatus } from "@prisma/client";

function getOriginFromBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const origin = (body as Record<string, unknown>).origin;
  return typeof origin === "string" ? origin : null;
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const origin = getOriginFromBody(body) ?? process.env.NEXT_PUBLIC_APP_ORIGIN;
  if (!origin) {
    return NextResponse.json({ error: "Missing origin" }, { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  let kompipayAccountId = dbUser.kompipayAccountId;
  let stripeConnectedAccountId = dbUser.stripeConnectedAccountId ?? undefined;

  if (!kompipayAccountId) {
    const created = await kompipayCreateSellerAccount({
      referenceId: dbUser.id,
      email: dbUser.email,
    });

    kompipayAccountId = created.kompipayAccountId;
    stripeConnectedAccountId = created.stripeConnectedAccountId;

    await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        kompipayAccountId,
        stripeConnectedAccountId: stripeConnectedAccountId ?? null,
        payoutsStatus: PayoutsStatus.pending,
      },
    });
  }

  const returnUrl = `${origin}/app/settings?kp=return`;
  const refreshUrl = `${origin}/app/settings?kp=refresh`;

  const link = await kompipayCreateOnboardingLink({
    kompipayAccountId,
    returnUrl,
    refreshUrl,
  });

  return NextResponse.json({ url: link.url });
}
