import { head } from "@vercel/blob";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireUser, sameOrigin, failure, AppError } from "@/lib/v2/http";
import { z } from "zod";
const schema = z.object({
  pathname: z.string().max(240),
  name: z.string().min(1).max(180),
  kind: z.enum(["image", "digital"]),
});
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const u = await requireUser();
    const p = schema.safeParse(await req.json());
    if (!p.success) throw new AppError("Invalid file.");
    const d = p.data;
    if (!d.pathname.startsWith(`${u.id}/`) || d.pathname.includes(".."))
      throw new AppError("File not found.", 404);
    const blob = await head(d.pathname);
    if (
      d.kind === "image" &&
      !["image/jpeg", "image/png", "image/webp"].includes(blob.contentType)
    )
      throw new AppError("Use a JPG, PNG or WebP photo.");
    if (blob.size > (d.kind === "image" ? 5 : 50) * 1024 * 1024)
      throw new AppError("This file is too large.");
    const asset = await prisma.asset.upsert({
      where: { pathname: d.pathname },
      create: {
        ...d,
        ownerId: u.id,
        contentType: blob.contentType,
        size: blob.size,
      },
      update: {},
    });
    if (asset.ownerId !== u.id) throw new AppError("File not found.", 404);
    return NextResponse.json({
      id: asset.id,
      url: `/api/assets/${asset.id}`,
      name: asset.name,
    });
  } catch (e) {
    return failure(e);
  }
}
