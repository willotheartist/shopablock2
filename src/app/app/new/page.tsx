import Link from "next/link";
import { createBlock } from "@/lib/actions";
import { Button, Container, Field, Input, Kicker, Panel, Textarea, Rule } from "@/components/ui";

export default function NewBlockPage() {
  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">New block</h1>
          </div>

          <Link href="/app">
            <Button>Back</Button>
          </Link>
        </div>

        <Panel>
          <div className="p-5">
            <form action={createBlock} className="grid gap-6">
              <Field label="Title">
                <Input name="title" placeholder="The Everyday Chair" required />
              </Field>

              <Field label="Description">
                <Textarea name="description" placeholder="What is it? Why does it matter?" />
              </Field>

              <Rule />

              <div className="grid gap-3">
                <div className="font-mono text-xs uppercase tracking-[0.28em] text-(--muted)">
                  Media
                </div>

                <Field label="Upload images (optional)">
                  <input
                    name="media"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    className="block w-full border border-(--line) bg-transparent px-3 py-3 font-mono text-sm"
                  />
                </Field>

                <p className="text-xs text-(--muted) leading-relaxed">
                  Upload now or later. Images are stored locally in{" "}
                  <span className="font-mono">/public/uploads</span>.
                </p>
              </div>

              <Rule />

              <Field label="Price (GBP)">
                <Input
                  name="price"
                  inputMode="decimal"
                  placeholder="699"
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
                    <Input name="handle" placeholder="the-everyday-chair" autoComplete="off" />
                  </Field>
                  <p className="text-xs text-(--muted) leading-relaxed">
                    If blank, we generate a clean link from the title.
                  </p>
                </div>
              </details>

              <Button variant="primary" full type="submit">
                Create block
              </Button>

              <p className="text-sm text-(--muted)">
                This creates the block and opens the edit screen.
              </p>
            </form>
          </div>
        </Panel>
      </div>
    </Container>
  );
}
