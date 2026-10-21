import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  Plus,
  ShoppingBag,
  Wallet,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { requirePageUser } from "@/lib/v2/session";
import { money } from "@/lib/v2/product";
export const metadata = { title: "Your shop" };
export default async function Dashboard() {
  const u = await requirePageUser();
  const [products, sales, awaiting, recent] = await Promise.all([
    prisma.block.findMany({
      where: { ownerId: u.id, archivedAt: null },
      include: { media: { take: 1, orderBy: { sort: "asc" } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.order.aggregate({
      where: { sellerId: u.id, status: { in: ["paid", "fulfilled"] } },
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.order.count({
      where: {
        sellerId: u.id,
        status: "paid",
        block: { deliveryType: "physical" },
      },
    }),
    prisma.order.findMany({
      where: { sellerId: u.id, status: { in: ["paid", "fulfilled"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        productTitle: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);
  return (
    <main id="main">
      <div className="workspace-top">
        <div>
          <span className="eyebrow">A LITTLE SHOP. ALL YOURS.</span>
          <h1>
            {u.displayName
              ? `Hello, ${u.displayName.split(" ")[0]}.`
              : "Welcome to your shop."}
          </h1>
          <p>Good things start with a little progress.</p>
        </div>
        <Link href="/create" className="btn btn-dark btn-sm">
          <Plus size={16} /> New product
        </Link>
      </div>
      <div className="stats-grid">
        <div className="stat">
          <span>
            Sales <Wallet size={15} />
          </span>
          <strong>{money(sales._sum.amount || 0)}</strong>
          <small>Gross paid orders, including delivery</small>
        </div>
        <div className="stat">
          <span>
            Orders <ShoppingBag size={15} />
          </span>
          <strong>{sales._count._all}</strong>
          <small>Paid and fulfilled orders</small>
        </div>
        <div className="stat">
          <span>
            To send <Package size={15} />
          </span>
          <strong>{awaiting}</strong>
          <small>Physical orders awaiting fulfilment</small>
        </div>
      </div>
      {u.payoutsStatus !== "active" && (
        <div className="attention-card">
          <Wallet size={23} />
          <div>
            <h2>A home for your earnings.</h2>
            <p>Connect payments before you publish your first product.</p>
          </div>
          <Link href="/app/settings" className="btn btn-outline btn-sm">
            Set up payments <ArrowUpRight size={14} />
          </Link>
        </div>
      )}
      <div className="panel-heading">
        <div>
          <h2>Your good things</h2>
          <p>
            {products.length
              ? `${products.length} ${products.length === 1 ? "product" : "products"} in your little corner of the internet.`
              : "Your next chapter starts here."}
          </p>
        </div>
        <Link href="/app/assistant" className="text-link">
          <Sparkles size={14} /> Need a hand?
        </Link>
      </div>
      {products.length ? (
        <div className="product-list">
          {products.map((b) => (
            <Link
              href={`/app/blocks/${b.id}`}
              key={b.id}
              className="dashboard-product"
            >
              <div className="dashboard-product-photo">
                {b.media[0] ? (
                  <img src={b.media[0].url} alt={b.title} />
                ) : (
                  <Package size={38} />
                )}
                <span className={`status ${b.status}`}>
                  {b.status.replace("_", " ")}
                </span>
              </div>
              <div className="dashboard-product-info">
                <h3>{b.title}</h3>
                <div>
                  <span>{money(b.price, b.currency)}</span>
                  <span>{b.soldCount} sold</span>
                </div>
                <p>
                  {b.deliveryType === "digital"
                    ? "DIGITAL DOWNLOAD"
                    : "PHYSICAL PRODUCT"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Package size={38} />
          <h2>What’s your one thing?</h2>
          <p>
            A product, a print, a file. Give it a beautiful little place of its
            own.
          </p>
          <Link href="/create" className="btn btn-dark">
            Create your first product <ArrowUpRight size={17} />
          </Link>
        </div>
      )}
      <section className="panel">
        <div className="panel-heading">
          <h2>Fresh from your shop</h2>
          <Link href="/app/orders" className="text-link">
            All orders <ArrowUpRight size={15} />
          </Link>
        </div>
        {recent.length ? (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link href={`/app/orders/${o.id}`}>
                        {o.productTitle || "Order"} ↗
                      </Link>
                    </td>
                    <td>
                      {o.createdAt.toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </td>
                    <td>{money(o.amount, o.currency)}</td>
                    <td>
                      <span className={`status ${o.status}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted" style={{ fontSize: 12 }}>
            Your first order will feel pretty good. It’ll appear right here.
          </p>
        )}
      </section>
    </main>
  );
}
