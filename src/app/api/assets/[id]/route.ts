import { get } from "@vercel/blob";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AppError, failure } from "@/lib/v2/http";
import { tokenHash } from "@/lib/v2/security";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const a = await prisma.asset.findUnique({ where: { id } });
    if (!a) throw new AppError("File not found.", 404);
    const u = await getSessionUser();
    let allowed = u?.id === a.ownerId;
    if (!allowed && a.kind === "image")
      allowed = !!(await prisma.blockMedia.findFirst({
        where: {
          url: `/api/assets/${a.id}`,
          block: { status: { in: ["active", "sold_out"] }, archivedAt: null },
        },
      }));
    if (!allowed && a.kind === "digital") {
      const t = new URL(req.url).searchParams.get("token");
      if (t && t.length < 200)
        allowed = !!(await prisma.order.findFirst({
          where: {
            accessTokenHash: tokenHash(t),
            digitalAssetId: a.id,
            status: { in: ["paid", "fulfilled"] },
          },
        }));
    }
    if (!allowed) throw new AppError("File not found.", 404);
    const b = await get(a.pathname, { access: "private" });
    if (!b || b.statusCode !== 200)
      throw new AppError("File unavailable. Please try again.", 404);
    return new Response(b.stream, {
      headers: {
        "Content-Type": a.contentType,
        "Content-Length": String(a.size),
        "Content-Disposition": `${a.kind === "image" ? "inline" : "attachment"}; filename="${a.name.replace(/[^a-zA-Z0-9._ -]/g, "_")}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch (e) {
    return failure(e);
  }
}
