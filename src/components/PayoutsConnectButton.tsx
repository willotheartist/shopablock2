//·src/components/PayoutsConnectButton.tsx
"use client";

import { useState } from "react";

type ConnectResponse =
  | { url: string }
  | { error: string }
  | Record<string, unknown>
  | null;

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong";
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getStringField(obj: Record<string, unknown>, key: string): string | null {
  const v = obj[key];
  return typeof v === "string" ? v : null;
}

export default function PayoutsConnectButton() {
  const [loading, setLoading] = useState(false);

  async function connect() {
    try {
      setLoading(true);

      const res = await fetch("/api/kompipay/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: window.location.origin }),
      });

      const data: ConnectResponse = (await res.json().catch(() => null)) as ConnectResponse;

      if (!res.ok) {
        const msg =
          isRecord(data) && getStringField(data, "error")
            ? (getStringField(data, "error") as string)
            : "Failed to start onboarding";
        throw new Error(msg);
      }

      const url =
        isRecord(data) ? getStringField(data, "url") : null;

      if (!url) throw new Error("Missing onboarding URL");

      window.location.href = url;
    } catch (err) {
      alert(getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={connect}
        className={
          "inline-flex items-center justify-center border px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] " +
          "border-(--line-strong) text-(--fg) hover:bg-(--accent)/8 focus:outline-none focus:ring-2 focus:ring-(--accent)/30 " +
          (loading ? "opacity-60 cursor-not-allowed" : "")
        }
      >
        {loading ? "Redirecting…" : "Enable payouts"}
      </button>

      <div className="text-xs text-(--muted)">
        You’ll be redirected to Stripe Express onboarding via KompiPay.
      </div>
    </div>
  );
}
