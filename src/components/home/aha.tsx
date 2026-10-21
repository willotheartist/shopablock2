//·src/components/home/aha.tsx
"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMemo, useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function useReveal() {
  return useMemo(
    () => ({
      wrap: {
        hidden: {},
        show: { transition: { staggerChildren: 0.18, delayChildren: 0.06 } },
      },
      item: {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
      },
    }),
    []
  );
}

type ValueCard = {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
};

const cards: ValueCard[] = [
  {
    id: "01",
    title: "Radical focus",
    body: "One block is one offer.\nNo catalog. No theme. No bloat.",
    image: "/shopablocks/Card5.png",
    alt: "One thing one page illustration",
  },
  {
    id: "02",
    title: "Get paid",
    body: "Checkout built in.\nSet a price. Get paid simply.",
    image: "/shopablocks/Card2.png",
    alt: "Get paid illustration",
  },
  {
    id: "03",
    title: "Deliver cleanly",
    body: "Digital or physical.\nEverything a buyer expects.",
    image: "/shopablocks/Card6.png",
    alt: "Create share sell illustration",
  },
  {
    id: "04",
    title: "Share anywhere",
    body: "One link that works\nin bio, DM, email, or QR.",
    image: "/shopablocks/Card1.png",
    alt: "Start selling illustration",
  },
];

function Lines({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </>
  );
}

function StaggerCard({
  c,
  i,
  progress,
}: {
  c: ValueCard;
  i: number;
  progress: MotionValue<number>;
}) {
  const start = 0.08 + i * 0.14;
  const end = start + 0.5;

  const local = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(local, [0, 1], [46, 0]);
  const opacity = useTransform(local, [0, 0.55, 1], [0, 0.9, 1]);
  const scale = useTransform(local, [0, 1], [0.96, 1]);

  const y2 = useTransform(local, [0, 1], [14 - i * 2, 0]);

  // ✅ Framer callback args are unknown[], so coerce safely.
  const finalY = useTransform([y, y2], (vals) => {
    const a = Number(vals[0] ?? 0);
    const b = Number(vals[1] ?? 0);
    return a + b;
  });

  return (
    <motion.div style={{ y: finalY, opacity, scale }} className="relative">
      <div
        className={[
          "shrink-0",
          "w-65 sm:w-75 md:w-[320px]",
          "rounded-[26px] md:rounded-[30px]",
          "bg-[rgb(246,245,241)]",
          "ring-1 ring-black/10",
          "overflow-hidden",
        ].join(" ")}
      >
        <div className="px-7 pt-7 md:px-8 md:pt-8 flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[0.18em] text-black/55">
            {c.id}
          </div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
            —
          </div>
        </div>

        <div className="px-7 mt-5 md:px-8">
          <div className="relative aspect-16/10">
            <Image
              src={c.image}
              alt={c.alt}
              fill
              sizes="(min-width: 768px) 320px, 80vw"
              className="object-contain select-none"
              priority={false}
            />
          </div>
        </div>

        <div className="px-7 pb-7 md:px-8 md:pb-8 mt-6">
          <div className="text-sm uppercase tracking-[0.18em] text-black/70">
            {c.title}
          </div>
          <div className="mt-3 text-sm leading-relaxed text-black/65">
            <Lines text={c.body} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AhaSection() {
  const v = useReveal();
  const railRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.9", "end 0.2"],
  });

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
            ShopABlock
          </div>
          <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.6rem)] tracking-tight font-normal leading-[1.08]">
            What a block gives you,
            <br />
            in four cards.
          </h2>
        </motion.div>

        <motion.div variants={v.item} className="mt-12">
          <div
            ref={railRef}
            className={[
              "relative",
              "overflow-x-auto overflow-y-hidden",
              "scroll-smooth",
              "[-ms-overflow-style:none] [scrollbar-width:none]",
              "[&::-webkit-scrollbar]:hidden",
            ].join(" ")}
          >
            <div className="flex gap-6 md:gap-7 pr-6">
              {cards.map((c, i) => (
                <StaggerCard key={c.id} c={c} i={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
