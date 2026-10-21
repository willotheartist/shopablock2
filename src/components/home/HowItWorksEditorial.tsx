// src/components/home/HowItWorksEditorial.tsx
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

type StepCard = {
  n: string; // "01"
  title: string;
  body: string;
  image: string; // /public/shopablocks/*
  alt: string;
};

const steps: StepCard[] = [
  {
    n: "01",
    title: "Create the block",
    body: "Name it. Add a short description.\nKeep the offer tight.",
    image: "/shopablocks/Card1.png",
    alt: "Create illustration",
  },
  {
    n: "02",
    title: "Add media",
    body: "Upload images (or video later).\nShow the product clearly.",
    image: "/shopablocks/Card3.png",
    alt: "Media illustration",
  },
  {
    n: "03",
    title: "Set your price",
    body: "One price.\nNo confusing tiers.",
    image: "/shopablocks/Card2.png",
    alt: "Pricing illustration",
  },
  {
    n: "04",
    title: "Pick delivery",
    body: "Digital or physical.\nCollect only what’s needed.",
    image: "/shopablocks/Card6.png",
    alt: "Delivery illustration",
  },
  {
    n: "05",
    title: "Share the link",
    body: "Bio, DM, email, QR.\nSame link everywhere.",
    image: "/shopablocks/Card5.png",
    alt: "Share illustration",
  },
  {
    n: "06",
    title: "Ship / send",
    body: "Orders land in your dashboard.\nFulfil fast, stay small.",
    image: "/shopablocks/Card4.png",
    alt: "Fulfilment illustration",
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

function Card({ c }: { c: StepCard }) {
  return (
    <div
      className={[
        "shrink-0",
        "w-65 sm:w-75 md:w-[320px]",
        "rounded-[26px] md:rounded-[30px]",
        "bg-[rgb(246,245,241)]",
        "ring-1 ring-black/10", // clean outline, no shadow
        "overflow-hidden",
      ].join(" ")}
    >
      <div className="px-7 pt-7 md:px-8 md:pt-8 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em] text-black/55">
          {c.n}
        </div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-black/35">
          —
        </div>
      </div>

      {/* media: no box/border so transparent PNGs sit clean */}
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
  );
}

export default function HowItWorksEditorial() {
  const v = useReveal();
  const reduceMotion = useReducedMotion();

  // marquee: duplicate cards for seamless loop
  const row = [...steps, ...steps];

  // Tune these:
  const durationSeconds = 34; // slower = calmer
  const gapClass = "gap-6 md:gap-7";

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
            How it works
          </div>
          <h2 className="mt-4 text-[clamp(1.6rem,3.6vw,2.6rem)] tracking-tight font-normal leading-[1.08]">
            From link to fulfilment.
            <br />
            Without the busywork.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-[15px] leading-relaxed text-black/70">
            A simple flow you can understand at a glance — and repeat for every drop.
          </p>
        </motion.div>

        {/* Marquee row */}
        <motion.div variants={v.item} className="mt-12">
          <div className="relative overflow-hidden">
            {/* soft edge fades (no shadows) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24"
              style={{
                background:
                  "linear-gradient(to right, rgb(246,245,241), rgba(246,245,241,0))",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24"
              style={{
                background:
                  "linear-gradient(to left, rgb(246,245,241), rgba(246,245,241,0))",
              }}
            />

            <motion.div
              className={`flex ${gapClass} pr-6`}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: ["0%", "-50%"],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: durationSeconds,
                      ease: "linear",
                      repeat: Infinity,
                    }
              }
              style={{ willChange: "transform" }}
            >
              {row.map((c, idx) => (
                <Card key={`${c.n}-${idx}`} c={c} />
              ))}
            </motion.div>
          </div>

          {/* optional second row (more “nice marquee” feel) */}
          <div className="mt-7 relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24"
              style={{
                background:
                  "linear-gradient(to right, rgb(246,245,241), rgba(246,245,241,0))",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24"
              style={{
                background:
                  "linear-gradient(to left, rgb(246,245,241), rgba(246,245,241,0))",
              }}
            />

            <motion.div
              className={`flex ${gapClass} pr-6`}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: ["-50%", "0%"], // opposite direction
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      duration: durationSeconds + 10,
                      ease: "linear",
                      repeat: Infinity,
                    }
              }
              style={{ willChange: "transform" }}
            >
              {row.map((c, idx) => (
                <Card key={`${c.n}-b-${idx}`} c={c} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
