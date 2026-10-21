// src/components/home/faqs.tsx
"use client";

import { Anonymous_Pro } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const anonymous = Anonymous_Pro({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ease = [0.16, 1, 0.3, 1] as const;

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export type FAQItem = {
  q: string;
  a: React.ReactNode;
};

function PlusMinus({ open }: { open: boolean }) {
  return (
    <motion.span
      aria-hidden
      className={cx(
        "grid place-items-center",
        "h-12 w-12 md:h-13 md:w-13 rounded-full",
        open ? "bg-black text-[rgb(246,245,241)]" : "bg-black text-[rgb(246,245,241)]"
      )}
      initial={false}
      animate={{ scale: open ? 1.02 : 1 }}
      transition={{ duration: 0.25, ease }}
    >
      <motion.span
        className={cx(anonymous.className, "text-xl leading-none")}
        initial={false}
        animate={{ rotate: open ? 0 : 0 }}
        transition={{ duration: 0.25, ease }}
      >
        {open ? "–" : "+"}
      </motion.span>
    </motion.span>
  );
}

function Answer({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key="a"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{
          height: { duration: 0.45, ease },
          opacity: { duration: 0.25, ease },
        }}
        className="overflow-hidden"
      >
        <motion.div
          initial={{ y: -6 }}
          animate={{ y: 0 }}
          exit={{ y: -6 }}
          transition={{ duration: 0.35, ease }}
          className="pb-8 md:pb-10 pr-0 md:pr-16"
        >
          <div className="mt-4 text-sm md:text-[15px] leading-relaxed text-black/55 max-w-3xl">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

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
        show: {
          transition: { staggerChildren: 0.12, delayChildren: 0.04 },
        },
      },
      item: {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
      },
      row: {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
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
  const [open, setOpen] = useState<number | null>(0);

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
      <div className="max-w-350 mx-auto">
        <motion.div variants={v.item} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <div className="md:col-span-4">
            <div className={cx(anonymous.className, "text-[44px] md:text-[56px] leading-[0.98] tracking-tight")}>
              Questions?
            </div>
            <div className="mt-6 text-sm leading-relaxed text-black/60 max-w-sm">
              Payments run via <span className="font-medium">KompiPay</span> +{" "}
              <span className="font-medium">Stripe Express</span>. Funds go directly to sellers.
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="border-t border-black/15">
              {data.map((it, idx) => {
                const isOpen = open === idx;
                const id = `faq-${idx}`;
                return (
                  <motion.div
                    key={it.q}
                    variants={v.row}
                    className="border-b border-black/15"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={id}
                      onClick={() => setOpen(isOpen ? null : idx)}
                      className={cx(
                        "w-full text-left",
                        "py-10 md:py-12",
                        "flex items-center justify-between gap-8",
                        "focus:outline-none"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="text-[22px] md:text-[26px] leading-[1.2] tracking-tight text-black">
                          {it.q}
                        </div>
                      </div>

                      <div className="shrink-0">
                        <PlusMinus open={isOpen} />
                      </div>
                    </button>

                    <div id={id} className="pl-0">
                      {isOpen ? <Answer>{it.a}</Answer> : null}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={v.item} className="mt-10 text-[11px] uppercase tracking-[0.18em] text-black/45">
              Still unsure? Build a block and test it — you can publish in minutes.
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
