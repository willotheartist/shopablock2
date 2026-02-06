//·src/app/explore/page.tsx
import { listPublicBlocks } from "@/lib/blocks";
import ExploreGrid from "./ExploreGrid";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const blocks = await listPublicBlocks();

  const tiles = blocks.map((b) => ({
    id: b.id,
    title: b.title,
    handle: b.handle,
    thumbUrl: b.media?.[0]?.url ?? null,
  }));

  return (
    <main className="bg-[rgb(246,245,241)] text-black min-h-screen">
      {/* FULL-WIDTH GRID */}
      {tiles.length === 0 ? (
        <div className="px-6 pb-20 flex justify-center">
          <div className="w-full max-w-xl border border-black bg-white p-10 text-center">
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
