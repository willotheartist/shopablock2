"use client";
import { FormEvent, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowUpRight, LockKeyhole, Loader2 } from "lucide-react";
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey?.startsWith("pk_")
  ? loadStripe(publishableKey)
  : null;
function PaymentForm({ receiptUrl }: { receiptUrl: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError("");
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${location.origin}${receiptUrl}` },
    });
    if (result.error)
      setError(result.error.message || "Payment could not be completed.");
    setBusy(false);
  }
  return (
    <form onSubmit={pay}>
      <PaymentElement />
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      <button
        className="btn btn-dark btn-block"
        disabled={busy || !stripe || !elements}
      >
        {busy ? (
          <Loader2 className="spinner" size={16} />
        ) : (
          <LockKeyhole size={15} />
        )}{" "}
        Pay securely
      </button>
      <p className="checkout-secure">
        <LockKeyhole size={12} /> Payment details are handled securely by
        Stripe.
      </p>
    </form>
  );
}
export default function Checkout({
  blockId,
  option,
  physical,
  ready,
}: {
  blockId: string;
  option: string;
  physical: boolean;
  ready: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [payment, setPayment] = useState<{
    clientSecret: string;
    receiptUrl: string;
  } | null>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const form = new FormData(e.currentTarget);
      const fields = Object.fromEntries(form);
      let session: { checkoutKey: string; accessToken: string };
      const key = `shopablock:checkout:${blockId}:${option}`;
      try {
        const stored = sessionStorage.getItem(key);
        session = stored ? JSON.parse(stored) : null;
        if (!session) {
          const bytes = crypto.getRandomValues(new Uint8Array(32));
          session = {
            checkoutKey: crypto.randomUUID(),
            accessToken: btoa(String.fromCharCode(...bytes))
              .replace(/\+/g, "-")
              .replace(/\//g, "_")
              .replace(/=/g, ""),
          };
          sessionStorage.setItem(key, JSON.stringify(session));
        }
      } catch {
        throw new Error("Allow browser storage to start a secure checkout.");
      }
      const r = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, blockId, option, ...session }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.completed) {
        location.assign(d.receiptUrl);
        return;
      }
      setPayment({ clientSecret: d.clientSecret, receiptUrl: d.receiptUrl });
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to start checkout. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!ready || !stripePromise)
    return (
      <div className="notice">
        This shop isn’t accepting payments yet. Please check back soon.
      </div>
    );
  return (
    <>
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {payment ? (
        <>
          <h2>One last little step.</h2>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: payment.clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#22231f",
                  borderRadius: "6px",
                  fontFamily: "Arial, sans-serif",
                },
              },
            }}
          >
            <PaymentForm receiptUrl={payment.receiptUrl} />
          </Elements>
        </>
      ) : (
        <form onSubmit={submit}>
          <h2>Make it yours.</h2>
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
            />
            <small>Used for your order. No account needed.</small>
          </div>
          {physical && (
            <>
              <hr className="soft-divider" />
              <span className="form-label">Your UK delivery address</span>
              <div className="field">
                <label htmlFor="shipName">Full name</label>
                <input
                  id="shipName"
                  name="shipName"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </div>
              <div className="field">
                <label htmlFor="shipLine1">Address</label>
                <input
                  id="shipLine1"
                  name="shipLine1"
                  autoComplete="address-line1"
                  required
                  maxLength={150}
                />
              </div>
              <div className="field">
                <label htmlFor="shipLine2">
                  Apartment, building, etc. (optional)
                </label>
                <input
                  id="shipLine2"
                  name="shipLine2"
                  autoComplete="address-line2"
                  maxLength={150}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="shipCity">Town / city</label>
                  <input
                    id="shipCity"
                    name="shipCity"
                    autoComplete="address-level2"
                    required
                    maxLength={80}
                  />
                </div>
                <div className="field">
                  <label htmlFor="shipPostcode">Postcode</label>
                  <input
                    id="shipPostcode"
                    name="shipPostcode"
                    autoComplete="postal-code"
                    required
                    maxLength={10}
                  />
                </div>
              </div>
              <input type="hidden" name="shipCountry" value="GB" />
              <p className="small-note">United Kingdom delivery only.</p>
            </>
          )}
          <button className="btn btn-dark btn-block" disabled={busy}>
            {busy ? (
              <Loader2 className="spinner" size={16} />
            ) : (
              <ArrowUpRight size={17} />
            )}{" "}
            Continue to payment
          </button>
          <p className="checkout-secure">
            <LockKeyhole size={12} /> Secure checkout · No account needed
          </p>
        </form>
      )}
    </>
  );
}
