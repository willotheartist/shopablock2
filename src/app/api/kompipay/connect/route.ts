import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { kp, type KpSeller } from "@/lib/kompipay";
import { requireUser, sameOrigin, failure, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await requireUser();
    await rateLimit(`connect:${user.id}`, 5, 3600);
    if (!process.env.KOMPIPAY_PLATFORM_API_KEY)
      throw new AppError(
        "Payments are being set up. Your drafts are safe; please check back soon.",
        503,
      );
    let sellerId = user.kompipayAccountId;
    if (!sellerId) {
      const claim = await prisma.user.updateMany({
        where: {
          id: user.id,
          payoutsStatus: "not_started",
          kompipayAccountId: null,
        },
        data: { payoutsStatus: "pending" },
      });
      if (!claim.count)
        throw new AppError(
          "Payment account setup is already in progress. Contact support if it does not complete.",
          409,
        );
      const seller = await kp<KpSeller>("/sellers", {
        email: user.email,
        externalId: user.id,
      });
      sellerId = seller.id;
      await prisma.user.update({
        where: { id: user.id },
        data: {
          kompipayAccountId: sellerId,
          stripeConnectedAccountId: seller.stripeAccountId,
        },
      });
    }
    const origin = new URL(req.url).origin;
    const link = await kp<{ url: string }>(
      `/sellers/${encodeURIComponent(sellerId)}/onboarding-link`,
      {
        returnUrl: `${origin}/app/settings?connect=returned`,
        refreshUrl: `${origin}/app/settings?connect=refresh`,
      },
    );
    const target = new URL(link.url);
    if (
      target.protocol !== "https:" ||
      !target.hostname.endsWith(".stripe.com")
    )
      throw new AppError("Unable to open payment verification.", 502);
    return NextResponse.json({ url: link.url });
  } catch (e) {
    return failure(e);
  }
}
