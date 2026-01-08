"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

export default function BlockMediaUploader({ blockId }: { blockId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canUpload = useMemo(() => files.length > 0 && !pending, [files.length, pending]);

  async function onUpload() {
    setError(null);

    const fd = new FormData();
    for (const f of files) fd.append("media", f);

    const res = await fetch(`/api/blocks/${encodeURIComponent(blockId)}/media`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "upload_failed");
      return;
    }

    // reset input
    setFiles([]);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="grid gap-3">
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        multiple
        value=""
        onChange={(e) => {
          const list = Array.from(e.target.files ?? []);
          setFiles(list);
        }}
        className="block w-full border border-(--line) bg-transparent px-3 py-3 font-mono text-sm"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={!canUpload}
          onClick={onUpload}
          className={[
            "inline-flex items-center justify-center border px-4 py-2 font-mono text-xs uppercase tracking-[0.22em]",
            "border-(--line-strong) text-(--fg)",
            canUpload ? "hover:bg-(--accent)/[0.08]" : "opacity-50 cursor-not-allowed",
          ].join(" ")}
        >
          {pending ? "Uploading…" : "Upload"}
        </button>

        <div className="text-xs text-(--muted)">
          {files.length ? `${files.length} selected` : "Select images"}
        </div>
      </div>

      {error ? (
        <div className="text-xs border border-(--line) px-3 py-2">
          Upload error: <span className="font-mono">{error}</span>
        </div>
      ) : null}
    </div>
  );
}
