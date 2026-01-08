// src/app/api/auth/sign-in/route.ts
import { NextResponse } from "next/server";
import { createSession, sessionCookieOptions, verifyUser, SESSION_COOKIE } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/app");

  const user = await verifyUser(email, password);
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in?error=invalid", req.url));
  }

  const { token, expiresAt } = await createSession(user.id);

  const dest = next.startsWith("/") ? next : "/app";
  const res = NextResponse.redirect(new URL(dest, req.url));

  // ✅ In Route Handlers, set cookie on the RESPONSE
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(expiresAt));

  return res;
}
