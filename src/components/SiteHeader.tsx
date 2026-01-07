"use client";

import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function SiteHeader() {
  return (
    <header className="border-b border-(--line)">
      <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">
          shopablock
        </Link>

        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="redirect" forceRedirectUrl="/app">
              <button
                type="button"
                className="text-sm px-3 py-2 rounded-md border border-(--line)"
              >
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="redirect" forceRedirectUrl="/app">
              <button
                type="button"
                className="text-sm px-3 py-2 rounded-md bg-(--accent) text-white"
              >
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/app"
              className="text-sm px-3 py-2 rounded-md border border-(--line)"
            >
              Dashboard
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
