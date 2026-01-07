// src/lib/auth.ts
import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";

const SESSION_COOKIE = "sb_session";
const SESSION_TTL_DAYS = 30;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function sha256Hex(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

function base64url(buf: Buffer) {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function addDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export async function createUser(email: string, password: string) {
  const e = normalizeEmail(email);
  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.user.create({
    data: { email: e, passwordHash },
  });
}

export async function verifyUser(email: string, password: string) {
  const e = normalizeEmail(email);
  const user = await prisma.user.findUnique({ where: { email: e } });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function setSession(userId: string) {
  const token = base64url(randomBytes(32));
  const tokenHash = sha256Hex(token);
  const expiresAt = addDays(SESSION_TTL_DAYS);

  await prisma.session.create({
    data: { tokenHash, userId, expiresAt },
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    const tokenHash = sha256Hex(token);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }

  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getSessionUser() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = sha256Hex(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt.getTime() <= Date.now()) {
    await prisma.session.deleteMany({ where: { tokenHash } });
    return null;
  }

  return session.user;
}
