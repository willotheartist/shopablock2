import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { syncOrder } from "@/lib/orders";
import { getSessionUser } from "@/lib/auth";
import { tokenMatches, clientIP } from "@/lib/v2/security";
import { sameOrigin, failure, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOrigin(req);
    await rateLimit(`order-sync:${clientIP(req)}`, 60, 900);
    const { id } = await params;
    const b = await req.json();
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) throw new AppError("Order not found.", 404);
    const user = await getSessionUser();
    if (
      user?.id !== order.sellerId &&
      !tokenMatches(String(b.token || ""), order.accessTokenHash)
    )
      throw new AppError("Order not found.", 404);
    const o = await syncOrder(id);
    return NextResponse.json({ status: o?.status });
  } catch (e) {
    return failure(e);
  }
}
