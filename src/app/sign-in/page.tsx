// src/app/sign-in/page.tsx
import Link from "next/link";
import SignInErrorCleaner from "./sign-in-error-cleaner";

export default function SignInPage({
  searchParams,
}: {
  searchParams?: { error?: string; next?: string };
}) {
  const error = searchParams?.error;
  const next = searchParams?.next ?? "/app";

  const showInvalid = error === "invalid";

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      {showInvalid ? <SignInErrorCleaner /> : null}

      <div className="w-full max-w-sm border border-(--line) rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-(--muted) mt-1">Welcome back.</p>

        {showInvalid ? (
          <div className="mt-4 text-sm border border-(--line) rounded-xl px-3 py-2">
            Email or password didn’t match. Try again.
          </div>
        ) : null}

        <form
          className="mt-6 grid gap-3"
          action="/api/auth/sign-in"
          method="post"
        >
          <input type="hidden" name="next" value={next} />

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
              autoComplete="current-password"
              className="border border-(--line) rounded-xl px-3 py-2"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-xl px-3 py-2 border border-(--line) hover:bg-(--accent)/5"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-sm text-(--muted)">
          New here?{" "}
          <Link className="underline" href="/sign-up">
            Create an account
          </Link>
        </p>

        <p className="mt-2 text-xs text-(--muted)">
          Forgot your password?{" "}
          <Link className="underline" href="/reset">
            Reset it
          </Link>
        </p>
      </div>
    </div>
  );
}
