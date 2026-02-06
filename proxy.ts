//·proxy.ts
import { NextResponse, type NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Touch req so eslint doesn't flag it as unused.
  // This keeps behavior identical: always allow the request through.
  void req;
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
