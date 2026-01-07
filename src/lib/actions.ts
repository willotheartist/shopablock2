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

function optionalString(formData: FormData, key: string) {
  const v = String(formData.get(key) ?? "").trim();
  return v || null;
}

function parsePriceToPence(raw: string) {
  // allow "60" or "60.00"
  const n = Number(raw);
  const pence = Math.round(n * 100);
  if (!Number.isFinite(pence) || pence <= 0) throw new Error("Price must be a positive number");
  return pence;
}

/**
 * NOTE (temporary until auth):
 * We pick the first user as the owner. Replace this with session user ASAP.
 */
async function getOwnerIdForNow() {
  const owner = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });
  if (!owner) throw new Error("No user exists yet. Create a user first.");
  return owner.id;
}

export async function createBlock(formData: FormData): Promise<void> {
  const title = requireString(formData, "title");
  const description = String(formData.get("description") ?? "").trim();
  const handle = requireString(formData, "handle");
  const pricePence = parsePriceToPence(requireString(formData, "price"));

  const ownerId = await getOwnerIdForNow();

  const block = await createBlockModel({
    ownerId,
    handle,
    title,
    description,
    price: pricePence,
    currency: "GBP",
    deliveryType: DeliveryType.physical,
  });

  redirect(`/app/blocks/${block.id}`);
}

export async function updateBlock(formData: FormData): Promise<void> {
  const id = requireString(formData, "id"); // block id
  const title = requireString(formData, "title");
  const description = String(formData.get("description") ?? "").trim();

  // Allow handle to be optional on edit; keep existing if blank.
  const handleMaybe = optionalString(formData, "handle");

  // price required on edit
  const pricePence = parsePriceToPence(requireString(formData, "price"));

  const ownerId = await getOwnerIdForNow();

  // Ensure the owner owns this block (prevents updating random blocks)
  const existing = await prisma.block.findFirst({
    where: { id, ownerId },
    select: { id: true, handle: true },
  });

  if (!existing) {
    throw new Error("Block not found");
  }

  await prisma.block.update({
    where: { id },
    data: {
      title,
      description,
      price: pricePence,
      ...(handleMaybe ? { handle: handleMaybe } : {}),
    },
  });

  redirect(`/app/blocks/${id}`);
}
