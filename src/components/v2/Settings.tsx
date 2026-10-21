"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Check,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
export default function Settings({
  name,
  email,
  payouts,
  connected,
  configured,
}: {
  name: string;
  email: string;
  payouts: string;
  connected: boolean;
  configured: boolean;
}) {
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  async function action(path: string, data?: unknown) {
    setBusy(path);
    setMessage("");
    setSuccess(false);
    try {
      const r = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data || {}),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.url) {
        location.assign(d.url);
        return;
      }
      setSuccess(true);
      setMessage(
        path === "/api/settings"
          ? "Your details are saved."
          : d.status === "active"
            ? "Payments are connected. You’re ready to publish."
            : "Verification is still in progress. Complete any outstanding steps with Stripe.",
      );
      router.refresh();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy("");
    }
  }
  return (
    <>
      <div className="settings-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>A little about you.</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void action("/api/settings", {
                displayName: new FormData(e.currentTarget).get("name"),
              });
            }}
          >
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                name="name"
                defaultValue={name}
                maxLength={80}
                placeholder="What should we call you?"
              />
            </div>
            <div className="field">
              <label htmlFor="account-email">Email address</label>
              <input id="account-email" value={email} readOnly />
              <small>Your sign-in address.</small>
            </div>
            <button disabled={!!busy} className="btn btn-dark btn-sm">
              {busy === "/api/settings" ? (
                <Loader2 className="spinner" size={14} />
              ) : (
                <Check size={14} />
              )}{" "}
              Save details
            </button>
          </form>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>Get paid.</h2>
            <Wallet size={22} />
          </div>
          <span className={`status ${payouts}`}>
            {payouts === "active"
              ? "Connected"
              : payouts === "not_started"
                ? "Not connected"
                : payouts.replace("_", " ")}
          </span>
          <p>
            Payments are handled through KompiPay and Stripe. Complete
            verification to accept orders and receive payouts.
          </p>
          {!configured && (
            <div className="notice" style={{ marginBottom: 20 }}>
              Payments are being set up. You can create and save your products
              while we finish connecting the payment service.
            </div>
          )}
          <div className="form-actions">
            <button
              className="btn btn-dark btn-sm"
              disabled={!!busy || !configured}
              onClick={() => action("/api/kompipay/connect")}
            >
              {busy === "/api/kompipay/connect" ? (
                <Loader2 className="spinner" size={14} />
              ) : (
                <ArrowUpRight size={14} />
              )}{" "}
              {connected ? "Continue verification" : "Connect payments"}
            </button>
            {connected && (
              <button
                className="btn btn-outline btn-sm"
                disabled={!!busy || !configured}
                onClick={() => action("/api/kompipay/sync")}
              >
                <RefreshCw
                  size={14}
                  className={busy === "/api/kompipay/sync" ? "spinner" : ""}
                />{" "}
                Check status
              </button>
            )}
          </div>
          <div className="product-assurance">
            <ShieldCheck size={14} /> Your bank details stay with the payment
            provider.
          </div>
        </section>
      </div>
      {message && (
        <div
          className={`notice ${success ? "success" : "error"}`}
          role="status"
        >
          {message}
        </div>
      )}
      <section className="panel">
        <h2 style={{ fontSize: 22 }}>Your account</h2>
        <p className="small-note">
          Sign out on shared devices to keep your shop secure.
        </p>
        <form
          action="/api/auth/sign-out"
          method="post"
          style={{ marginTop: 20 }}
        >
          <button className="btn btn-outline btn-sm">Sign out</button>
        </form>
      </section>
    </>
  );
}
