import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requirePageUser } from "@/lib/v2/session";
import { toDraft } from "@/lib/v2/products";
import Builder from "@/components/v2/Builder";
export default async function Edit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const u = await requirePageUser();
  const { id } = await params;
  const p = await prisma.block.findFirst({
    where: { id, ownerId: u.id },
    include: { media: { orderBy: { sort: "asc" } } },
  });
  if (!p) notFound();
  return (
    <Builder
      initialDraft={toDraft(p)}
      userId={u.id}
      payouts={u.payoutsStatus === "active"}
      product={{
        id: p.id,
        status: p.status,
        updatedAt: p.updatedAt.toISOString(),
      }}
    />
  );
}
