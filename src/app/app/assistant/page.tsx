import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/v2/http";
import Assistant from "@/components/v2/Assistant";
export const metadata = { title: "Your shop assistant" };
export default async function AssistantPage() {
  const u = await requireUser();
  const runs = await prisma.agentRun.findMany({
    where: { ownerId: u.id },
    take: 15,
    orderBy: { createdAt: "desc" },
    select: { id: true, kind: true, status: true, createdAt: true },
  });
  return (
    <main id="main">
      <div className="workspace-top">
        <div>
          <span className="eyebrow">A HELPING HAND, BUILT IN</span>
          <h1>Your shop assistant.</h1>
          <p>For the little things between an idea and a sale.</p>
        </div>
      </div>
      <Assistant
        history={runs.map((r) => ({
          id: r.id,
          kind: r.kind,
          status: r.status,
          date: r.createdAt.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
          }),
        }))}
      />
    </main>
  );
}
