"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
const publicRoutes = [
  "/",
  "/demo",
  "/pricing",
  "/help",
  "/privacy",
  "/terms",
  "/explore",
  "/sign-in",
  "/sign-up",
  "/reset",
];
export function Header({ signedIn }: { signedIn: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (!publicRoutes.includes(path)) return null;
  return (
    <header className="sb-header">
      <div className="sb-nav-shell">
        <Brand />
        <nav
          className={open ? "sb-nav open" : "sb-nav"}
          aria-label="Main navigation"
        >
          <Link href="/#how-it-works" onClick={() => setOpen(false)}>
            How it works
          </Link>
          <Link href="/#assistant" onClick={() => setOpen(false)}>
            Your assistant
          </Link>
          <Link href="/demo" onClick={() => setOpen(false)}>
            See a shop
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)}>
            Pricing
          </Link>
        </nav>
        <div className="sb-nav-actions">
          <Link className="sb-login" href={signedIn ? "/app" : "/sign-in"}>
            {signedIn ? "Dashboard" : "Log in"}
          </Link>
          <Link className="sb-button sb-button-white" href="/create">
            Start building <ArrowUpRight size={18} />
          </Link>
          <button
            className="sb-menu-toggle"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}
export function Footer() {
  const path = usePathname();
  if (!publicRoutes.includes(path)) return null;
  return (
    <footer className="sb-footer">
      <div className="sb-shell">
        <div className="sb-footer-top">
          <div>
            <Brand />
            <p>
              One product. One page.
              <br />A business that’s yours.
            </p>
          </div>
          <div className="sb-footer-links">
            <div>
              <span>Build</span>
              <Link href="/create">Create your shop</Link>
              <Link href="/demo">See an example</Link>
              <Link href="/app">Your workspace</Link>
            </div>
            <div>
              <span>Explore</span>
              <Link href="/#assistant">Your assistant</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/help">Help & answers</Link>
            </div>
            <div>
              <span>The essentials</span>
              <Link href="/terms">Terms</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/sign-in">
                Log in <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </div>
        <div className="sb-footer-wordmark" aria-hidden="true">
          shopablock.
        </div>
        <div className="sb-footer-bottom">
          <span>© {new Date().getFullYear()} ShopaBlock</span>
          <span>For the thing you want to sell.</span>
          <Link href="/create">
            Make your next move <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
