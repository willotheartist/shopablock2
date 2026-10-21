"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  Eye,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Monitor,
  Package,
  Pencil,
  Save,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import {
  type Draft,
  emptyDraft,
  draftSchema,
  launchChecks,
  slugify,
} from "@/lib/v2/product";
import { type Proposal, applyProposal } from "@/lib/v2/assistant";
import ProductView from "./ProductView";
import Brand from "./Brand";
type ProductState = { id: string; status: string; updatedAt: string };
export function ProposalCard({
  proposal,
  actions = [],
  onApply,
  onDismiss,
}: {
  proposal: Proposal;
  actions?: string[];
  onApply?: () => void;
  onDismiss?: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const changes = Object.entries(proposal.changes).filter(
    ([, v]) => v !== null,
  );
  return (
    <div className="ai-proposal">
      <div className="ai-proposal-head">
        <Sparkles size={15} /> Ready for your review
      </div>
      <div className="ai-proposal-body">
        {actions.map((a, i) => (
          <div className="activity-action" key={i}>
            <Check size={12} />
            {a}
          </div>
        ))}
        <p>{proposal.summary}</p>
        {changes.length > 0 && (
          <dl>
            {changes.map(([k, v]) => (
              <div key={k}>
                <dt>{k.replace(/([A-Z])/g, " $1")}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {proposal.questions.length > 0 && (
          <>
            <hr className="soft-divider" />
            <p>
              <b>A few details to confirm</b>
            </p>
            {proposal.questions.map((q) => (
              <p key={q}>• {q}</p>
            ))}
          </>
        )}
        {proposal.copy && (
          <>
            <hr className="soft-divider" />
            <p>{proposal.copy}</p>
          </>
        )}
      </div>
      <div className="ai-proposal-actions">
        {onApply && changes.length > 0 && (
          <button className="btn btn-blue btn-sm" onClick={onApply}>
            <Check size={14} /> Apply to draft
          </button>
        )}
        {proposal.copy && (
          <button
            className="btn btn-outline btn-sm"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(proposal.copy!);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            <Copy size={13} />
            {copied ? "Copied" : "Copy text"}
          </button>
        )}
        {onDismiss && (
          <button className="btn btn-outline btn-sm" onClick={onDismiss}>
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
export default function Builder({
  userId,
  payouts = false,
  initialDraft,
  product,
}: {
  userId?: string;
  payouts?: boolean;
  initialDraft?: Draft;
  product?: ProductState;
}) {
  const [draft, setDraft] = useState<Draft>(initialDraft || emptyDraft);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState<ProductState | undefined>(product);
  const [tab, setTab] = useState("product");
  const [viewport, setViewport] = useState("desktop");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [brief, setBrief] = useState("");
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [actions, setActions] = useState<string[]>([]);
  const [fileName, setFileName] = useState(
    initialDraft?.digitalAssetId ? "Download file attached" : "",
  );
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!initialDraft) {
      try {
        const raw = localStorage.getItem("shopablock:draft:v2");
        if (raw) {
          const parsed = draftSchema.safeParse(JSON.parse(raw));
          // Browser storage is an external source; hydrate it once after SSR.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          if (parsed.success) setDraft(parsed.data);
        }
      } catch {}
    }
    setLoaded(true);
  }, [initialDraft]);
  useEffect(() => {
    if (loaded && !saved) {
      try {
        localStorage.setItem("shopablock:draft:v2", JSON.stringify(draft));
      } catch {}
    }
  }, [draft, loaded, saved]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
    setMessage("");
  }
  function signIn() {
    dialog.current?.showModal();
  }
  async function save(publish = false) {
    if (!userId) {
      signIn();
      return;
    }
    if (busy) return;
    setBusy(publish ? "publish" : "save");
    setError("");
    setMessage("");
    try {
      const res = await fetch(
        saved ? `/api/products/${saved.id}` : "/api/products",
        {
          method: saved ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            draft: { ...draft, handle: draft.handle || slugify(draft.title) },
            publish,
            updatedAt: saved?.updatedAt,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSaved({ id: data.id, status: data.status, updatedAt: data.updatedAt });
      setDraft((d) => ({ ...d, handle: data.handle }));
      setDirty(false);
      setMessage(
        publish
          ? "Your shop is live. Time to share your good thing."
          : "Draft saved. Pick up where you left off from your dashboard.",
      );
      try {
        localStorage.removeItem("shopablock:draft:v2");
      } catch {}
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save. Please try again.",
      );
    } finally {
      setBusy("");
    }
  }
  async function files(list: FileList | null, kind: "image" | "digital") {
    if (!list?.length) return;
    if (!userId) {
      signIn();
      return;
    }
    setBusy("upload");
    setError("");
    try {
      const accepted = Array.from(list).slice(
        0,
        kind === "image" ? 8 - draft.media.length : 1,
      );
      if (!accepted.length) throw new Error("You can add up to 8 photos.");
      const images: Draft["media"] = [];
      for (const f of accepted) {
        if (f.size > (kind === "image" ? 5 : 50) * 1024 * 1024)
          throw new Error(
            `Use a file smaller than ${kind === "image" ? 5 : 50} MB.`,
          );
        const pathname = `${userId}/${crypto.randomUUID()}-${f.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100)}`;
        const blob = await upload(pathname, f, {
          access: "private",
          handleUploadUrl: "/api/assets/upload",
          clientPayload: kind,
          contentType: f.type || "application/octet-stream",
        });
        const response = await fetch("/api/assets/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pathname: blob.pathname,
            name: f.name.slice(0, 180),
            kind,
          }),
        });
        const a = await response.json();
        if (!response.ok) throw new Error(a.error);
        if (kind === "image") images.push({ url: a.url, name: a.name });
        else {
          change("digitalAssetId", a.id);
          setFileName(a.name);
        }
      }
      if (images.length)
        setDraft((d) => ({ ...d, media: [...d.media, ...images] }));
      setDirty(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Upload failed. Please try again.",
      );
    } finally {
      setBusy("");
    }
  }
  async function ask() {
    if (!userId) {
      signIn();
      return;
    }
    if (brief.trim().length < 3) {
      setError("Tell your assistant what you’re selling.");
      return;
    }
    setBusy("ai");
    setError("");
    try {
      const r = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "product", brief, draft }),
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
      setBusy("");
    }
  }
  const checks = launchChecks(draft, payouts);
  const ready = checks.every((c) => c.ok);
  const live = saved?.status === "active";
  return (
    <main id="main" className={`builder ${preview ? "show-preview" : ""}`}>
      <header className="builder-header">
        <div className="builder-heading">
          <Brand />
          <span>
            {live ? "Your live product" : "A little shop in the making"}
          </span>
        </div>
        <div className="builder-actions">
          <span className="save-state" role="status">
            {dirty
              ? "Unsaved changes"
              : saved
                ? "Saved"
                : "Draft on this device"}
          </span>
          <Link
            href={userId ? "/app" : "/"}
            className="icon-btn"
            aria-label={userId ? "Go to dashboard" : "Back to home"}
          >
            <ArrowLeft size={16} />
          </Link>
          <button
            className="btn btn-outline btn-sm"
            disabled={!!busy}
            onClick={() => save(live)}
          >
            {busy === "save" ? (
              <Loader2 size={14} className="spinner" />
            ) : (
              <Save size={14} />
            )}{" "}
            Save
          </button>
          <button
            className="btn btn-dark btn-sm"
            disabled={!!busy}
            onClick={() => {
              setTab("launch");
              setPreview(false);
            }}
          >
            Review & publish <ArrowUpRight size={14} />
          </button>
        </div>
      </header>
      <div className="builder-layout">
        <section className="builder-panel">
          <span className="eyebrow">ONE GOOD THING STARTS HERE</span>
          <h1>Make yourself a little shop.</h1>
          <p className="intro">
            Your product. Your story. All coming together.
          </p>
          {error && (
            <div className="notice error" role="alert">
              {error}
            </div>
          )}
          {message && (
            <div className="notice success" role="status">
              {message}
            </div>
          )}
          <div
            className="editor-tabs"
            role="tablist"
            aria-label="Editor sections"
          >
            {[
              ["product", "Your product"],
              ["details", "The details"],
              ["launch", "Ready to launch"],
            ].map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                className={tab === id ? "active" : ""}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          {tab === "product" && (
            <>
              <div className="ai-start">
                <div>
                  <Sparkles size={17} />
                  <strong>Start with a few words.</strong>
                </div>
                <p>
                  Tell your assistant what you’re selling. Review its
                  suggestions before anything changes.
                </p>
                <textarea
                  aria-label="Tell your assistant about your product"
                  value={brief}
                  maxLength={3000}
                  onChange={(e) => setBrief(e.target.value)}
                  placeholder="I’ve made 30 ceramic mugs. They’re £24 each, with UK delivery…"
                />
                <button
                  disabled={!!busy}
                  className="btn btn-blue btn-sm"
                  onClick={ask}
                >
                  {busy === "ai" ? (
                    <Loader2 className="spinner" size={14} />
                  ) : (
                    <Sparkles size={14} />
                  )}{" "}
                  {busy === "ai"
                    ? "Working on your draft…"
                    : "Help me get started"}
                </button>
              </div>
              {proposal && (
                <ProposalCard
                  proposal={proposal}
                  actions={actions}
                  onDismiss={() => setProposal(null)}
                  onApply={() => {
                    try {
                      const nextDraft = applyProposal(draft, proposal);
                      setDraft(nextDraft);
                      setDirty(true);
                      setProposal(null);
                      setMessage(
                        "Suggestions added to your draft. Review the details below.",
                      );
                    } catch {
                      setError(
                        "One suggestion was too long or invalid. Please edit it manually.",
                      );
                    }
                  }}
                />
              )}
              <span className="form-label">
                Product photos <span className="text-muted">· up to 8</span>
              </span>
              {draft.media.length > 0 && (
                <div className="media-grid">
                  {draft.media.map((m, i) => (
                    <div className="media-tile" key={m.url}>
                      <img src={m.url} alt={`Product photo ${i + 1}`} />
                      <button
                        disabled={!!busy}
                        aria-label={`Remove photo ${i + 1}`}
                        onClick={() =>
                          change(
                            "media",
                            draft.media.filter((_, j) => j !== i),
                          )
                        }
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="upload-area">
                {busy === "upload" ? (
                  <Loader2 className="spinner" size={23} />
                ) : (
                  <ImagePlus size={24} />
                )}
                <span>
                  {busy === "upload"
                    ? "Uploading your file…"
                    : "Add a little visual magic"}
                </span>
                <small>JPG, PNG or WebP · 5 MB per image</small>
                <input
                  disabled={!!busy}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => {
                    void files(e.target.files, "image");
                    e.target.value = "";
                  }}
                  aria-label="Upload product photos"
                />
              </label>
              <div style={{ height: 24 }} />
              <div className="field">
                <label htmlFor="title">What are you selling?</label>
                <input
                  id="title"
                  value={draft.title}
                  maxLength={140}
                  onChange={(e) => change("title", e.target.value)}
                  placeholder="The everyday mug"
                />
              </div>
              <div className="field">
                <label htmlFor="description">Tell its story</label>
                <textarea
                  id="description"
                  value={draft.description}
                  maxLength={6000}
                  onChange={(e) => change("description", e.target.value)}
                  placeholder="The idea, the details, the reason someone will love it…"
                  rows={5}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="price">Price (£)</label>
                  <input
                    id="price"
                    inputMode="decimal"
                    value={draft.price}
                    onChange={(e) => change("price", e.target.value)}
                    placeholder="24.00"
                  />
                </div>
                <div className="field">
                  <label htmlFor="quantity">Total quantity</label>
                  <input
                    id="quantity"
                    inputMode="numeric"
                    value={draft.quantity}
                    onChange={(e) => change("quantity", e.target.value)}
                    placeholder="Unlimited"
                  />
                  <small>Includes any units already sold</small>
                </div>
              </div>
              <button
                className="btn btn-outline btn-block"
                onClick={() => setTab("details")}
              >
                Next: the little details <ArrowUpRight size={16} />
              </button>
            </>
          )}
          {tab === "details" && (
            <>
              <div className="field">
                <label htmlFor="brand">Your shop name</label>
                <input
                  id="brand"
                  value={draft.brandName}
                  maxLength={80}
                  onChange={(e) => change("brandName", e.target.value)}
                  placeholder="Your name or brand"
                />
              </div>
              <div className="field">
                <label htmlFor="handle">Your shop link</label>
                <input
                  id="handle"
                  value={draft.handle}
                  maxLength={64}
                  onChange={(e) => change("handle", slugify(e.target.value))}
                  placeholder={slugify(draft.title) || "your-good-thing"}
                />
                <small>
                  shopablock.co/
                  {draft.handle || slugify(draft.title) || "your-good-thing"}
                </small>
              </div>
              <div className="field">
                <label htmlFor="options">
                  Options <span className="text-muted">optional</span>
                </label>
                <input
                  id="options"
                  value={draft.options}
                  maxLength={500}
                  onChange={(e) => change("options", e.target.value)}
                  placeholder="Small, Medium, Large"
                />
                <small>
                  Separate with commas. All options share a price and stock.
                </small>
              </div>
              <span className="form-label">How will it arrive?</span>
              <div className="segmented">
                <button
                  className={draft.deliveryType === "physical" ? "active" : ""}
                  onClick={() => change("deliveryType", "physical")}
                >
                  <Package size={14} /> Physical product
                </button>
                <button
                  className={draft.deliveryType === "digital" ? "active" : ""}
                  onClick={() => change("deliveryType", "digital")}
                >
                  <Download size={14} /> Digital download
                </button>
              </div>
              {draft.deliveryType === "physical" ? (
                <>
                  <div className="field">
                    <label htmlFor="shipping">UK delivery (£)</label>
                    <input
                      id="shipping"
                      value={draft.shippingPrice}
                      inputMode="decimal"
                      onChange={(e) => change("shippingPrice", e.target.value)}
                      placeholder="3.50"
                    />
                    <small>
                      Enter 0 for free delivery. UK delivery only in this
                      release.
                    </small>
                  </div>
                  <div className="field">
                    <label htmlFor="delivery">Delivery details</label>
                    <textarea
                      id="delivery"
                      value={draft.deliveryNote}
                      maxLength={600}
                      onChange={(e) => change("deliveryNote", e.target.value)}
                      placeholder="UK delivery in 3–5 working days. Packed with care."
                    />
                  </div>
                </>
              ) : (
                <>
                  <label className="upload-area">
                    <Download size={24} />
                    <span>
                      {fileName || "Attach the file your customer will receive"}
                    </span>
                    <small>
                      PDF, ZIP, text, CSV, MP3 or image · up to 50 MB
                    </small>
                    <input
                      type="file"
                      disabled={!!busy}
                      accept=".pdf,.zip,.txt,.csv,.mp3,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => {
                        void files(e.target.files, "digital");
                        e.target.value = "";
                      }}
                      aria-label="Upload digital download"
                    />
                  </label>
                  <p className="small-note">
                    Your file stays private. Customers unlock it after payment.
                  </p>
                  <hr className="soft-divider" />
                </>
              )}
              <button
                className="btn btn-outline btn-block"
                onClick={() => setTab("launch")}
              >
                Next: ready to launch <ArrowUpRight size={16} />
              </button>
            </>
          )}
          {tab === "launch" && (
            <>
              <h2 style={{ fontSize: 25 }}>A few final checks.</h2>
              <p className="intro" style={{ marginTop: 10 }}>
                Good details make a great first impression.
              </p>
              <ul className="check-list">
                {checks.map((c) => (
                  <li key={c.key} className={c.ok ? "done" : ""}>
                    {c.ok ? <CheckCircle2 /> : <Circle />}
                    {c.label}
                    {c.key === "payments" && !c.ok && (
                      <Link
                        href={
                          userId ? "/app/settings" : "/sign-up?next=/create"
                        }
                        className="inline-link"
                      >
                        Connect
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <div className="launch-summary">
                <h3>{ready ? "Your good thing is ready." : "Nearly there."}</h3>
                <p>
                  {ready
                    ? "Publishing makes this page public and available to buy. Check your price, delivery and product details before continuing."
                    : "Complete the checks above to accept orders. You can save a draft at any time."}
                </p>
                <button
                  className="btn btn-dark btn-block"
                  disabled={!!busy || !ready}
                  onClick={() => save(true)}
                >
                  {busy === "publish" ? (
                    <Loader2 className="spinner" size={16} />
                  ) : (
                    <ArrowUpRight size={16} />
                  )}{" "}
                  {live ? "Publish changes" : "Publish your shop"}
                </button>
                {live && (
                  <>
                    <div className="saved-url">
                      <Link href={`/${draft.handle}`} target="_blank">
                        shopablock.co/{draft.handle}
                      </Link>
                      <button
                        className="icon-btn"
                        aria-label="Copy shop link"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              `${location.origin}/${draft.handle}`,
                            );
                            setMessage("Shop link copied.");
                          } catch {
                            setError(
                              "Copy the shop link from the address bar.",
                            );
                          }
                        }}
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                    <button
                      className="btn btn-outline btn-block"
                      disabled={!!busy}
                      onClick={() => save(false)}
                    >
                      Pause sales and save as draft
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </section>
        <section className="builder-preview" aria-label="Live shop preview">
          <div className="preview-toolbar">
            <span>YOUR SHOP, TAKING SHAPE</span>
            <div>
              <button
                className={viewport === "desktop" ? "active" : ""}
                onClick={() => setViewport("desktop")}
                aria-label="Desktop preview"
              >
                <Monitor size={17} />
              </button>
              <button
                className={viewport === "mobile" ? "active" : ""}
                onClick={() => setViewport("mobile")}
                aria-label="Mobile preview"
              >
                <Smartphone size={17} />
              </button>
            </div>
          </div>
          <div
            className={`preview-window ${viewport === "mobile" ? "mobile" : ""}`}
          >
            <div className="preview-url">
              <LockKeyhole size={10} /> shopablock.co/
              {draft.handle || slugify(draft.title) || "your-good-thing"}
            </div>
            <ProductView draft={draft} />
          </div>
          <p className="preview-note">
            Every little change, right here as you make it.
          </p>
        </section>
      </div>
      <button
        className="builder-mobile-toggle"
        onClick={() => setPreview(!preview)}
      >
        {preview ? <Pencil size={16} /> : <Eye size={16} />}{" "}
        {preview ? "Back to editing" : "Preview your shop"}
      </button>
      <dialog
        ref={dialog}
        className="signup-dialog"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog">
          <button
            className="icon-btn"
            style={{ float: "right" }}
            onClick={() => dialog.current?.close()}
            aria-label="Close"
          >
            <X size={16} />
          </button>
          <h2>Keep your good thing going.</h2>
          <p>
            Create an account to save your shop, upload files and work with your
            assistant. Your local draft will be here when you return.
          </p>
          <Link className="btn btn-dark" href="/sign-up?next=/create">
            Create an account <ArrowUpRight size={16} />
          </Link>
          <Link className="btn btn-outline" href="/sign-in?next=/create">
            I already have an account
          </Link>
        </div>
      </dialog>
    </main>
  );
}
