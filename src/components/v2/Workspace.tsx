"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ShoppingBag,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";
import Brand from "./Brand";
const links = [
  ["/app", "Your shop", LayoutGrid],
  ["/app/orders", "Orders", ShoppingBag],
  ["/app/assistant", "Assistant", Sparkles],
  ["/app/settings", "Settings", Settings],
] as const;
export default function Workspace({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const path = usePathname();
  if (path.startsWith("/app/blocks/")) return <>{children}</>;
  return (
    <div className="workspace">
      <aside className="sidebar">
        <Brand />
        <nav aria-label="Seller navigation">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              className={
                (href === "/app" ? path === "/app" : path.startsWith(href))
                  ? "active"
                  : ""
              }
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <span>{email}</span>
          <form action="/api/auth/sign-out" method="post">
            <button>
              <LogOut size={14} /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="workspace-content">
        <div className="workspace-mobile-brand">
          <Brand />
          <span>YOUR LITTLE SHOP</span>
        </div>
        {children}
      </div>
    </div>
  );
}
