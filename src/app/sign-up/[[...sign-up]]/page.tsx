"use client";

import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
      <ClerkLoading>
        <div className="text-sm opacity-60">Loading sign up…</div>
      </ClerkLoading>

      <ClerkLoaded>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
      </ClerkLoaded>
    </main>
  );
}
