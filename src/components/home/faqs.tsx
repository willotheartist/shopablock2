// src/components/home/faqs.tsx
"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export type FAQItem = {
  q: string;
  a: React.ReactNode;
};

export default function FAQs({
  items,
  compact = false,
}: {
  items?: FAQItem[];
  compact?: boolean;
}) {
  const v = useMemo(
    () => ({
      wrap: {
        hidden: {},
        show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
      },
      item: {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      },
      line: {
        hidden: { scaleX: 0, opacity: 0.6 },
        show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease } },
      },
    }),
    []
  );

  const defaultItems: FAQItem[] = useMemo(
    () => [
      {
        q: "What is a block?",
        a: (
          <>
            A block is a single product page designed to sell one thing — title,
            description, media, price, delivery, and one “Buy now” button.
          </>
        ),
      },
      {
        q: "Is this a store like Shopify?",
        a: (
          <>
            No. Shopify is a full store with catalogs, themes, and apps.
            ShopABlock is one selling unit: a page + checkout for one product.
          </>
        ),
      },
      {
        q: "What can I sell?",
        a: (
          <>
            Physical or digital products. One product per block. If you want to
            sell more, you add more blocks.
          </>
        ),
      },
      {
        q: "How do payments work?",
        a: (
          <>
            Payments are processed via <span className="font-medium">KompiPay</span>, powered by{" "}
            <span className="font-medium">Stripe Express</span>. Buyers pay at checkout, and
            funds go directly to the seller’s payout account.
          </>
        ),
      },
      {
        q: "Do I need a Stripe account?",
        a: (
          <>
            You’ll complete a quick <span className="font-medium">Stripe Express</span>{" "}
            onboarding through KompiPay. You don’t need to build anything in Stripe —
            it’s just how payouts work.
          </>
        ),
      },
      {
        q: "When do I get paid?",
        a: (
          <>
            Buyers are charged instantly. Payout timing depends on Stripe Express and
            your bank, just like other Stripe-powered tools.
          </>
        ),
      },
      {
        q: "Is this safe for buyers?",
        a: (
          <>
            Yes. Checkout uses Stripe’s secure payment infrastructure, including fraud
            detection, receipts, and dispute handling. Standard card protections apply.
          </>
        ),
      },
      {
        q: "Who handles refunds and chargebacks?",
        a: (
          <>
            Refunds and disputes are handled through the payment rail (Stripe Express via
            KompiPay). Sellers manage them directly through their connected payout account.
          </>
        ),
      },
      {
        q: "How is this different from Gumroad?",
        a: (
          <>
            Gumroad is a marketplace and payment intermediary. ShopABlock gives sellers
            their own page and direct payments — without running a full store.
          </>
        ),
      },
      {
        q: "How do shipping and delivery work?",
        a: (
          <>
            If you sell a physical product, we collect shipping details at checkout. If
            you sell digital, we only collect what’s needed and skip shipping.
          </>
        ),
      },
      {
        q: "Can I customize the design?",
        a: (
          <>
            Not really (on purpose). Blocks are opinionated so they stay fast, clear,
            and focused on conversion.
          </>
        ),
      },
      {
        q: "What fees do you charge?",
        a: (
          <>
            You pay your block subscription, plus a small transaction fee per sale (via
            KompiPay), and standard payment processing fees.
          </>
        ),
      },
    ],
    []
  );

  const data = items ?? defaultItems;

  return (
    <motion.section
      variants={v.wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      className={cx(
        "px-6",
        compact ? "py-16 md:py-18" : "py-24 md:py-28",
        "border-b border-black"
      )}
    >
      <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
        {/* Left label */}
        <motion.div variants={v.item} className="md:col-span-4">
          <div className="text-xs uppercase tracking-[0.18em] text-black/70">
            FAQ
          </div>
          <h3 className="mt-5 text-2xl tracking-tight font-normal">
            Clear answers.
            <br />
            No pitch.
          </h3>

          <div className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
            Payments are handled via{" "}
            <span className="font-medium">KompiPay</span>, powered by{" "}
            <span className="font-medium">Stripe Express</span>. Funds go directly to
            sellers.
          </div>
        </motion.div>

        {/* Right accordion */}
        <motion.div
          variants={v.item}
          className="md:col-span-8 border border-black"
        >
          {/* Header row */}
          <div className="px-6 md:px-8 py-5 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-black/60 border-b border-black">
            <span>Questions</span>
            <span>Answers</span>
          </div>

          <div className="divide-y divide-black">
            {data.map((it) => (
              <details key={it.q} className="group">
                <summary
                  className={cx(
                    "cursor-pointer list-none",
                    "px-6 md:px-8 py-6",
                    "flex items-start justify-between gap-6"
                  )}
                >
                  <span className="text-sm leading-relaxed">{it.q}</span>
                  <span
                    className={cx(
                      "shrink-0 text-xs uppercase tracking-[0.18em]",
                      "text-black/60 group-open:text-black"
                    )}
                    aria-hidden
                  >
                    {/** keep it extremely minimal, matches your L&F */}
                    +
                  </span>
                </summary>

                <div className="px-6 md:px-8 pb-6 -mt-2">
                  <div className="text-sm leading-relaxed text-black/80 max-w-2xl">
                    {it.a}
                  </div>
                </div>
              </details>
            ))}
          </div>

          {/* Footer strip */}
          <motion.div
            variants={v.item}
            className="border-t border-black px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div className="text-xs uppercase tracking-[0.18em] text-black/60">
              Trust
            </div>
            <div className="text-sm text-black/80">
              Checkout uses Stripe infrastructure via KompiPay — receipts, disputes, and
              payout onboarding included.
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
