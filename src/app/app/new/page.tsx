//src/app/app/new/page.tsx
import Link from "next/link";
import { createBlock } from "@/lib/actions";
import {
  Button,
  Container,
  Field,
  Input,
  Kicker,
  Panel,
  Textarea,
} from "@/components/ui";

export default function NewBlockPage() {
  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              New block
            </h1>
          </div>

          <Link href="/app">
            <Button>Back</Button>
          </Link>
        </div>

        <Panel>
          <div className="p-5">
            <form action={createBlock} className="grid gap-5">
              <Field label="Handle">
                <Input name="handle" placeholder="kus-studio" required />
              </Field>

              <Field label="Title">
                <Input
                  name="title"
                  placeholder="Studio Print — Edition of 50"
                  required
                />
              </Field>

              <Field label="Description">
                <Textarea
                  name="description"
                  placeholder="What is it? Why does it matter?"
                />
              </Field>

              <Field label="Price">
                <Input
                  name="price"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  placeholder="60.00"
                  required
                />
              </Field>

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
