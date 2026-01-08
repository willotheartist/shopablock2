// src/app/pricing/page.tsx
import Link from "next/link";
import { Button, Container, Panel } from "@/components/ui";

const TIERS = [
  {
    name: "Starter",
    price: "£9",
    period: "/month",
    meta: "1 block",
    bullets: ["1 public block", "Checkout + receipt", "Digital or physical delivery", "Orders dashboard", "Share anywhere"],
  },
  {
    name: "Pro",
    price: "£19",
    period: "/month",
    meta: "3 blocks",
    bullets: ["3 blocks", "Run multiple offers", "Fast product editor", "Instant payouts via Stripe Express", "Built for conversion"],
  },
  {
    name: "Studio",
    price: "£29",
    period: "/month",
    meta: "10 blocks",
    bullets: ["10 blocks", "For small collections", "Multiple drops", "Keep the system simple", "Scale without bloat"],
  },
];

export default function PricingPage() {
  return (
    <Container>
      <div className="py-20 grid gap-16">
        {/* Header */}
        <section className="grid gap-6 max-w-2xl">
          <div className="text-xs tracking-[0.3em] uppercase text-(--muted)">
            Pricing
          </div>

          <h1 className="text-5xl font-semibold tracking-tight">
            Buy a block. Start selling.
          </h1>

          <p className="text-lg text-(--muted)">
            Blocks are the unit. Pick how many you need now — upgrade when you want more.
          </p>
        </section>

        {/* Tiers */}
        <section className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((t) => (
              <Panel key={t.name}>
                <div className="p-8 grid gap-7">
                  <div className="grid gap-2">
                    <div className="text-xs tracking-[0.3em] uppercase text-(--muted)">
                      {t.name}
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-5xl font-semibold">{t.price}</div>
                      <div className="text-sm text-(--muted)">{t.period}</div>
                    </div>
                    <div className="text-sm text-(--muted)">{t.meta}</div>
                  </div>

                  <ul className="grid gap-3 text-sm">
                    {t.bullets.map((b) => (
                      <li key={b}>• {b}</li>
                    ))}
                  </ul>

                  <div className="pt-2">
                    <Button href="/app" variant="primary" full>
                      Start selling
                    </Button>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="max-w-2xl text-sm text-(--muted) grid gap-3">
          <p>
            Transaction fees apply per sale (processed via KompiPay).
          </p>
          <p>
            Payments and payouts are handled through Stripe Express onboarding via KompiPay — no direct Stripe setup required.
          </p>
        </section>

        {/* Back link */}
        <section>
          <Link
            href="/"
            className="text-sm text-(--muted) hover:text-black transition"
          >
            ← Back to home
          </Link>
        </section>
      </div>
    </Container>
  );
}
