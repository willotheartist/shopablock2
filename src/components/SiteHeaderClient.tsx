// src/components/SiteHeaderClient.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type NavItem = { href: string; label: string };

const NAV_PUBLIC: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/sign-in", label: "Sign in" },
  { href: "/sign-up", label: "Sign up" },
];

const NAV_AUTHED: NavItem[] = [
  { href: "/explore", label: "Explore" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: "Dashboard" },
];

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
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

  const items = useMemo(() => (authed ? NAV_AUTHED : NAV_PUBLIC), [authed]);

  return (
    <header className="w-full bg-[rgb(246,245,241)] text-black border-b border-black">
      <div className="px-6 py-5 flex items-center justify-between gap-6">
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

        <nav className="hidden md:flex items-center gap-3">
          {items.map((it) => {
            const active = pathname === it.href;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cx(
                  "relative px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors",
                  "border border-black/0",
                  "hover:bg-black hover:text-[rgb(246,245,241)] hover:border-black",
                  active && "bg-black text-[rgb(246,245,241)] border-black"
                )}
              >
                {it.label}
              </Link>
            );
          })}

          {authed ? (
            <form action="/api/auth/sign-out" method="post">
              <button
                type="submit"
                className={cx(
                  "relative px-4 py-2 text-xs uppercase tracking-[0.18em] transition-colors",
                  "border border-black",
                  "hover:bg-black hover:text-[rgb(246,245,241)]"
                )}
              >
                Sign out
              </button>
            </form>
          ) : null}
        </nav>

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

      {open ? (
        <div className="md:hidden border-t border-black">
          <div className="px-6 py-4 grid gap-2">
            {items.map((it) => {
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

            {authed ? (
              <form action="/api/auth/sign-out" method="post">
                <button
                  type="submit"
                  className={cx(
                    "px-4 py-3 border border-black text-xs uppercase tracking-[0.18em] text-left",
                    "hover:bg-black hover:text-[rgb(246,245,241)]"
                  )}
                >
                  Sign out
                </button>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}
