// src/app/reset/page.tsx
export const dynamic = "force-dynamic";

export default function ResetPage({
  searchParams,
}: {
  searchParams?: { ok?: string; error?: string };
}) {
  const ok = searchParams?.ok;
  const error = searchParams?.error;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-(--line) rounded-2xl p-6">
        <h1 className="text-xl font-semibold">Reset password</h1>
        <p className="text-sm text-(--muted) mt-1">
          Dev/admin reset. (Disable for production.)
        </p>

        {ok ? (
          <div className="mt-4 text-sm border border-(--line) rounded-xl px-3 py-2">
            Password updated. You can sign in now.
          </div>
        ) : null}

        {error ? (
          <div className="mt-4 text-sm border border-(--line) rounded-xl px-3 py-2">
            {error === "forbidden"
              ? "Reset is disabled."
              : error === "missing"
              ? "Enter email + new password (8+ chars)."
              : error === "notfound"
              ? "No user with that email."
              : "Something went wrong."}
          </div>
        ) : null}

        <form className="mt-6 grid gap-3" action="/api/auth/reset" method="post">
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
            New password
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
            Set new password
          </button>
        </form>
      </div>
    </div>
  );
}
