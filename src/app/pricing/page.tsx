import Link from "next/link";
import { Button } from "@/components/ui";

const TIERS = [
  {
    name: "Starter",
    price: "£9",
    period: "/month",
    meta: "1 block",
    bullets: [
      "1 public block",
      "Checkout + receipt",
      "Digital or physical delivery",
      "Orders dashboard",
      "Share anywhere",
    ],
  },
  {
    name: "Pro",
    price: "£19",
    period: "/month",
    meta: "3 blocks",
    bullets: [
      "3 blocks",
      "Run multiple offers",
      "Fast product editor",
      "Instant payouts via Stripe Express",
      "Built for conversion",
    ],
  },
  {
    name: "Studio",
    price: "£29",
    period: "/month",
    meta: "10 blocks",
    bullets: [
      "10 blocks",
      "For small collections",
      "Multiple drops",
      "Keep the system simple",
      "Scale without bloat",
    ],
  },
];

function Check({ children, tone }: { children: React.ReactNode; tone: "light" | "dark" }) {
  const ring =
    tone === "dark"
      ? "border-white/25 text-white/70"
      : "border-black/15 text-black/60";

  return (
    <div className="flex items-start gap-3">
      <span
        className={[
          "mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs leading-none",
          ring,
        ].join(" ")}
      >
        ✓
      </span>
      <span>{children}</span>
    </div>
  );
}

export default function PricingPage() {
  const starter = TIERS[0];
  const pro = TIERS[1];
  const studio = TIERS[2];

  return (
    <div className="w-full">
      <div className="px-6 md:px-10 lg:px-14 py-24 md:py-28">
        {/* Header (constrained like Awwwards) */}
        <div className="max-w-4xl">
          <div className="text-sm text-black/60">Prices</div>

          <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight leading-[1.02]">
            Buy a block
            <br />
            and increase your visibility.
          </h1>

          <p className="mt-6 text-lg text-black/60 max-w-2xl">
            Blocks are the unit. Pick how many you need now — upgrade when you want more.
          </p>
        </div>

        {/* FULL WIDTH pricing slab */}
        <div className="mt-16 grid gap-10 lg:grid-cols-[420px_1fr] items-stretch w-full">
          {/* LEFT LIGHT SLAB */}
          <div className="bg-white rounded-[28px] border border-black/10 overflow-hidden">
            <div className="p-10 md:p-12">
              <div className="text-3xl font-semibold tracking-tight leading-tight">
                {starter.name}
              </div>

              <div className="mt-12 flex items-end gap-3">
                <div className="text-7xl font-semibold tracking-tight leading-none">
                  {starter.price}
                </div>
                <div className="pb-2 text-lg text-black/55">{starter.period}</div>
              </div>

              <div className="mt-4 text-sm text-black/55">{starter.meta}</div>

              <div className="mt-10 max-w-xs">
                <Button href="/app" variant="outline" full>
                  Choose {starter.name}
                </Button>
              </div>

              <div className="mt-12 grid gap-5 text-sm text-black/65">
                {starter.bullets.map((b) => (
                  <Check key={b} tone="light">
                    {b}
                  </Check>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT DARK SLAB */}
          <div className="bg-neutral-900 text-white rounded-[28px] overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Pro */}
              <div className="p-10 md:p-12">
                <div className="text-3xl font-semibold tracking-tight leading-tight">
                  {pro.name}
                </div>

                <div className="mt-12 flex items-end gap-3">
                  <div className="text-7xl font-semibold tracking-tight leading-none">
                    {pro.price}
                  </div>
                  <div className="pb-2 text-lg text-white/55">{pro.period}</div>
                </div>

                <div className="mt-4 text-sm text-white/60">{pro.meta}</div>

                <div className="mt-10 max-w-xs">
                  <Button href="/app" variant="outline" full>
                    Choose {pro.name}
                  </Button>
                </div>

                <div className="mt-12 grid gap-5 text-sm text-white/70">
                  {pro.bullets.map((b) => (
                    <Check key={b} tone="dark">
                      {b}
                    </Check>
                  ))}
                </div>

                <div className="mt-10 text-sm text-white/60">
                  From 3 plans, find the one that suits you,{" "}
                  <span className="underline underline-offset-4 text-white/85">
                    see all plans
                  </span>
                </div>
              </div>

              {/* Studio */}
              <div className="p-10 md:p-12 bg-white/5 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10">
                <div className="text-sm text-white/70">
                  All{" "}
                  <span className="font-semibold text-white">{studio.name}</span>{" "}
                  plan benefits +
                </div>

                <div className="mt-8">
                  <div className="text-3xl font-semibold tracking-tight leading-tight">
                    {studio.name}
                  </div>

                  <div className="mt-8 flex items-end gap-3">
                    <div className="text-6xl font-semibold tracking-tight leading-none">
                      {studio.price}
                    </div>
                    <div className="pb-2 text-lg text-white/55">{studio.period}</div>
                  </div>

                  <div className="mt-4 text-sm text-white/60">{studio.meta}</div>

                  <div className="mt-10 max-w-xs">
                    <Button href="/app" variant="outline" full>
                      Choose {studio.name}
                    </Button>
                  </div>
                </div>

                <div className="mt-12 grid gap-5 text-sm text-white/70 sm:grid-cols-2">
                  {studio.bullets.map((b) => (
                    <Check key={b} tone="dark">
                      {b}
                    </Check>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-14 max-w-3xl text-sm text-black/60 grid gap-3">
          <p>Transaction fees apply per sale (processed via KompiPay).</p>
          <p>
            Payments and payouts are handled through Stripe Express onboarding via
            KompiPay — no direct Stripe setup required.
          </p>
        </div>

        {/* Back */}
        <div className="mt-10">
          <Link href="/" className="text-sm text-black/55 hover:text-black transition">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
