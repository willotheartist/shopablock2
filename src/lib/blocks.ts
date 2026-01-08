import { prisma } from "@/lib/db";
import { BlockStatus, DeliveryType } from "@prisma/client";

export async function listPublicBlocks() {
  return prisma.block.findMany({
    where: { status: BlockStatus.active },
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        orderBy: { sort: "asc" },
        take: 1,
      },
    },
  });
}

export async function listBlocksByOwner(ownerId: string) {
  return prisma.block.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: {
      media: {
        orderBy: { sort: "asc" },
      },
    },
  });
}

export async function getBlockById(id: string) {
  const v = typeof id === "string" ? id.trim() : "";
  if (!v) return null;

  return prisma.block.findUnique({
    where: { id: v },
    include: { media: { orderBy: { sort: "asc" } } },
  });
}

export async function getBlockByHandle(handle?: string) {
  const h = typeof handle === "string" ? handle.trim() : "";
  if (!h) return null;

  return prisma.block.findUnique({
    where: { handle: h },
    include: { media: { orderBy: { sort: "asc" } } },
  });
}

export async function createBlock(input: {
  ownerId: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  deliveryType: DeliveryType;
}) {
  return prisma.block.create({
    data: {
      ownerId: input.ownerId,
      handle: input.handle,
      title: input.title,
      description: input.description,
      price: input.price,
      currency: input.currency ?? "GBP",
      deliveryType: input.deliveryType,
      status: BlockStatus.draft,
    },
  });
}

export async function updateBlockStatus(
  blockId: string,
  ownerId: string,
  status: BlockStatus
) {
  return prisma.block.updateMany({
    where: { id: blockId, ownerId },
    data: { status },
  });
}
