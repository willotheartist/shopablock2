// src/app/page.tsx
"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";
import HowItWorksEditorial from "@/components/home/HowItWorksEditorial";
import FAQs from "@/components/home/faqs";
import ShopABlocks from "@/components/home/shopablocks";

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

function CTAButton({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base =
    "h-12 px-8 text-sm uppercase tracking-[0.18em] inline-flex items-center justify-center border border-black transition";
  const styles =
    variant === "primary"
      ? "bg-black text-[rgb(246,245,241)] hover:opacity-90"
      : "bg-transparent text-black hover:bg-black hover:text-[rgb(246,245,241)]";
  return (
    <Link href={href} className={`${base} ${styles}`}>
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
      <section className="min-h-[95vh] px-6 pt-28 pb-22 md:pt-32 md:pb-28 border-b border-black flex items-center">
        <div ref={heroRef} className="max-w-300 mx-auto">
          <motion.div style={{ y: heroY, opacity: heroFade }}>
            <motion.div variants={v.wrap} initial="hidden" animate="show">
              <motion.h1
                variants={v.item}
                className="text-center text-[clamp(3.1rem,8.4vw,6.4rem)] leading-[0.92] tracking-tight font-normal"
              >
                Buy one block.
                <br />
                Sell one thing.
              </motion.h1>

              <motion.p
                variants={v.item}
                className="mt-10 mx-auto max-w-176 text-center text-[15px] leading-relaxed text-black/80"
              >
                The smallest possible shop on the internet.
                <br />
                A single product page with checkout and delivery.
              </motion.p>

              <motion.div
                variants={v.item}
                className="mt-10 flex justify-center gap-3"
              >
                <CTAButton href="/app/new" variant="primary">
                  Start selling
                </CTAButton>
                <CTAButton href="/demo" variant="ghost">
                  See a demo block
                </CTAButton>
              </motion.div>

              <motion.div
                variants={v.item}
                className="mt-10 text-center text-[11px] uppercase tracking-[0.18em] text-black/60"
              >
                No store setup • No themes • No bloat
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MANIFESTO / POSITION */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
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

      {/* 6-CARD VISUAL SECTION */}
      <ShopABlocks />

      {/* “ANATOMY” */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
          <motion.div
            variants={v.item}
            className="md:col-span-4 md:sticky md:top-24"
          >
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
                    <div className="text-sm uppercase tracking-[0.18em]">£48</div>
                  </div>

                  <div className="mt-7 grid grid-cols-3 gap-2">
                    <div className="aspect-4/3 border border-black" />
                    <div className="aspect-4/3 border border-black" />
                    <div className="aspect-4/3 border border-black" />
                  </div>

                  <p className="mt-7 text-sm leading-relaxed text-black/80 max-w-md">
                    A single product page for a single product. Description,
                    images, a price, and checkout — with delivery built in.
                  </p>

                  <div className="mt-7 text-xs uppercase tracking-[0.18em] text-black/60">
                    Delivery • Receipt • Confirmation
                  </div>
                </div>

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
                        The surface stays the same even if the payment rail
                        evolves.
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

      {/* PRINCIPLES */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 mx-auto">
          <motion.div
            variants={v.item}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14"
          >
            <div className="md:col-span-4">
              <K>Principles</K>
              <h3 className="mt-5 text-2xl tracking-tight font-normal">
                Designed to stay small.
              </h3>
              <p className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
                The point is restraint: fewer features, fewer decisions, fewer
                ways to break your selling flow.
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
                      One block is one offer. Clear message. Clean conversion.
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
                      Share a block anywhere: social, email, bio, DM.
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

      {/* HOW IT WORKS */}
      <HowItWorksEditorial />

      {/* DEMO BLOCKS */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <motion.div variants={v.item} className="md:col-span-4">
            <K>Demo blocks</K>
            <h3 className="mt-5 text-2xl tracking-tight font-normal">
              See what “one thing” looks like.
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
              We launch with curated blocks so it’s instantly obvious what you
              can sell — and how it should feel.
            </p>
            <div className="mt-6 text-sm uppercase tracking-[0.18em]">
              <UnderlineLink href="/demo">Open demos</UnderlineLink>
            </div>
          </motion.div>

          <motion.div variants={v.item} className="md:col-span-8">
            <div className="border border-black">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {[
                  {
                    title: "Artist selling a print",
                    meta: "Physical • 3–6 images",
                    price: "£35",
                  },
                  {
                    title: "Creator selling merch",
                    meta: "Physical • Sizes/variants later",
                    price: "£28",
                  },
                  {
                    title: "Indie maker selling digital",
                    meta: "Digital • Simple delivery",
                    price: "£12",
                  },
                  {
                    title: "Pop-up brand selling one item",
                    meta: "Limited • Weekend drop",
                    price: "£49",
                  },
                ].map((b, idx) => {
                  const isRight = idx % 2 === 1;
                  const needsTopBorder = idx >= 2;
                  return (
                    <div
                      key={b.title}
                      className={[
                        "p-7 md:p-9",
                        "border-black",
                        isRight ? "md:border-l border-t md:border-t-0" : "",
                        needsTopBorder ? "border-t" : "",
                        idx === 0 ? "" : "border-t md:border-t-0",
                      ].join(" ")}
                    >
                      <div className="flex items-baseline justify-between gap-6">
                        <div className="min-w-0">
                          <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                            Demo
                          </div>
                          <div className="mt-3 text-lg tracking-tight">
                            {b.title}
                          </div>
                          <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-black/60">
                            {b.meta}
                          </div>
                        </div>
                        <div className="text-sm uppercase tracking-[0.18em]">
                          {b.price}
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-3 gap-2">
                        <div className="aspect-4/3 border border-black" />
                        <div className="aspect-4/3 border border-black" />
                        <div className="aspect-4/3 border border-black" />
                      </div>

                      <div className="mt-6 text-sm uppercase tracking-[0.18em]">
                        <UnderlineLink href="/demo">View block</UnderlineLink>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-black p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                  Purpose
                </div>
                <div className="text-sm">
                  Demos make the product legible in seconds.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* WHY NOT SHOPIFY / GUMROAD */}
      <Section className="px-6 py-24 md:py-28 border-b border-black">
        <div className="max-w-350 mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
          <motion.div variants={v.item} className="md:col-span-4">
            <K>Why not</K>
            <h3 className="mt-5 text-2xl tracking-tight font-normal">
              Ecommerce without the store.
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-black/75 max-w-sm">
              If you want a store, use a store tool. If you just need somewhere
              to sell one thing — this is lighter, faster, and clearer.
            </p>
          </motion.div>

          <motion.div variants={v.item} className="md:col-span-8">
            <div className="border border-black">
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-12 gap-6 text-sm">
                  <div className="col-span-12 md:col-span-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                      ShopABlock
                    </div>
                    <ul className="mt-4 space-y-2 text-black/80">
                      <li>• One page per product</li>
                      <li>• One CTA: Buy now</li>
                      <li>• No themes or setup</li>
                      <li>• Built to share</li>
                    </ul>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                      Shopify
                    </div>
                    <ul className="mt-4 space-y-2 text-black/80">
                      <li>• Store + catalog</li>
                      <li>• Theme choices</li>
                      <li>• App/plugin stack</li>
                      <li>• More surface area</li>
                    </ul>
                  </div>

                  <div className="col-span-12 md:col-span-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                      Gumroad
                    </div>
                    <ul className="mt-4 space-y-2 text-black/80">
                      <li>• Marketplace feel</li>
                      <li>• Page is templated</li>
                      <li>• Less “brand page”</li>
                      <li>• Great for some cases</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-black p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                  Rule
                </div>
                <div className="text-sm">
                  If it starts to feel like ecommerce software, we failed.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* FAQ */}
      <FAQs />

      {/* FINAL CTA */}
      <Section className="px-6 py-24 md:py-28">
        <div className="max-w-350 mx-auto border border-black">
          <div className="p-7 md:p-9 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <motion.div variants={v.item}>
              <div className="text-xs uppercase tracking-[0.18em] text-black/60">
                ShopABlock
              </div>
              <div className="mt-3 text-2xl tracking-tight">
                Build your first block in under a minute.
              </div>
              <div className="mt-4 text-sm text-black/75">
                One product page. One checkout. One link to share.
              </div>
            </motion.div>

            <motion.div
              variants={v.item}
              className="flex flex-col sm:flex-row gap-3"
            >
              <CTAButton href="/app/new" variant="primary">
                Create a block
              </CTAButton>
              <CTAButton href="/demo" variant="ghost">
                View demo
              </CTAButton>
            </motion.div>
          </div>

          <div className="border-t border-black p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-xs uppercase tracking-[0.18em] text-black/60">
              Links
            </div>
            <div className="text-sm uppercase tracking-[0.18em] flex flex-wrap gap-x-10 gap-y-4">
              <UnderlineLink href="/app/new">Create</UnderlineLink>
              <UnderlineLink href="/demo">Demo</UnderlineLink>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
