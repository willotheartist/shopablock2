import { getBlockByHandle } from "@/lib/blocks";
import { createOrder } from "@/lib/orders";
import { Button, Container, Panel } from "@/components/ui";

export default async function PublicBlockPage({
  params,
}: {
  params: { handle: string };
}) {
  const block = await getBlockByHandle(params.handle);

  if (!block || block.status !== "active") {
    return (
      <Container narrow>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold">Not found</h1>
          <p className="mt-2 text-sm text-(--muted)">
            This block doesn’t exist or is no longer available.
          </p>
        </div>
      </Container>
    );
  }

  async function buy(formData: FormData) {
    "use server";

    const email = String(formData.get("email") || "").trim();
    if (!email) throw new Error("Email required");

    const order = await createOrder({
      blockId: block.id,
      sellerId: block.ownerId,
      email,
    });

    return order;
  }

  return (
    <Container narrow>
      <div className="py-16 grid gap-10">
        {/* Header */}
        <div className="grid gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {block.title}
          </h1>
          <p className="text-(--muted) text-base leading-relaxed">
            {block.description}
          </p>
        </div>

        {/* Offer */}
        <Panel>
          <div className="p-6 grid gap-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-(--muted)">Price</div>
              <div className="text-2xl font-semibold">
                £{(Number(block.price) / 100).toFixed(2)}
              </div>
            </div>

            <form action={buy} className="grid gap-3">
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-md border border-(--line) px-3 py-2 text-sm"
              />

              <Button type="submit" variant="primary" full>
                Buy now
              </Button>
            </form>

            <div className="text-xs text-(--muted) leading-relaxed">
              <p>Secure checkout · Instant delivery</p>
              <p>
                By purchasing, you agree to the seller’s refund and support
                policy.
              </p>
            </div>
          </div>
        </Panel>

        {/* Footer trust */}
        <div className="text-xs text-(--muted) leading-relaxed">
          <p>
            Sold by <span className="font-medium">@{block.handle}</span>
          </p>
          <p>Questions? Contact the seller directly.</p>
        </div>
      </div>
    </Container>
  );
}
