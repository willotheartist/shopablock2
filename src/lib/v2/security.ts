import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
export const tokenHash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");
export function tokenMatches(token: string, hash: string | null) {
  if (!hash || token.length > 200) return false;
  const a = Buffer.from(tokenHash(token));
  const b = Buffer.from(hash);
  return a.length === b.length && timingSafeEqual(a, b);
}
export function clientIP(req: Request) {
  return tokenHash(
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "local",
  ).slice(0, 24);
}
