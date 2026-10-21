import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    throw new AppError("This request could not be verified.", 403);
}
export async function requireUser() {
  const u = await getSessionUser();
  if (!u) throw new AppError("Sign in to continue.", 401);
  return u;
}
export function failure(e: unknown) {
  if (e instanceof AppError)
    return NextResponse.json({ error: e.message }, { status: e.status });
  console.error(
    "ShopaBlock request failed",
    e instanceof Error ? e.name : "Unknown",
  );
  return NextResponse.json(
    { error: "Something went wrong. Please try again." },
    { status: 500 },
  );
}
export function safeNext(v: unknown) {
  const s = typeof v === "string" ? v : "/app";
  return /^\/(?!\/)/.test(s) && !s.includes("\\") ? s : "/app";
}
