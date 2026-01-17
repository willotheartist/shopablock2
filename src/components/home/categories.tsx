// src/components/home/categories.tsx
"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

function useReveal() {
  return useMemo(
    () => ({
      wrap: {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.04 } },
      },
      item: {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
      },
    }),
    []
  );
}

type Category = {
  label: string;
  image: string; // /public/shopablocks/*
  alt: string;
};

const categories: Category[] = [
  { label: "Posters", image: "/shopablocks/Card1.png", alt: "Posters" },
  { label: "Prints", image: "/shopablocks/Card2.png", alt: "Prints" },
  { label: "Merch", image: "/shopablocks/Card3.png", alt: "Merch" },
  { label: "Presets", image: "/shopablocks/Card4.png", alt: "Presets" },
  { label: "Notion templates", image: "/shopablocks/Card5.png", alt: "Notion templates" },
  { label: "Digital downloads", image: "/shopablocks/Card6.png", alt: "Digital downloads" },
  { label: "Zines", image: "/shopablocks/Card1.png", alt: "Zines" },
  { label: "Stickers", image: "/shopablocks/Card2.png", alt: "Stickers" },
  { label: "Courses", image: "/shopablocks/Card3.png", alt: "Courses" },
  { label: "Tickets", image: "/shopablocks/Card4.png", alt: "Tickets" },
];

function Chip({ c }: { c: Category }) {
  return (
    <div
      className={[
        "shrink-0",
        "inline-flex items-center gap-3",
        "px-4 py-3",
        "rounded-full",
        "bg-[rgb(246,245,241)]",
        "ring-1 ring-black/10",
      ].join(" ")}
    >
      <div className="relative h-7 w-7">
        <Image
          src={c.image}
          alt={c.alt}
          fill
          sizes="28px"
          className="object-contain select-none"
          priority={false}
        />
      </div>
      <div className="text-sm font-normal tracking-tight">{c.label}</div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
  duration = 28,
}: {
  items: Category[];
  reverse?: boolean;
  duration?: number;
}) {
  const reduceMotion = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      {/* Edge fades (no shadow, just background fade) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
        style={{
          background:
            "linear-gradient(to right, rgb(246,245,241), rgba(246,245,241,0))",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
        style={{
          background:
            "linear-gradient(to left, rgb(246,245,241), rgba(246,245,241,0))",
        }}
      />

      <motion.div
        className="flex gap-4 md:gap-5 pr-6"
        animate={
          reduceMotion
            ? undefined
            : reverse
              ? { x: ["-50%", "0%"] }
              : { x: ["0%", "-50%"] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration, ease: "linear", repeat: Infinity }
        }
        style={{ willChange: "transform" }}
      >
        {row.map((c, idx) => (
          <Chip key={`${c.label}-${idx}`} c={c} />
        ))}
      </motion.div>
    </div>
  );
}

export default function Categories() {
  const v = useReveal();

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
            Categories
          </div>
          <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.6rem)] tracking-tight font-normal leading-[1.08]">
            What people sell with a block.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-[15px] leading-relaxed text-black/70">
            From simple digital downloads to physical drops — all as one link.
          </p>
        </motion.div>

        <motion.div variants={v.item} className="mt-12 space-y-5 md:space-y-6">
          <MarqueeRow items={categories.slice(0, 8)} duration={26} />
          <MarqueeRow items={categories.slice(2)} reverse duration={32} />
          <MarqueeRow items={categories.slice(1, 9)} duration={28} />
        </motion.div>
      </div>
    </motion.section>
  );
}
