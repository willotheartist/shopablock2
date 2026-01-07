// src/app/app/orders/[id]/page.tsx
import { redirect, notFound } from "next/navigation";
import { Container, Panel, Kicker, Button } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app/orders");

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, sellerId: user.id },
    select: {
      id: true,
      status: true,
      amount: true,
      currency: true,
      email: true,
      shipName: true,
      shipLine1: true,
      shipLine2: true,
      shipCity: true,
      shipPostcode: true,
      shipCountry: true,
      fulfilledAt: true,
      createdAt: true,
      block: { select: { id: true, title: true, handle: true } },
    },
  });

  if (!order) notFound();

  const ship = [
    order.shipName,
    order.shipLine1,
    order.shipLine2,
    order.shipCity,
    order.shipPostcode,
    order.shipCountry,
  ].filter(Boolean);

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Order</h1>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
              {order.id}
            </div>
          </div>

          <a href="/app/orders">
            <Button variant="outline">Back</Button>
          </a>
        </div>

        <Panel>
          <div className="p-5 grid gap-4">
            <div className="text-sm">
              <div className="text-(--muted)">Block</div>
              <div className="font-medium">{order.block.title}</div>
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
                @{order.block.handle}
              </div>
            </div>

            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-(--muted)">Status</span>
                <span className="font-medium">{order.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-(--muted)">Amount</span>
                <span className="font-medium">
                  {order.currency} {(order.amount / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-(--muted)">Customer</span>
                <span className="font-medium">{order.email}</span>
              </div>
            </div>

            <div className="text-sm">
              <div className="text-(--muted)">Shipping</div>
              {ship.length ? (
                <div className="mt-1 whitespace-pre-line">{ship.join("\n")}</div>
              ) : (
                <div className="mt-1 text-(--muted)">No shipping details.</div>
              )}
            </div>

            <div className="text-sm">
              <div className="text-(--muted)">Fulfilled</div>
              <div className="mt-1">
                {order.fulfilledAt ? order.fulfilledAt.toISOString() : "No"}
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
