import { NextResponse } from "next/server";
import { requireUser, sameOrigin, failure } from "@/lib/v2/http";
import { saveProduct } from "@/lib/v2/products";
import { rateLimit } from "@/lib/v2/rate-limit";
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    sameOrigin(req);
    const u = await requireUser();
    await rateLimit(`product:${u.id}`, 60, 3600);
    const { id } = await params;
    const b = await saveProduct(u.id, await req.json(), id);
    return NextResponse.json({
      id: b.id,
      handle: b.handle,
      status: b.status,
      updatedAt: b.updatedAt,
    });
  } catch (e) {
    return failure(e);
  }
}
