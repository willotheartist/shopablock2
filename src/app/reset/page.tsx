import Link from "next/link";
import { emailConfigured } from "@/lib/v2/mail";
export const metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; sent?: string; error?: string }>;
}) {
  const { token, sent, error } = await searchParams;
  return (
    <main id="main">
      <section
        className="auth-form"
        style={{ maxWidth: 520, margin: "35px auto 60px" }}
      >
        <span className="eyebrow">LET’S GET YOU BACK IN</span>
        <h1>A fresh start.</h1>
        <p>
          {token
            ? "Choose a new password for your shop."
            : "Enter your account email and we’ll send a private reset link."}
        </p>
        {sent && (
          <div className="notice success" role="status">
            If there is an account with that email, a reset link is on its way.
          </div>
        )}
        {error && (
          <div className="notice error" role="alert">
            {error === "expired"
              ? "That link has expired or has already been used. Request a new one."
              : error === "invalid"
                ? "Please check your email or use a password with 10–72 characters."
                : "Password reset emails are currently unavailable. Please try again later."}
          </div>
        )}
        {!token && !emailConfigured() ? (
          <div className="notice">
            Password reset emails are being set up. Please try again later.
          </div>
        ) : (
          <form action="/api/auth/reset" method="post">
            {token ? (
              <>
                <input type="hidden" name="token" value={token} />
                <div className="field">
                  <label htmlFor="password">New password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    required
                    minLength={10}
                    maxLength={72}
                  />
                </div>
              </>
            ) : (
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
              </div>
            )}
            <button className="btn btn-dark btn-block">
              {token ? "Set new password" : "Send reset link"} ↗
            </button>
          </form>
        )}
        <p className="bottom-note">
          <Link href="/sign-in">Back to sign in</Link>
        </p>
      </section>
    </main>
  );
}
