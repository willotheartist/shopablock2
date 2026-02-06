//·src/lib/kompipay.ts
import "server-only";
import crypto from "crypto";

type Json = Record<string, unknown>;

type KpFetchInit = RequestInit & { json?: Json };

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getEnv(name: string) {
  const v = process.env[name];
  return v && v.trim() ? v.trim() : null;
}

/**
 * ENV (supported):
 * - KOMPIPAY_BASE_URL="https://kompipay.com"
 *
 * Secret key (server):
 * - KOMPIPAY_SECRET_KEY="kp_sec_..."   (preferred)
 *   OR
 * - KOMPIPAY_API_KEY="kp_sec_..."      (alias, supported)
 *
 * Public key (optional, client):
 * - KOMPIPAY_PUBLIC_KEY="kp_pub_..."
 *
 * Webhook secret (server, required to verify webhooks):
 * - KOMPIPAY_WEBHOOK_SECRET="whsec_..."
 */
function getBaseUrl() {
  const raw = getEnv("KOMPIPAY_BASE_URL") ?? "https://kompipay.com";
  return raw.replace(/\/+$/, "");
}

function getSecretKey() {
  // Support both names; prefer KOMPIPAY_SECRET_KEY
  const key = getEnv("KOMPIPAY_SECRET_KEY") ?? getEnv("KOMPIPAY_API_KEY");
  if (!key) {
    throw new Error(
      "Missing env var: set KOMPIPAY_SECRET_KEY (preferred) or KOMPIPAY_API_KEY"
    );
  }
  return key;
}

async function kpFetch<T>(path: string, init: KpFetchInit = {}): Promise<T> {
  const baseUrl = getBaseUrl();
  const secretKey = getSecretKey();

  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey}`,
    Accept: "application/json",
  };

  if (init.json) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    ...init,
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
    const msg = typeof data === "string" ? data : safeStringify(data ?? { error: "Unknown error" });
    throw new Error(`KompiPay error ${res.status} ${res.statusText}: ${msg}`);
  }

  return data as T;
}

/**
 * ----------------------------------------------------------------------------
 * Seller / payouts
 * ----------------------------------------------------------------------------
 */

export async function kompipayCreateSellerAccount(input: {
  referenceId: string;
  email: string;
}) {
  return kpFetch<{
    kompipayAccountId: string;
    stripeConnectedAccountId?: string;
  }>("/api/v1/sellers", {
    method: "POST",
    json: {
      referenceId: input.referenceId,
      email: input.email,
    },
  });
}

export async function kompipayCreateOnboardingLink(input: {
  kompipayAccountId: string;
  returnUrl: string;
  refreshUrl: string;
}) {
  return kpFetch<{ url: string }>("/api/v1/sellers/onboarding-link", {
    method: "POST",
    json: {
      kompipayAccountId: input.kompipayAccountId,
      returnUrl: input.returnUrl,
      refreshUrl: input.refreshUrl,
    },
  });
}

/**
 * ----------------------------------------------------------------------------
 * Checkout
 * ----------------------------------------------------------------------------
 */

export async function kompipayCreateCheckout(input: {
  orderId: string;
  kompipayAccountId: string;
  amount: number;
  currency: string;
  buyerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return kpFetch<{
    checkoutUrl: string;
    kompipayPaymentId?: string;
    stripeCheckoutSessionId?: string;
    stripePaymentIntentId?: string;
  }>("/api/v1/checkout/sessions", {
    method: "POST",
    json: {
      orderId: input.orderId,
      kompipayAccountId: input.kompipayAccountId,
      amount: input.amount,
      currency: input.currency,
      buyerEmail: input.buyerEmail,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
      metadata: input.metadata ?? {},
    },
  });
}

/**
 * ----------------------------------------------------------------------------
 * Webhook verification helpers
 * ----------------------------------------------------------------------------
 */

function timingSafeEqualHex(aHex: string, bHex: string) {
  try {
    const a = Buffer.from(aHex, "hex");
    const b = Buffer.from(bHex, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function kompipayVerifyWebhook(input: {
  rawBody: string;
  signatureHeader: string | null;
  toleranceSeconds?: number;
}) {
  const secret = getEnv("KOMPIPAY_WEBHOOK_SECRET");
  if (!secret) {
    return { ok: false as const, error: "Missing env var: KOMPIPAY_WEBHOOK_SECRET" };
  }

  const header = input.signatureHeader;
  if (!header) return { ok: false as const, error: "Missing signature header" };

  const parts = header.split(",").map((p) => p.trim());
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));

  if (!tPart || !v1Part) {
    return { ok: false as const, error: "Malformed signature header" };
  }

  const timestampStr = tPart.slice(2);
  const sigHex = v1Part.slice(3);

  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp)) {
    return { ok: false as const, error: "Invalid timestamp" };
  }

  const tolerance = input.toleranceSeconds ?? 300;
  const nowSec = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSec - timestamp) > tolerance) {
    return { ok: false as const, error: "Signature timestamp outside tolerance" };
  }

  const signedPayload = `${timestamp}.${input.rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload, "utf8")
    .digest("hex");

  const ok = timingSafeEqualHex(expected, sigHex);
  if (!ok) return { ok: false as const, error: "Invalid signature" };

  return { ok: true as const };
}
