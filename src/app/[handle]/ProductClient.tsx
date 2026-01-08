//src/app/[handle]/ProductClient.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

type MediaItem = { id: string; url: string };

type BlockDTO = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  handle: string;
  media: MediaItem[];
};

const ease = [0.16, 1, 0.3, 1] as const;

function moneyGBP(pence: number) {
  return `£${(Number(pence) / 100).toFixed(2)}`;
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-12 h-12 text-base leading-none">
      {children}
    </span>
  );
}

function TopBar({ brand = "block" }: { brand?: string }) {
  return (
    <div className="w-full border-b border-black bg-[rgb(246,245,241)]">
      <div className="w-full px-0">
        <div className="w-full border border-black bg-white h-12 flex items-center">
          <Link
            href="/explore"
            aria-label="Back"
            title="Back"
            className="h-12 w-12 border-r border-black grid place-items-center hover:bg-black hover:text-[rgb(246,245,241)] transition"
          >
            <Icon>←</Icon>
          </Link>

          <button
            type="button"
            aria-label="Menu"
            className="h-12 w-12 border-r border-black grid place-items-center hover:bg-black hover:text-[rgb(246,245,241)] transition"
          >
            <Icon>≡</Icon>
          </button>

          <div className="flex-1 grid place-items-center">
            <div className="text-xs uppercase tracking-[0.28em] leading-none">
              {brand}
            </div>
          </div>

          <button
            type="button"
            aria-label="Search"
            className="h-12 w-12 border-l border-black grid place-items-center hover:bg-black hover:text-[rgb(246,245,241)] transition"
          >
            <Icon>⌕</Icon>
          </button>
        </div>
      </div>
    </div>
  );
}

function AccordionRow({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="border-t border-black" open={defaultOpen}>
      <summary className="cursor-pointer list-none flex items-center justify-between gap-6 py-4">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-black/80">
          {title}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-black/50">
          ↗
        </span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-black/75">{children}</div>
    </details>
  );
}

export default function ProductClient({
  block,
  buyAction,
}: {
  block: BlockDTO;
  buyAction: (formData: FormData) => Promise<void>;
}) {
  const media = block.media ?? [];
  const [active, setActive] = useState(0);
  const activeMedia = media[active];

  const subtitle = useMemo(() => `@${block.handle}`, [block.handle]);

  return (
    <main className="bg-[rgb(246,245,241)] text-black min-h-screen w-full">
      <TopBar brand="block" />

      {/* FULL BLEED split layout */}
      <div className="border-t border-black w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_420px]">
          {/* LEFT: media (full-bleed column) */}
          <div className="md:border-r border-black">
            <div className="p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease }}
                className="border border-black bg-white overflow-hidden"
              >
                <div className="relative w-full aspect-16/10 md:aspect-16/11 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeMedia?.id ?? "empty"}
                      initial={{ opacity: 0, scale: 1.01 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="absolute inset-0"
                    >
                      {activeMedia ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeMedia.url}
                          alt=""
                          className="w-full h-full object-contain bg-white"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center">
                          <div className="w-[62%] aspect-5/4 border border-black/60 bg-[rgba(0,0,0,0.03)]" />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {media.length > 1 ? (
                  <div className="border-t border-black p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {media.slice(0, 8).map((m, idx) => {
                        const isActive = idx === active;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setActive(idx)}
                            className={[
                              "border border-black bg-white overflow-hidden aspect-4/3 relative",
                              isActive
                                ? "outline outline-black"
                                : "hover:bg-black/5",
                            ].join(" ")}
                            aria-label={`Select image ${idx + 1}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.url}
                              alt=""
                              className="w-full h-full object-cover"
                              draggable={false}
                            />
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 text-[11px] uppercase tracking-[0.22em] text-black/50 font-mono">
                      {active + 1} / {media.length}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </div>
          </div>

          {/* RIGHT: info / buy (fixed column) */}
          <div>
            <div className="p-6 md:p-10">
              <div className="md:sticky md:top-16">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.05 }}
                  className="border border-black bg-white"
                >
                  <div className="p-6 md:p-7">
                    <div className="text-xs uppercase tracking-[0.28em] text-black/60 font-mono">
                      Product
                    </div>

                    <div className="mt-4">
                      <h1 className="text-3xl md:text-4xl tracking-tight leading-[0.95]">
                        {block.title}
                      </h1>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-6">
                      <div className="text-sm text-black/70">{subtitle}</div>
                      <div className="font-mono text-xs uppercase tracking-[0.22em] text-black/60">
                        {moneyGBP(block.price)}
                      </div>
                    </div>

                    {block.description ? (
                      <p className="mt-6 text-sm leading-relaxed text-black/75">
                        {block.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="border-t border-black p-6 md:p-7">
                    <div className="font-mono text-xs uppercase tracking-[0.22em] text-black/60">
                      Checkout
                    </div>

                    <form action={buyAction} className="mt-4 grid gap-3">
                      <label className="grid gap-2">
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/60">
                          Email
                        </span>
                        <input
                          type="email"
                          name="email"
                          required
                          placeholder="you@example.com"
                          className="h-12 w-full border border-black bg-transparent px-3 font-mono text-sm outline-none focus:border-black"
                        />
                      </label>

                      <Button type="submit" variant="primary" full>
                        Buy now
                      </Button>

                      <div className="text-[11px] leading-relaxed text-black/55">
                        Secure checkout · Receipt · Delivery
                      </div>
                    </form>
                  </div>

                  <div className="px-6 md:px-7">
                    <AccordionRow title="Details" defaultOpen>
                      <div className="grid gap-2">
                        <div>
                          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/50">
                            Price
                          </span>
                          <div className="mt-1">{moneyGBP(block.price)}</div>
                        </div>

                        <div>
                          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/50">
                            Seller
                          </span>
                          <div className="mt-1">@{block.handle}</div>
                        </div>
                      </div>
                    </AccordionRow>

                    <AccordionRow title="Delivery">
                      Instant delivery for digital items, or shipping for physical
                      (depending on the block’s configuration).
                    </AccordionRow>

                    <AccordionRow title="Support">
                      Questions? Contact the seller directly after purchase. You’ll
                      receive a receipt and delivery confirmation.
                    </AccordionRow>
                  </div>

                  <div className="border-t border-black p-6 md:p-7 flex items-center justify-between">
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-black/50">
                      Public link
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.22em]">
                      /{block.handle}
                    </div>
                  </div>
                </motion.div>

                <div className="mt-6 text-[11px] uppercase tracking-[0.22em] text-black/50 font-mono">
                  A block is intentionally sparse.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* footer full-bleed */}
      <div className="border-t border-black w-full">
        <div className="px-6 md:px-10 py-10 text-[11px] uppercase tracking-[0.22em] text-black/50 font-mono flex items-center justify-between">
          <span>block</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </main>
  );
}
