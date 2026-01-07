import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing(.*)",
  "/demo(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

function clerkProxy(req: NextRequest) {
  // Only proxy Clerk requests
  if (!req.nextUrl.pathname.startsWith("/_clerk")) return null;

  const proxyHeaders = new Headers(req.headers);

  // Required headers for Clerk proxy mode
  const proxyUrl = process.env.NEXT_PUBLIC_CLERK_PROXY_URL || "";
  const secretKey = process.env.CLERK_SECRET_KEY || "";

  if (proxyUrl) proxyHeaders.set("Clerk-Proxy-Url", proxyUrl);
  if (secretKey) proxyHeaders.set("Clerk-Secret-Key", secretKey);

  // Use forwarded headers (middleware doesn't have req.ip in types)
  const forwardedFor =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "";
  if (forwardedFor) proxyHeaders.set("X-Forwarded-For", forwardedFor);

  // Forward to Clerk Frontend API
  const url = new URL(req.url);
  url.protocol = "https:";
  url.host = "frontend-api.clerk.services";
  url.port = "443";
  url.pathname = url.pathname.replace("/_clerk", "");

  return NextResponse.rewrite(url, { request: { headers: proxyHeaders } });
}

const clerkHandler = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) await auth.protect();
});

export default function middleware(req: NextRequest, event: any) {
  const proxyResponse = clerkProxy(req);
  if (proxyResponse) return proxyResponse;

  // clerkMiddleware in your Next/Clerk version expects (req, event)
  return (clerkHandler as any)(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico)).*)",
    "/(api|trpc|_clerk)(.*)",
  ],
};
