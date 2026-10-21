"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Megaphone,
  Package,
  Loader2,
} from "lucide-react";
import { type Proposal } from "@/lib/v2/assistant";
import { ProposalCard } from "./Builder";
const tasks = [
  {
    id: "launch",
    name: "Plan my launch",
    icon: CheckCircle2,
    prompt:
      "Review my products and help me prepare a simple launch checklist. Tell me what to work on first.",
  },
  {
    id: "marketing",
    name: "Write a launch post",
    icon: Megaphone,
    prompt:
      "Look at my products and draft a short, natural social post for my next launch. No invented claims or sales numbers.",
  },
  {
    id: "orders",
    name: "Check my orders",
    icon: Package,
    prompt:
      "Summarise my orders and tell me which paid orders need to be sent.",
  },
] as const;
export default function Assistant({
  history,
}: {
  history: { id: string; kind: string; status: string; date: string }[];
}) {
  const [kind, setKind] = useState<string>("launch");
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  async function ask() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          brief: brief || tasks.find((t) => t.id === kind)?.prompt,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setProposal(d.proposal);
      setActions(d.actions);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your assistant is unavailable.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="assistant-layout">
      <section className="assistant-main">
        <div className="panel">
          <div className="assistant-demo-head">
            <span className="assistant-icon">
              <Sparkles size={19} />
            </span>
            <div>
              <strong>A little less admin.</strong>
              <span>What can I help you with today?</span>
            </div>
          </div>
          <div className="assistant-task-grid">
            {tasks.map((t) => (
              <button
                key={t.id}
                className={`assistant-task ${kind === t.id ? "active" : ""}`}
                onClick={() => {
                  setKind(t.id);
                  setBrief(t.prompt);
                }}
              >
                <t.icon size={18} />
                {t.name}
              </button>
            ))}
            <Link href="/create" className="assistant-task">
              <Sparkles size={18} /> Draft a new product
            </Link>
          </div>
          <div className="field">
            <label htmlFor="request">Tell me what you have in mind</label>
            <textarea
              id="request"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              maxLength={3000}
              placeholder={tasks.find((t) => t.id === kind)?.prompt}
              rows={5}
            />
          </div>
          <button className="btn btn-dark" onClick={ask} disabled={busy}>
            {busy ? (
              <Loader2 className="spinner" size={16} />
            ) : (
              <Sparkles size={16} />
            )}{" "}
            {busy ? "Working through the details…" : "Let’s work on it"}
          </button>
          <p className="small-note">
            Your assistant can read your products and order totals. It prepares
            suggestions for you to review. It cannot send messages or change
            payments.
          </p>
        </div>
        {error && (
          <div className="notice error" role="alert">
            {error}
          </div>
        )}
        {proposal && (
          <ProposalCard
            proposal={proposal}
            actions={actions}
            onDismiss={() => setProposal(null)}
          />
        )}
      </section>
      <aside
        className="panel assistant-history-panel"
        style={{ marginTop: 0, alignSelf: "start" }}
      >
        <div className="panel-heading">
          <h2>Our little paper trail.</h2>
        </div>
        {history.length ? (
          <ul className="assistant-history">
            {history.map((h) => (
              <li key={h.id}>
                <b>
                  {h.kind === "product"
                    ? "Product draft"
                    : h.kind === "marketing"
                      ? "Launch copy"
                      : h.kind === "orders"
                        ? "Order check"
                        : "Launch planning"}
                </b>
                <small>
                  {h.date} · {h.status}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted" style={{ fontSize: 12 }}>
            Your assistant’s work will appear here, so you can keep track.
          </p>
        )}
      </aside>
    </div>
  );
}
