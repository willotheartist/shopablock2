import Link from "next/link";
import { getBlockById } from "@/lib/blocks";
import { updateBlock, uploadBlockMedia, deleteBlockMedia } from "@/lib/actions";
import { Button, Container, Field, Input, Kicker, Panel, Textarea, Rule } from "@/components/ui";

export const dynamic = "force-dynamic";

type Params = { id?: string };

export default async function EditBlockPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const resolved = await Promise.resolve(params);
  const id = resolved?.id?.trim();

  const block = id ? await getBlockById(id) : null;

  if (!block) {
    return (
      <Container narrow>
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold">Not found</h1>
          <p className="mt-2 text-sm text-(--muted)">This block doesn’t exist.</p>
          <div className="mt-6">
            <Link href="/app">
              <Button>Back</Button>
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const media = block.media ?? [];

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Edit block</h1>
          </div>

          <Link href="/app">
            <Button>Back</Button>
          </Link>
        </div>

        {/* FIELDS */}
        <Panel>
          <div className="p-5">
            <form action={updateBlock} className="grid gap-6">
              <input type="hidden" name="id" value={block.id} />

              <Field label="Title">
                <Input name="title" defaultValue={block.title} required />
              </Field>

              <Field label="Description">
                <Textarea name="description" defaultValue={block.description ?? ""} />
              </Field>

              <Rule />

              <Field label="Status">
                <select
                  name="status"
                  defaultValue={block.status}
                  className="h-12 w-full border border-(--line) bg-transparent px-3 font-mono text-sm outline-none focus:border-(--accent)"
                >
                  <option value="draft">Draft (hidden)</option>
                  <option value="active">Active (public)</option>
                  <option value="sold_out">Sold out</option>
                </select>
              </Field>

              <p className="text-xs text-(--muted) leading-relaxed">
                Only <span className="font-mono">Active</span> blocks appear on{" "}
                <span className="font-mono">/explore</span>.
              </p>

              <Rule />

              <Field label="Price (GBP)">
                <Input
                  name="price"
                  inputMode="decimal"
                  defaultValue={(Number(block.price) / 100).toFixed(2)}
                  required
                />
              </Field>

              <details className="border border-(--line) rounded-xl p-4">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                  <div className="font-mono text-xs uppercase tracking-[0.28em] text-(--muted)">
                    Advanced
                  </div>
                  <div className="text-(--muted)">+</div>
                </summary>

                <div className="mt-4 grid gap-3">
                  <Field label="Custom link (optional)">
                    <Input
                      name="handle"
                      defaultValue={block.handle ?? ""}
                      placeholder="the-everyday-chair"
                      autoComplete="off"
                    />
                  </Field>
                  <p className="text-xs text-(--muted) leading-relaxed">
                    Leave blank to keep the generated link based on the title.
                  </p>
                </div>
              </details>

              <Button variant="primary" full type="submit">
                Save changes
              </Button>

              <p className="text-sm text-(--muted)">Changes are saved immediately.</p>
            </form>
          </div>
        </Panel>

        {/* MEDIA (separate form so it never wipes fields) */}
        <Panel>
          <div className="p-5 grid gap-4">
            <div className="font-mono text-xs uppercase tracking-[0.28em] text-(--muted)">
              Media
            </div>

            {media.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {media.map((m) => (
                  <div key={m.id} className="border border-(--line) bg-white">
                    <div className="aspect-4/3 overflow-hidden border-b border-(--line)">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="p-3 flex items-center justify-between gap-3">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-(--muted) truncate">
                        Image
                      </div>

                      <form action={deleteBlockMedia}>
                        <input type="hidden" name="blockId" value={block.id} />
                        <input type="hidden" name="mediaId" value={m.id} />
                        <button
                          type="submit"
                          className="font-mono text-[11px] uppercase tracking-[0.18em] border border-(--line) px-2 py-1 hover:bg-(--accent)/5"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-(--line) p-4 text-sm text-(--muted)">
                No media yet. Add 1–3 images to make the block feel real.
              </div>
            )}

            <form action={uploadBlockMedia} className="grid gap-3">
              <input type="hidden" name="blockId" value={block.id} />

              <Field label="Add images">
                <input
                  name="media"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  className="block w-full border border-(--line) bg-transparent px-3 py-3 font-mono text-sm"
                />
              </Field>

              <Button type="submit" full>
                Upload
              </Button>

              <p className="text-xs text-(--muted) leading-relaxed">
                Images are stored locally in <span className="font-mono">/public/uploads</span>.
              </p>
            </form>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
