import "server-only";
import { AppError } from "@/lib/v2/http";
export function paymentsConfigured() {
  return (
    !!process.env.KOMPIPAY_PLATFORM_API_KEY &&
    !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_")
  );
}
export async function kp<T>(
  path: string,
  body?: Record<string, unknown>,
  idempotencyKey?: string,
): Promise<T> {
  const key = process.env.KOMPIPAY_PLATFORM_API_KEY;
  if (!key)
    throw new AppError(
      "Payments are being set up. You can keep building and saving your shop.",
      503,
    );
  const base = (
    process.env.KOMPIPAY_BASE_URL || "https://kompipay.com"
  ).replace(/\/$/, "");
  const response = await fetch(`${base}/api/v2${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    console.error("KompiPay request failed", {
      status: response.status,
      path: path.split("/").slice(0, 2).join("/"),
    });
    throw new AppError(
      response.status === 401 || response.status === 403
        ? "Payment setup needs attention. Please contact the shop owner."
        : "The payment provider is temporarily unavailable. Please try again.",
      503,
    );
  }
  return response.json() as Promise<T>;
}
export type KpSeller = {
  id: string;
  status: string;
  stripeAccountId: string;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
};
export type KpPayment = {
  id: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: string;
  stripePaymentIntentId: string;
  clientSecret?: string;
  metadata?: Record<string, string>;
};
