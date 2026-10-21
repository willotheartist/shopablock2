import Link from "next/link";
export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="brand" aria-label="ShopaBlock home">
      <svg viewBox="0 0 32 36" fill="none" aria-hidden="true">
        <path
          d="M16 1 31 9.5v17L16 35 1 26.5v-17L16 1Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="m1 9.5 15 8.7 15-8.7M16 18v17"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M16 18 1 9.5v17L16 35V18Z" fill="currentColor" />
      </svg>
      {!compact && (
        <span>
          shopablock<span className="brand-period">.</span>
        </span>
      )}
    </Link>
  );
}
