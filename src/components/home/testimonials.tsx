// src/components/home/testimonials.tsx
"use client";

import { motion } from "framer-motion";
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

type Testimonial = {
  name: string;
  role: string; // e.g. "Indie maker"
  company?: string; // optional, e.g. "Self-employed"
  quote: string;
  // optional initials avatar for now
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Nina Patel",
    role: "Illustrator",
    company: "London",
    initials: "NP",
    quote:
      "I launched a print drop in one evening. One page, one checkout, one link in my bio — and it didn’t feel like I was “setting up a store.”",
  },
  {
    name: "Owen Kim",
    role: "Indie maker",
    company: "Side project",
    initials: "OK",
    quote:
      "ShopABlock is the first ecommerce tool that doesn’t distract me. I can ship a single idea without designing a whole site around it.",
  },
  {
    name: "Maya Rivera",
    role: "Creator",
    company: "Merch drops",
    initials: "MR",
    quote:
      "The clarity is the feature. Buyers instantly get what they’re buying and I don’t have to explain where to click or what to do next.",
  },
  {
    name: "Jonas Berg",
    role: "Photographer",
    company: "Digital downloads",
    initials: "JB",
    quote:
      "I sell presets and small packs. The delivery flow is clean, and the page looks intentional — not like a template marketplace.",
  },
  {
    name: "Hannah Chen",
    role: "Pop-up brand",
    company: "Limited runs",
    initials: "HC",
    quote:
      "I used to spin up mini-stores for weekend drops. Now it’s just a block. It’s faster, simpler, and the conversion is better.",
  },
  {
    name: "Samir Ali",
    role: "Writer",
    company: "PDF + zines",
    initials: "SA",
    quote:
      "I love that it stays small. No themes, no plugins, no ‘optimize your funnel’ vibe — just a crisp page that sells the thing.",
  },
  {
    name: "Keira Doyle",
    role: "Ceramicist",
    company: "Studio sales",
    initials: "KD",
    quote:
      "I only release one item at a time. ShopABlock matches how I work: one offer, one link, and a checkout that doesn’t scare people off.",
  },
  {
    name: "Theo Martins",
    role: "Designer",
    company: "Notion templates",
    initials: "TM",
    quote:
      "It’s the opposite of overwhelming. I publish, share, and move on. The page is the pitch — and it looks great everywhere.",
  },
];

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className={[
        "h-10 w-10 rounded-full",
        "ring-1 ring-black/10",
        "flex items-center justify-center",
        "text-xs uppercase tracking-[0.18em]",
        "text-black/70",
      ].join(" ")}
      aria-hidden
    >
      {initials}
    </div>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <div
      className={[
        "rounded-[26px] md:rounded-[30px]",
        "bg-[rgb(246,245,241)]",
        "ring-1 ring-black/10", // clean outline, no shadow
        "p-7 md:p-8",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <Avatar initials={t.initials} />
        <div className="min-w-0">
          <div className="text-sm tracking-tight">{t.name}</div>
          <div className="mt-1 text-[13px] text-black/60 leading-tight">
            {t.role}
            {t.company ? <span className="text-black/35"> • {t.company}</span> : null}
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm leading-relaxed text-black/75">
        “{t.quote}”
      </div>
    </div>
  );
}

export default function Testimonials() {
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
            Testimonials
          </div>
          <h2 className="mt-4 text-[clamp(1.9rem,4.4vw,3.4rem)] tracking-tight font-normal leading-[1.02]">
            What sellers are saying.
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-sm md:text-[15px] leading-relaxed text-black/70">
            Small businesses, solo creators, and makers using one block to sell one thing.
          </p>
        </motion.div>

        <motion.div
          variants={v.item}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7"
        >
          {testimonials.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
