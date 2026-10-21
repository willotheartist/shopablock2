import { prisma } from "@/lib/db";
import { AppError } from "./http";
export async function rateLimit(id: string, limit: number, seconds = 3600) {
  const key = `${id}:${Math.floor(Date.now() / (seconds * 1000))}`;
  const item = await prisma.rateLimit.upsert({
    where: { id: key },
    create: {
      id: key,
      count: 1,
      expiresAt: new Date(Date.now() + seconds * 1000),
    },
    update: { count: { increment: 1 } },
  });
  if (item.count > limit)
    throw new AppError(
      "You have reached the limit for now. Please try again later.",
      429,
    );
}
