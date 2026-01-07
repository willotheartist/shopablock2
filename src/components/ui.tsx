import React from "react";

export function Band({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-b border-(--line) bg-(--bg)">
      <div className="mx-auto max-w-6xl px-6">{children}</div>
    </div>
  );
}

export function Container({
  children,
  narrow,
}: {
  children: React.ReactNode;
  narrow?: boolean;
}) {
  return (
    <div className={`mx-auto px-6 ${narrow ? "max-w-3xl" : "max-w-6xl"}`}>
      {children}
    </div>
  );
}

export function Rule({ strong }: { strong?: boolean }) {
  return (
    <div className={`h-px w-full ${strong ? "bg-(--line-strong)" : "bg-(--line)"}`} />
  );
}

export function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs uppercase tracking-[0.28em] text-(--muted)">
      {children}
    </div>
  );
}

export function BigTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-5xl font-semibold tracking-[-0.03em] leading-[0.98]">
      {children}
    </h1>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-3xl font-semibold tracking-[-0.02em] leading-tight">
      {children}
    </h2>
  );
}

export function Panel({ children }: { children: React.ReactNode }) {
  // In this design language, “panel” is a ruled region, not a card.
  return <div className="border border-(--line)">{children}</div>;
}

export function Row({
  left,
  right,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-(--line)">
      <div className="min-w-0">{left}</div>
      {right ? (
        <div className="shrink-0 font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
          {right}
        </div>
      ) : null}
    </div>
  );
}

export function LinkRow({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block border-t border-(--line) hover:bg-(--accent)/5"
    >
      <div className="flex items-center justify-between gap-6 py-4">
        <div className="font-mono text-sm uppercase tracking-[0.28em]">
          {label}
        </div>
        <div className="text-(--accent) text-xl leading-none">↗</div>
      </div>
    </a>
  );
}

export function Button({
  children,
  href,
  variant = "outline",
  full,
  type,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "outline" | "primary";
  full?: boolean;
  type?: "button" | "submit";
}) {
  const base =
    "inline-flex items-center justify-center border px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] " +
    "hover:bg-(--accent)/[0.08] focus:outline-none focus:ring-2 focus:ring-(--accent)/30";

  const styles =
    variant === "primary"
      ? " border-(--accent) text-(--accent)"
      : " border-(--line-strong) text-(--fg)";

  const width = full ? " w-full" : "";

  const cls = base + styles + width;

  if (href) return <a className={cls} href={href}>{children}</a>;
  return <button className={cls} type={type ?? "button"}>{children}</button>;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label className="font-mono text-xs uppercase tracking-[0.28em] text-(--muted)">
        {label}
      </label>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-12 w-full border border-(--line) bg-transparent px-3 font-mono text-sm outline-none focus:border-(--accent)"
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-35 w-full resize-y border border-(--line) bg-transparent px-3 py-3 font-mono text-sm outline-none focus:border-(--accent)"
    />
  );
}
