import { z } from "zod";

export const draftSchema = z.object({
  title: z.string().max(140),
  description: z.string().max(6000),
  handle: z.string().max(64),
  brandName: z.string().max(80),
  price: z.string().max(20),
  quantity: z.string().max(10),
  deliveryType: z.enum(["physical", "digital"]),
  shippingPrice: z.string().max(20),
  deliveryNote: z.string().max(600),
  options: z.string().max(500),
  digitalAssetId: z.string().nullable(),
  media: z
    .array(
      z.object({
        url: z.string().max(500),
        id: z.string().optional(),
        name: z.string().optional(),
      }),
    )
    .max(8),
});
export type Draft = z.infer<typeof draftSchema>;
export const emptyDraft: Draft = {
  title: "",
  description: "",
  handle: "",
  brandName: "",
  price: "",
  quantity: "",
  deliveryType: "physical",
  shippingPrice: "",
  deliveryNote: "",
  options: "",
  digitalAssetId: null,
  media: [],
};
export const mugDraft: Draft = {
  ...emptyDraft,
  title: "The everyday mug",
  description:
    "A little ritual, made better. A hand-finished ceramic mug with a generous rounded handle and a deep cobalt glaze. Made for slow mornings and your favourite coffee.",
  brandName: "Form Studio",
  handle: "the-everyday-mug",
  price: "24",
  quantity: "30",
  shippingPrice: "3.50",
  deliveryNote: "UK delivery in 3–5 working days.",
  options: "Cobalt blue, Chalk white",
  media: [{ url: "/images/mug.webp", name: "Cobalt ceramic mug" }],
};
export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 64);
}
export function minorUnits(value: string): number | null {
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(value.trim())) return null;
  const [whole, decimal = ""] = value.trim().split(".");
  return Number(whole) * 100 + Number(decimal.padEnd(2, "0"));
}
export function money(value: number, currency = "GBP") {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: value % 100 ? 2 : 0,
  }).format(value / 100);
}
export function productOptions(d: Draft) {
  return [
    ...new Set(
      d.options
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  ].slice(0, 20);
}
export function launchChecks(d: Draft, payouts = false) {
  return [
    { key: "title", label: "Product name", ok: d.title.trim().length > 1 },
    {
      key: "description",
      label: "Product description",
      ok: d.description.trim().length >= 20,
    },
    {
      key: "media",
      label: "At least one product photo",
      ok: d.media.length > 0,
    },
    {
      key: "price",
      label: "A valid price",
      ok: (minorUnits(d.price) ?? 0) >= 50,
    },
    {
      key: "quantity",
      label: "Available quantity",
      ok:
        d.quantity === "" ||
        (/^\d+$/.test(d.quantity) &&
          Number(d.quantity) > 0 &&
          Number(d.quantity) <= 1000000),
    },
    {
      key: "delivery",
      label:
        d.deliveryType === "digital"
          ? "Download file attached"
          : "Delivery cost and timeframe",
      ok:
        d.deliveryType === "digital"
          ? !!d.digitalAssetId
          : minorUnits(d.shippingPrice) !== null &&
            d.deliveryNote.trim().length > 3,
    },
    { key: "payments", label: "Payments connected", ok: payouts },
  ];
}
export const reservedHandles = new Set([
  "app",
  "api",
  "create",
  "demo",
  "explore",
  "pricing",
  "help",
  "privacy",
  "terms",
  "sign-in",
  "sign-up",
  "reset",
  "receipt",
  "checkout",
  "favicon.ico",
]);
