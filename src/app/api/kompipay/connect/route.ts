//·src/app/api/kompipay/connect/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import {
  kompipayCreateOnboardingLink,
  kompipayCreateSellerAccount,
} from "@/lib/kompipay";
import { PayoutsStatus } from "@prisma/client";

type Body = {
  origin?: unknown;
};

function getOrigin(body: Body, req: Request) {
  if (typeof body.origin === "string" && body.origin.trim()) return body.origin.trim();
  const envOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;
  if (envOrigin && envOrigin.trim()) return envOrigin.trim();
  const hdrOrigin = req.headers.get("origin");
  if (hdrOrigin && hdrOrigin.trim()) return hdrOrigin.trim();
  return null;
}

function errJson(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return errJson("Unauthorized", 401);

    const body = (await req.json().catch(() => ({}))) as Body;
    const origin = getOrigin(body, req);
    if (!origin) return errJson("Missing origin", 400);

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return errJson("User not found", 404);

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

    if (!link?.url) return errJson("KompiPay did not return an onboarding URL", 502);

    return NextResponse.json({ url: link.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown server error";
    // Always return JSON so the client can show it.
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
