import Link from "next/link";
import { Container, Panel, Kicker } from "@/components/ui";
import { prisma } from "@/lib/db";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { block: true },
  });

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <Kicker>Orders</Kicker>

        <h1 className="text-2xl font-semibold tracking-tight">
          All orders
        </h1>

        <Panel>
          <div className="p-4 grid gap-2">
            {orders.length === 0 ? (
              <p className="text-sm text-(--muted)">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/app/orders/${order.id}`}
                  className="block border-b border-(--line) last:border-0 hover:bg-(--accent)/5"
                >
                  <div className="py-3 flex justify-between gap-4 text-sm">
                    <div className="truncate">
                      {order.block.title}
                    </div>
                    <div className="text-(--muted)">
                      {order.amount}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </Panel>
      </div>
    </Container>
  );
}
