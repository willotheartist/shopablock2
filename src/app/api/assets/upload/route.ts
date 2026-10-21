import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireUser, sameOrigin, failure, AppError } from "@/lib/v2/http";
import { rateLimit } from "@/lib/v2/rate-limit";
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as HandleUploadBody;
    const result = await handleUpload({
      request: req,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        sameOrigin(req);
        const u = await requireUser();
        await rateLimit(`upload:${u.id}`, 40, 3600);
        const kind = clientPayload === "digital" ? "digital" : "image";
        if (
          !pathname.startsWith(`${u.id}/`) ||
          pathname.includes("..") ||
          pathname.length > 240
        )
          throw new AppError("Invalid file name.");
        return {
          allowedContentTypes:
            kind === "image"
              ? ["image/jpeg", "image/png", "image/webp"]
              : [
                  "application/pdf",
                  "application/zip",
                  "application/x-zip-compressed",
                  "text/plain",
                  "text/csv",
                  "audio/mpeg",
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ],
          maximumSizeInBytes:
            kind === "image" ? 5 * 1024 * 1024 : 50 * 1024 * 1024,
          addRandomSuffix: true,
          allowOverwrite: false,
          validUntil: Date.now() + 10 * 60 * 1000,
          tokenPayload: JSON.stringify({ ownerId: u.id, kind }),
        };
      },
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (e) {
    return failure(e);
  }
}
