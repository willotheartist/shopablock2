import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sameOrigin, AppError } from "@/lib/v2/http";
import { clientIP, newToken, tokenHash } from "@/lib/v2/security";
import { rateLimit } from "@/lib/v2/rate-limit";
import { emailConfigured, sendReset } from "@/lib/v2/mail";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    await rateLimit(`reset:${clientIP(req)}`, 5, 3600);
    const f = await req.formData();
    const token = String(f.get("token") || "");
    if (token) {
      const password = String(f.get("password") || "");
      if (
        password.length < 10 ||
        Buffer.byteLength(password) > 72 ||
        token.length > 200
      )
        throw new AppError("invalid");
      const reset = await prisma.passwordReset.findUnique({
        where: { tokenHash: tokenHash(token) },
      });
      if (!reset || reset.usedAt || reset.expiresAt < new Date())
        throw new AppError("expired");
      const hash = await bcrypt.hash(password, 12);
      await prisma.$transaction(async (tx) => {
        const result = await tx.passwordReset.updateMany({
          where: { id: reset.id, usedAt: null, expiresAt: { gt: new Date() } },
          data: { usedAt: new Date() },
        });
        if (!result.count) throw new AppError("expired");
        await tx.user.update({
          where: { id: reset.userId },
          data: { passwordHash: hash },
        });
        await tx.session.deleteMany({ where: { userId: reset.userId } });
      });
      return NextResponse.redirect(
        new URL("/sign-in?error=reset", req.url),
        303,
      );
    }
    if (!emailConfigured()) throw new AppError("unavailable");
    const email = String(f.get("email") || "")
      .trim()
      .toLowerCase();
    if (!z.email().max(254).safeParse(email).success)
      throw new AppError("invalid");
    await rateLimit(`reset-email:${tokenHash(email)}`, 3, 3600);
    const u = await prisma.user.findUnique({ where: { email } });
    if (u) {
      const value = newToken();
      const r = await prisma.passwordReset.create({
        data: {
          userId: u.id,
          tokenHash: tokenHash(value),
          expiresAt: new Date(Date.now() + 30 * 60000),
        },
      });
      await sendReset(
        email,
        `${new URL(req.url).origin}/reset?token=${value}`,
        r.id,
      );
    }
    return NextResponse.redirect(new URL("/reset?sent=1", req.url), 303);
  } catch (e) {
    const error =
      e instanceof AppError && ["invalid", "expired"].includes(e.message)
        ? e.message
        : "unavailable";
    return NextResponse.redirect(
      new URL(`/reset?error=${error}`, req.url),
      303,
    );
  }
}
