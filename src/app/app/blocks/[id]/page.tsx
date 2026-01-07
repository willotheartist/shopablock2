import Link from "next/link";
import { getBlockById } from "@/lib/blocks";
import { updateBlock } from "@/lib/actions";
import { Button, Container, Field, Input, Kicker, Panel, Textarea } from "@/components/ui";

export default async function EditBlockPage({
  params,
}: {
  params: { id: string };
}) {
  const block = await getBlockById(params.id);

  if (!block) {
    return (
      <Container narrow>
        <div className="py-10">
          <Panel>
            <div className="p-6">
              <Kicker>Not found</Kicker>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">
                Block not found.
              </h1>
            </div>
          </Panel>
        </div>
      </Container>
    );
  }

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Edit block
            </h1>
            <div className="mt-2 font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
              @{block.handle}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`/${block.handle}`}
              className="font-mono text-xs uppercase tracking-[0.22em] text-(--accent) hover:underline"
            >
              View ↗
            </a>
            <Link href="/app">
              <Button>Back</Button>
            </Link>
          </div>
        </div>

        <Panel>
          <div className="p-5">
            <form action={updateBlock.bind(null, block.id)} className="grid gap-5">
              <Field label="Handle">
                <Input name="handle" defaultValue={block.handle} />
              </Field>

              <Field label="Title">
                <Input name="title" defaultValue={block.title} required />
              </Field>

              <Field label="Description">
                <Textarea name="description" defaultValue={block.description} />
              </Field>

              <Field label="Price">
                <Input name="price" defaultValue={block.price} required />
              </Field>

              <Field label="Delivery type">
                <select
                  name="deliveryType"
                  defaultValue={block.deliveryType}
                  className="h-12 w-full border border-(--line) bg-transparent px-3 font-mono text-sm outline-none focus:border-(--accent)"
                >
                  <option value="physical">physical</option>
                  <option value="digital">digital</option>
                </select>
              </Field>

              <Button variant="primary" full type="submit">
                Save changes
              </Button>
            </form>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
