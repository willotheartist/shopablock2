"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="not-found">
      <h1>A little interruption.</h1>
      <p>We couldn’t load this page. Your saved work is safe.</p>
      <button className="btn btn-dark" onClick={reset}>
        Try again ↗
      </button>
    </main>
  );
}
