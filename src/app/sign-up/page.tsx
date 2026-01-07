// src/app/sign-up/page.tsx
import Link from "next/link";

export default function SignUpPage({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-(--line) rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="text-sm text-(--muted) mt-1">Email + password.</p>

        {error ? (
          <div className="mt-4 text-sm border border-(--line) rounded-xl px-3 py-2">
            {error === "exists"
              ? "Email already in use."
              : "Please enter a valid email and a password (8+ chars)."}
          </div>
        ) : null}

        <form className="mt-6 grid gap-3" action="/api/auth/sign-up" method="post">
          <label className="grid gap-1 text-sm">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="border border-(--line) rounded-xl px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm">
            Password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="border border-(--line) rounded-xl px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-xl px-3 py-2 border border-(--line) hover:bg-(--accent)/5"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-sm text-(--muted)">
          Already have an account?{" "}
          <Link className="underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
