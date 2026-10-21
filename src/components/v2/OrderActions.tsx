"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RefreshCw } from "lucide-react";
export function SyncOrders() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <div>
      <button
        className="btn btn-outline btn-sm"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setMessage("");
          try {
            const r = await fetch("/api/orders/sync", { method: "POST" });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error);
            setMessage(
              d.failed
                ? "Some payments could not be checked. Try again shortly."
                : `Checked ${d.checked} pending ${d.checked === 1 ? "order" : "orders"}.`,
            );
            router.refresh();
          } catch (e) {
            setMessage(
              e instanceof Error ? e.message : "Could not refresh orders.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <RefreshCw size={14} className={busy ? "spinner" : ""} />
        Refresh payments
      </button>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
export function FulfilOrder({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        const f = new FormData(e.currentTarget);
        try {
          const r = await fetch(`/api/orders/${id}/fulfil`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tracking: f.get("tracking") }),
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          router.refresh();
        } catch (e) {
          setMessage(
            e instanceof Error ? e.message : "Could not update order.",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="field">
        <label htmlFor="tracking">Tracking reference (optional)</label>
        <input
          id="tracking"
          name="tracking"
          maxLength={160}
          placeholder="Your parcel tracking number"
        />
      </div>
      <button className="btn btn-dark btn-block" disabled={busy}>
        {busy ? <Loader2 className="spinner" size={15} /> : <Check size={15} />}{" "}
        Mark as sent
      </button>
      <p className="small-note">
        This updates the order. It does not send a customer message.
      </p>
      {message && (
        <p className="form-message" role="alert">
          {message}
        </p>
      )}
    </form>
  );
}
export function ReceiptSync({ id, token }: { id: string; token: string }) {
  const [message, setMessage] = useState("Checking your payment…");
  const [busy, setBusy] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const router = useRouter();
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    let count = 0;
    async function check() {
      try {
        const r = await fetch(`/api/orders/${id}/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const d = await r.json();
        if (stopped) return;
        if (!r.ok) throw new Error(d.error);
        if (
          d.status === "paid" ||
          d.status === "fulfilled" ||
          d.status === "cancelled"
        ) {
          router.refresh();
          setBusy(false);
          return;
        }
        if (++count < 6) {
          timer = setTimeout(check, 5000);
          return;
        }
        setMessage(
          "Your payment is still processing. Keep this private link and check again shortly.",
        );
      } catch {
        if (!stopped)
          setMessage(
            "We couldn’t check your payment yet. Keep this link and try again shortly.",
          );
      }
      if (!stopped) setBusy(false);
    }
    void check();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [id, token, attempt, router]);
  return (
    <div>
      <p className="form-message" role="status">
        {message}
      </p>
      <button
        disabled={busy}
        className="btn btn-outline"
        onClick={() => {
          setBusy(true);
          setAttempt((a) => a + 1);
        }}
      >
        <RefreshCw size={15} className={busy ? "spinner" : ""} /> Check payment
      </button>
    </div>
  );
}
