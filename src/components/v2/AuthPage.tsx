import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function AuthPage({
  signup = false,
  next = "/app",
  error,
}: {
  signup?: boolean;
  next?: string;
  error?: string;
}) {
  const messages: Record<string, string> = {
    invalid: signup
      ? "Use a valid email and a password with 10–72 characters."
      : "That email and password didn’t match. Please try again.",
    exists: "An account with this email already exists. Try signing in.",
    limited: "Too many attempts. Please try again a little later.",
    unavailable: "We couldn’t reach your account right now. Please try again.",
    reset: "Your password is updated. Sign in to continue.",
  };
  return (
    <main id="main" className="auth-layout">
      <div className="auth-art">
        <img
          src="/images/mug.webp"
          alt="A little good thing, ready for its own shop"
        />
        <div className="auth-art-overlay">
          <h2>
            One good thing.
            <br />
            Your next chapter.
          </h2>
          <p>Give your idea a place of its own.</p>
        </div>
      </div>
      <section className="auth-form">
        <span className="eyebrow">
          {signup ? "YOUR GOOD IDEA STARTS HERE" : "A LITTLE SHOP. ALL YOURS."}
        </span>
        <h1>{signup ? "Let’s make it happen." : "Good to see you."}</h1>
        <p>
          {signup
            ? "Create your account and give your product a beautiful little home."
            : "Sign in and pick up where you left off."}
        </p>
        {error && (
          <div
            className={`notice ${error === "reset" ? "success" : "error"}`}
            role="alert"
          >
            {messages[error] || messages.unavailable}
          </div>
        )}
        <form
          method="post"
          action={`/api/auth/${signup ? "sign-up" : "sign-in"}`}
        >
          <input type="hidden" name="next" value={next} />
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">
              Password
              {!signup && (
                <Link href="/reset" className="text-muted">
                  Forgot it?
                </Link>
              )}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={signup ? 10 : 1}
              maxLength={72}
              autoComplete={signup ? "new-password" : "current-password"}
              placeholder={signup ? "At least 10 characters" : "Your password"}
            />
          </div>
          <button className="btn btn-dark btn-block">
            {signup ? "Create your account" : "Sign in"}{" "}
            <ArrowUpRight size={17} />
          </button>
        </form>
        <p className="bottom-note">
          {signup ? "Already have an account?" : "New to ShopaBlock?"}{" "}
          <Link
            href={`/${signup ? "sign-in" : "sign-up"}?next=${encodeURIComponent(next)}`}
          >
            {signup ? "Sign in" : "Create an account"}
          </Link>
        </p>
        {signup && (
          <p className="bottom-note">
            By continuing, you agree to our <Link href="/terms">terms</Link> and
            acknowledge our <Link href="/privacy">privacy information</Link>.
          </p>
        )}
      </section>
    </main>
  );
}
