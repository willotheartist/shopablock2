// src/app/app/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { listBlocksByOwner } from "@/lib/blocks";
import { Button, Container, Kicker, Panel, Row } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AppDashboard() {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app");

  const blocks = await listBlocksByOwner(user.id);

  return (
    <Container>
      <div className="py-20 grid gap-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="grid gap-4">
            <Kicker>App</Kicker>
            <h1 className="text-5xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-(--muted) text-base leading-relaxed max-w-2xl">
              Your blocks, orders, and settings — kept intentionally small.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <form action="/api/auth/sign-out" method="post">
              <Button type="submit" variant="outline">
                Sign out
              </Button>
            </form>
            <Button href="/app/new" variant="primary">
              New block
            </Button>
          </div>
        </header>

        {/* Dashboard cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Panel>
            <div className="p-6 grid gap-4">
              <div className="text-xs uppercase tracking-[0.28em] text-(--muted)">
                Blocks
              </div>
              <div className="text-2xl font-semibold">My products</div>
              <div className="text-sm text-(--muted) leading-relaxed">
                Create, edit, publish, and share blocks.
              </div>
              <div className="pt-2">
                <Button href="/app/new" variant="primary" full>
                  Create a block
                </Button>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="p-6 grid gap-4">
              <div className="text-xs uppercase tracking-[0.28em] text-(--muted)">
                Orders
              </div>
              <div className="text-2xl font-semibold">Sales</div>
              <div className="text-sm text-(--muted) leading-relaxed">
                View purchases and fulfilment status.
              </div>
              <div className="pt-2">
                <Button href="/app/orders" variant="outline" full>
                  View orders
                </Button>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="p-6 grid gap-4">
              <div className="text-xs uppercase tracking-[0.28em] text-(--muted)">
                Settings
              </div>
              <div className="text-2xl font-semibold">Account</div>
              <div className="text-sm text-(--muted) leading-relaxed">
                Payouts, profile, and preferences.
              </div>
              <div className="pt-2">
                <Button href="/app/settings" variant="outline" full>
                  Open settings
                </Button>
              </div>
            </div>
          </Panel>
        </section>

        {/* Blocks list */}
        <section className="grid gap-6">
          <div className="flex items-end justify-between gap-6">
            <div className="grid gap-2">
              <div className="text-xs uppercase tracking-[0.28em] text-(--muted)">
                My blocks
              </div>
              <div className="text-sm text-(--muted)">
                {blocks.length === 0
                  ? "No blocks yet."
                  : `${blocks.length} block${blocks.length === 1 ? "" : "s"}`}
              </div>
            </div>

            <Link
              href="/app/new"
              className="text-xs uppercase tracking-[0.28em] text-(--muted) hover:text-(--fg)"
            >
              New block ↗
            </Link>
          </div>

          <Panel>
            <div className="p-6 grid gap-2">
              {blocks.length === 0 ? (
                <div className="grid gap-4">
                  <div className="text-sm text-(--muted) leading-relaxed">
                    Create your first block — a single page for a single product.
                  </div>
                  <Button href="/app/new" variant="primary" full>
                    Create your first block
                  </Button>

                  <div className="text-sm text-(--muted)">
                    Want to see the format first?{" "}
                    <Link
                      href="/demo"
                      className="underline underline-offset-4"
                    >
                      Open the demo
                    </Link>
                    .
                  </div>
                </div>
              ) : (
                <div className="border-t border-(--line)">
                  {blocks.map((b) => (
                    <a
                      key={b.id}
                      href={`/app/blocks/${b.id}`}
                      className="block border-t border-(--line) hover:bg-(--accent)/5"
                    >
                      <div className="flex items-center justify-between gap-6 py-4">
                        <div className="min-w-0 grid gap-1">
                          <div className="truncate text-sm font-medium">
                            {b.title}
                          </div>
                          <div className="truncate font-mono text-xs uppercase tracking-[0.22em] text-(--muted)">
                            @{b.handle}
                          </div>
                        </div>
                        <div className="text-(--accent) text-xl leading-none">
                          ↗
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Panel>

          {/* Quick links */}
          <Panel>
            <div className="p-6 grid gap-2">
              <Row
                left={<div className="text-sm">Orders</div>}
                right={<Link href="/app/orders">Open ↗</Link>}
              />
              <Row
                left={<div className="text-sm">Settings</div>}
                right={<Link href="/app/settings">Open ↗</Link>}
              />
              <Row
                left={<div className="text-sm">Explore</div>}
                right={<Link href="/explore">View ↗</Link>}
              />
            </div>
          </Panel>
        </section>
      </div>
    </Container>
  );
}
