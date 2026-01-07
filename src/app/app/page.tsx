//src/app/app/page.tsx
import Link from "next/link";
import { listBlocksByOwner } from "@/lib/blocks";
import { Button, Container, Kicker, Panel } from "@/components/ui";

export const dynamic = "force-dynamic";

const OWNER_ID = "demo-user";

export default async function AppDashboard() {
  const blocks = await listBlocksByOwner(OWNER_ID);

  return (
    <Container narrow>
      <div className="py-10 grid gap-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <Kicker>App</Kicker>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Dashboard
            </h1>
          </div>

          <Link href="/app/new">
            <Button variant="primary">New block</Button>
          </Link>
        </div>

        <Panel>
          <div className="p-5">
            {blocks.length === 0 ? (
              <p className="text-sm text-(--muted)">No blocks yet.</p>
            ) : (
              <div className="border-t border-(--line)">
                {blocks.map((b: any) => (
                  <a
                    key={b.id}
                    href={`/app/blocks/${b.id}`}
                    className="block border-t border-(--line) hover:bg-(--accent)/5"
                  >
                    <div className="flex items-center justify-between gap-6 py-4">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {b.title}
                        </div>
                        <div className="truncate font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
                          @{b.handle}
                        </div>
                      </div>
                      <div className="text-(--accent) text-xl leading-none">↗</div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </div>
    </Container>
  );
}
