import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toDraft } from "@/lib/v2/products";
import { paymentsConfigured } from "@/lib/kompipay";
import ProductView from "@/components/v2/ProductView";
import type { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const b = await prisma.block.findFirst({
    where: { handle, status: { in: ["active", "sold_out"] }, archivedAt: null },
    select: {
      title: true,
      description: true,
      media: { take: 1, orderBy: { sort: "asc" } },
    },
  });
  if (!b)
    return { title: "Shop not found", robots: { index: false, follow: false } };
  return {
    title: b.title,
    description: b.description.slice(0, 160),
    alternates: { canonical: `/${handle}` },
    openGraph: {
      title: b.title,
      description: b.description.slice(0, 160),
      images: b.media.map((m) => ({ url: m.url })),
    },
  };
}
export default async function Product({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const b = await prisma.block.findFirst({
    where: { handle, status: { in: ["active", "sold_out"] }, archivedAt: null },
    include: {
      media: { orderBy: { sort: "asc" } },
      owner: { select: { payoutsStatus: true, kompipayAccountId: true } },
    },
  });
  if (!b) notFound();
  const soldOut =
    b.status === "sold_out" ||
    (b.quantity !== null && b.quantity <= b.soldCount + b.reservedCount);
  return (
    <main id="main">
      <ProductView
        draft={toDraft(b)}
        mode="live"
        blockId={b.id}
        available={
          paymentsConfigured() &&
          b.owner.payoutsStatus === "active" &&
          !!b.owner.kompipayAccountId
        }
        soldOut={soldOut}
      />
    </main>
  );
}
