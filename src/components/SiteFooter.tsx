"use client";

import Link from "next/link";

type Col = {
  title: string;
  links: Array<
    | { label: string; href: string; external?: boolean }
    | { label: string; note: string; href: string; external?: boolean }
  >;
};

function cx(...v: Array<string | false | null | undefined>) {
  return v.filter(Boolean).join(" ");
}

function ExtIcon() {
  return (
    <span aria-hidden className="ml-2 inline-block translate-y-px text-[12px]">
      ↗
    </span>
  );
}

export default function SiteFooter() {
  const cols: Col[] = [
    {
      title: "Products",
      links: [
        { label: "Blocks", href: "/explore" },
        { label: "Pricing", href: "/pricing" },
        { label: "Demo", href: "/demo" },
        { label: "Dashboard", href: "/app" },
        { label: "New block", href: "/app/new" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Help", href: "/help" },
        { label: "Guides", href: "/guides" },
        { label: "Status", href: "/status" },
        { label: "Legal", href: "/legal" },
      ],
    },
    {
      title: "Partners",
      links: [
        { label: "Partner with ShopABlock", href: "/partners" },
        { label: "API documentation", href: "/docs", external: false },
        { label: "Affiliates", href: "/affiliates" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Live chat", href: "/support" },
        { label: "Email support", href: "mailto:help@shopablock.com", external: true },
        { label: "WhatsApp support", href: "https://wa.me/447000000000", external: true },
      ],
    },
    {
      title: "24/7",
      links: [
        { label: "Help desk", href: "/help" },
        { label: "+44 20 0000 0000", href: "tel:+442000000000", external: true },
        { label: "Support hours", href: "/support" },
      ],
    },
  ];

  const linkBase =
    "inline-flex items-center text-sm text-[rgb(246,245,241)]/80 hover:text-[rgb(246,245,241)] transition-colors";

  return (
    <footer className="border-t border-black bg-[#0b0b0b] text-[rgb(246,245,241)]">
      <div className="px-6 pt-18 pb-10 md:pt-22">
        <div className="max-w-350 mx-auto">
          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            {cols.map((c) => (
              <div key={c.title}>
                <div className="text-[11px] uppercase tracking-[0.18em] text-[rgb(246,245,241)]/55">
                  {c.title}
                </div>

                <ul className="mt-5 space-y-3">
                  {c.links.map((l) => {
                    const isObj = "href" in l;
                    if (!isObj) return null;

                    const external = "external" in l ? l.external : false;

                    return (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className={linkBase}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noreferrer" : undefined}
                        >
                          {l.label}
                          {external ? <ExtIcon /> : null}
                          {"note" in l ? (
                            <span className="ml-3 rounded-full border border-[rgb(246,245,241)]/25 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[rgb(246,245,241)]/70">
                              {l.note}
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="mt-14 border-t border-[rgb(246,245,241)]/12" />

          {/* Legal paragraph (Teya-esque) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-9 text-sm leading-relaxed text-[rgb(246,245,241)]/55">
              © {new Date().getFullYear()} ShopABlock Ltd. ShopABlock is a registered company.
              Payments are processed via our payment partners (e.g. Stripe Express via KompiPay,
              where applicable). This footer copy is placeholder and should be replaced with your
              final legal wording.
            </div>

            <div className="md:col-span-3 flex md:justify-end">
              {/* Country / language selector (static placeholder) */}
              <button
                type="button"
                className={cx(
                  "w-full md:w-auto",
                  "inline-flex items-center justify-between gap-3",
                  "rounded-full",
                  "border border-[rgb(246,245,241)]/22",
                  "px-4 py-3",
                  "text-xs uppercase tracking-[0.18em]",
                  "text-[rgb(246,245,241)]/80 hover:text-[rgb(246,245,241)]",
                  "transition-colors"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <span aria-hidden>🌐</span>
                  United Kingdom (English)
                </span>
                <span aria-hidden>▾</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-12 border-t border-[rgb(246,245,241)]/12" />

          {/* Bottom row links */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-[rgb(246,245,241)]/45">
              ShopABlock
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              {[
                { label: "Responsible Disclosure", href: "/security" },
                { label: "Privacy", href: "/privacy" },
                { label: "Cookie Settings", href: "/cookies" },
                { label: "Terms", href: "/terms" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[rgb(246,245,241)]/65 hover:text-[rgb(246,245,241)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
