//·src/components/SiteHeaderClient.tsx
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

const SHOW_ANNOUNCEMENT = true;

const MARQUEE_ITEMS = [
  "One product. One page. One checkout.",
  "Sell less. Sell better.",
  "A storefront, without the storefront.",
  "Publish a block in minutes.",
];

function IconMenu({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconX({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SiteHeaderClient({ authed }: { authed: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = useMemo(() => (authed ? NAV_AUTHED : NAV_PUBLIC), [authed]);

  // Close menu on route change (avoid sync setState directly in effect body)
  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => setOpen(false));
    return () => window.cancelAnimationFrame(id);
  }, [pathname, open]);

  // Escape to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Body scroll lock while open
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
      <header className="fixed inset-x-0 top-0 z-50">
        {/* MARQUEE STRIP */}
        {SHOW_ANNOUNCEMENT ? (
          <div className="h-9 bg-[#131313] text-white border-b border-white/10 overflow-hidden">
            <div className="h-9 flex items-center">
              <div className="relative w-full">
                {/* edge fades */}
                <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-linear-to-r from-[#131313] to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-linear-to-l from-[#131313] to-transparent" />

                <div className="sb-marquee">
                  <div className="sb-marquee__inner">
                    {/* Track A */}
                    <div className="sb-marquee__track">
                      {MARQUEE_ITEMS.map((t, i) => (
                        <span key={`a-${i}`} className="sb-marquee__item">
                          {t}
                          <span className="sb-marquee__sep">•</span>
                        </span>
                      ))}
                    </div>

                    {/* Track B (duplicate) */}
                    <div className="sb-marquee__track" aria-hidden="true">
                      {MARQUEE_ITEMS.map((t, i) => (
                        <span key={`b-${i}`} className="sb-marquee__item">
                          {t}
                          <span className="sb-marquee__sep">•</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <style jsx>{`
                  .sb-marquee {
                    width: 100%;
                    overflow: hidden;
                  }
                  .sb-marquee__inner {
                    display: flex;
                    width: max-content;
                    gap: 0;
                    align-items: center;
                    animation: sb-marquee 18s linear infinite;
                    will-change: transform;
                  }
                  .sb-marquee__track {
                    display: inline-flex;
                    align-items: center;
                    white-space: nowrap;
                  }
                  .sb-marquee__item {
                    display: inline-flex;
                    align-items: center;
                    font-size: 12px;
                    font-weight: 650;
                    letter-spacing: -0.01em;
                    opacity: 0.95;
                    padding: 0 14px;
                  }
                  .sb-marquee__sep {
                    display: inline-block;
                    margin-left: 14px;
                    opacity: 0.55;
                  }
                  @keyframes sb-marquee {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  @media (prefers-reduced-motion: reduce) {
                    .sb-marquee__inner {
                      animation: none;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        ) : null}

        {/* MAIN HEADER */}
        <div className="bg-white border-b border-black/10">
          <div className="mx-auto max-w-7xl px-6 h-18 flex items-center gap-5">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="h-10 w-10 rounded-full hover:bg-black/5 transition flex items-center justify-center"
              >
                <IconMenu className="h-6 w-6" />
              </button>

              <Link href="/" aria-label="Home">
                <Image
                  src="/blocklogo.png"
                  alt="Shopablock"
                  width={130}
                  height={32}
                  priority
                  className="h-7 w-auto"
                />
              </Link>
            </div>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              {items.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  className={`transition ${
                    pathname === it.href
                      ? "text-black font-semibold"
                      : "text-black/70 hover:text-black"
                  }`}
                >
                  {it.label}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="hidden lg:flex flex-1">
              <label className="relative w-full max-w-xl">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
                <input
                  type="search"
                  placeholder="Search blocks, products, sellers"
                  className="w-full h-11 rounded-xl border border-black/10 bg-black/2 pl-12 pr-4 text-sm font-medium outline-none focus:border-black/20 focus:bg-white transition"
                />
              </label>
            </div>

            {/* Right */}
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                aria-label="Search"
                className="lg:hidden h-10 w-10 rounded-full hover:bg-black/5 flex items-center justify-center"
              >
                <IconSearch className="h-5 w-5 text-black/70" />
              </button>

              {!authed ? (
                <>
                  <Link
                    href="/sign-in"
                    className="hidden sm:inline text-sm font-medium text-black/70 hover:text-black transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="hidden sm:inline text-sm font-medium text-black/70 hover:text-black transition"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/pricing"
                    className="h-10 px-4 rounded-xl bg-black text-white text-sm font-semibold flex items-center hover:opacity-90 transition"
                  >
                    Be Pro
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/app"
                    className="hidden sm:inline text-sm font-medium text-black/70 hover:text-black transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/app/new"
                    className="h-10 px-4 rounded-xl bg-black text-white text-sm font-semibold flex items-center hover:opacity-90 transition"
                  >
                    New Block
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MENU OVERLAY — unchanged */}
      {open ? (
        <div className="fixed inset-0 z-60">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/25 backdrop-blur-md"
          />

          <div className="absolute inset-0 flex items-start justify-center pt-24 px-4">
            <div className="w-full max-w-lg border border-black bg-white shadow-sm">
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
                  <span className="text-xl font-black tracking-tight">
                    shopablock
                  </span>
                </div>

                <div className="justify-self-end w-10" aria-hidden />
              </div>

              <nav className="px-6 py-10">
                <div className="grid gap-3 text-center">
                  {items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href}
                      className="text-4xl sm:text-5xl font-black leading-none hover:opacity-70 transition-opacity"
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
                    <Link
                      href="/app/new"
                      className="text-4xl sm:text-5xl font-black leading-none hover:opacity-70 transition-opacity"
                    >
                      NEW BLOCK
                    </Link>
                  )}
                </div>
              </nav>

              <div className="border-t border-black grid grid-cols-2">
                <Link
                  href="/pricing"
                  className="px-4 py-4 text-center text-sm font-semibold hover:bg-black hover:text-white transition-colors border-r border-black"
                >
                  PRICING
                </Link>

                {authed ? (
                  <form
                    action="/api/auth/sign-out"
                    method="post"
                    className="contents"
                  >
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

      {/* Spacer: marquee (36px) + header (72px) = 108px */}
      <div className={SHOW_ANNOUNCEMENT ? "h-27" : "h-18"} />
    </>
  );
}
