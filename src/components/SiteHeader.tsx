// src/components/SiteHeader.tsx
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-(--line)">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="font-semibold tracking-tight">
          Shopablock
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link className="hover:underline" href="/pricing">
            Pricing
          </Link>
          <Link className="hover:underline" href="/demo">
            Demo
          </Link>
          <Link className="hover:underline" href="/app">
            App
          </Link>
          <Link className="hover:underline" href="/sign-in">
            Sign in
          </Link>
          <Link
            className="rounded-xl px-3 py-2 border border-(--line) hover:bg-(--accent)/5"
            href="/sign-up"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
