import { prisma } from "@/lib/db";
import { OrderStatus, BlockStatus } from "@prisma/client";

export async function createOrder(input: {
  blockId: string;
  sellerId: string;
  email: string;
}) {
  const block = await prisma.block.findUnique({
    where: { id: input.blockId },
  });

  if (!block) throw new Error("Block not found");
  if (block.status !== BlockStatus.active) {
    throw new Error("Block not available");
  }

  return prisma.order.create({
    data: {
      blockId: block.id,
      sellerId: input.sellerId,
      email: input.email,
      amount: block.price,
      currency: block.currency,
      status: OrderStatus.pending,
    },
  });
}

export async function getOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      block: true,
      seller: true,
    },
  });
}

export async function listOrdersForSeller(sellerId: string) {
  return prisma.order.findMany({
    where: { sellerId },
    orderBy: { createdAt: "desc" },
    include: { block: true },
  });
}
