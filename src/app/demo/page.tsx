// src/app/demo/page.tsx
import Link from "next/link";
import { Button, Container, Panel, Row, Kicker } from "@/components/ui";

export default function DemoPage() {
  return (
    <Container narrow>
      <div className="py-20 grid gap-8">
        <header className="grid gap-5">
          <Kicker>Demo block</Kicker>
          <h1 className="text-4xl font-semibold tracking-tight leading-[1.05]">
            Notion Template
          </h1>
          <p className="text-sm text-(--muted) max-w-prose leading-relaxed">
            A single product page for a single product. Clear description, media,
            price, delivery — and one CTA.
          </p>
        </header>

        <Panel>
          <div className="p-6 grid gap-6">
            {/* Media strip (placeholder blocks, same design language as home) */}
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-4/3 border border-(--line-strong) bg-transparent" />
              <div className="aspect-4/3 border border-(--line-strong) bg-transparent" />
              <div className="aspect-4/3 border border-(--line-strong) bg-transparent" />
            </div>

            {/* Core fields */}
            <div className="grid">
              <Row
                left={<div className="text-sm">Product</div>}
                right={<div className="font-medium">Notion Template</div>}
              />
              <Row left={<div className="text-sm">Price</div>} right={<div>£12</div>} />
              <Row
                left={<div className="text-sm">Delivery</div>}
                right={<div>Instant download</div>}
              />
            </div>

            {/* Description */}
            <div className="text-sm leading-relaxed text-(--muted)">
              A clean, reusable workspace for planning, writing, and shipping.
              Includes setup guide + updates.
            </div>

            {/* Single CTA */}
            <div className="pt-2">
              <Button href="/app/new" variant="primary" full>
                Create your own block
              </Button>
            </div>

            <div className="text-[11px] uppercase tracking-[0.28em] text-(--muted)">
              Demo only • Checkout & receipt in real blocks
            </div>
          </div>
        </Panel>

        <p className="text-sm text-(--muted)">
          This is a demo block. Real blocks include checkout, receipts, and delivery.
        </p>

        <Link
          href="/"
          className="text-sm text-(--muted) hover:text-black transition"
        >
          ← Back to home
        </Link>
      </div>
    </Container>
  );
}
