import Link from "next/link";
export const metadata = { title: "A little help" };
export default function Help() {
  return (
    <main id="main" className="info-page">
      <span className="eyebrow">A LITTLE HELP GOES A LONG WAY</span>
      <h1>
        From idea to
        <br />
        your first order.
      </h1>
      <section>
        <h2>Start with your product</h2>
        <p>
          Open the builder, add a name and description, then see your shop take
          shape in the preview. You can try this without an account. Your local
          draft is saved in this browser; sign up to save it to your account.
        </p>
      </section>
      <section>
        <h2>Add the details</h2>
        <p>
          Upload JPG, PNG or WebP photos up to 5 MB each. Add a price in pounds,
          total stock and optional choices such as size or colour. Choices share
          the same price and stock. For physical products, set a UK delivery
          price and timeframe. For digital products, attach your file, up to 50
          MB.
        </p>
      </section>
      <section>
        <h2>Ask for a hand</h2>
        <p>
          Describe your product to the assistant. It can suggest copy and
          details, prepare launch material or summarise your orders. Check its
          suggestions carefully. Nothing is applied or published until you
          approve it.
        </p>
      </section>
      <section>
        <h2>Connect payments and publish</h2>
        <p>
          Payment setup is in your account settings. Complete the verification
          steps with the payment provider, then check your connection status.
          The editor’s launch checklist shows what’s left before publishing.
        </p>
      </section>
      <section>
        <h2>Look after your orders</h2>
        <p>
          Paid orders appear in your dashboard. Use Refresh payments to check
          pending orders. Physical orders can be marked as sent with a tracking
          reference. Digital customers get a private download on their order
          confirmation page. Keep order links private.
        </p>
      </section>
      <section>
        <h2>Buying from a shop?</h2>
        <p>
          Your confirmation page is your order record. Keep its private link.
          The seller is responsible for the product, delivery and any refund
          request. ShopaBlock does not currently send automatic order emails or
          offer in-app refunds.
        </p>
      </section>
      <Link href="/create" className="btn btn-dark" style={{ marginTop: 35 }}>
        Create your little shop ↗
      </Link>
    </main>
  );
}
