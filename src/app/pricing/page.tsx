import Link from "next/link";
export const metadata = { title: "Simple plans for small shops" };
export default function Pricing() {
  return (
    <main id="main" className="info-page">
      <span className="eyebrow">SMALL SHOP. SIMPLE PLANS.</span>
      <h1>
        A little space
        <br />
        for your good thing.
      </h1>
      <p>
        Try the builder and save your draft without entering a payment card.
      </p>
      <div className="price-card">
        <h2>Start with your one thing.</h2>
        <p className="text-muted">
          A considered product page, a live editor and a helping hand with the
          details.
        </p>
        <ul>
          <li>Physical products and private digital downloads</li>
          <li>Your own product link, ready to share</li>
          <li>AI suggestions that you review and approve</li>
          <li>Orders and fulfilment in one simple workspace</li>
        </ul>
        <Link href="/create" className="btn btn-dark">
          Try the builder ↗
        </Link>
      </div>
      <section>
        <h2>The plans we’re working towards.</h2>
        <p>
          Starter — £9/month for 1 public product. Pro — £19/month for 3. Studio
          — £29/month for 10.
        </p>
        <p style={{ marginTop: 15 }}>
          Paid subscriptions are not enabled yet. These are planned prices;
          creating a draft does not start a subscription. Payment processing
          fees are separate and depend on your payment account. Final fees and
          terms will be shown before any paid plan starts.
        </p>
      </section>
      <section>
        <h2>Good questions?</h2>
        <p>
          <Link href="/help">See how ShopaBlock works →</Link>
        </p>
      </section>
    </main>
  );
}
