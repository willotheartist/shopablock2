import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, sameOrigin, failure, AppError } from "@/lib/v2/http";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const u = await requireUser();
    const d = await req.json();
    if (typeof d.displayName !== "string" || d.displayName.length > 80)
      throw new AppError("Use a name under 80 characters.");
    await prisma.user.update({
      where: { id: u.id },
      data: { displayName: d.displayName.trim() },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
