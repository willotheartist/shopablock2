//src/app/app/blocks/[id]/page.tsx
import Link from "next/link";
import { getBlockById } from "@/lib/blocks";
import { updateBlock } from "@/lib/actions";
import {
  Button,
  Container,
  Field,
  Input,
  Kicker,
  Panel,
  Textarea,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EditBlockPage({
  params,
}: {
  params: { id: string };
}) {
  const block = await getBlockById(params.id);

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

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Edit block
            </h1>
          </div>

          <Link href="/app">
            <Button>Back</Button>
          </Link>
        </div>

        <Panel>
          <div className="p-5">
            <form action={updateBlock} className="grid gap-5">
              <input type="hidden" name="id" value={block.id} />

              <Field label="Handle">
                <Input
                  name="handle"
                  defaultValue={block.handle ?? ""}
                  placeholder="kus-studio"
                />
              </Field>

              <Field label="Title">
                <Input
                  name="title"
                  defaultValue={block.title}
                  placeholder="Studio Print — Edition of 50"
                  required
                />
              </Field>

              <Field label="Description">
                <Textarea
                  name="description"
                  defaultValue={block.description ?? ""}
                  placeholder="What is it? Why does it matter?"
                />
              </Field>

              <Field label="Price">
                <Input
                  name="price"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  defaultValue={(Number(block.price) / 100).toFixed(2)}
                  required
                />
              </Field>

              <Button variant="primary" full type="submit">
                Save changes
              </Button>

              <p className="text-sm text-(--muted)">
                Changes are saved immediately.
              </p>
            </form>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
