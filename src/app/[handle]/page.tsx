//src/app/[handle]/page.tsx
import { getBlockByHandle } from "@/lib/blocks";
import { createOrder } from "@/lib/orders";
import { redirect } from "next/navigation";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

type Params = { handle?: string };

export default async function PublicBlockPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const handle = resolvedParams?.handle?.trim();

  const block = await getBlockByHandle(handle);

  if (!block || block.status !== "active") {
    return (
      <main className="bg-[rgb(246,245,241)] text-black min-h-[70vh] grid place-items-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Not found</h1>
          <p className="mt-2 text-sm text-black/60">
            This block doesn’t exist or is no longer available.
          </p>
        </div>
      </main>
    );
  }

  const blockId = block.id;
  const sellerId = block.ownerId;

  async function buy(formData: FormData): Promise<void> {
    "use server";

    const email = String(formData.get("email") || "").trim();
    if (!email) throw new Error("Email required");

    const order = await createOrder({
      blockId,
      sellerId,
      email,
    });

    redirect(`/checkout/${order.id}`);
  }

  return (
    <ProductClient
      buyAction={buy}
      block={{
        id: block.id,
        title: block.title,
        description: block.description ?? null,
        price: Number(block.price),
        currency: block.currency,
        handle: block.handle,
        media: (block.media ?? []).map((m) => ({ id: m.id, url: m.url })),
      }}
    />
  );
}
