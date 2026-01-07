"use client";

import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-(--line) bg-[rgba(255,255,255,0.7)] backdrop-blur">
      <div className="w-full px-6 sm:px-10 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/blocklogo.png" alt="Shopablock" width={140} height={28} priority className="h-6 w-auto" />
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm px-3 py-2 rounded-md border border-(--line) hover:bg-black/5 transition">
            Sign in
          </Link>
          <Link href="/sign-up" className="text-sm px-3 py-2 rounded-md bg-(--accent) text-white hover:opacity-95 transition">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
