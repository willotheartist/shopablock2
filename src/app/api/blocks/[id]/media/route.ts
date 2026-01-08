import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { saveBlockImages } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> | { id: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const resolved = await Promise.resolve(ctx.params);
  const blockId = String(resolved?.id ?? "").trim();
  if (!blockId) {
    return NextResponse.json({ error: "missing_block_id" }, { status: 400 });
  }

  const block = await prisma.block.findFirst({
    where: { id: blockId, ownerId: user.id },
    select: { id: true },
  });

  if (!block) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const form = await req.formData();
  const files = form
    .getAll("media")
    .filter((v): v is File => typeof v === "object" && v !== null);

  if (!files.length) {
    return NextResponse.json({ ok: true, added: 0 });
  }

  const saved = await saveBlockImages({ blockId, files });

  if (!saved.length) {
    return NextResponse.json({ ok: true, added: 0 });
  }

  const existingCount = await prisma.blockMedia.count({
    where: { blockId },
  });

  await prisma.blockMedia.createMany({
    data: saved.map((s, i) => ({
      blockId,
      url: s.url,
      sort: existingCount + i,
    })),
  });

  return NextResponse.json({ ok: true, added: saved.length });
}
