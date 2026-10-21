import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncOrder } from "@/lib/orders";
import { sameOrigin, requireUser, failure } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const u = await requireUser();
    await rateLimit(`seller-order-sync:${u.id}`, 12, 3600);
    const pending = await prisma.order.findMany({
      where: {
        sellerId: u.id,
        status: "pending",
        kompipayPaymentId: { not: null },
      },
      select: { id: true },
      take: 20,
      orderBy: { updatedAt: "asc" },
    });
    const result = await Promise.allSettled(
      pending.map((o) => syncOrder(o.id)),
    );
    return NextResponse.json({
      checked: pending.length,
      failed: result.filter((r) => r.status === "rejected").length,
    });
  } catch (e) {
    return failure(e);
  }
}
