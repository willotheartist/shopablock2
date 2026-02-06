//·src/components/PayoutsConnectButton.tsx
"use client";

export default function PayoutsConnectButton() {
  const dashboardUrl =
    process.env.NEXT_PUBLIC_KOMPIPAY_DASHBOARD_URL &&
    process.env.NEXT_PUBLIC_KOMPIPAY_DASHBOARD_URL.trim()
      ? process.env.NEXT_PUBLIC_KOMPIPAY_DASHBOARD_URL.trim()
      : null;

  return (
    <div className="grid gap-2">
      {dashboardUrl ? (
        <a
          href={dashboardUrl}
          target="_blank"
          rel="noreferrer"
          className={
            "inline-flex items-center justify-center border px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] " +
            "border-(--line-strong) text-(--fg) hover:bg-(--accent)/8 focus:outline-none focus:ring-2 focus:ring-(--accent)/30"
          }
        >
          Manage payouts
        </a>
      ) : (
        <div className="border border-(--line) p-4 grid gap-2">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
            Payouts setup
          </div>
          <div className="text-sm">
            Stripe onboarding is managed in the KompiPay dashboard (merchant UI),
            not inside ShopaBlock.
          </div>
          <div className="text-xs text-(--muted)">
            If you need a dashboard link, set{" "}
            <span className="font-mono">NEXT_PUBLIC_KOMPIPAY_DASHBOARD_URL</span>.
          </div>
        </div>
      )}

      <div className="text-xs text-(--muted)">
        KompiPay v1 uses checkout redirects. Seller onboarding isn’t available via API.
      </div>
    </div>
  );
}
