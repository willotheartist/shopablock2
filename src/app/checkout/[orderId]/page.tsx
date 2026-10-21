import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { paymentsConfigured } from "@/lib/kompipay";
import { money } from "@/lib/v2/product";
import Checkout from "@/components/v2/Checkout";
import Brand from "@/components/v2/Brand";
export const metadata = {
  title: "Secure checkout",
  robots: { index: false, follow: false },
};
export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ option?: string }>;
}) {
  const [{ orderId }, { option = "" }] = await Promise.all([
    params,
    searchParams,
  ]);
  const b = await prisma.block.findFirst({
    where: { id: orderId, status: "active", archivedAt: null },
    include: {
      media: { orderBy: { sort: "asc" }, take: 1 },
      owner: { select: { payoutsStatus: true, kompipayAccountId: true } },
    },
  });
  if (!b) notFound();
  const options = Array.isArray(b.options) ? b.options : [];
  const selected = options.includes(option) ? option : String(options[0] || "");
  const ready =
    paymentsConfigured() &&
    b.owner.payoutsStatus === "active" &&
    !!b.owner.kompipayAccountId &&
    (b.quantity === null || b.quantity > b.soldCount + b.reservedCount);
  const physical = b.deliveryType === "physical";
  const shipping = physical ? b.shippingPrice : 0;
  return (
    <main id="main" className="checkout-page">
      <div className="checkout-header">
        <Brand />
        <Link href={`/${b.handle}`}>← Back to shop</Link>
      </div>
      <div className="checkout-layout">
        <section className="checkout-summary">
          {b.media[0] && <img src={b.media[0].url} alt={b.title} />}
          <span className="eyebrow">{b.brandName || "YOUR GOOD THING"}</span>
          <h1>{b.title}</h1>
          {selected && <p>{selected}</p>}
          <p>
            {physical
              ? b.deliveryNote
              : "Digital file · available after payment"}
          </p>
          <div className="checkout-totals">
            <div>
              <span>Product · quantity 1</span>
              <span>{money(b.price, b.currency)}</span>
            </div>
            {physical && (
              <div>
                <span>UK delivery</span>
                <span>{shipping ? money(shipping, b.currency) : "Free"}</span>
              </div>
            )}
            <div>
              <span>Total</span>
              <strong>{money(b.price + shipping, b.currency)}</strong>
            </div>
          </div>
        </section>
        <section className="checkout-form">
          <Checkout
            blockId={b.id}
            option={selected}
            physical={physical}
            ready={ready}
          />
        </section>
      </div>
    </main>
  );
}
