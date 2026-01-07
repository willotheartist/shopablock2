import Link from "next/link";
import { Button, Container, Panel } from "@/components/ui";

export default function PricingPage() {
  return (
    <Container>
      <div className="py-20 grid gap-20">

        {/* Header */}
        <section className="grid gap-6 max-w-2xl">
          <div className="text-xs tracking-[0.3em] uppercase text-(--muted)">
            Pricing
          </div>

          <h1 className="text-5xl font-semibold tracking-tight">
            One block. One price.
          </h1>

          <p className="text-lg text-(--muted)">
            ShopABlock is infrastructure for selling a single thing.
            No storefronts. No plans to compare. Just one unit of commerce.
          </p>
        </section>

        {/* Pricing card */}
        <section className="max-w-xl">
          <Panel>
            <div className="p-8 grid gap-8">

              <div className="grid gap-2">
                <div className="text-sm text-(--muted)">Per block</div>
                <div className="text-5xl font-semibold">£9</div>
                <div className="text-sm text-(--muted)">
                  One-time. No monthly fee.
                </div>
              </div>

              <ul className="grid gap-3 text-sm">
                <li>• Public product page</li>
                <li>• Checkout & receipt</li>
                <li>• Digital or physical delivery</li>
                <li>• Orders dashboard</li>
                <li>• Share anywhere</li>
              </ul>

              <div className="pt-4">
                <Button href="/app" variant="primary" full>
                  Start selling
                </Button>
              </div>
            </div>
          </Panel>
        </section>

        {/* Footnote */}
        <section className="max-w-2xl text-sm text-(--muted)">
          Payments, payouts, and transaction fees will be introduced later.
          Early blocks keep their original pricing.
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
