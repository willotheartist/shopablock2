"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

function slugifyHandle(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
}

/**
 * BLOCKS
 */
export async function createBlock(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const handleInput = String(formData.get("handle") ?? "").trim();

  if (!title) throw new Error("Title is required.");
  if (!price) throw new Error("Price is required.");

  const handle = slugifyHandle(handleInput || title);

  const block = await prisma.block.create({
    data: {
      handle,
      title,
      description,
      price,
      deliveryType: "physical",
    },
  });

  redirect(`/app/blocks/${block.id}`);
}

export async function updateBlock(id: string, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const handleInput = String(formData.get("handle") ?? "").trim();
  const deliveryType = String(formData.get("deliveryType") ?? "physical");

  if (!title) throw new Error("Title is required.");
  if (!price) throw new Error("Price is required.");
  if (deliveryType !== "physical" && deliveryType !== "digital") {
    throw new Error("Invalid delivery type.");
  }

  const handle = slugifyHandle(handleInput || title);

  await prisma.block.update({
    where: { id },
    data: {
      handle,
      title,
      description,
      price,
      deliveryType,
    },
  });

  redirect(`/app/blocks/${id}`);
}

/**
 * CHECKOUT (stub)
 */
export async function startCheckout(blockId: string, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();

  if (!email) throw new Error("Email is required.");
  if (!amount) throw new Error("Amount is required.");

  const block = await prisma.block.findUnique({ where: { id: blockId } });
  if (!block) throw new Error("Block not found.");

  const shipName = String(formData.get("shipName") ?? "").trim();
  const shipLine1 = String(formData.get("shipLine1") ?? "").trim();
  const shipLine2 = String(formData.get("shipLine2") ?? "").trim();
  const shipCity = String(formData.get("shipCity") ?? "").trim();
  const shipPostcode = String(formData.get("shipPostcode") ?? "").trim();
  const shipCountry = String(formData.get("shipCountry") ?? "").trim();

  // If physical delivery, require minimal address fields
  if (block.deliveryType === "physical") {
    if (!shipName || !shipLine1 || !shipCity || !shipPostcode || !shipCountry) {
      throw new Error("Shipping address is required for physical delivery.");
    }
  }

  const order = await prisma.order.create({
    data: {
      blockId,
      email,
      amount,
      status: "pending",
      shipName: shipName || null,
      shipLine1: shipLine1 || null,
      shipLine2: shipLine2 || null,
      shipCity: shipCity || null,
      shipPostcode: shipPostcode || null,
      shipCountry: shipCountry || null,
    },
  });

  redirect(`/checkout/${order.id}`);
}

export async function completeCheckout(orderId: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "paid" },
  });

  redirect(`/receipt/${orderId}`);
}
