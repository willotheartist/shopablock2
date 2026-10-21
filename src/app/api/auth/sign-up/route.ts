import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  createUser,
  createSession,
  sessionCookieOptions,
  SESSION_COOKIE,
} from "@/lib/auth";
import { sameOrigin, safeNext, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
import { clientIP } from "@/lib/v2/security";
export async function POST(req: Request) {
  let next = "/app";
  try {
    sameOrigin(req);
    const f = await req.formData();
    next = safeNext(f.get("next"));
    await rateLimit(`signup:${clientIP(req)}`, 5, 3600);
    const email = String(f.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(f.get("password") || "");
    if (
      !z.email().max(254).safeParse(email).success ||
      password.length < 10 ||
      Buffer.byteLength(password) > 72
    )
      throw new AppError("invalid");
    const user = await createUser(email, password);
    const { token, expiresAt } = await createSession(user.id);
    const r = NextResponse.redirect(new URL(next, req.url), 303);
    r.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    return r;
  } catch (e) {
    const code =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
        ? "exists"
        : e instanceof AppError
          ? e.status === 429
            ? "limited"
            : e.message === "invalid"
              ? "invalid"
              : "unavailable"
          : "unavailable";
    return NextResponse.redirect(
      new URL(
        `/sign-up?error=${code}&next=${encodeURIComponent(next)}`,
        req.url,
      ),
      303,
    );
  }
}
