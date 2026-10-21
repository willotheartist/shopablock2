import { NextResponse } from "next/server";
import {
  createSession,
  sessionCookieOptions,
  verifyUser,
  SESSION_COOKIE,
} from "@/lib/auth";
import { sameOrigin, safeNext, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
import { clientIP, tokenHash } from "@/lib/v2/security";
export async function POST(req: Request) {
  let next = "/app";
  try {
    sameOrigin(req);
    const f = await req.formData();
    next = safeNext(f.get("next"));
    const email = String(f.get("email") || "")
      .trim()
      .toLowerCase();
    const password = String(f.get("password") || "");
    await rateLimit(`signin-ip:${clientIP(req)}`, 30, 900);
    await rateLimit(`signin-email:${tokenHash(email)}`, 10, 900);
    if (email.length > 254 || Buffer.byteLength(password) > 72)
      throw new AppError("invalid");
    const user = await verifyUser(email, password);
    if (!user) throw new AppError("invalid");
    const { token, expiresAt } = await createSession(user.id);
    const r = NextResponse.redirect(new URL(next, req.url), 303);
    r.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));
    return r;
  } catch (e) {
    const code =
      e instanceof AppError
        ? e.status === 429
          ? "limited"
          : e.message === "invalid"
            ? "invalid"
            : "unavailable"
        : "unavailable";
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${code}&next=${encodeURIComponent(next)}`,
        req.url,
      ),
      303,
    );
  }
}
