import Link from "next/link";
import ProductView from "@/components/v2/ProductView";
import { mugDraft } from "@/lib/v2/product";
export const metadata = { title: "A little shop, in action" };
export default async function Demo({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const d =
    product === "1"
      ? {
          ...mugDraft,
          title: "Off the grid",
          brandName: "Weekend Editions",
          price: "18",
          options: "A3",
          description:
            "A little space to think. An original geometric art print in forest green and chartreuse. A bold study in finding your own way, ready to bring a fresh perspective to your wall.",
          media: [{ url: "/images/print.svg" }],
        }
      : product === "2"
        ? {
            ...mugDraft,
            title: "A little more organised",
            brandName: "The Daily Practice",
            price: "12",
            deliveryType: "digital" as const,
            options: "",
            description:
              "Less busy. More intentional. A printable daily planner that gives your ideas, priorities and small wins a little room to breathe. Start whenever you are ready.",
            media: [{ url: "/images/planner.svg" }],
          }
        : mugDraft;
  return (
    <main id="main">
      <div className="demo-banner">
        A little look at what you can create. This is an example shop.
        <Link href="/create">Make yours ↗</Link>
      </div>
      <ProductView draft={d} mode="demo" />
    </main>
  );
}
