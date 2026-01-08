"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type BlockTile = {
  id: string;
  title: string;
  handle: string;
  thumbUrl?: string | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

export default function ExploreGrid({ blocks }: { blocks: BlockTile[] }) {
  return (
    <div className="w-full border-t border-black bg-white">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {blocks.map((b, idx) => {
          const isLastCol2 = (idx + 1) % 2 === 0;
          const isLastCol3 = (idx + 1) % 3 === 0;
          const isLastCol4 = (idx + 1) % 4 === 0;

          return (
            <div
              key={b.id}
              className={[
                "border-b border-black",
                "border-r border-black",
                isLastCol2 ? "md:border-r border-r-0" : "",
                "md:border-r",
                isLastCol3 ? "md:border-r-0" : "",
                "lg:border-r",
                isLastCol4 ? "lg:border-r-0" : "",
              ].join(" ")}
            >
              <Link
                href={`/${encodeURIComponent(b.handle)}`}
                className="group block relative"
                aria-label={`Open ${b.title}`}
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  className="relative w-full aspect-square overflow-hidden bg-white"
                >
                  {/* IMAGE / PLACEHOLDER */}
                  <motion.div
                    variants={{ hover: { scale: 1.02 } }}
                    transition={{ duration: 0.35, ease }}
                    className="absolute inset-0"
                  >
                    {b.thumbUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.thumbUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center">
                        <div className="w-[55%] aspect-square border border-black/40 bg-[rgba(0,0,0,0.03)]" />
                      </div>
                    )}
                  </motion.div>

                  {/* HOVER LABEL */}
                  <motion.div
                    variants={{
                      rest: { opacity: 0, y: 10 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.18, ease }}
                    className="absolute left-6 bottom-6"
                  >
                    <div className="inline-flex items-center gap-3 border border-black bg-white px-4 py-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-black/80">
                        {b.title}
                      </span>
                      <span className="text-xs uppercase tracking-[0.18em] text-black/45">
                        @{b.handle}
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
