// src/lib/auth.ts
import "server-only";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "crypto";

export const SESSION_COOKIE = "sb_session";
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

export function sessionCookieOptions(expires: Date) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
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

/**
 * ✅ Create a DB session and return the *raw* token (to be set as cookie on the response).
 * IMPORTANT: Route Handlers must set cookies via NextResponse.cookies.set(),
 * not via cookies().set() inside here.
 */
export async function createSession(userId: string) {
  const token = base64url(randomBytes(32));
  const tokenHash = sha256Hex(token);
  const expiresAt = addDays(SESSION_TTL_DAYS);

  await prisma.session.create({
    data: { tokenHash, userId, expiresAt },
  });

  return { token, expiresAt };
}

/**
 * ✅ Delete session (if exists) by raw token.
 */
export async function deleteSessionByToken(token: string | undefined | null) {
  if (!token) return;
  const tokenHash = sha256Hex(token);
  await prisma.session.deleteMany({ where: { tokenHash } });
}

/**
 * Server components / actions can still read cookies normally.
 */
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
