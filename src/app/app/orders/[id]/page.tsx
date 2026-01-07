import { auth } from "@clerk/nextjs/server";
import { Container, Panel, Row, Kicker, Button } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const order = await prisma.order.findFirst({
    where: { id: params.id, sellerId: userId },
    include: { block: true },
  });

  if (!order) {
    return (
      <Container narrow>
        <div className="py-10">
          <Panel>
            <div className="p-6">
              <Kicker>Not found</Kicker>
              <h1 className="mt-3 text-xl font-semibold">Order not found</h1>
            </div>
          </Panel>
        </div>
      </Container>
    );
  }

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <Row left={<Kicker>Order</Kicker>} right={order.status} />

        <Panel>
          <div className="p-6 grid gap-3 text-sm">
            <Row left="Product" right={order.block.title} />
            <Row left="Amount" right={order.amount} />
            <Row left="Buyer email" right={order.email} />
            <Row left="Created" right={order.createdAt.toDateString()} />
          </div>
        </Panel>

        <Button href="/app/orders" variant="outline">
          ← Back to orders
        </Button>
      </div>
    </Container>
  );
}
