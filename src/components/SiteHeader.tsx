import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="w-full border-b border-black">
      <div className="grid grid-cols-2 md:grid-cols-4 items-center px-6 py-4">
        <div className="col-span-1">
          <Link href="/" className="text-base font-medium tracking-wide uppercase">
            ShopABlock
          </Link>
        </div>

        <nav className="col-span-1 hidden md:flex justify-center gap-10 text-sm uppercase tracking-wider">
          <Link href="/explore">Explore</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/app">Dashboard</Link>
        </nav>

        <div className="col-span-1 md:col-span-2 flex justify-end">
          <Link
            href="/app/new"
            className="text-sm uppercase tracking-wider underline underline-offset-4"
          >
            Create Block
          </Link>
        </div>
      </div>
    </header>
  );
}
