"use server";

import { prisma } from "@/lib/db";
import { BlockStatus, DeliveryType } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parsePriceToPennies(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "").trim();
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Invalid price");
  return Math.round(value * 100);
}

async function requireAuthedUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const u = await currentUser();
  const email =
    u?.emailAddresses?.[0]?.emailAddress ??
    `${userId}@users.clerk.local`;

  await prisma.user.upsert({
    where: { id: userId },
    update: { email },
    create: { id: userId, email },
  });

  return { userId, email };
}

export async function createBlock(formData: FormData): Promise<void> {
  const { userId } = await requireAuthedUser();

  const handleInput = String(formData.get("handle") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "").trim();

  if (!title) throw new Error("Title required");

  const price = parsePriceToPennies(priceRaw);

  // If handle not provided, generate a stable-ish default.
  const base = slugify(handleInput || title) || "block";
  const handle = handleInput ? slugify(handleInput) : `${base}-${userId.slice(-6)}`;

  const block = await prisma.block.create({
    data: {
      ownerId: userId,
      handle,
      title,
      description,
      price,
      currency: "GBP",
      deliveryType: DeliveryType.physical,
      status: BlockStatus.draft,
    },
  });

  redirect(`/app/blocks/${block.id}`);
}

export async function updateBlock(formData: FormData): Promise<void> {
  const { userId } = await requireAuthedUser();

  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("Missing block id");

  const handle = slugify(String(formData.get("handle") || "").trim());
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const priceRaw = String(formData.get("price") || "").trim();

  if (!title) throw new Error("Title required");
  if (!handle) throw new Error("Handle required");

  const price = parsePriceToPennies(priceRaw);

  await prisma.block.updateMany({
    where: { id, ownerId: userId },
    data: {
      handle,
      title,
      description,
      price,
      updatedAt: new Date(),
    },
  });

  redirect(`/app/blocks/${id}`);
}

export async function updateBlockStatus(formData: FormData): Promise<void> {
  const { userId } = await requireAuthedUser();

  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "").trim() as BlockStatus;

  if (!id) throw new Error("Missing block id");

  await prisma.block.updateMany({
    where: { id, ownerId: userId },
    data: { status },
  });

  redirect(`/app/blocks/${id}`);
}
