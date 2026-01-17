"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const NAV_PUBLIC: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
];

const NAV_AUTHED: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
];

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function IconMenu({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconSearch({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeaderClient({ authed }: { authed: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = useMemo(() => (authed ? NAV_AUTHED : NAV_PUBLIC), [authed]);

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  // Escape to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Body scroll lock when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* GUFRAM-ish header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <div className="border border-black bg-white">
            <div className="grid grid-cols-3 items-center px-4 py-3">
              {/* Left: burger */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="justify-self-start p-2 -m-2 hover:opacity-70 transition-opacity"
              >
                <IconMenu className="h-6 w-6" />
              </button>

              {/* Center: logo */}
              <Link href="/" aria-label="Home" className="justify-self-center">
                {/* If you want pure text like gufram, replace Image with <span className="text-2xl font-black">shopablock</span> */}
                <Image
                  src="/blocklogo.png"
                  alt="ShopABlock"
                  width={150}
                  height={40}
                  priority
                  className="h-8 w-auto"
                />
              </Link>

              {/* Right: search (placeholder) */}
              <button
                type="button"
                aria-label="Search"
                onClick={() => setOpen(true)} // optional: open same menu, or wire to search later
                className="justify-self-end p-2 -m-2 hover:opacity-70 transition-opacity"
              >
                <IconSearch className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal overlay + blurred page */}
      {open ? (
        <div className="fixed inset-0 z-60">
          {/* Backdrop (blur + dim) */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className={cx(
              "absolute inset-0",
              "bg-black/25",
              "backdrop-blur-md"
            )}
          />

          {/* Center panel */}
          <div className="absolute inset-0 flex items-start justify-center pt-24 px-4">
            <div className="w-full max-w-xl border border-black bg-white shadow-sm">
              {/* Panel top bar */}
              <div className="grid grid-cols-3 items-center px-4 py-3 border-b border-black">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="justify-self-start p-2 -m-2 hover:opacity-70 transition-opacity"
                >
                  <IconX className="h-6 w-6" />
                </button>

                <div className="justify-self-center">
                  <span className="text-xl font-black tracking-tight">shopablock</span>
                </div>

                <button
                  type="button"
                  aria-label="Search"
                  className="justify-self-end p-2 -m-2 hover:opacity-70 transition-opacity"
                  onClick={() => {
                    // wire search later
                  }}
                >
                  <IconSearch className="h-6 w-6" />
                </button>
              </div>

              {/* Big nav */}
              <nav className="px-6 py-10">
                <div className="grid gap-3 text-center">
                  {items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className={cx(
                        "text-4xl sm:text-5xl font-black leading-none",
                        "hover:opacity-70 transition-opacity"
                      )}
                    >
                      {it.label.toUpperCase()}
                    </Link>
                  ))}
                  {!authed ? (
                    <>
                      <Link
                        href="/sign-in"
                        className="text-4xl sm:text-5xl font-black leading-none hover:opacity-70 transition-opacity"
                      >
                        LOG IN
                      </Link>
                      <Link
                        href="/sign-up"
                        className="text-4xl sm:text-5xl font-black leading-none hover:opacity-70 transition-opacity"
                      >
                        SIGN UP
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/app/new"
                        className="text-4xl sm:text-5xl font-black leading-none hover:opacity-70 transition-opacity"
                      >
                        NEW BLOCK
                      </Link>
                    </>
                  )}
                </div>
              </nav>

              {/* Bottom actions (optional, gufram-ish utility strip) */}
              <div className="border-t border-black grid grid-cols-2">
                <Link
                  href="/pricing"
                  className="px-4 py-4 text-center text-sm font-semibold hover:bg-black hover:text-white transition-colors border-r border-black"
                >
                  PRICING
                </Link>

                {authed ? (
                  <form action="/api/auth/sign-out" method="post" className="contents">
                    <button
                      type="submit"
                      className="px-4 py-4 text-center text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                    >
                      SIGN OUT
                    </button>
                  </form>
                ) : (
                  <Link
                    href="/pricing"
                    className="px-4 py-4 text-center text-sm font-semibold hover:bg-black hover:text-white transition-colors"
                  >
                    BUY A BLOCK
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Spacer so content doesn't hide under fixed header */}
      <div className="h-20" />
    </>
  );
}
