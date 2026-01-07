"use client";

import Link from "next/link";
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
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
      },
      line: {
        hidden: { scaleX: 0, opacity: 0.6 },
        show: { scaleX: 1, opacity: 1, transition: { duration: 0.8, ease } },
      },
    }),
    []
  );
}

function Section({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const v = useReveal();
  return (
    <motion.section
      variants={v.wrap}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function Rule() {
  const v = useReveal();
  return (
    <motion.div
      variants={v.line}
      style={{ originX: 0 }}
      className="h-px bg-black"
    />
  );
}

function K({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs uppercase tracking-[0.18em] text-black/70">
      {children}
    </span>
  );
}

function UnderlineLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 decoration-black/60 hover:decoration-black"
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  const v = useReveal();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

  return (
    <main className="bg-[rgb(246,245,241)] text-black">
      {/* HERO */}
      <section className="px-6 pt-28 pb-22 md:pt-32 md:pb-28 border-b border-black">
        <div ref={heroRef} className="max-w-300">
          <motion.div style={{ y: heroY, opacity: heroFade }}>
            <h1 className="text-[clamp(3.1rem,8.4vw,6.4rem)] leading-[0.92] tracking-tight font-normal">
              Sell one thing.
              <br />
              Perfectly.
            </h1>

            <p className="mt-10 max-w-176 text-[15px] leading-relaxed text-black/80">
              ShopABlock is a single product page with checkout and delivery.
              Built for focus. Built to be shared. Built to convert without
              looking like a funnel.
            </p>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm uppercase tracking-[0.18em]">
              <UnderlineLink href="/app/new">Create a block</UnderlineLink>
              <UnderlineLink href="/explore">See examples</UnderlineLink>
              <UnderlineLink href="/app">Open dashboard</UnderlineLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO / NOT BORING */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <motion.div variants={v.item} className="md:col-span-4">
            <K>Position</K>
            <h2 className="mt-5 text-3xl leading-tight tracking-tight font-normal">
              A block is a selling primitive.
              <br />
              Not a store.
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
              Most tools push you into catalogs, templates, and endless setup.
              ShopABlock removes everything that isn’t selling.
            </p>
          </motion.div>

          <motion.div variants={v.item} className="md:col-span-8">
            <div className="border border-black">
              <div className="grid grid-cols-1 md:grid-cols-2 border-b border-black">
                <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-black">
                  <K>What you get</K>
                  <div className="mt-6 text-sm leading-relaxed">
                    <ul className="space-y-3">
                      <li>• A public product page (one link)</li>
                      <li>• Checkout + receipt</li>
                      <li>• Delivery: digital or physical</li>
                      <li>• Orders dashboard</li>
                    </ul>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <K>What you avoid</K>
                  <div className="mt-6 text-sm leading-relaxed">
                    <ul className="space-y-3">
                      <li>• Themes and templates</li>
                      <li>• App/plugin sprawl</li>
                      <li>• Catalog management</li>
                      <li>• “Funnel” aesthetics</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-sm text-black/75 leading-relaxed">
                  <span className="uppercase tracking-[0.18em] text-black/60 text-xs">
                    Mental model
                  </span>
                  <div className="mt-2">
                    Product → Block → Link → Checkout → Delivery
                  </div>
                </div>
                <div className="text-sm uppercase tracking-[0.18em]">
                  <UnderlineLink href="/app/new">Make one now</UnderlineLink>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* “ANATOMY” — the missing visual */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <motion.div variants={v.item} className="md:col-span-4 md:sticky md:top-24">
            <K>Block anatomy</K>
            <h3 className="mt-5 text-2xl tracking-tight font-normal">
              Everything a buyer needs.
              <br />
              Nothing they don’t.
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
              A block is intentionally sparse — it creates trust by being clear.
              The page is the pitch.
            </p>
          </motion.div>

          <motion.div variants={v.item} className="md:col-span-8">
            <div className="border border-black">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* left: fake product */}
                <div className="p-7 md:p-9 border-b md:border-b-0 md:border-r border-black">
                  <div className="flex items-baseline justify-between gap-6">
                    <div className="min-w-0">
                      <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                        Public block
                      </div>
                      <div className="mt-3 text-xl tracking-tight">
                        Studio Edition Poster
                      </div>
                      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-black/60">
                        @studio / limited run
                      </div>
                    </div>
                    <div className="text-sm uppercase tracking-[0.18em]">
                      £48
                    </div>
                  </div>

                  <div className="mt-7 grid grid-cols-3 gap-2">
                    <div className="aspect-4/3 border border-black" />
                    <div className="aspect-4/3 border border-black" />
                    <div className="aspect-4/3order border-black" />
                  </div>

                  <p className="mt-7 text-sm leading-relaxed text-black/80 max-w-md">
                    A single product page for a single product. Description,
                    images, a price, and checkout — with delivery built in.
                  </p>

                  <div className="mt-7 text-xs uppercase tracking-[0.18em] text-black/60">
                    Delivery • Receipt • Confirmation
                  </div>
                </div>

                {/* right: fake checkout */}
                <div className="p-7 md:p-9">
                  <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                    Checkout
                  </div>

                  <div className="mt-6 grid gap-4">
                    <div className="grid gap-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-black/60">
                        Email
                      </div>
                      <div className="h-10 border border-black" />
                    </div>

                    <div className="grid gap-2">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-black/60">
                        Shipping (optional)
                      </div>
                      <div className="h-10 border border-black" />
                      <div className="h-10 border border-black" />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-10 border border-black" />
                        <div className="h-10 border border-black" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="h-12 border border-black flex items-center justify-between px-4">
                        <span className="text-xs uppercase tracking-[0.18em]">
                          Complete purchase
                        </span>
                        <span className="text-xs uppercase tracking-[0.18em] text-black/60">
                          →
                        </span>
                      </div>
                      <div className="mt-3 text-[11px] leading-relaxed text-black/60">
                        Payment integration can change later — the selling
                        surface stays the same.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-black p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                  Result
                </div>
                <div className="text-sm">
                  A block feels like a product — not a website builder.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* PRINCIPLES — not floating in empty space */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350">
          <motion.div variants={v.item} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-4">
              <K>Principles</K>
              <h3 className="mt-5 text-2xl tracking-tight font-normal">
                Designed to stay small.
              </h3>
              <p className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
                The point is restraint: fewer features, fewer decisions, fewer
                ways to break your own selling flow.
              </p>
            </div>

            <div className="md:col-span-8 border border-black">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em]">
                      Radical focus
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-black/80">
                      Each block is about one thing only. Clear messaging.
                      Honest conversion.
                    </p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em]">
                      Fast by default
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-black/80">
                      No themes, no plugins, no layout decisions. Blocks load
                      fast and work everywhere.
                    </p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em]">
                      Own the link
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-black/80">
                      Share a block anywhere: social, email, bio, DM. It works
                      without context.
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-black p-6 md:p-7 flex items-center justify-between text-xs uppercase tracking-[0.18em]">
                <span className="text-black/60">Constraint is the feature</span>
                <span className="text-black/60">—</span>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* HOW IT WORKS — structured like a system */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <motion.div variants={v.item} className="md:col-span-4">
            <K>How it works</K>
            <h3 className="mt-5 text-2xl tracking-tight font-normal">
              Three steps.
              <br />
              No ceremony.
            </h3>
          </motion.div>

          <motion.div variants={v.item} className="md:col-span-8">
            <div className="border border-black">
              <div className="p-6 md:p-8">
                <div className="grid gap-6">
                  <div className="grid grid-cols-12 items-start gap-6">
                    <div className="col-span-2 text-xs uppercase tracking-[0.18em] text-black/60">
                      01
                    </div>
                    <div className="col-span-10">
                      <div className="text-sm leading-relaxed">
                        Create a block with title, description, price, delivery.
                      </div>
                      <div className="mt-2 text-[11px] leading-relaxed text-black/60">
                        Digital? deliver a file. Physical? collect shipping
                        details. Same surface.
                      </div>
                    </div>
                  </div>

                  <Rule />

                  <div className="grid grid-cols-12 items-start gap-6">
                    <div className="col-span-2 text-xs uppercase tracking-[0.18em] text-black/60">
                      02
                    </div>
                    <div className="col-span-10">
                      <div className="text-sm leading-relaxed">
                        Share the link where you already have attention.
                      </div>
                      <div className="mt-2 text-[11px] leading-relaxed text-black/60">
                        Website, bio, newsletter, DM — it’s built for context
                        collapse.
                      </div>
                    </div>
                  </div>

                  <Rule />

                  <div className="grid grid-cols-12 items-start gap-6">
                    <div className="col-span-2 text-xs uppercase tracking-[0.18em] text-black/60">
                      03
                    </div>
                    <div className="col-span-10">
                      <div className="text-sm leading-relaxed">
                        Get paid. Fulfil the order. Done.
                      </div>
                      <div className="mt-2 text-[11px] leading-relaxed text-black/60">
                        Receipts, order status, and delivery flow live with the
                        block.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-black p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                  Next
                </div>
                <div className="text-sm uppercase tracking-[0.18em]">
                  <UnderlineLink href="/app/new">Create your first block</UnderlineLink>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* FAQ — density without marketing */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <motion.div variants={v.item} className="md:col-span-4">
            <K>FAQ</K>
            <h3 className="mt-5 text-2xl tracking-tight font-normal">
              Clear answers.
              <br />
              No pitch.
            </h3>
          </motion.div>

          <motion.div variants={v.item} className="md:col-span-8 border border-black">
            <div className="divide-y divide-black">
              <details className="p-6 md:p-8 group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
                  <span className="text-sm">Is this Shopify?</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-black/60 group-open:opacity-100 opacity-80">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-black/80 max-w-2xl">
                  No. Shopify is a full store. ShopABlock is a single selling
                  unit — a page + checkout for one product.
                </p>
              </details>

              <details className="p-6 md:p-8 group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
                  <span className="text-sm">What can I sell?</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-black/60 group-open:opacity-100 opacity-80">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-black/80 max-w-2xl">
                  Physical or digital. A product, a print, a file, a ticket, a
                  membership later — the primitive stays the same.
                </p>
              </details>

              <details className="p-6 md:p-8 group">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-6">
                  <span className="text-sm">What about payments?</span>
                  <span className="text-xs uppercase tracking-[0.18em] text-black/60 group-open:opacity-100 opacity-80">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-black/80 max-w-2xl">
                  Payments are a plug-in layer. The block is the surface. You
                  can change providers without rebuilding your product page.
                </p>
              </details>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* FOOT */}
      <Section className="px-6 py-24 md:py-28">
        <div className="max-w-350 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <motion.div variants={v.item}>
            <div className="text-xs uppercase tracking-[0.18em] text-black/60">
              ShopABlock
            </div>
            <div className="mt-3 text-lg tracking-tight">
              Build your first block in under a minute.
            </div>
          </motion.div>

          <motion.div variants={v.item} className="text-sm uppercase tracking-[0.18em] flex gap-10">
            <UnderlineLink href="/app/new">Create</UnderlineLink>
            <UnderlineLink href="/explore">Explore</UnderlineLink>
            <UnderlineLink href="/pricing">Pricing</UnderlineLink>
          </motion.div>
        </div>
      </Section>
    </main>
  );
}
