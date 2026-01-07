import Link from "next/link";
import { Button, Container, Panel, Row, Kicker } from "@/components/ui";

export default function DemoPage() {
  return (
    <Container narrow>
      <div className="py-20 grid gap-6">

        <Kicker>Demo</Kicker>

        <h1 className="text-4xl font-semibold tracking-tight">
          Sell one thing.
        </h1>

        <Panel>
          <div className="p-6 grid gap-4">
            <Row
              left={<div className="text-sm">Product</div>}
              right={<div className="font-medium">Notion Template</div>}
            />

            <Row
              left={<div className="text-sm">Price</div>}
              right={<div>£12</div>}
            />

            <Row
              left={<div className="text-sm">Delivery</div>}
              right={<div>Instant download</div>}
            />

            <div className="pt-4">
              <Button href="/app/new" variant="primary" full>
                Create your own block
              </Button>
            </div>
          </div>
        </Panel>

        <p className="text-sm text-(--muted)">
          This is a demo block. Real blocks include checkout, receipts,
          and delivery.
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
