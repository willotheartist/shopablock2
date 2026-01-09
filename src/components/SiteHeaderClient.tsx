// src/components/SiteHeaderClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const NAV_PUBLIC_LEFT: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
];

const NAV_AUTHED_LEFT: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
];

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function Marquee() {
  // “Webflow-ish” thin bar with repeating copy
  const chunk = (
    <span className="inline-flex items-center gap-3 px-6">
      <span className="font-semibold">ShopABlock</span>
      <span className="opacity-80">Buy one block. Sell one thing. Get paid instantly.</span>
      <span aria-hidden className="opacity-70">
        ☺
      </span>
    </span>
  );

  return (
    <div className="w-full border-b border-black bg-black/6 text-black">
      <div className="overflow-hidden">
        <div className="marquee flex whitespace-nowrap py-2 text-xs tracking-wide">
          {chunk}
          {chunk}
          {chunk}
          {chunk}
          {chunk}
          {chunk}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          will-change: transform;
          animation: marquee 18s linear infinite;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function SiteHeaderClient({ authed }: { authed: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const leftItems = useMemo(
    () => (authed ? NAV_AUTHED_LEFT : NAV_PUBLIC_LEFT),
    [authed]
  );

  const linkBase =
    "px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors border border-black/0";
  const linkHover = "hover:bg-black hover:text-[rgb(246,245,241)] hover:border-black";
  const linkActive = "bg-black text-[rgb(246,245,241)] border-black";

  const buttonBase =
    "px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors border border-black";

  return (
    <header className="w-full bg-[rgb(246,245,241)] text-black">
      <Marquee />

      {/* Main bar - FULL WIDTH */}
      <div className="w-full border-b border-black">
        <div className="w-full px-6 py-5 flex items-center justify-between gap-6">
          {/* Left cluster: logo + desktop nav */}
          <div className="flex items-center gap-6">
            <Link href="/" aria-label="Home" className="shrink-0">
              <Image
                src="/blocklogo.png"
                alt="ShopABlock"
                width={160}
                height={80}
                priority
                className="h-10 md:h-12 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {leftItems.map((it) => {
                const active = pathname === it.href;
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={cx(linkBase, linkHover, active && linkActive)}
                  >
                    {it.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right cluster: auth actions */}
          <div className="hidden md:flex items-center gap-3">
            {authed ? (
              <>
                <Link
                  href="/app/new"
                  className={cx(
                    buttonBase,
                    "bg-black text-[rgb(246,245,241)] hover:opacity-90"
                  )}
                >
                  New block
                </Link>

                <form action="/api/auth/sign-out" method="post">
                  <button
                    type="submit"
                    className={cx(
                      buttonBase,
                      "bg-transparent hover:bg-black hover:text-[rgb(246,245,241)]"
                    )}
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/sign-in" className={cx(linkBase, linkHover, pathname === "/sign-in" && linkActive)}>
                  Log in
                </Link>

                <Link href="/sign-up" className={cx(linkBase, linkHover, pathname === "/sign-up" && linkActive)}>
                  Sign up
                </Link>

                <Link
                  href="/pricing"
                  className={cx(
                    buttonBase,
                    "bg-black text-[rgb(246,245,241)] hover:opacity-90"
                  )}
                >
                  Buy a block
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((s) => !s)}
            className={cx(
              "md:hidden text-xs uppercase tracking-[0.18em]",
              "px-4 py-2 border border-black",
              "hover:bg-black hover:text-[rgb(246,245,241)]"
            )}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="md:hidden border-b border-black bg-[rgb(246,245,241)]">
          <div className="px-6 py-4 grid gap-2">
            {leftItems.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cx(
                    "px-4 py-3 border border-black text-xs uppercase tracking-[0.18em]",
                    "hover:bg-black hover:text-[rgb(246,245,241)]",
                    active && "bg-black text-[rgb(246,245,241)]"
                  )}
                >
                  {it.label}
                </Link>
              );
            })}

            <div className="h-2" />

            {authed ? (
              <>
                <Link
                  href="/app/new"
                  className="px-4 py-3 border border-black text-xs uppercase tracking-[0.18em] bg-black text-[rgb(246,245,241)] hover:opacity-90"
                >
                  New block
                </Link>

                <form action="/api/auth/sign-out" method="post">
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-3 border border-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-[rgb(246,245,241)]"
                  >
                    Sign out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-4 py-3 border border-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-[rgb(246,245,241)]"
                >
                  Log in
                </Link>

                <Link
                  href="/sign-up"
                  className="px-4 py-3 border border-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-[rgb(246,245,241)]"
                >
                  Sign up
                </Link>

                <Link
                  href="/pricing"
                  className="px-4 py-3 border border-black text-xs uppercase tracking-[0.18em] bg-black text-[rgb(246,245,241)] hover:opacity-90"
                >
                  Buy a block
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
