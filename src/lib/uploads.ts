import "server-only";
import path from "path";
import fs from "fs/promises";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function safeBaseName(name: string) {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.slice(0, 80) || "image";
}

function extFromType(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "";
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

export async function saveBlockImages(opts: {
  blockId: string;
  files: File[];
}) {
  const { blockId, files } = opts;

  const outDir = path.join(process.cwd(), "public", "uploads", blockId);
  await ensureDir(outDir);

  const saved: Array<{ url: string; originalName: string }> = [];

  for (const f of files) {
    if (!f || typeof f.arrayBuffer !== "function") continue;

    const type = String((f as any).type ?? "");
    if (!ALLOWED.has(type)) continue;

    const size = Number((f as any).size ?? 0);
    if (!Number.isFinite(size) || size <= 0 || size > MAX_FILE_BYTES) continue;

    const originalName = String((f as any).name ?? "image");
    const base = safeBaseName(originalName.replace(/\.[^/.]+$/, ""));
    const ext = extFromType(type) || "bin";

    // unique filename
    const stamp = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    const filename = `${base}-${stamp}-${rand}.${ext}`;

    const abs = path.join(outDir, filename);
    const buf = Buffer.from(await f.arrayBuffer());
    await fs.writeFile(abs, buf);

    saved.push({
      url: `/uploads/${blockId}/${filename}`,
      originalName,
    });
  }

  return saved;
}
