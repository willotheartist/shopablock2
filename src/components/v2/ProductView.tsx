"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  ImagePlus,
  Package,
  ShieldCheck,
} from "lucide-react";
import {
  type Draft,
  money,
  minorUnits,
  productOptions,
} from "@/lib/v2/product";
import Brand from "./Brand";
export default function ProductView({
  draft,
  mode = "preview",
  blockId,
  available = true,
  soldOut = false,
}: {
  draft: Draft;
  mode?: "preview" | "demo" | "live";
  blockId?: string;
  available?: boolean;
  soldOut?: boolean;
}) {
  const [photo, setPhoto] = useState(0);
  const [option, setOption] = useState("");
  const [note, setNote] = useState("");
  const options = productOptions(draft);
  const selected = options.includes(option) ? option : options[0] || "";
  const image = draft.media[Math.min(photo, draft.media.length - 1)];
  const price = minorUnits(draft.price) || 0;
  return (
    <div className="product-shell">
      <div className="shop-heading">
        <span className="shop-wordmark">
          {draft.brandName || "YOUR LITTLE SHOP"}
        </span>
        <span>ONE GOOD THING.</span>
      </div>
      <div className="product-layout">
        <div>
          <div className="product-main-photo">
            {image ? (
              <img src={image.url} alt={draft.title || "Your product"} />
            ) : (
              <div className="photo-empty">
                <ImagePlus size={35} />
                <span>Your product, front and centre.</span>
              </div>
            )}
          </div>
          {draft.media.length > 1 && (
            <div className="product-thumbs">
              {draft.media.map((m, i) => (
                <button
                  key={m.url}
                  className={i === photo ? "active" : ""}
                  onClick={() => setPhoto(i)}
                  aria-label={`View photo ${i + 1}`}
                  aria-pressed={i === photo}
                >
                  <img src={m.url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <div className="eyebrow">
            <span className="blue-dot" />
            {soldOut
              ? "CURRENTLY SOLD OUT"
              : draft.deliveryType === "digital"
                ? "A LITTLE SOMETHING TO DOWNLOAD"
                : "MADE FOR YOUR EVERYDAY"}
          </div>
          <h1>{draft.title || "Your good thing goes here."}</h1>
          <div className="product-price">{price ? money(price) : "£—"}</div>
          <p className="product-description">
            {draft.description ||
              "Tell the story of your product. What makes it special, who it’s for, and the little details that matter."}
          </p>
          {options.length > 0 && (
            <>
              <label>Choose an option</label>
              <div className="option-group">
                {options.map((o) => (
                  <button
                    key={o}
                    className={o === selected ? "active" : ""}
                    onClick={() => setOption(o)}
                    aria-pressed={o === selected}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </>
          )}
          {mode === "live" && available && !soldOut ? (
            <Link
              href={`/checkout/${blockId}?option=${encodeURIComponent(selected)}`}
              className="btn btn-dark product-buy"
            >
              {draft.deliveryType === "digital"
                ? "Get the download"
                : "Make it yours"}{" "}
              <ArrowUpRight size={19} />
            </Link>
          ) : (
            <button
              disabled={mode === "live"}
              className="btn btn-dark product-buy"
              onClick={() =>
                setNote(
                  mode === "demo"
                    ? "This is an example shop. Create your own to start selling."
                    : "This is your live preview. Publish your shop to accept orders.",
                )
              }
            >
              {mode === "live"
                ? soldOut
                  ? "Sold out"
                  : "Coming soon"
                : draft.deliveryType === "digital"
                  ? "Get the download"
                  : "Make it yours"}{" "}
              <ArrowUpRight size={19} />
            </button>
          )}
          {note && (
            <div className="notice" role="status">
              {note}
              {mode === "demo" && (
                <>
                  {" "}
                  <Link href="/create">Create your shop</Link>
                </>
              )}
            </div>
          )}
          <div className="delivery-info">
            {draft.deliveryType === "digital" ? (
              <Download size={16} />
            ) : (
              <Package size={16} />
            )}
            <div>
              {draft.deliveryType === "digital"
                ? "Download your file from the order confirmation page after payment."
                : draft.deliveryNote ||
                  "Your delivery details will appear here."}
              {draft.deliveryType === "physical" &&
                draft.shippingPrice !== "" && (
                  <p>
                    {(minorUnits(draft.shippingPrice) || 0) === 0
                      ? "Free delivery"
                      : `${money(minorUnits(draft.shippingPrice) || 0)} delivery`}
                  </p>
                )}
            </div>
          </div>
          <div className="product-assurance">
            <ShieldCheck size={14} />
            {mode === "live" && available
              ? "Secure payment through Stripe"
              : "A simple, considered little shop."}
          </div>
        </div>
      </div>
      <div className="shop-powered">
        A little shop, powered by <Brand />
      </div>
    </div>
  );
}
