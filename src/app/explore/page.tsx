import { listPublicBlocks } from "@/lib/blocks";
import ExploreGrid from "./ExploreGrid";

export const dynamic = "force-dynamic";

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center w-10 h-10 text-base leading-none">
      {children}
    </span>
  );
}

export default async function ExplorePage() {
  const blocks = await listPublicBlocks();

  const tiles = blocks.map((b) => ({
    id: b.id,
    title: b.title,
    handle: b.handle,
    thumbUrl: b.media?.[0]?.url ?? null,
  }));

  return (
    <main className="bg-[rgb(246,245,241)] text-black min-h-[calc(100vh-80px)]">
      {/* toolbar (centered like reference) */}
      <div className="px-6 pt-16 pb-10 flex justify-center">
        <div className="w-full max-w-2xl border border-black bg-white h-14 flex items-center">
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

      {/* FULL-WIDTH GRID */}
      {tiles.length === 0 ? (
        <div className="px-6 pb-20">
          <div className="border border-black bg-white p-10 text-center">
            <div className="text-lg">No active blocks yet.</div>
            <div className="mt-2 text-sm text-black/60">
              Publish a block, then it will appear here.
            </div>
          </div>
        </div>
      ) : (
        <ExploreGrid blocks={tiles} />
      )}
    </main>
  );
}
