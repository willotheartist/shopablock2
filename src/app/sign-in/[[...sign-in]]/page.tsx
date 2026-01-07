"use client";

import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
      <ClerkLoading>
        <div className="text-sm opacity-60">Loading sign in…</div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
      </ClerkLoaded>
    </main>
  );
}
