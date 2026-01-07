// src/app/app/orders/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { Container, Panel, Kicker } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export default async function OrdersPage() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app/orders");

  const orders = await prisma.order.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      amount: true,
      currency: true,
      email: true,
      createdAt: true,
      block: { select: { title: true, handle: true } },
    },
  });

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div>
          <Kicker>App</Kicker>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">Orders</h1>
        </div>

        <Panel>
          <div className="p-5">
            {orders.length === 0 ? (
              <p className="text-sm text-(--muted)">No orders yet.</p>
            ) : (
              <div className="border-t border-(--line)">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/app/orders/${o.id}`}
                    className="block border-t border-(--line) hover:bg-(--accent)/5"
                  >
                    <div className="flex items-center justify-between gap-6 py-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {o.block.title}
                        </div>
                        <div className="truncate font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
                          {o.status} · {o.currency} {(o.amount / 100).toFixed(2)} ·{" "}
                          {o.email}
                        </div>
                      </div>
                      <div className="text-(--accent) text-xl leading-none">↗</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>
    </Container>
  );
}
