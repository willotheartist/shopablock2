import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { kp, type KpSeller } from "@/lib/kompipay";
import { requireUser, sameOrigin, failure, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await requireUser();
    await rateLimit(`sync:${user.id}`, 20, 3600);
    if (!user.kompipayAccountId) throw new AppError("Connect payments first.");
    const s = await kp<KpSeller>(
      `/sellers/${encodeURIComponent(user.kompipayAccountId)}?sync=1`,
    );
    const status =
      s.chargesEnabled && s.payoutsEnabled
        ? "active"
        : s.status === "RESTRICTED"
          ? "restricted"
          : "pending";
    await prisma.user.update({
      where: { id: user.id },
      data: {
        payoutsStatus: status,
        stripeConnectedAccountId: s.stripeAccountId,
        payoutsEnabledAt: status === "active" ? new Date() : null,
      },
    });
    return NextResponse.json({ status });
  } catch (e) {
    return failure(e);
  }
}
