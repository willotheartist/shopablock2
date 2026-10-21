"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Brand from "./Brand";
export function Header({ signedIn }: { signedIn: boolean }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (
    ![
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
    ].includes(path)
  )
    return null;
  return (
    <header className="site-header">
      <Brand />
      <nav
        className={open ? "header-nav open" : "header-nav"}
        aria-label="Main navigation"
      >
        <Link href="/demo" onClick={() => setOpen(false)}>
          See a shop
        </Link>
        <Link href="/#how-it-works" onClick={() => setOpen(false)}>
          How it works
        </Link>
        <Link href="/pricing" onClick={() => setOpen(false)}>
          Pricing
        </Link>
      </nav>
      <div className="header-actions">
        <Link className="login-link" href={signedIn ? "/app" : "/sign-in"}>
          {signedIn ? "Dashboard" : "Log in"}
        </Link>
        <Link className="btn btn-dark btn-sm" href="/create">
          Start selling <ArrowUpRight size={16} />
        </Link>
        <button
          className="mobile-menu icon-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  const p = usePathname();
  if (
    ![
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
    ].includes(p)
  )
    return null;
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Brand />
        <p>Small shop. Big possibilities.</p>
        <Link href="/create" className="footer-link">
          Make something happen <ArrowUpRight size={20} />
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ShopaBlock</span>
        <div>
          <Link href="/help">Help</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
        <span>One good thing is all it takes.</span>
      </div>
    </footer>
  );
}
