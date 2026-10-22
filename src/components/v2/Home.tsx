"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type Variants,
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
  Package,
  Pause,
  Play,
  Plus,
  Sparkles,
  CheckCheck,
} from "lucide-react";
import BlockSculpture from "./BlockSculpture";
import {
  ease,
  Lines,
  Magnetic,
  Parallax,
  Reveal,
  ScrollWords,
  SmoothScroll,
  useMinWidth,
} from "./motion";

const stages = [
  {
    title: ["Start with", "your thing."],
    body: "A print. A small batch. Something you know. Add your product, a price and the details that make it yours.",
    points: [
      "Physical products or digital downloads",
      "Your photos, your story, your price",
      "A live preview as you build",
    ],
    label: "Create your page",
  },
  {
    title: ["A head start.", "In your own words."],
    body: "Give your assistant the facts. It helps shape the description, spots missing details and prepares your launch copy.",
    points: [
      "Useful suggestions, grounded in your product",
      "A clear check before you launch",
      "You review every change",
    ],
    label: "Meet your assistant",
  },
  {
    title: ["One link.", "Open for business."],
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

/* Demo panels animate their insides in sequence when a stage arrives. */
const demoParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.075, delayChildren: 0.12 } },
};
const demoChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};
const demoImage: Variants = {
  hidden: { clipPath: "inset(100% 0 0 0)", scale: 1.08 },
  show: {
    clipPath: "inset(0% 0 0 0)",
    scale: 1,
    transition: { duration: 1, ease },
  },
};

function ShopDemo() {
  return (
    <motion.div className="sb-shop-demo" variants={demoParent}>
      <motion.div className="sb-demo-browser" variants={demoChild}>
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>
          <Globe2 size={14} /> shopablock.co/your-thing
        </span>
        <Link2 size={16} />
      </motion.div>
      <motion.div className="sb-demo-brand" variants={demoChild}>
        <span>FORM STUDIO</span>
        <span>Edition 001</span>
      </motion.div>
      <div className="sb-demo-product">
        <motion.img
          src="/images/mug.webp"
          alt="Illustrative ceramic mug storefront"
          variants={demoImage}
        />
        <motion.div className="sb-demo-product-copy" variants={demoParent}>
          <motion.span className="sb-label" variants={demoChild}>
            THE EVERYDAY COLLECTION
          </motion.span>
          <motion.h3 variants={demoChild}>The everyday mug.</motion.h3>
          <motion.p variants={demoChild}>
            A ceramic companion for your daily ritual.
          </motion.p>
          <motion.strong variants={demoChild}>£24.00</motion.strong>
          <motion.div className="sb-demo-purchase" variants={demoChild}>
            Make it yours <ArrowUpRight size={18} />
          </motion.div>
          <motion.span className="sb-demo-shipping" variants={demoChild}>
            <Package size={16} /> Made for the everyday.
          </motion.span>
        </motion.div>
      </div>
      <motion.div className="sb-demo-caption" variants={demoChild}>
        Illustrative shop preview
      </motion.div>
    </motion.div>
  );
}
function SuggestionDemo() {
  return (
    <motion.div className="sb-suggestion-demo" variants={demoParent}>
      <motion.div className="sb-panel-heading" variants={demoChild}>
        <span className="sb-agent-symbol">
          <Sparkles size={22} />
        </span>
        <div>
          <strong>ShopaBlock assistant</strong>
          <span>A little less blank-page energy.</span>
        </div>
      </motion.div>
      <motion.div className="sb-demo-message" variants={demoChild}>
        I’m launching a ceramic mug. Help me find the words.
      </motion.div>
      <motion.div
        className="sb-demo-proposal"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
        }}
      >
        <motion.div className="sb-label" variants={demoChild}>
          <CheckCheck size={17} /> SUGGESTION READY
        </motion.div>
        <motion.h3 variants={demoChild}>Meet your new daily ritual.</motion.h3>
        <motion.p variants={demoChild}>
          A ceramic mug for slow mornings, strong coffee and a moment to
          yourself.
        </motion.p>
        <motion.div className="sb-demo-question" variants={demoChild}>
          What’s the capacity, finish and delivery time?
        </motion.div>
      </motion.div>
      <motion.div className="sb-review-note" variants={demoChild}>
        <span>
          <Check size={17} /> Review before applying
        </span>
        <span>Example</span>
      </motion.div>
    </motion.div>
  );
}
function OrdersDemo() {
  return (
    <motion.div className="sb-orders-demo" variants={demoParent}>
      <motion.div className="sb-panel-heading" variants={demoChild}>
        <span className="sb-agent-symbol">
          <Package size={22} />
        </span>
        <div>
          <strong>Your orders</strong>
          <span>From your first sale, onwards.</span>
        </div>
        <span className="sb-example-pill">Example</span>
      </motion.div>
      <motion.div className="sb-order-summary" variants={demoChild}>
        <div>
          <span>Paid orders</span>
          <strong>03</strong>
        </div>
        <div>
          <span>To fulfil</span>
          <strong>02</strong>
        </div>
      </motion.div>
      {[
        { name: "The everyday mug", tag: "Ready to pack", id: "0043" },
        { name: "The everyday mug", tag: "Ready to pack", id: "0042" },
        { name: "Off the grid", tag: "Sent", id: "0041" },
      ].map((o, i) => (
        <motion.div className="sb-order-row" key={o.id} variants={demoChild}>
          <span className="sb-order-icon">
            {i === 2 ? <Check size={21} /> : <Package size={21} />}
          </span>
          <div>
            <strong>{o.name}</strong>
            <span>Order #{o.id}</span>
          </div>
          <span className="sb-order-status">{o.tag}</span>
        </motion.div>
      ))}
      <motion.div className="sb-order-foot" variants={demoChild}>
        <span>Everything in its place.</span>
        <ArrowUpRight size={20} />
      </motion.div>
    </motion.div>
  );
}

/* The strip reads scroll speed: it hurries when you scroll and drifts when you stop. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};
function Marquee({ paused }: { paused: boolean }) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState(false);
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [0, 1200], [0, 4], { clamp: false });
  const direction = useRef(-1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  useAnimationFrame((_, delta) => {
    if (paused || reduce) return;
    const b = boost.get();
    if (b < -0.05) direction.current = 1;
    else if (b > 0.05) direction.current = -1;
    const speed = hover ? 0.25 : 1.25; // % per second
    let move = direction.current * speed * (delta / 1000);
    move += move * Math.abs(b);
    base.set(base.get() + move);
  });
  const items = [
    "Prints",
    "Small batches",
    "Digital downloads",
    "Templates",
    "Your next idea",
  ];
  return (
    <div
      className="sb-marquee"
      aria-label="For prints, small batches, digital downloads, templates and your next idea"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <motion.div style={{ x }}>
        {[0, 1].map((n) => (
          <div className="sb-marquee-group" key={n} aria-hidden={n === 1}>
            {items.map((s) => (
              <span key={s}>
                {s}
                <span className="sb-marquee-mark">✳</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Hero({
  paused,
  setPaused,
  reduce,
}: {
  paused: boolean;
  setPaused: (v: boolean) => void;
  reduce: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const wide = useMinWidth();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const artScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const artOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.15]);
  return (
    <section ref={ref} className="sb-hero sb-shell">
      <motion.div
        className="sb-announcement"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <span className="sb-new-pill">Introducing</span>
        <Link href="#assistant">
          A little intelligence for your independent shop{" "}
          <ArrowUpRight size={16} />
        </Link>
      </motion.div>
      <div className="sb-hero-grid">
        <motion.div
          className="sb-hero-copy"
          style={
            reduce || !wide ? undefined : { y: copyY, opacity: copyOpacity }
          }
        >
          <Lines
            as="h1"
            inView={false}
            delay={0.1}
            stagger={0.11}
            lines={[
              "One product.",
              "One page.",
              <span className="sb-muted" key="m">
                All yours.
              </span>,
            ]}
          />
          <motion.div
            initial={reduce ? false : "hidden"}
            animate="show"
            transition={{ staggerChildren: 0.1, delayChildren: 0.55 }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
              }}
            >
              A sharp storefront for whatever you make. Add your product,
              connect payments, and share one link.
            </motion.p>
            <motion.div
              className="sb-hero-actions"
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
              }}
            >
              <Magnetic>
                <Link className="sb-button sb-button-white" href="/create">
                  Build your block <ArrowUpRight size={20} />
                </Link>
              </Magnetic>
              <Link className="sb-button sb-button-ghost" href="/demo">
                See it in action <ArrowRight size={19} />
              </Link>
            </motion.div>
            <motion.span
              className="sb-hero-note"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 0.8 } },
              }}
            >
              Try the builder before you sign up.
            </motion.span>
          </motion.div>
        </motion.div>
        <motion.div
          className="sb-hero-art-wrap"
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease, delay: 0.25 }}
        >
          <motion.div
            className="sb-hero-art"
            style={
              reduce || !wide
                ? undefined
                : { y: artY, scale: artScale, opacity: artOpacity }
            }
          >
            <div className="sb-art-coordinate">001 — YOUR NEXT BEGINNING</div>
            <BlockSculpture paused={paused || reduce} />
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
          </motion.div>
        </motion.div>
      </div>
      <Reveal className="sb-hero-steps" stagger={0.1} delay={0.1} amount={0.1}>
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
      </Reveal>
    </section>
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
      setStage(value < 0.34 ? 0 : value < 0.67 ? 1 : 2);
  });
  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section ref={ref} id="how-it-works" className="sb-journey">
      <motion.div
        className="sb-journey-sticky sb-shell"
        initial={reduce ? false : { opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, ease }}
      >
        <div className="sb-journey-top">
          <span className="sb-label">FROM AN IDEA TO YOUR OWN SHOP</span>
          <span className="sb-scroll-hint">
            Keep scrolling
            <motion.span
              animate={reduce ? undefined : { y: [0, 4, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ display: "inline-flex" }}
            >
              <ArrowDown size={17} />
            </motion.span>
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
                  {stage === i && (
                    <motion.i
                      className="sb-stage-underline"
                      layoutId="stage-underline"
                      transition={{ duration: 0.45, ease }}
                    />
                  )}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                role="tabpanel"
                id="stage-panel"
                aria-labelledby={`stage-${stage}`}
                initial={reduce ? false : "hidden"}
                animate="show"
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{
                  duration: 0.25,
                  staggerChildren: 0.08,
                  delayChildren: 0.05,
                }}
              >
                <Lines
                  inView={false}
                  stagger={0.08}
                  lines={stages[stage].title}
                />
                <motion.p variants={demoChild}>{stages[stage].body}</motion.p>
                <ul>
                  {stages[stage].points.map((p) => (
                    <motion.li key={p} variants={demoChild}>
                      <Check size={17} />
                      {p}
                    </motion.li>
                  ))}
                </ul>
                <motion.div variants={demoChild}>
                  <Link
                    className="sb-text-link"
                    href={stage === 1 ? "/app/assistant" : "/create"}
                  >
                    {stages[stage].label}
                    <ArrowUpRight size={20} />
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="sb-journey-visual">
            <div className="sb-panel-grid" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={stage}
                className="sb-visual-content"
                initial={reduce ? false : "hidden"}
                animate="show"
                exit={reduce ? undefined : "exit"}
                variants={{
                  hidden: { opacity: 0, y: 36, scale: 0.97 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.55, ease },
                  },
                  exit: {
                    opacity: 0,
                    y: -24,
                    scale: 0.985,
                    transition: { duration: 0.3, ease },
                  },
                }}
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
      </motion.div>
    </section>
  );
}

function Showcase() {
  const reduce = useReducedMotion();
  const wide = useMinWidth();
  const offsets = wide ? [36, 0, -36] : [0, 0, 0];
  return (
    <section className="sb-showcase">
      <div className="sb-shell">
        <Reveal className="sb-section-heading">
          <div>
            <span className="sb-label">
              A SMALL SHOP CAN MAKE A BIG IMPRESSION.
            </span>
            <Lines
              lines={[
                "Whatever your thing.",
                <span className="sb-muted" key="m">
                  Make it unmistakably yours.
                </span>,
              ]}
            />
          </div>
          <Link className="sb-text-link" href="/demo">
            Explore an example <ArrowUpRight size={20} />
          </Link>
        </Reveal>
        <div className="sb-product-grid">
          {examples.map((p, i) => (
            <Parallax
              key={p.id}
              distance={offsets[i]}
              className={`sb-product-card sb-product-${i}`}
            >
              <motion.div
                initial={reduce ? false : "hidden"}
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delayChildren: i * 0.1 }}
              >
                <Link
                  href={`/demo?product=${p.id}`}
                  aria-label={`View example shop: ${p.title}`}
                >
                  <motion.div
                    className="sb-product-image"
                    variants={{
                      hidden: { clipPath: "inset(100% 0 0 0)", scale: 1.1 },
                      show: {
                        clipPath: "inset(0% 0 0 0)",
                        scale: 1,
                        transition: { duration: 1.2, ease },
                      },
                    }}
                  >
                    <span className="sb-product-number">0{i + 1}</span>
                    <img src={p.image} alt={p.title} loading="lazy" />
                    <span className="sb-product-arrow">
                      <ArrowUpRight size={25} />
                    </span>
                  </motion.div>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.9, ease, delay: 0.35 },
                      },
                    }}
                  >
                    <div className="sb-product-meta">
                      <span>{p.type}</span>
                      <span>{p.price}</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.brand}</p>
                  </motion.div>
                </Link>
              </motion.div>
            </Parallax>
          ))}
        </div>
        <Reveal className="sb-showcase-note" amount={0.6}>
          <span>Illustrative shops. Real possibilities.</span>
          <span>
            <Package size={17} /> Physical products{" "}
            <span className="sb-separator">/</span>
            <Download size={17} /> Digital downloads
          </span>
        </Reveal>
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
      <Reveal className="sb-assistant-copy" stagger={0.1}>
        <span className="sb-label">A HELPING HAND. ON YOUR TERMS.</span>
        <Lines
          lines={[
            "Your product.",
            "Your voice.",
            <span className="sb-muted" key="m">
              A head start.
            </span>,
          ]}
        />
        <p>
          Your assistant helps with the details that slow you down. Better
          descriptions. Missing information. The words for your next launch.
        </p>
        <p className="sb-copy-secondary">
          It can read your shop and order totals. You stay in charge of what
          changes and what goes live.
        </p>
        <Magnetic>
          <Link className="sb-button sb-button-white" href="/app/assistant">
            Meet your assistant <ArrowUpRight size={19} />
          </Link>
        </Magnetic>
      </Reveal>
      <Parallax distance={-24}>
        <Reveal className="sb-assistant-demo" delay={0.15}>
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
              initial={reduce ? false : "hidden"}
              animate="show"
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.1 } },
              }}
            >
              <motion.div className="sb-prompt" variants={demoChild}>
                <span>You</span>
                <p>{selected.prompt}</p>
                <ArrowUpRight size={19} />
              </motion.div>
              <motion.div
                className="sb-answer"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.09, delayChildren: 0.35 },
                  },
                }}
              >
                <motion.div className="sb-answer-status" variants={demoChild}>
                  <CheckCheck size={17} />
                  {selected.action}
                </motion.div>
                <motion.h3 variants={demoChild}>{selected.heading}</motion.h3>
                <motion.p variants={demoChild}>{selected.copy}</motion.p>
                <motion.div className="sb-answer-note" variants={demoChild}>
                  {selected.note}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="sb-assistant-demo-foot">
            <span>
              <Check size={16} /> Suggestions, ready for your review.
            </span>
            <span>Example content</span>
          </div>
        </Reveal>
      </Parallax>
    </section>
  );
}

function ShareMap() {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.6, ease },
    },
  };
  const channels = [
    "Your bio",
    "A direct message",
    "Your newsletter",
    "Anywhere else",
  ];
  return (
    <motion.div
      className="sb-share-map"
      aria-hidden="true"
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
    >
      <svg viewBox="0 0 560 350" fill="none">
        <motion.path
          variants={draw}
          d="M280 175C280 80 145 70 80 65M280 175C280 80 410 70 480 65M280 175C280 270 145 280 80 285M280 175C280 270 410 280 480 285"
        />
        <motion.path
          className="sb-flow-line"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ delay: 1.2 }}
          d="M80 65C145 70 280 80 280 175C280 270 410 280 480 285M480 65C410 70 280 80 280 175C280 270 145 280 80 285"
        />
      </svg>
      <motion.div
        className="sb-share-center"
        variants={{
          hidden: { opacity: 0, scale: 0.6, x: "-50%", y: "-50%" },
          show: {
            opacity: 1,
            scale: 1,
            x: "-50%",
            y: "-50%",
            transition: { type: "spring", stiffness: 180, damping: 16 },
          },
        }}
      >
        <svg viewBox="0 0 32 36" fill="none">
          <path
            d="M16 1 31 9.5v17L16 35 1 26.5v-17L16 1ZM1 9.5 16 18 31 9.5M16 18v17"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </motion.div>
      {channels.map((c, i) => (
        <motion.div
          key={c}
          className={`sb-channel-wrap sb-channel-${i + 1}`}
          variants={{
            hidden: { opacity: 0, scale: 0.7, y: 16 },
            show: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 17,
                delay: 0.5 + i * 0.1,
              },
            },
          }}
        >
          <span className="sb-channel">
            {c} <ArrowUpRight size={16} />
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
}

function Faq() {
  const [faq, setFaq] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <section className="sb-faq sb-shell">
      <Reveal stagger={0.1}>
        <span className="sb-label">GOOD QUESTIONS.</span>
        <Lines
          lines={[
            "A little clarity.",
            <span className="sb-muted" key="m">
              Then you’re off.
            </span>,
          ]}
        />
        <Link className="sb-text-link" href="/help">
          More about ShopaBlock <ArrowUpRight size={20} />
        </Link>
      </Reveal>
      <Reveal className="sb-faq-list" stagger={0.07} amount={0.15}>
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
                <motion.span
                  className="sb-faq-icon"
                  animate={{ rotate: faq === i ? 45 : 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <Plus size={20} />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {faq === i && (
                <motion.div
                  id={`faq-answer-${i}`}
                  key="answer"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="sb-faq-answer">
                    <p>{a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

function LastCall() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [20, 60]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const headY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <section ref={ref} className="sb-last-call sb-shell">
      <div>
        <Reveal stagger={0.12}>
          <span className="sb-label">
            THE NEXT THING STARTS WITH ONE THING.
          </span>
        </Reveal>
        <motion.div style={reduce ? undefined : { y: headY }}>
          <Lines lines={["Yours."]} stagger={0} />
        </motion.div>
        <Reveal stagger={0.12} delay={0.4} amount={0.6}>
          <p>
            Give it a page.
            <br />
            See where it goes.
          </p>
          <Magnetic>
            <Link className="sb-button sb-button-white" href="/create">
              Build your block <ArrowUpRight size={22} />
            </Link>
          </Magnetic>
        </Reveal>
      </div>
      <motion.div
        className="sb-final-orbit"
        aria-hidden="true"
        style={reduce ? undefined : { rotate, y: orbitY }}
      >
        <span />
        <span />
        <span />
      </motion.div>
    </section>
  );
}

export default function Home() {
  const [paused, setPaused] = useState(false),
    [copied, setCopied] = useState(false);
  const reduce = !!useReducedMotion();
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
      <SmoothScroll />
      <Hero paused={paused} setPaused={setPaused} reduce={reduce} />
      <Marquee paused={paused} />
      <section className="sb-manifesto sb-shell">
        <div>
          <Reveal>
            <span className="sb-label">THE SMALLEST POSSIBLE SHOP.</span>
          </Reveal>
          <Lines
            stagger={0.1}
            lines={[
              "You made something",
              "worth buying.",
              <span className="sb-muted" key="a">
                Getting it online should
              </span>,
              <span className="sb-muted" key="b">
                be the easy part.
              </span>,
            ]}
          />
          <ScrollWords text="ShopaBlock gives one good product everything it needs: a page, a checkout and a link. With room for your personality." />
        </div>
        <Parallax distance={-70}>
          <div className="sb-manifesto-mark" aria-hidden="true">
            <div />
            <div />
            <div />
          </div>
        </Parallax>
      </section>
      <Journey />
      <Showcase />
      <AssistantSection />
      <section className="sb-share sb-shell">
        <Reveal stagger={0.1}>
          <span className="sb-label">WHEREVER YOUR PEOPLE ARE.</span>
          <Lines
            lines={[
              "One link.",
              <span className="sb-muted" key="m">
                Go everywhere.
              </span>,
            ]}
          />
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
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? "ok" : "copy"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="sb-copy-icon"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </Reveal>
        <ShareMap />
      </section>
      <Faq />
      <LastCall />
    </main>
  );
}
