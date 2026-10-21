"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Globe2,
  Link2,
  Minus,
  Package,
  Pause,
  Play,
  Plus,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import BlockSculpture from "./BlockSculpture";

const stages = [
  {
    title: "Start with your thing.",
    body: "A print. A small batch. Something you know. Add your product, a price and the details that make it yours.",
    points: [
      "Physical products or digital downloads",
      "Your photos, your story, your price",
      "A live preview as you build",
    ],
    label: "Create your page",
  },
  {
    title: "A head start.\nIn your own words.",
    body: "Give your assistant the facts. It helps shape the description, spots missing details and prepares your launch copy.",
    points: [
      "Useful suggestions, grounded in your product",
      "A clear check before you launch",
      "You review every change",
    ],
    label: "Meet your assistant",
  },
  {
    title: "One link.\nOpen for business.",
    body: "Finish payment verification, publish your page and put the link wherever your people are. Your orders have a home, too.",
    points: [
      "A product page built around one purchase",
      "Orders and fulfilment in one place",
      "Private files for digital products",
    ],
    label: "Make your first shop",
  },
];
const examples = [
  {
    brand: "FORM STUDIO",
    title: "The everyday mug",
    price: "£24",
    type: "The small batch",
    image: "/images/mug.webp",
    id: 0,
  },
  {
    brand: "WEEKEND EDITIONS",
    title: "Off the grid",
    price: "£18",
    type: "The next print drop",
    image: "/images/print.svg",
    id: 1,
  },
  {
    brand: "THE DAILY PRACTICE",
    title: "A little more organised",
    price: "£12",
    type: "The digital download",
    image: "/images/planner.svg",
    id: 2,
  },
];
const assistantTasks = [
  {
    label: "Write my description",
    prompt: "Help me describe my blue ceramic mug. Keep it simple.",
    heading: "A clearer way to say it.",
    copy: "A blue ceramic mug for your daily coffee, tea and everything in between.",
    note: "What’s the capacity? And are there any care instructions buyers should know?",
    action: "Description drafted",
  },
  {
    label: "Check my launch",
    prompt: "What’s left before I can publish my shop?",
    heading: "A few details to finish.",
    copy: "Your product has a title and price. Add a photo, confirm delivery details and finish payment verification before publishing.",
    note: "Your assistant checks the draft. You decide when it goes live.",
    action: "Launch checklist prepared",
  },
  {
    label: "Plan my announcement",
    prompt: "Write a short post announcing my new mug.",
    heading: "Your next post, started.",
    copy: "Meet the everyday mug. Blue ceramic. Yours for the morning coffee ritual. Take a closer look at the link in my bio.",
    note: "Check the product details and add your shop link before posting.",
    action: "Launch copy drafted",
  },
];
const faqs = [
  [
    "What exactly is a block?",
    "One product, on its own page, with the details a buyer needs and a clear way to purchase. You get a link to share and a workspace to manage the product and its orders.",
  ],
  [
    "What can I sell?",
    "Physical products and digital downloads. Think prints, small batches, templates and guides. Product options can share a price and stock. This release uses GBP, with UK delivery for physical products.",
  ],
  [
    "Do I have to use the AI?",
    "No. You can write and edit everything yourself. The assistant can prepare suggestions, launch checks and copy when you want help. You review changes before applying them.",
  ],
  [
    "Can I build before signing up?",
    "Yes. Start in the builder and try your page with a local draft. Create an account to save online, upload your files and use your assistant.",
  ],
  [
    "How do payments work?",
    "Payment onboarding runs through KompiPay and Stripe. Checkout requires completed verification and platform payment setup. You can build and save your shop while payments are being prepared; your dashboard shows what is still needed.",
  ],
];

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
function ShopDemo() {
  return (
    <div className="sb-shop-demo">
      <div className="sb-demo-browser">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>
          <Globe2 size={14} /> shopablock.co/your-thing
        </span>
        <Link2 size={16} />
      </div>
      <div className="sb-demo-brand">
        <span>FORM STUDIO</span>
        <span>Edition 001</span>
      </div>
      <div className="sb-demo-product">
        <img src="/images/mug.webp" alt="Illustrative ceramic mug storefront" />
        <div className="sb-demo-product-copy">
          <span className="sb-label">THE EVERYDAY COLLECTION</span>
          <h3>The everyday mug.</h3>
          <p>A ceramic companion for your daily ritual.</p>
          <strong>£24.00</strong>
          <div className="sb-demo-purchase">
            Make it yours <ArrowUpRight size={18} />
          </div>
          <span className="sb-demo-shipping">
            <Package size={16} /> Made for the everyday.
          </span>
        </div>
      </div>
      <div className="sb-demo-caption">Illustrative shop preview</div>
    </div>
  );
}
function SuggestionDemo() {
  return (
    <div className="sb-suggestion-demo">
      <div className="sb-panel-heading">
        <span className="sb-agent-symbol">
          <Sparkles size={22} />
        </span>
        <div>
          <strong>ShopaBlock assistant</strong>
          <span>A little less blank-page energy.</span>
        </div>
      </div>
      <div className="sb-demo-message">
        I’m launching a ceramic mug. Help me find the words.
      </div>
      <div className="sb-demo-proposal">
        <div className="sb-label">
          <CheckCheck size={17} /> SUGGESTION READY
        </div>
        <h3>Meet your new daily ritual.</h3>
        <p>
          A ceramic mug for slow mornings, strong coffee and a moment to
          yourself.
        </p>
        <div className="sb-demo-question">
          What’s the capacity, finish and delivery time?
        </div>
      </div>
      <div className="sb-review-note">
        <span>
          <Check size={17} /> Review before applying
        </span>
        <span>Example</span>
      </div>
    </div>
  );
}
function OrdersDemo() {
  return (
    <div className="sb-orders-demo">
      <div className="sb-panel-heading">
        <span className="sb-agent-symbol">
          <Package size={22} />
        </span>
        <div>
          <strong>Your orders</strong>
          <span>From your first sale, onwards.</span>
        </div>
        <span className="sb-example-pill">Example</span>
      </div>
      <div className="sb-order-summary">
        <div>
          <span>Paid orders</span>
          <strong>03</strong>
        </div>
        <div>
          <span>To fulfil</span>
          <strong>02</strong>
        </div>
      </div>
      {[
        { name: "The everyday mug", tag: "Ready to pack", id: "0043" },
        { name: "The everyday mug", tag: "Ready to pack", id: "0042" },
        { name: "Off the grid", tag: "Sent", id: "0041" },
      ].map((o, i) => (
        <div className="sb-order-row" key={o.id}>
          <span className="sb-order-icon">
            {i === 2 ? <Check size={21} /> : <Package size={21} />}
          </span>
          <div>
            <strong>{o.name}</strong>
            <span>Order #{o.id}</span>
          </div>
          <span className="sb-order-status">{o.tag}</span>
        </div>
      ))}
      <div className="sb-order-foot">
        <span>Everything in its place.</span>
        <ArrowUpRight size={20} />
      </div>
    </div>
  );
}
function Journey() {
  const ref = useRef<HTMLElement>(null),
    reduce = useReducedMotion();
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!reduce && window.matchMedia("(min-width: 901px)").matches)
      setStage(Math.min(2, Math.floor(value * 3)));
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section ref={ref} id="how-it-works" className="sb-journey">
      <div className="sb-journey-sticky sb-shell">
        <div className="sb-journey-top">
          <span className="sb-label">FROM AN IDEA TO YOUR OWN SHOP</span>
          <span className="sb-scroll-hint">
            Keep scrolling <ArrowDown size={17} />
          </span>
        </div>
        <div className="sb-journey-grid">
          <div className="sb-journey-copy">
            <div
              className="sb-stage-tabs"
              role="tablist"
              aria-label="How ShopaBlock works"
            >
              {["Create", "Refine", "Launch"].map((x, i) => (
                <button
                  key={x}
                  role="tab"
                  id={`stage-${i}`}
                  aria-controls="stage-panel"
                  aria-selected={stage === i}
                  tabIndex={stage === i ? 0 : -1}
                  onKeyDown={(event) => {
                    const next =
                      event.key === "ArrowRight"
                        ? (i + 1) % 3
                        : event.key === "ArrowLeft"
                          ? (i + 2) % 3
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? 2
                              : null;
                    if (next !== null) {
                      event.preventDefault();
                      setStage(next);
                      document.getElementById(`stage-${next}`)?.focus();
                    }
                  }}
                  className={stage === i ? "active" : ""}
                  onClick={() => setStage(i)}
                >
                  <span>0{i + 1}</span>
                  {x}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                role="tabpanel"
                id="stage-panel"
                aria-labelledby={`stage-${stage}`}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.24 }}
              >
                <h2>{stages[stage].title}</h2>
                <p>{stages[stage].body}</p>
                <ul>
                  {stages[stage].points.map((p) => (
                    <li key={p}>
                      <Check size={17} />
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  className="sb-text-link"
                  href={stage === 1 ? "/app/assistant" : "/create"}
                >
                  {stages[stage].label}
                  <ArrowUpRight size={20} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="sb-journey-visual">
            <div className="sb-panel-grid" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                className="sb-visual-content"
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.99 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              >
                {stage === 0 ? (
                  <ShopDemo />
                ) : stage === 1 ? (
                  <SuggestionDemo />
                ) : (
                  <OrdersDemo />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="sb-journey-track">
          <motion.div style={{ width: progress }} />
        </div>
      </div>
    </section>
  );
}
function AssistantSection() {
  const [task, setTask] = useState(0),
    reduce = useReducedMotion();
  const selected = assistantTasks[task];
  return (
    <section className="sb-assistant sb-shell" id="assistant">
      <Reveal className="sb-assistant-copy">
        <span className="sb-label">A HELPING HAND. ON YOUR TERMS.</span>
        <h2>
          Your product.
          <br />
          Your voice.
          <br />
          <span>A head start.</span>
        </h2>
        <p>
          Your assistant helps with the details that slow you down. Better
          descriptions. Missing information. The words for your next launch.
        </p>
        <p className="sb-copy-secondary">
          It can read your shop and order totals. You stay in charge of what
          changes and what goes live.
        </p>
        <Link className="sb-button sb-button-white" href="/app/assistant">
          Meet your assistant <ArrowUpRight size={19} />
        </Link>
      </Reveal>
      <Reveal className="sb-assistant-demo">
        <div className="sb-assistant-demo-head">
          <span>
            <Sparkles size={19} /> Your shop assistant
          </span>
          <span className="sb-example-pill">Interactive example</span>
        </div>
        <div className="sb-task-picker" aria-label="Try an assistant example">
          {assistantTasks.map((x, i) => (
            <button
              key={x.label}
              aria-pressed={task === i}
              className={task === i ? "active" : ""}
              onClick={() => setTask(i)}
            >
              {x.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={task}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="sb-prompt">
              <span>You</span>
              <p>{selected.prompt}</p>
              <ArrowUpRight size={19} />
            </div>
            <div className="sb-answer">
              <div className="sb-answer-status">
                <CheckCheck size={17} />
                {selected.action}
              </div>
              <h3>{selected.heading}</h3>
              <p>{selected.copy}</p>
              <div className="sb-answer-note">{selected.note}</div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="sb-assistant-demo-foot">
          <span>
            <Check size={16} /> Suggestions, ready for your review.
          </span>
          <span>Example content</span>
        </div>
      </Reveal>
    </section>
  );
}
export default function Home() {
  const [paused, setPaused] = useState(false),
    [faq, setFaq] = useState<number | null>(0),
    [copied, setCopied] = useState(false);
  const reduce = useReducedMotion();
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://shopablock.co/demo");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };
  return (
    <main
      id="main"
      className="sb-home"
      data-motion={paused || reduce ? "paused" : "running"}
    >
      <section className="sb-hero sb-shell">
        <div className="sb-announcement">
          <span className="sb-new-pill">Introducing</span>
          <Link href="#assistant">
            A little intelligence for your independent shop{" "}
            <ArrowUpRight size={16} />
          </Link>
        </div>
        <div className="sb-hero-grid">
          <div className="sb-hero-copy">
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.7, 0.2, 1] }}
            >
              One product.
              <br />
              One page.
              <br />
              <span>All yours.</span>
            </motion.h1>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
            >
              <p>
                A sharp storefront for whatever you make. Add your product,
                connect payments, and share one link.
              </p>
              <div className="sb-hero-actions">
                <Link className="sb-button sb-button-white" href="/create">
                  Build your block <ArrowUpRight size={20} />
                </Link>
                <Link className="sb-button sb-button-ghost" href="/demo">
                  See it in action <ArrowRight size={19} />
                </Link>
              </div>
              <span className="sb-hero-note">
                Try the builder before you sign up.
              </span>
            </motion.div>
          </div>
          <div className="sb-hero-art">
            <div className="sb-art-coordinate">001 — YOUR NEXT BEGINNING</div>
            <BlockSculpture paused={paused || !!reduce} />
            <div className="sb-art-bottom">
              <span>One block. Built around you.</span>
              <button
                onClick={() => setPaused(!paused)}
                aria-label={paused ? "Play animation" : "Pause animation"}
              >
                {paused ? <Play size={16} /> : <Pause size={16} />}
                <span>{paused ? "Play" : "Pause"} motion</span>
              </button>
            </div>
          </div>
        </div>
        <div className="sb-hero-steps">
          {[
            {
              n: "01",
              title: "Make it.",
              copy: "Give your product a place of its own.",
            },
            {
              n: "02",
              title: "Share it.",
              copy: "One link, wherever your people are.",
            },
            {
              n: "03",
              title: "Own it.",
              copy: "Your product. Your customers. Your call.",
            },
          ].map((s) => (
            <div key={s.n}>
              <span>{s.n}</span>
              <div>
                <h2>{s.title}</h2>
                <p>{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div
        className="sb-marquee"
        aria-label="For prints, small batches, digital downloads, templates and your next idea"
      >
        <div>
          {[0, 1].map((n) => (
            <div className="sb-marquee-group" key={n} aria-hidden={n === 1}>
              {[
                "Prints",
                "Small batches",
                "Digital downloads",
                "Templates",
                "Your next idea",
              ].map((s) => (
                <span key={s}>
                  {s}
                  <span className="sb-marquee-mark">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <section className="sb-manifesto sb-shell">
        <Reveal>
          <span className="sb-label">THE SMALLEST POSSIBLE SHOP.</span>
          <h2>
            You made something
            <br />
            worth buying.
            <br />
            <span>
              Getting it online should
              <br className="sb-wide-break" /> be the easy part.
            </span>
          </h2>
          <p>
            ShopaBlock gives one good product everything it needs: a page, a
            checkout and a link. With room for your personality.
          </p>
        </Reveal>
        <div className="sb-manifesto-mark" aria-hidden="true">
          <div />
          <div />
          <div />
        </div>
      </section>
      <Journey />
      <section className="sb-showcase">
        <div className="sb-shell">
          <Reveal className="sb-section-heading">
            <div>
              <span className="sb-label">
                A SMALL SHOP CAN MAKE A BIG IMPRESSION.
              </span>
              <h2>
                Whatever your thing.
                <br />
                <span>Make it unmistakably yours.</span>
              </h2>
            </div>
            <Link className="sb-text-link" href="/demo">
              Explore an example <ArrowUpRight size={20} />
            </Link>
          </Reveal>
          <div className="sb-product-grid">
            {examples.map((p, i) => (
              <Reveal key={p.id} className={`sb-product-card sb-product-${i}`}>
                <Link
                  href={`/demo?product=${p.id}`}
                  aria-label={`View example shop: ${p.title}`}
                >
                  <div className="sb-product-image">
                    <span className="sb-product-number">0{i + 1}</span>
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <span className="sb-product-arrow">
                      <ArrowUpRight size={25} />
                    </span>
                  </div>
                  <div className="sb-product-meta">
                    <span>{p.type}</span>
                    <span>{p.price}</span>
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.brand}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="sb-showcase-note">
            <span>Illustrative shops. Real possibilities.</span>
            <span>
              <Package size={17} /> Physical products{" "}
              <span className="sb-separator">/</span>
              <Download size={17} /> Digital downloads
            </span>
          </div>
        </div>
      </section>
      <AssistantSection />
      <section className="sb-share sb-shell">
        <Reveal>
          <span className="sb-label">WHEREVER YOUR PEOPLE ARE.</span>
          <h2>
            One link.
            <br />
            <span>Go everywhere.</span>
          </h2>
          <p>
            In your bio. In a message. In the newsletter you finally send. Your
            shop is always one click away.
          </p>
          <button
            className="sb-copy-link"
            aria-label={
              copied
                ? "Example shop link copied"
                : "Copy the example shop link: shopablock.co/demo"
            }
            onClick={copyLink}
          >
            <Link2 size={20} />
            <span>shopablock.co/demo</span>
            <span>{copied ? "Copied demo link" : "Try copying a link"}</span>
            {copied ? <Check size={20} /> : <Copy size={20} />}
          </button>
        </Reveal>
        <div className="sb-share-map" aria-hidden="true">
          <svg viewBox="0 0 560 350" fill="none">
            <path d="M280 175C280 80 145 70 80 65M280 175C280 80 410 70 480 65M280 175C280 270 145 280 80 285M280 175C280 270 410 280 480 285" />
            <path
              className="sb-flow-line"
              d="M80 65C145 70 280 80 280 175C280 270 410 280 480 285M480 65C410 70 280 80 280 175C280 270 145 280 80 285"
            />
          </svg>
          <div className="sb-share-center">
            <svg viewBox="0 0 32 36" fill="none">
              <path
                d="M16 1 31 9.5v17L16 35 1 26.5v-17L16 1ZM1 9.5 16 18 31 9.5M16 18v17"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="sb-channel sb-channel-1">
            Your bio <ArrowUpRight size={16} />
          </span>
          <span className="sb-channel sb-channel-2">
            A direct message <ArrowUpRight size={16} />
          </span>
          <span className="sb-channel sb-channel-3">
            Your newsletter <ArrowUpRight size={16} />
          </span>
          <span className="sb-channel sb-channel-4">
            Anywhere else <ArrowUpRight size={16} />
          </span>
        </div>
      </section>
      <section className="sb-faq sb-shell">
        <Reveal>
          <span className="sb-label">GOOD QUESTIONS.</span>
          <h2>
            A little clarity.
            <br />
            <span>Then you’re off.</span>
          </h2>
          <Link className="sb-text-link" href="/help">
            More about ShopaBlock <ArrowUpRight size={20} />
          </Link>
        </Reveal>
        <div className="sb-faq-list">
          {faqs.map(([q, a], i) => (
            <div
              className={faq === i ? "sb-faq-item open" : "sb-faq-item"}
              key={q}
            >
              <h3>
                <button
                  aria-expanded={faq === i}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q}
                  {faq === i ? <Minus size={20} /> : <Plus size={20} />}
                </button>
              </h3>
              <div
                id={`faq-answer-${i}`}
                className="sb-faq-answer"
                hidden={faq !== i}
              >
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="sb-last-call sb-shell">
        <Reveal>
          <span className="sb-label">
            THE NEXT THING STARTS WITH ONE THING.
          </span>
          <h2>Yours.</h2>
          <div>
            <p>
              Give it a page.
              <br />
              See where it goes.
            </p>
            <Link className="sb-button sb-button-white" href="/create">
              Build your block <ArrowUpRight size={22} />
            </Link>
          </div>
        </Reveal>
        <div className="sb-final-orbit" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </section>
    </main>
  );
}
