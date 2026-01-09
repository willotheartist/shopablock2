// src/components/home/HowItWorksEditorial.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Step = {
  id: "create" | "share" | "paid";
  label: string; // right list label
  metric: string; // right list "value" column (like "Most Viewed")
  coverTitle: string; // big left title (serif)
  coverKickerLeft: string; // bottom-left caption title
  coverCopyLeft: string; // bottom-left caption copy
  coverKickerRight: string; // bottom-right caption title
  coverCopyRight: string; // bottom-right caption copy
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

export default function HowItWorksEditorial() {
  const steps: Step[] = useMemo(
    () => [
      {
        id: "create",
        label: "Create a block",
        metric: "01",
        coverTitle: "Create\nA Block",
        coverKickerLeft: "Minimal editor",
        coverCopyLeft:
          "Title, description, media, price, delivery type. Nothing else.",
        coverKickerRight: "The unit",
        coverCopyRight: "One block = one offer. A page built to convert.",
      },
      {
        id: "share",
        label: "Share the link",
        metric: "02",
        coverTitle: "Share\nThe Link",
        coverKickerLeft: "One URL",
        coverCopyLeft:
          "Drop it into your bio, newsletter, DM, or a QR code. Done.",
        coverKickerRight: "Built for context",
        coverCopyRight: "Works wherever attention already lives.",
      },
      {
        id: "paid",
        label: "Get paid + fulfil",
        metric: "03",
        coverTitle: "Get Paid\n& Fulfil",
        coverKickerLeft: "Checkout + receipt",
        coverCopyLeft:
          "A clean surface for buyers. Confirmation and order flow included.",
        coverKickerRight: "Payouts",
        coverCopyRight: "KompiPay handles Stripe Express payments and payouts.",
      },
    ],
    []
  );

  const [active, setActive] = useState<Step["id"]>("create");
  const step = steps.find((s) => s.id === active) ?? steps[0];

  const v = useMemo(
    () => ({
      wrap: {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.02 } },
      },
      item: {
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      },
      swap: {
        hidden: { opacity: 0, y: 8, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.45, ease },
        },
        exit: {
          opacity: 0,
          y: -6,
          filter: "blur(6px)",
          transition: { duration: 0.22, ease },
        },
      },
    }),
    []
  );

  return (
    <motion.section
      variants={v.wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      className="px-6 py-24 md:py-28 border-b border-black"
    >
      <div className="max-w-350 mx-auto">
        <motion.div variants={v.item} className="border border-black">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* LEFT “COVER” */}
            <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-black">
              <div className="relative h-130 md:h-140 overflow-hidden bg-black text-[rgb(246,245,241)]">
                {/* “photo” layer (no asset) */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_80%_70%,rgba(255,255,255,0.12),transparent_60%)]" />
                  <div className="absolute inset-0 opacity-[0.22] mix-blend-overlay">
                    <div className="grain absolute inset-0" />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/35 to-black/70" />
                </div>

                {/* top-right tiny vertical meta (like book spine vibe) */}
                <div className="absolute right-4 top-4 hidden md:block">
                  <div className="text-[10px] uppercase tracking-[0.18em] opacity-70 rotate-90 origin-top-right translate-x-8 translate-y-8">
                    ShopABlock / How it works
                  </div>
                </div>

                {/* big serif title */}
                <div className="relative p-7 md:p-9 h-full flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.id}
                      variants={v.swap}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                    >
                      <h3
                        className="whitespace-pre-line leading-[0.9] tracking-tight font-normal text-[clamp(3.2rem,6.5vw,5.3rem)]"
                        style={{
                          fontFamily:
                            'ui-serif, Georgia, "Times New Roman", Times, serif',
                        }}
                      >
                        {step.coverTitle}
                      </h3>
                    </motion.div>
                  </AnimatePresence>

                  {/* bottom captions (2 columns) */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step.id + "-captions"}
                      variants={v.swap}
                      initial="hidden"
                      animate="show"
                      exit="exit"
                      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
                    >
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] opacity-80">
                          {step.coverKickerLeft}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[rgb(246,245,241)]/80 max-w-sm">
                          {step.coverCopyLeft}
                        </p>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] opacity-80">
                          {step.coverKickerRight}
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-[rgb(246,245,241)]/80 max-w-sm">
                          {step.coverCopyRight}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT “INDEX” */}
            <div className="md:col-span-5 bg-white">
              <div className="p-7 md:p-9">
                <div
                  className="text-[clamp(2.2rem,3.2vw,3.1rem)] leading-[0.95] tracking-tight font-normal text-black"
                  style={{
                    fontFamily:
                      'ui-serif, Georgia, "Times New Roman", Times, serif',
                  }}
                >
                  How it works
                </div>

                <div className="mt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-black/60">
                  <span>Steps</span>
                  <span>Order</span>
                </div>

                <div className="mt-3 h-px bg-black" />

                <div className="divide-y divide-black">
                  {steps.map((s) => {
                    const isActive = s.id === active;
                    return (
                      <div
                        key={s.id}
                        onMouseEnter={() => setActive(s.id)}
                        onMouseLeave={() => setActive(active)} // keeps current
                        onFocus={() => setActive(s.id)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Preview: ${s.label}`}
                        className={cx(
                          "cursor-default outline-none select-none",
                          "py-4",
                          "flex items-center justify-between gap-6",
                          "transition-colors",
                          "hover:bg-black/5 focus:bg-black/5",
                          isActive && "bg-black/5"
                        )}
                      >
                        <div className="text-base tracking-tight">{s.label}</div>
                        <div className="text-base tabular-nums">{s.metric}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 h-px bg-black" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
          background-size: 180px 180px;
          transform: scale(1.2);
        }
      `}</style>
    </motion.section>
  );
}
