import Link from "next/link";
import { prisma } from "@/lib/db";
import { money } from "@/lib/v2/product";
export const dynamic = "force-dynamic";
export const metadata = { title: "Discover little shops" };
export default async function Explore() {
  const products = await prisma.block.findMany({
    where: { status: "active", archivedAt: null },
    take: 60,
    orderBy: { createdAt: "desc" },
    include: { media: { take: 1, orderBy: { sort: "asc" } } },
  });
  return (
    <main
      id="main"
      className="wrap"
      style={{ paddingTop: 60, paddingBottom: 80 }}
    >
      <div className="section-intro">
        <div>
          <span className="eyebrow">LITTLE SHOPS. GOOD THINGS.</span>
          <h2>
            Made by someone.
            <br />
            Found by you.
          </h2>
        </div>
      </div>
      {products.length ? (
        <div className="examples-grid">
          {products.map((b) => (
            <Link href={`/${b.handle}`} key={b.id} className="example-card">
              <div className="example-photo">
                {b.media[0] && <img src={b.media[0].url} alt={b.title} />}
              </div>
              <div className="example-card-caption">
                <div>
                  <p>{b.brandName}</p>
                  <h3>{b.title}</h3>
                </div>
                <span>{money(b.price, b.currency)}</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>A good thing is coming.</h2>
          <p>
            The first shops are taking shape. See what yours could look like.
          </p>
          <Link href="/demo" className="btn btn-dark">
            Explore an example shop ↗
          </Link>
        </div>
      )}
    </main>
  );
}
