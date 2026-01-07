//src/lib/actions.ts
"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createBlock as createBlockModel } from "@/lib/blocks";
import { DeliveryType } from "@prisma/client";

function requireString(formData: FormData, key: string) {
  const v = String(formData.get(key) ?? "").trim();
  if (!v) throw new Error(`${key} required`);
  return v;
}

export async function createBlock(formData: FormData): Promise<void> {
  const title = requireString(formData, "title");
  const description = String(formData.get("description") ?? "").trim();

  // Handle MUST exist (because User has no handle field)
  const handle = requireString(formData, "handle");

  // Accept "60" or "60.00" and store pennies/cents (integer)
  const rawPrice = requireString(formData, "price");
  const pricePence = Math.round(Number(rawPrice) * 100);

  if (!Number.isFinite(pricePence) || pricePence <= 0) {
    throw new Error("Price must be a positive number");
  }

  // Until auth exists, pick the first user as owner (by id only)
  const owner = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!owner) {
    throw new Error("No user exists yet. Create a user first.");
  }

  const block = await createBlockModel({
    ownerId: owner.id,
    handle,
    title,
    description,
    price: pricePence,
    currency: "GBP",
    deliveryType: DeliveryType.physical,
  });

  redirect(`/app/blocks/${block.id}`);
}
