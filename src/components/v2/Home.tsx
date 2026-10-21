"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Plus,
  Minus,
  Sparkles,
  Package,
  Download,
  Link2,
  MousePointer2,
  ImagePlus,
  ShieldCheck,
} from "lucide-react";
const examples = [
  {
    name: "The everyday mug",
    brand: "FORM STUDIO",
    price: "£24",
    kind: "Something you made",
    image: "/images/mug.webp",
    className: "mug-example",
  },
  {
    name: "Off the grid",
    brand: "WEEKEND EDITIONS",
    price: "£18",
    kind: "Something you designed",
    image: "/images/print.svg",
    className: "print-example",
  },
  {
    name: "A little more organised",
    brand: "THE DAILY PRACTICE",
    price: "£12",
    kind: "Something you know",
    image: "/images/planner.svg",
    className: "planner-example",
  },
];
const faqs = [
  [
    "What can I sell?",
    "Physical products and digital downloads. A print, a small batch of ceramics, a guide, a template or your next limited release. Each page focuses on one product, with options such as size or colour.",
  ],
  [
    "Do I need a website?",
    "No. Your product gets its own page and shareable link. Put it in your bio, send it in a message or add it to your newsletter.",
  ],
  [
    "How does the AI help?",
    "Tell the assistant about your product and it can propose copy, product details and launch materials. Review changes before applying them. You can also create and edit everything yourself.",
  ],
  [
    "How do I get paid?",
    "Connect payments from your dashboard. Payment onboarding is provided through KompiPay and Stripe. You need to finish verification before accepting orders; payout timing depends on your payment account.",
  ],
  [
    "Can I try it before signing up?",
    "Yes. Open the builder and create a local draft. Create an account when you are ready to save it, upload files or use AI assistance.",
  ],
];
export default function Home() {
  const [selected, setSelected] = useState(0);
  const [faq, setFaq] = useState<number | null>(0);
  const e = examples[selected];
  return (
    <main id="main" className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="blue-dot" /> FOR THE THING YOU WANT TO SELL
          </div>
          <h1>
            Your one thing.
            <br />
            <span className="muted-heading">Ready to sell.</span>
          </h1>
          <p>
            A beautiful little shop for your next big idea.
            <br className="desktop-only" /> Add your product. Make it yours.
            Share it with the world.
          </p>
          <div className="hero-ctas">
            <Link href="/create" className="btn btn-dark">
              Create your shop <ArrowUpRight size={19} />
            </Link>
            <Link href="/demo" className="text-link">
              Take a look around <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-note">
            <Check size={15} /> Try the builder before you sign up
          </div>
          <div className="hero-bottom-note">
            <span>01 /</span> A shop that starts with you.
          </div>
        </div>
        <div className="hero-stage">
          <div className="stage-grid" />
          <div className="floating-label top-label">
            <span className="blue-dot" /> YOUR IDEA, OPEN FOR BUSINESS
          </div>
          <div className="hero-shop" key={selected}>
            <div className="mini-shop-top">
              <span className="mini-brand">{e.brand}</span>
              <span>01 — THE COLLECTION</span>
            </div>
            <div className={`hero-product-image ${e.className}`}>
              <img src={e.image} alt={e.name} />
              <span className="edition-label">THE EVERYDAY EDIT</span>
            </div>
            <div className="hero-product-details">
              <div>
                <h2>{e.name}</h2>
                <p>Made to become your new favourite.</p>
              </div>
              <strong>{e.price}</strong>
            </div>
            <Link href={`/demo?product=${selected}`} className="sample-buy">
              Make it yours <ArrowUpRight size={17} />
            </Link>
            <div className="sample-delivery">
              <Package size={13} />{" "}
              {selected === 2
                ? "Instant digital download"
                : "Thoughtfully made. Carefully delivered."}
            </div>
          </div>
          <div className="floating-label assistant-label">
            <span className="assistant-icon">
              <Sparkles size={18} />
            </span>
            <div>
              <b>A little help goes a long way.</b>
              <span>Your assistant helps with the details.</span>
            </div>
          </div>
          <div className="stage-tabs" aria-label="Example products">
            {examples.map((x, i) => (
              <button
                key={x.name}
                className={selected === i ? "active" : ""}
                onClick={() => setSelected(i)}
                aria-pressed={selected === i}
              >
                {i === 0 ? (
                  <Package size={14} />
                ) : i === 1 ? (
                  <ImagePlus size={14} />
                ) : (
                  <Download size={14} />
                )}{" "}
                {["The maker", "The artist", "The creator"][i]}
              </button>
            ))}
          </div>
          <span className="example-caption">Illustrative shop examples</span>
        </div>
      </section>
      <div className="principle-strip">
        <span>ONE PRODUCT.</span>
        <span>YOUR OWN PAGE.</span>
        <span>PAYMENTS BUILT IN.</span>
        <span>A LINK TO ANYWHERE.</span>
        <span className="strip-signature">That’s your shop. ↗</span>
      </div>
      <section className="examples-section wrap">
        <div className="section-intro">
          <div>
            <span className="eyebrow">A SMALL START CAN BE A BIG THING</span>
            <h2>
              You made it.
              <br />
              Let’s make it happen.
            </h2>
          </div>
          <p>
            A first edition. A weekend project. Something you’ve been meaning to
            put out there.
            <br />
            Give it a place of its own.
          </p>
        </div>
        <div className="examples-grid">
          {examples.map((x, i) => (
            <Link
              href={`/demo?product=${i}`}
              className={`example-card example-${i}`}
              key={x.name}
            >
              <div className="example-photo">
                <img src={x.image} alt={x.name} loading="lazy" />
                <span className="round-arrow">
                  <ArrowUpRight size={21} />
                </span>
              </div>
              <div className="example-card-caption">
                <div>
                  <p>{x.kind}</p>
                  <h3>{x.name}</h3>
                </div>
                <span>{x.price}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="small-note">
          Example products, made to show what’s possible.
        </p>
      </section>
      <section className="how-section" id="how-it-works">
        <div className="wrap">
          <div className="section-intro">
            <div>
              <span className="eyebrow">FROM “WHAT IF” TO “IT’S LIVE”</span>
              <h2>
                A few small steps.
                <br />
                Something real.
              </h2>
            </div>
            <Link href="/create" className="text-link">
              Try it for yourself <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="steps-grid">
            <article>
              <div className="step-visual upload-visual">
                <div className="upload-tile">
                  <ImagePlus size={28} />
                  <span>Drop your good idea here</span>
                  <small>Photos, files & a few words</small>
                </div>
                <div className="tiny-file">
                  <img src="/images/mug.webp" alt="" /> everyday-mug.jpg{" "}
                  <Check size={14} />
                </div>
              </div>
              <span className="step-number">01 / ADD YOUR THING</span>
              <h3>Start with what you have.</h3>
              <p>
                A photo, a file, a few words. Your shop starts taking shape
                straight away.
              </p>
            </article>
            <article>
              <div className="step-visual edit-visual">
                <div className="edit-card">
                  <span>Product description</span>
                  <p>A little ritual, made better.</p>
                  <div />
                  <div />
                  <Link href="/create">
                    <Sparkles size={14} /> Help me write this
                  </Link>
                </div>
                <MousePointer2 className="cursor-icon" size={28} />
              </div>
              <span className="step-number">02 / MAKE IT YOURS</span>
              <h3>A little polish. All you.</h3>
              <p>
                Edit your page live, or ask your assistant for a hand. You have
                the final say.
              </p>
            </article>
            <article>
              <div className="step-visual share-visual">
                <div className="share-link">
                  <Link2 size={20} />
                  <span>shopablock.co/your-thing</span>
                  <ArrowUpRight size={18} />
                </div>
                <div className="share-tags">
                  <span>Your bio</span>
                  <span>A message</span>
                  <span>Your people</span>
                </div>
              </div>
              <span className="step-number">03 / PUT IT OUT THERE</span>
              <h3>One link. Open for business.</h3>
              <p>
                Connect payments, check the details and publish. Share your shop
                wherever your people are.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="assistant-section wrap">
        <div className="assistant-demo">
          <div className="assistant-demo-head">
            <span className="assistant-icon">
              <Sparkles size={19} />
            </span>
            <div>
              <strong>Your shop assistant</strong>
              <span>Good at the little details.</span>
            </div>
            <span className="demo-pill">EXAMPLE</span>
          </div>
          <div className="demo-message">
            I’ve made 30 mugs. They’re £24 each, with UK delivery. Help me get
            them ready to sell.
          </div>
          <div className="demo-reply">
            <Sparkles size={18} />
            <div>
              <p>Let’s give them a good home.</p>
              <ul>
                <li>
                  <Check /> Product page drafted
                </li>
                <li>
                  <Check /> Price and quantity added
                </li>
                <li>
                  <Check /> Description ready for your review
                </li>
              </ul>
              <div className="assistant-question">
                What should we charge for delivery?
              </div>
            </div>
          </div>
          <div className="demo-review">
            <span>You’re in control of every change.</span>
            <Link href="/create">
              Open builder <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="assistant-copy">
          <span className="eyebrow">A HELPING HAND, BUILT IN</span>
          <h2>
            Your idea.
            <br />A little less admin.
          </h2>
          <p>
            Get help writing your page, checking the details and preparing your
            launch. Your assistant works with the product you’re actually
            selling.
          </p>
          <div className="assistant-benefits">
            <div>
              <Sparkles size={19} />
              <span>Turn a short brief into a product draft</span>
            </div>
            <div>
              <ShieldCheck size={19} />
              <span>Catch the details before you go live</span>
            </div>
            <div>
              <Check size={19} />
              <span>Review, edit and approve every change</span>
            </div>
          </div>
          <Link href="/create" className="btn btn-dark">
            Meet your new shop <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="faq-section wrap">
        <div>
          <span className="eyebrow">THE LITTLE THINGS</span>
          <h2>
            Good questions.
            <br />
            Simple answers.
          </h2>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <article key={q}>
              <button
                onClick={() => setFaq(faq === i ? null : i)}
                aria-expanded={faq === i}
              >
                {q}
                {faq === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {faq === i && <p>{a}</p>}
            </article>
          ))}
        </div>
      </section>
      <section className="final-cta">
        <span className="eyebrow">YOUR NEXT CHAPTER STARTS SMALL</span>
        <h2>
          One good thing.
          <br />A world of possibility.
        </h2>
        <Link href="/create" className="btn btn-light">
          Let’s put it out there <ArrowUpRight size={20} />
        </Link>
        <span className="cta-cube" aria-hidden="true">
          ↗
        </span>
      </section>
    </main>
  );
}
