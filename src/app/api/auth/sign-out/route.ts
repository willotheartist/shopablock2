import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteSessionByToken, SESSION_COOKIE } from "@/lib/auth";
import { sameOrigin, failure } from "@/lib/v2/http";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const jar = await cookies();
    await deleteSessionByToken(jar.get(SESSION_COOKIE)?.value);
    const r = NextResponse.redirect(new URL("/", req.url), 303);
    r.cookies.set(SESSION_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0),
    });
    return r;
  } catch (e) {
    return failure(e);
  }
}
