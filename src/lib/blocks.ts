import { prisma } from "@/lib/db";
import { BlockStatus, DeliveryType } from "@prisma/client";

export async function listPublicBlocks() {
  return prisma.block.findMany({
    where: { status: BlockStatus.active },
    orderBy: { createdAt: "desc" },
  });
}

export async function listBlocksByOwner(ownerId: string) {
  return prisma.block.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBlockById(id: string) {
  return prisma.block.findUnique({ where: { id } });
}

export async function getBlockByHandle(handle: string) {
  return prisma.block.findUnique({ where: { handle } });
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
