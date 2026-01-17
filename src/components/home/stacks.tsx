// src/components/home/stacks.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function useReveal() {
  return useMemo(
    () => ({
      wrap: {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.02 } },
      },
      item: {
        hidden: { opacity: 0, y: 14, scale: 0.99 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.75, ease },
        },
      },
    }),
    []
  );
}

function K({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] uppercase tracking-[0.18em] text-black/60">
      {children}
    </span>
  );
}

type StackCard = {
  eyebrow: string;
  headline: string; // allow \n
  body: string; // allow \n
  bullets?: string[];
  punch?: string;
  image: string; // from /public/shopablocks/
  alt: string;
};

function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ))}
    </>
  );
}

function StackCardView({
  c,
  index,
  progress,
}: {
  c: StackCard;
  index: number;
  progress: any; // MotionValue<number>
}) {
  // calm stack motion (no shadows, no fade)
  const scale = useTransform(progress, [0, 1], [1, 0.975]);
  const y = useTransform(progress, [0, 1], [0, -12]);

  // later cards in front
  const z = 10 + index;

  return (
    <div className="sticky top-22 md:top-26" style={{ zIndex: z }}>
      <motion.div
        style={{ scale, y }}
        transition={{ duration: 0.7, ease }}
        className={[
          "relative overflow-hidden",
          "rounded-[28px] md:rounded-[34px]",
          "bg-[rgb(246,245,241)]",
          "ring-1 ring-black/6",
        ].join(" ")}
      >
        {/* subtle wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 420px at 50% 0%, rgba(0,0,0,0.045), rgba(0,0,0,0) 56%)",
          }}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-12">
          {/* Copy */}
          <div className="px-7 pt-8 pb-7 md:px-8 md:pt-9 md:pb-8 md:col-span-5 border-b md:border-b-0 md:border-r border-black/10">
            <K>{c.eyebrow}</K>

            <div className="mt-4 tracking-tight font-normal text-[26px] md:text-[30px] leading-[1.06]">
              <Lines text={c.headline} />
            </div>

            <div className="mt-5 text-sm leading-relaxed text-black/65">
              <Lines text={c.body} />
            </div>

            {c.bullets?.length ? (
              <ul className="mt-6 space-y-3">
                {c.bullets.map((b) => (
                  <li key={b} className="text-sm leading-relaxed text-black/70">
                    • {b}
                  </li>
                ))}
              </ul>
            ) : null}

            {c.punch ? (
              <div className="mt-6 text-xs uppercase tracking-[0.18em] text-black/55">
                {c.punch}
              </div>
            ) : null}
          </div>

          {/* Media (no border, no box — transparent PNGs will float cleanly) */}
          <div className="px-7 pt-8 pb-7 md:px-8 md:pt-9 md:pb-8 md:col-span-7 flex items-center justify-center">
            <div className="relative w-full max-w-140">
              <div className="relative aspect-16/10">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-contain select-none"
                  priority={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom rail (subtle, no border) */}
        <div className="relative px-7 py-5 md:px-8 md:py-6 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-black/45">
          <span>ShopABlock</span>
          <span>{String(index + 1).padStart(2, "0")} / 03</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Stacks() {
  const v = useReveal();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const p1 = useTransform(scrollYProgress, [0.0, 0.38], [0, 1]);
  const p2 = useTransform(scrollYProgress, [0.22, 0.72], [0, 1]);
  const p3 = useTransform(scrollYProgress, [0.55, 1.0], [0, 1]);

  // ✅ Uses /public/shopablocks/Card1.png ... Card6.png
  // We pick 3 that match the story, but you can swap these anytime.
  const cards: StackCard[] = [
    {
      eyebrow: "THE PROBLEM",
      headline: "You don’t need\na store.",
      body:
        "Most ecommerce tools are built for catalogs, themes, and dashboards.\nIf you’re selling one product, it’s all overhead.",
      bullets: [
        "Too many decisions before you can sell",
        "Too much setup for a single offer",
        "Store complexity disguised as “features”",
      ],
      punch: "Selling one thing shouldn’t feel like running a business.",
      image: "/shopablocks/Card4.png",
      alt: "No store setup illustration",
    },
    {
      eyebrow: "THE BLOCK",
      headline: "One block.\nOne product.\nThat’s it.",
      body:
        "A block is the smallest possible shop on the internet.\nA focused page designed for conversion — nothing more, nothing less.",
      bullets: ["Title, description, media", "One price", "One checkout", "One CTA"],
      punch: "Buy a block. Turn it on. Start selling.",
      image: "/shopablocks/Card5.png",
      alt: "One thing, one page illustration",
    },
    {
      eyebrow: "GET PAID",
      headline: "Payments\nwithout the pain.",
      body:
        "ShopABlock handles payments end-to-end using KompiPay and Stripe Express.\nYou set a price — we handle the rest.",
      bullets: ["Secure checkout", "Fast payouts", "Built-in fees", "Refunds supported"],
      punch: "It feels like selling — not configuring software.",
      image: "/shopablocks/Card2.png",
      alt: "Get paid simply illustration",
    },
  ];

  return (
    <motion.section
      variants={v.wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-120px" }}
      className="px-6 py-24 md:py-28 border-b border-black"
    >
      <div className="max-w-350 mx-auto">
        <motion.div variants={v.item} className="text-center">
          <div className="text-[11px] uppercase tracking-[0.18em] text-black/60">
            The stack
          </div>
          <h3 className="mt-4 text-3xl md:text-4xl tracking-tight font-normal leading-[1.05]">
            Three reasons
            <br />
            blocks win.
          </h3>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-[15px] leading-relaxed text-black/70">
            A scroll section that explains the product without sounding like software.
          </p>
        </motion.div>

        <div ref={sectionRef} className="mt-12 relative">
          <div className="relative h-[240vh] md:h-[260vh]">
            <div className="absolute inset-0 flex flex-col gap-10 md:gap-12">
              <StackCardView c={cards[0]} index={0} progress={p1} />
              <StackCardView c={cards[1]} index={1} progress={p2} />
              <StackCardView c={cards[2]} index={2} progress={p3} />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
