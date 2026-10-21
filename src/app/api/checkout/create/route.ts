import { NextResponse } from "next/server";
import { checkoutSchema, createOrder, preparePayment } from "@/lib/orders";
import { sameOrigin, failure, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
import { clientIP } from "@/lib/v2/security";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    await rateLimit(`checkout:${clientIP(req)}`, 12, 900);
    const p = checkoutSchema.safeParse(await req.json());
    if (!p.success)
      throw new AppError("Please check your email and delivery details.");
    const order = await createOrder(p.data);
    const payment = await preparePayment(order.id);
    return NextResponse.json({
      ...payment,
      orderId: order.id,
      receiptUrl: `/receipt/${order.id}?token=${encodeURIComponent(p.data.accessToken)}`,
    });
  } catch (e) {
    return failure(e);
  }
}
