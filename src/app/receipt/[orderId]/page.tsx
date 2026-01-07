import { getOrder } from "@/lib/orders";
import { getBlockById } from "@/lib/blocks";
import { Button, Container, Kicker, Panel, Row } from "@/components/ui";

export default async function ReceiptPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await getOrder(params.orderId);
  if (!order) return null;

  const block = await getBlockById(order.blockId);

  return (
    <Container narrow>
      <div className="py-10 grid gap-4">
        <Row left={<Kicker>Receipt</Kicker>} right={order.status} />

        <Panel>
          <div className="p-5 grid gap-4">
            <Row left="Item" right={block?.title} />
            <Row
              left="Amount"
              right={`£${(Number(order.amount) / 100).toFixed(2)}`}
            />
            <Row left="Email" right={order.email} />

            <div className="pt-2">
              <Button href={`/${block?.handle}`}>Back to block</Button>
            </div>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
