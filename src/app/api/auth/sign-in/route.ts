// src/app/api/auth/sign-in/route.ts
import { NextResponse } from "next/server";
import { setSession, verifyUser } from "@/lib/auth";

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

  await setSession(user.id);
  return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/app", req.url));
}
