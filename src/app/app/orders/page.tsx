import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/v2/http";
import { money } from "@/lib/v2/product";
import { SyncOrders } from "@/components/v2/OrderActions";
export const metadata = { title: "Orders" };
export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const u = await requireUser();
  const { status } = await searchParams;
  const filter = ["pending", "paid", "fulfilled", "cancelled"].includes(
    status || "",
  )
    ? (status as "pending" | "paid" | "fulfilled" | "cancelled")
    : undefined;
  const orders = await prisma.order.findMany({
    where: { sellerId: u.id, ...(filter ? { status: filter } : {}) },
    take: 100,
    orderBy: { createdAt: "desc" },
    include: { block: { select: { title: true } } },
  });
  return (
    <main id="main">
      <div className="workspace-top">
        <div>
          <span className="eyebrow">GOOD THINGS, HEADING OUT</span>
          <h1>Your orders.</h1>
          <p>Keep track of every little delivery.</p>
        </div>
        <SyncOrders />
      </div>
      <div className="editor-tabs">
        {[
          ["", "All orders"],
          ["paid", "To send"],
          ["fulfilled", "Completed"],
          ["pending", "Pending"],
        ].map(([v, l]) => (
          <Link
            key={v}
            href={`/app/orders${v ? `?status=${v}` : ""}`}
            className={
              (!filter && !v) || filter === v ? "text-link" : "text-muted"
            }
            style={{ fontSize: 11, paddingBottom: 12 }}
          >
            {l}
          </Link>
        ))}
      </div>
      {orders.length ? (
        <section className="panel">
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/app/orders/${o.id}`}>
                        {o.productTitle || o.block.title} ↗
                        <small>#{o.id.slice(-8).toUpperCase()}</small>
                      </Link>
                    </td>
                    <td>{o.email}</td>
                    <td>
                      {o.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td>{money(o.amount, o.currency)}</td>
                    <td>
                      <span className={`status ${o.status}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small-note">
            Showing the latest 100 orders. Pending orders reserve stock until
            the payment provider confirms payment or cancellation.
          </p>
        </section>
      ) : (
        <div className="empty-state">
          <ShoppingBag size={35} />
          <h2>A little quiet, for now.</h2>
          <p>
            {filter
              ? "No orders with this status."
              : "Share your shop link with your people. Your orders will appear here."}
          </p>
          <Link href="/app" className="btn btn-outline">
            Back to your shop ↗
          </Link>
        </div>
      )}
    </main>
  );
}
