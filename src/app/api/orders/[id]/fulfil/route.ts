import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sameOrigin, requireUser, failure, AppError } from "@/lib/v2/http";
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOrigin(req);
    const u = await requireUser();
    const { id } = await params;
    const b = await req.json();
    const tracking = String(b.tracking || "").slice(0, 160);
    const result = await prisma.order.updateMany({
      where: { id, sellerId: u.id, status: "paid" },
      data: {
        status: "fulfilled",
        fulfilledAt: new Date(),
        trackingReference: tracking || null,
      },
    });
    if (!result.count)
      throw new AppError("This order cannot be marked as sent.", 409);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
