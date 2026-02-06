//·src/lib/kompipay.ts
import "server-only";

type Json = Record<string, unknown>;

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const BASE_URL = mustEnv("KOMPIPAY_BASE_URL").replace(/\/+$/, "");
const SECRET_KEY =
  process.env.KOMPIPAY_SECRET_KEY || process.env.KOMPIPAY_API_KEY || "";

if (!SECRET_KEY) {
  throw new Error(
    "Missing env var: set KOMPIPAY_SECRET_KEY (preferred) or KOMPIPAY_API_KEY"
  );
}

type KpFetchInit = RequestInit & { json?: Json };

async function kpFetch<T>(path: string, init: KpFetchInit = {}): Promise<T> {
  const url = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${SECRET_KEY}`,
    Accept: "application/json",
  };

  if (init.json) headers["Content-Type"] = "application/json";

  const method = (init.method ?? "GET").toUpperCase();

  const res = await fetch(url, {
    ...init,
    method,
    headers: { ...headers, ...(init.headers as Record<string, string> | undefined) },
    body: init.json ? JSON.stringify(init.json) : init.body,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;

  try {
    data = text ? (JSON.parse(text) as unknown) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      typeof data === "string"
        ? data
        : JSON.stringify(data ?? { error: "Unknown error" });

    throw new Error(
      `KompiPay ${method} ${url} -> ${res.status} ${res.statusText}: ${msg}`
    );
  }

  return data as T;
}

function normalizeCurrency(currency: string) {
  const c = String(currency || "").trim().toUpperCase();
  return c || "GBP";
}

/**
 * KompiPay v1 SDK Checkout
 * POST /api/sdk/checkout
 *
 * Payload (per KompiPay):
 * {
 *   "product": { "title": "...", "price": 5000, "currency": "GBP" },
 *   "quantity": 1,
 *   "metadata": { "shopablockOrderId": "SB_123" }
 * }
 *
 * Expected response:
 * { "orderId": "...", "checkoutUrl": "..." }
 */
export async function kompipayCreateCheckout(input: {
  title: string;
  price: number; // minor units (integer)
  currency: string; // GBP
  quantity: number;
  metadata?: Record<string, string>;
}) {
  const title = String(input.title || "").trim() || "ShopaBlock Order";

  // ensure integer minor units
  const price = Number.isFinite(input.price) ? Math.trunc(input.price) : 0;
  if (price <= 0) throw new Error("Invalid price for KompiPay checkout");

  const quantity = Number.isFinite(input.quantity) ? Math.trunc(input.quantity) : 1;
  if (quantity <= 0) throw new Error("Invalid quantity for KompiPay checkout");

  const currency = normalizeCurrency(input.currency);

  return kpFetch<{ orderId: string; checkoutUrl: string }>("/api/sdk/checkout", {
    method: "POST",
    json: {
      product: { title, price, currency },
      quantity,
      metadata: input.metadata ?? {},
    },
  });
}
