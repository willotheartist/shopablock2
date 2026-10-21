import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/v2/http";
import { money } from "@/lib/v2/product";
import { FulfilOrder, SyncOrders } from "@/components/v2/OrderActions";
export default async function Order({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const u = await requireUser();
  const { id } = await params;
  const o = await prisma.order.findFirst({
    where: { id, sellerId: u.id },
    include: { block: { select: { title: true, deliveryType: true } } },
  });
  if (!o) notFound();
  return (
    <main id="main">
      <Link className="text-link" href="/app/orders">
        ← All orders
      </Link>
      <div className="workspace-top" style={{ marginTop: 25 }}>
        <div>
          <span className="eyebrow">ORDER #{o.id.slice(-8).toUpperCase()}</span>
          <h1>{o.productTitle || o.block.title}</h1>
          <p>
            {o.createdAt.toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Europe/London",
            })}
          </p>
        </div>
        <span className={`status ${o.status}`}>{o.status}</span>
      </div>
      <div className="order-detail-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>The details</h2>
          </div>
          <dl className="detail-list">
            <div>
              <dt>Customer</dt>
              <dd>{o.email}</dd>
            </div>
            <div>
              <dt>Product</dt>
              <dd>
                {o.productTitle || o.block.title}
                {o.option ? ` · ${o.option}` : ""}
              </dd>
            </div>
            <div>
              <dt>Total · including delivery</dt>
              <dd>{money(o.amount, o.currency)}</dd>
            </div>
            {o.shipName && (
              <div>
                <dt>Delivery address</dt>
                <dd>
                  {[
                    o.shipName,
                    o.shipLine1,
                    o.shipLine2,
                    o.shipCity,
                    o.shipPostcode,
                    "United Kingdom",
                  ]
                    .filter(Boolean)
                    .join("\n")}
                </dd>
              </div>
            )}
            {o.trackingReference && (
              <div>
                <dt>Tracking reference</dt>
                <dd>{o.trackingReference}</dd>
              </div>
            )}
          </dl>
        </section>
        <section className="panel">
          <div className="panel-heading">
            <h2>
              {o.status === "paid"
                ? "Ready to head out."
                : o.status === "fulfilled"
                  ? "All taken care of."
                  : "Payment status"}
            </h2>
          </div>
          {o.status === "paid" && o.block.deliveryType === "physical" ? (
            <FulfilOrder id={o.id} />
          ) : o.status === "fulfilled" ? (
            <p className="text-muted" style={{ fontSize: 12 }}>
              {o.digitalAssetId
                ? "Your customer can download their file from the private order confirmation page."
                : `Marked as sent${o.fulfilledAt ? ` on ${o.fulfilledAt.toLocaleDateString("en-GB")}` : ""}.`}
            </p>
          ) : (
            <>
              <p
                className="text-muted"
                style={{ fontSize: 12, marginBottom: 20 }}
              >
                Only confirmed payments count as sales. If the customer has
                paid, refresh to check the provider.
              </p>
              <SyncOrders />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
