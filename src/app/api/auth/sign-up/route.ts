// src/app/api/auth/sign-up/route.ts
import { NextResponse } from "next/server";
import { createUser, setSession } from "@/lib/auth";

export const runtime = "nodejs";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!isValidEmail(email) || password.length < 8) {
    return NextResponse.redirect(new URL("/sign-up?error=invalid", req.url));
  }

  try {
    const user = await createUser(email, password);
    await setSession(user.id);
    return NextResponse.redirect(new URL("/app", req.url));
  } catch {
    return NextResponse.redirect(new URL("/sign-up?error=exists", req.url));
  }
}
