export const metadata = { title: "Privacy information" };
export default function Privacy() {
  return (
    <main id="main" className="info-page">
      <span className="eyebrow">YOUR INFORMATION</span>
      <h1>
        A little clarity
        <br />
        on your data.
      </h1>
      <p>
        This describes how the current ShopaBlock app handles information.
        Updated 21 October 2026.
      </p>
      <section>
        <h2>Your account and shop</h2>
        <p>
          ShopaBlock stores your email, a hashed password, account settings,
          product details and files. A secure session cookie keeps you signed
          in. Drafts created before signing in are stored in your browser until
          you save or clear them.
        </p>
      </section>
      <section>
        <h2>Orders and payments</h2>
        <p>
          For purchases, we store the buyer’s email, order details and, for
          physical products, delivery address. The seller can see this
          information to fulfil the order. Card and bank details are handled by
          the payment providers, KompiPay and Stripe. ShopaBlock stores payment
          references and status, not card numbers.
        </p>
      </section>
      <section>
        <h2>Files and service providers</h2>
        <p>
          The app is hosted on Vercel, with account and order records in Neon
          and uploaded files in private Vercel Blob storage. Photos attached to
          published products are publicly viewable. Digital files require a paid
          order link or the seller’s authenticated account.
        </p>
      </section>
      <section>
        <h2>The shop assistant</h2>
        <p>
          When you request AI assistance, your request and relevant product
          information may be sent through Vercel AI Gateway to an AI model
          provider. Order tools provide totals and fulfilment counts without
          buyer email or delivery addresses. Requests and results are saved in
          your assistant history. Do not include passwords, payment details or
          sensitive personal information in your requests.
        </p>
      </section>
      <section>
        <h2>Access and retention</h2>
        <p>
          Public product pages can be viewed by anyone. Your account, draft
          products and order records require appropriate access. Private receipt
          links act as access keys and should not be shared. Account and order
          records are retained to operate your shop; there is currently no
          automated account deletion or data export tool.
        </p>
      </section>
      <section>
        <h2>Cookies and local storage</h2>
        <p>
          The current app uses essential storage for sign-in, local drafts and
          checkout recovery. It does not include advertising trackers. Your
          browser can clear local storage and cookies; doing so removes unsaved
          local drafts and signs you out.
        </p>
      </section>
    </main>
  );
}
