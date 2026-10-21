"use client";

import Link from "next/link";
import { Container } from "@/components/ui";
import { motion } from "framer-motion";

type BlockTile = {
  id: string;
  title: string;
  handle: string;
  media?: Array<{ id: string; url: string }> | null;
};

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 text-base leading-none">
      {children}
    </span>
  );
}

function TileCard({ b }: { b: BlockTile }) {
  const href = `/${encodeURIComponent(b.handle)}`;
  const cover = b.media?.[0]?.url;

  return (
    <Link href={href} className="group relative block" aria-label={`Open ${b.title}`}>
      <motion.div
        initial={false}
        whileHover="hover"
        className="relative w-full aspect-4/3 bg-white overflow-hidden"
      >
        <motion.div
          variants={{ hover: { scale: 1.03 } }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="absolute inset-0"
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-[58%] aspect-5/4 border border-black/60 bg-[rgba(0,0,0,0.03)]" />
            </div>
          )}
        </motion.div>

        <motion.div
          variants={{ hover: { opacity: 1, y: 0 } }}
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-6 bottom-6"
        >
          <div className="inline-flex items-center gap-3 border border-black bg-white px-4 py-2">
            <span className="text-xs uppercase tracking-[0.18em] text-black/70">
              {b.title}
            </span>
            <span className="text-xs uppercase tracking-[0.18em] text-black/40">
              @{b.handle}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function ExploreGrid({ blocks }: { blocks: BlockTile[] }) {
  return (
    <main className="bg-[rgb(246,245,241)] text-black">
      <Container>
        <div className="py-16 md:py-20 grid gap-10">
          {/* Toolbar */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl border border-black bg-white h-14 flex items-center">
              <button
                type="button"
                aria-label="Menu"
                className="h-14 w-14 border-r border-black grid place-items-center hover:bg-black hover:text-[rgb(246,245,241)]"
              >
                <Icon>≡</Icon>
              </button>

              <div className="flex-1 grid place-items-center">
                <div className="text-xs uppercase tracking-[0.28em] leading-none">
                  Explore
                </div>
              </div>

              <button
                type="button"
                aria-label="Search"
                className="h-14 w-14 border-l border-black grid place-items-center hover:bg-black hover:text-[rgb(246,245,241)]"
              >
                <Icon>⌕</Icon>
              </button>
            </div>
          </div>

          {/* Grid */}
          {blocks.length === 0 ? (
            <div className="border border-black bg-white p-10 text-center">
              <div className="text-lg">No active blocks yet.</div>
              <div className="mt-2 text-sm text-black/60">
                Publish a block, then it will appear here.
              </div>
            </div>
          ) : (
            <div className="border border-black bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {blocks.map((b, idx) => (
                  <div
                    key={b.id}
                    className={[
                      "border-black border-b",
                      "sm:border-r",
                      (idx + 1) % 2 === 0 ? "sm:border-r-0" : "",
                      "lg:border-r",
                      (idx + 1) % 4 === 0 ? "lg:border-r-0" : "",
                    ].join(" ")}
                  >
                    <TileCard b={b} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
