import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Clock, Download, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { tokenMatches } from "@/lib/v2/security";
import { money } from "@/lib/v2/product";
import { ReceiptSync } from "@/components/v2/OrderActions";
import Brand from "@/components/v2/Brand";
export const metadata = {
  title: "Your order",
  robots: { index: false, follow: false },
  referrer: "no-referrer" as const,
};
export default async function Receipt({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ orderId }, { token = "" }] = await Promise.all([
    params,
    searchParams,
  ]);
  const o = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      block: { select: { title: true, handle: true, deliveryNote: true } },
    },
  });
  if (!o) notFound();
  const user = await getSessionUser();
  if (user?.id !== o.sellerId && !tokenMatches(token, o.accessTokenHash))
    notFound();
  const paid = o.status === "paid" || o.status === "fulfilled";
  return (
    <main id="main" className="checkout-page">
      <div className="checkout-header">
        <Brand />
        <Link href={`/${o.block.handle}`}>Back to shop ↗</Link>
      </div>
      <div className="receipt-card">
        <div className="receipt-icon">
          {paid ? (
            <Check size={29} />
          ) : o.status === "cancelled" ? (
            <X size={29} />
          ) : (
            <Clock size={29} />
          )}
        </div>
        <h1>
          {paid
            ? "A good thing is on its way."
            : o.status === "cancelled"
              ? "This payment was cancelled."
              : "One moment, please."}
        </h1>
        <p>
          {paid
            ? o.digitalAssetId
              ? "Your payment is confirmed. Your download is ready below."
              : "Your payment is confirmed. The seller will prepare your order."
            : o.status === "cancelled"
              ? "You can return to the shop to start a new order."
              : "We’re waiting for confirmation from the payment provider."}
        </p>
        <dl className="detail-list">
          <div>
            <dt>Your good thing</dt>
            <dd>
              {o.productTitle || o.block.title}
              {o.option ? ` · ${o.option}` : ""}
            </dd>
          </div>
          <div>
            <dt>{paid ? "Paid" : "Order total"}</dt>
            <dd>{money(o.amount, o.currency)}</dd>
          </div>
          <div>
            <dt>Order reference</dt>
            <dd>{o.id.slice(-8).toUpperCase()}</dd>
          </div>
          {paid && o.trackingReference && (
            <div>
              <dt>Tracking reference</dt>
              <dd>{o.trackingReference}</dd>
            </div>
          )}
          {paid && !o.digitalAssetId && (
            <div>
              <dt>Delivery</dt>
              <dd>
                {o.block.deliveryNote || "The seller will prepare your order."}
              </dd>
            </div>
          )}
        </dl>
        {paid && o.digitalAssetId && (
          <a
            className="btn btn-dark btn-block"
            href={`/api/assets/${o.digitalAssetId}?token=${encodeURIComponent(token)}`}
          >
            <Download size={17} /> Download your file
          </a>
        )}
        {o.status === "pending" && <ReceiptSync id={o.id} token={token} />}
        <p className="small-note">
          Keep this private order link for your records. Anyone with the link
          can view this receipt.
        </p>
      </div>
    </main>
  );
}
