// src/lib/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { BlockStatus, DeliveryType } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 64);
}

function moneyToIntGBP(value: string) {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

export async function createBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app/new");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const handleInput = String(formData.get("handle") ?? "").trim();
  const priceInput = String(formData.get("price") ?? "").trim();
  const currency = String(formData.get("currency") ?? "GBP").trim() || "GBP";
  const deliveryTypeRaw = String(formData.get("deliveryType") ?? "physical").trim();
  const statusRaw = String(formData.get("status") ?? "draft").trim();
  const quantityRaw = String(formData.get("quantity") ?? "").trim();

  if (!title) redirect("/app/new?error=title");

  const handle = slugify(handleInput || title);
  if (!handle) redirect("/app/new?error=handle");

  const price = moneyToIntGBP(priceInput);
  if (price < 0) redirect("/app/new?error=price");

  const deliveryType =
    deliveryTypeRaw === "digital" ? DeliveryType.digital : DeliveryType.physical;

  const status =
    statusRaw === "active"
      ? BlockStatus.active
      : statusRaw === "sold_out"
        ? BlockStatus.sold_out
        : BlockStatus.draft;

  const quantity =
    quantityRaw === "" ? null : Math.max(0, Number.parseInt(quantityRaw, 10) || 0);

  try {
    const block = await prisma.block.create({
      data: {
        handle,
        title,
        description,
        price,
        currency,
        status,
        quantity,
        deliveryType,
        ownerId: user.id,
      },
      select: { id: true },
    });

    redirect(`/app/blocks/${block.id}`);
  } catch {
    redirect(`/app/new?error=handle_taken&handle=${encodeURIComponent(handle)}`);
  }
}

export async function updateBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app");

  const blockId = String(formData.get("id") ?? "").trim();
  if (!blockId) redirect("/app?error=missing_id");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const handleInput = String(formData.get("handle") ?? "").trim();
  const priceInput = String(formData.get("price") ?? "").trim();
  const currency = String(formData.get("currency") ?? "GBP").trim() || "GBP";
  const deliveryTypeRaw = String(formData.get("deliveryType") ?? "physical").trim();
  const statusRaw = String(formData.get("status") ?? "draft").trim();
  const quantityRaw = String(formData.get("quantity") ?? "").trim();

  const handle = slugify(handleInput || title);
  const price = moneyToIntGBP(priceInput);

  const deliveryType =
    deliveryTypeRaw === "digital" ? DeliveryType.digital : DeliveryType.physical;

  const status =
    statusRaw === "active"
      ? BlockStatus.active
      : statusRaw === "sold_out"
        ? BlockStatus.sold_out
        : BlockStatus.draft;

  const quantity =
    quantityRaw === "" ? null : Math.max(0, Number.parseInt(quantityRaw, 10) || 0);

  await prisma.block.updateMany({
    where: { id: blockId, ownerId: user.id },
    data: {
      title,
      description,
      handle,
      price,
      currency,
      status,
      quantity,
      deliveryType,
    },
  });

  redirect(`/app/blocks/${blockId}`);
}

export async function deleteBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app");

  const blockId = String(formData.get("id") ?? "").trim();
  if (!blockId) redirect("/app?error=missing_id");

  await prisma.block.deleteMany({
    where: { id: blockId, ownerId: user.id },
  });

  redirect("/app");
}
