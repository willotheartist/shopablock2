// src/app/api/auth/reset/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: Request) {
  const enabled = process.env.NODE_ENV !== "production";
  if (!enabled) {
    return NextResponse.redirect(new URL("/reset?error=forbidden", req.url));
  }

  const form = await req.formData();
  const email = normalizeEmail(String(form.get("email") ?? ""));
  const password = String(form.get("password") ?? "");

  if (!email || password.length < 8) {
    return NextResponse.redirect(new URL("/reset?error=missing", req.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL("/reset?error=notfound", req.url));
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return NextResponse.redirect(new URL("/reset?ok=1", req.url));
}
