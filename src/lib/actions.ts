"use server";

import { prisma } from "@/lib/db";
import { BlockStatus, DeliveryType } from "@prisma/client";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 64);
}

/**
 * ✅ Money parsing without floats.
 * Accepts: "699", "699.00", "699,00", "1,299.99", "1299.99"
 * Returns integer minor units (pence).
 */
function moneyToIntGBP(raw: string) {
  const s = String(raw ?? "").trim();
  if (!s) return 0;

  // Remove currency symbols and spaces
  let cleaned = s.replace(/[£$€\s]/g, "");

  // If both comma and dot exist, assume comma is thousands: "1,299.99"
  const hasComma = cleaned.includes(",");
  const hasDot = cleaned.includes(".");
  if (hasComma && hasDot) {
    cleaned = cleaned.replace(/,/g, "");
  } else if (hasComma && !hasDot) {
    // "699,00" → decimal comma
    cleaned = cleaned.replace(/,/g, ".");
  }

  // Now cleaned is digits + optional dot decimal
  const match = cleaned.match(/^(\d+)(?:\.(\d{0,}))?$/);
  if (!match) return 0;

  const pounds = match[1] ?? "0";
  const decRaw = match[2] ?? "";

  const p = Number.parseInt(pounds, 10) || 0;
  const dec2 = (decRaw + "00").slice(0, 2); // pad/trim to 2
  const d = Number.parseInt(dec2, 10) || 0;

  return p * 100 + d;
}

async function ensureUploadsDir() {
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

function fileExtFrom(file: File) {
  // Prefer name extension if present
  const name = (file as any)?.name ? String((file as any).name) : "";
  const ext = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";

  if (ext && ext.length <= 8) return "." + ext;

  // Fallback from mime
  const type = file.type || "";
  if (type === "image/jpeg") return ".jpg";
  if (type === "image/png") return ".png";
  if (type === "image/webp") return ".webp";
  if (type === "image/gif") return ".gif";
  return "";
}

async function saveFileToPublicUploads(file: File) {
  const bytes = await file.arrayBuffer();
  const buf = Buffer.from(bytes);

  const uploadsDir = await ensureUploadsDir();
  const ext = fileExtFrom(file);
  const filename = `${randomUUID()}${ext}`;
  const fullPath = path.join(uploadsDir, filename);

  await fs.writeFile(fullPath, buf);

  return `/uploads/${filename}`;
}

function normalizeFiles(value: FormDataEntryValue[] | FormDataEntryValue) {
  const arr = Array.isArray(value) ? value : [value];
  return arr.filter((v): v is File => v instanceof File && v.size > 0);
}

/**
 * ✅ CREATE BLOCK (supports optional media upload)
 */
export async function createBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app/new");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();

  // optional "custom link"
  const handleInput = String(formData.get("handle") ?? "").trim();

  if (!title) redirect("/app/new?error=title");

  const handle = slugify(handleInput || title);
  if (!handle) redirect("/app/new?error=handle");

  const price = moneyToIntGBP(priceRaw);
  if (price <= 0) redirect("/app/new?error=price");

  // default values
  const currency = "GBP";
  const deliveryType = DeliveryType.physical;
  const status = BlockStatus.draft;

  // files
  const mediaFiles = normalizeFiles(formData.getAll("media"));

  try {
    const block = await prisma.block.create({
      data: {
        handle,
        title,
        description,
        price,
        currency,
        status,
        deliveryType,
        ownerId: user.id,
      },
      select: { id: true },
    });

    if (mediaFiles.length) {
      const saved = [];
      for (const f of mediaFiles.slice(0, 8)) {
        const url = await saveFileToPublicUploads(f);
        saved.push(url);
      }

      // Assumes BlockMedia model exists + relation is `media`
      await prisma.blockMedia.createMany({
        data: saved.map((url, i) => ({
          blockId: block.id,
          url,
          sort: i,
        })),
      });
    }

    redirect(`/app/blocks/${block.id}`);
  } catch {
    redirect(`/app/new?error=handle_taken&handle=${encodeURIComponent(handle)}`);
  }
}

/**
 * ✅ UPDATE BLOCK FIELDS ONLY (NO MEDIA)
 * Safe: if fields are missing, it does NOT overwrite with empty.
 */
export async function updateBlock(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app");

  const blockId = String(formData.get("id") ?? "").trim();
  if (!blockId) redirect("/app?error=missing_id");

  const existing = await prisma.block.findFirst({
    where: { id: blockId, ownerId: user.id },
    select: { title: true, description: true, handle: true, price: true, status: true },
  });
  if (!existing) redirect("/app?error=not_found");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const handleInput = String(formData.get("handle") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const statusRaw = String(formData.get("status") ?? "").trim();

  const nextTitle = title || existing.title;
  const nextDesc = description || existing.description;
  const nextHandle = slugify(handleInput || nextTitle) || existing.handle;

  const parsedPrice = priceRaw ? moneyToIntGBP(priceRaw) : existing.price;
  const nextPrice = parsedPrice > 0 ? parsedPrice : existing.price;

  const nextStatus =
    statusRaw === "active"
      ? BlockStatus.active
      : statusRaw === "sold_out"
        ? BlockStatus.sold_out
        : BlockStatus.draft;

  try {
    await prisma.block.updateMany({
      where: { id: blockId, ownerId: user.id },
      data: {
        title: nextTitle,
        description: nextDesc,
        handle: nextHandle,
        price: nextPrice,
        status: nextStatus,
      },
    });
  } catch {
    // likely handle uniqueness collision
    redirect(`/app/blocks/${blockId}?error=handle_taken`);
  }

  redirect(`/app/blocks/${blockId}`);
}

/**
 * ✅ UPLOAD MEDIA ONLY (does not touch title/desc/price)
 */
export async function uploadBlockMedia(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app");

  const blockId = String(formData.get("blockId") ?? "").trim();
  if (!blockId) redirect("/app?error=missing_id");

  const block = await prisma.block.findFirst({
    where: { id: blockId, ownerId: user.id },
    include: { media: { orderBy: { sort: "asc" } } },
  });
  if (!block) redirect("/app?error=not_found");

  const files = normalizeFiles(formData.getAll("media"));
  if (!files.length) redirect(`/app/blocks/${blockId}`);

  const startSort = block.media.length ? block.media[block.media.length - 1]!.sort + 1 : 0;

  const savedUrls: string[] = [];
  for (const f of files.slice(0, 8)) {
    const url = await saveFileToPublicUploads(f);
    savedUrls.push(url);
  }

  await prisma.blockMedia.createMany({
    data: savedUrls.map((url, i) => ({
      blockId,
      url,
      sort: startSort + i,
    })),
  });

  redirect(`/app/blocks/${blockId}`);
}

/**
 * ✅ DELETE MEDIA
 */
export async function deleteBlockMedia(formData: FormData) {
  const user = await getSessionUser();
  if (!user) redirect("/sign-in?next=/app");

  const blockId = String(formData.get("blockId") ?? "").trim();
  const mediaId = String(formData.get("mediaId") ?? "").trim();
  if (!blockId || !mediaId) redirect("/app?error=missing_id");

  const owned = await prisma.block.findFirst({
    where: { id: blockId, ownerId: user.id },
    select: { id: true },
  });
  if (!owned) redirect("/app?error=not_found");

  await prisma.blockMedia.deleteMany({
    where: { id: mediaId, blockId },
  });

  redirect(`/app/blocks/${blockId}`);
}

/**
 * ✅ DELETE BLOCK
 */
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
