// src/components/home/shopablocks.tsx
"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useMemo, useRef } from "react";

const ease = [0.16, 1, 0.3, 1] as const;
const easeInOutBezier = [0.42, 0, 0.58, 1] as const;

function useReveal() {
  return useMemo(
    () => ({
      wrap: {
        hidden: {},
        show: { transition: { staggerChildren: 0.1, delayChildren: 0.03 } },
      },
      item: {
        hidden: { opacity: 0, y: 18, scale: 0.985 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.8, ease },
        },
      },
    }),
    []
  );
}

type Card = {
  image: string; // /Card1.png etc
  alt: string;
  headline: string; // allow \n
  body?: string; // allow \n
  variant?: "short" | "long";
  drift?: number; // per-card scroll drift intensity
};

const cards: Card[] = [
  {
    image: "/Card1.png",
    alt: "A journey illustration",
    headline: "Start selling\nwithout the detour.",
    body: "No platform maze.\nNo setup rabbit hole.",
    variant: "long",
    drift: 20,
  },
  {
    image: "/Card2.png",
    alt: "A wallet illustration",
    headline: "Get paid,\nsimply.",
    body: "Set a price.\nMoney goes straight to you.",
    variant: "long",
    drift: 28,
  },
  {
    image: "/Card3.png",
    alt: "People connecting illustration",
    headline: "Built for\nreal sellers.",
    body: "Creators, artists, makers.\nNot ecommerce teams.",
    variant: "long",
    drift: 18,
  },
  {
    image: "/Card4.png",
    alt: "Shopping cart illustration",
    headline: "No store\nsetup.",
    variant: "short",
    drift: 30,
  },
  {
    image: "/Card5.png",
    alt: "Family shopping illustration",
    headline: "One thing.\nOne page.",
    variant: "short",
    drift: 22,
  },
  {
    image: "/Card6.png",
    alt: "Scooter illustration",
    headline: "Create.\nShare.\nSell.",
    body: "A single link that works anywhere.",
    variant: "long",
    drift: 26,
  },
];

function lines(text: string) {
  return text.split("\n").map((line, idx) => (
    <span key={idx} className="block">
      {line}
    </span>
  ));
}

function ExpressiveCard({ c, index }: { c: Card; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

  // Pointer-driven tilt (hover-only)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const rx = useTransform(py, [-40, 40], [8, -8]);
  const ry = useTransform(px, [-40, 40], [-10, 10]);

  const srx = useSpring(rx, { stiffness: 220, damping: 24, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 220, damping: 24, mass: 0.6 });

  // Scroll “breathing” drift while in view
  const drift = c.drift ?? 20;
  const driftY = useSpring(0, { stiffness: 120, damping: 22 });

  useEffect(() => {
    if (!inView) return;
    driftY.set((index % 2 === 0 ? -1 : 1) * (drift * 0.35));
    const t = setTimeout(() => driftY.set(0), 280);
    return () => clearTimeout(t);
  }, [inView, drift, driftY, index]);

  // Image float loop (runs only when in view)
  const floatA = useMemo(
    () => ({
      y: [0, -6, 0],
      rotate: [0, index % 2 === 0 ? 1.4 : -1.4, 0],
      transition: {
        duration: 4.2 + (index % 3) * 0.4,
        repeat: Infinity,
        ease: easeInOutBezier,
      },
    }),
    [index]
  );

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    px.set(Math.max(-40, Math.min(40, dx / 6)));
    py.set(Math.max(-40, Math.min(40, dy / 6)));
  };

  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.85, ease }}
      className="relative"
    >
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          y: driftY,
        }}
        whileHover={{
          y: -10,
          scale: 1.025,
          transition: { type: "spring", stiffness: 260, damping: 18 },
        }}
        className={[
          "group",
          "relative",
          "rounded-[28px] md:rounded-[34px]",
          "bg-black/[0.035]",
          "ring-1 ring-black/6",
          "overflow-hidden",
          "min-h-72.5 md:min-h-82.5",
          "flex flex-col items-center text-center",
          "px-7 pt-8 pb-7",
          "will-change-transform",
        ].join(" ")}
      >
        {/* Animated gradient wash on hover */}
        <motion.div
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.35, ease }}
          style={{
            background:
              "radial-gradient(1200px 420px at 50% 0%, rgba(0,0,0,0.07), rgba(0,0,0,0) 56%)",
          }}
        />

        {/* Soft glow */}
        <motion.div
          aria-hidden
          className="absolute -inset-16 opacity-0 group-hover:opacity-100 blur-3xl"
          transition={{ duration: 0.35, ease }}
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,0,0,0.09), rgba(0,0,0,0))",
          }}
        />

        {/* Tiny “spark” dots */}
        <motion.div
          aria-hidden
          className="absolute top-6 right-7 flex gap-1.5 opacity-50"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-black/25"
              animate={{
                y: inView ? [0, -3, 0] : 0,
                opacity: inView ? [0.35, 0.7, 0.35] : 0.35,
              }}
              transition={{
                duration: 1.6 + i * 0.25,
                repeat: Infinity,
                ease: easeInOutBezier,
                delay: i * 0.12,
              }}
            />
          ))}
        </motion.div>

        {/* Text (fixed height so short-copy cards don’t feel smaller) */}
        <div className="relative w-full" style={{ transform: "translateZ(22px)" }}>
          <div className="min-h-35 flex flex-col items-center">
            <motion.div
              className="tracking-tight font-normal text-[22px] md:text-[24px] leading-[1.06]"
              whileHover={{ letterSpacing: "-0.01em" }}
              transition={{ duration: 0.25, ease }}
            >
              {lines(c.headline)}
            </motion.div>

            {c.body ? (
              <motion.div
                className="mt-4 text-sm leading-relaxed text-black/65"
                whileHover={{ opacity: 0.92 }}
                transition={{ duration: 0.25, ease }}
              >
                {lines(c.body)}
              </motion.div>
            ) : (
              <div className="mt-4 h-10" />
            )}

            <motion.div
              aria-hidden
              className="mx-auto mt-5 h-px w-12 bg-black/30 origin-left"
              initial={{ scaleX: 0.3, opacity: 0.35 }}
              whileHover={{ scaleX: 1.25, opacity: 0.75 }}
              transition={{ duration: 0.35, ease }}
            />
          </div>
        </div>

        {/* Illustration (fixed height + object-contain so NOTHING crops) */}
        <div
          className="relative mt-7 w-full"
          style={{ transform: "translateZ(34px)", height: 190 }}
        >
          <motion.div
            animate={inView ? floatA : undefined}
            whileHover={{
              y: -10,
              rotate: index % 2 === 0 ? 2 : -2,
              scale: 1.06,
              transition: { type: "spring", stiffness: 240, damping: 16 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={c.image}
              alt={c.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-contain select-none"
              priority={false}
            />
          </motion.div>
        </div>

        {/* Bottom shadow line that “breathes” on hover */}
        <motion.div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-12"
          initial={{ opacity: 0.22 }}
          whileHover={{ opacity: 0.5 }}
          transition={{ duration: 0.3, ease }}
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.085), rgba(0,0,0,0))",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ShopABlocks() {
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
            ShopABlock
          </div>
          <h3 className="mt-4 text-3xl md:text-4xl tracking-tight font-normal leading-[1.05]">
            Six small truths
            <br />
            about selling online.
          </h3>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-[15px] leading-relaxed text-black/70">
            Clean pages. Fewer decisions. One link to share.
          </p>
        </motion.div>

        <motion.div
          variants={v.item}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7"
        >
          {cards.map((c, i) => (
            <ExpressiveCard key={c.alt} c={c} index={i} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
