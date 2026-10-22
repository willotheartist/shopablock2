"use client";
import {
  Children,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import Lenis from "lenis";

/** One easing for the whole page, so everything feels like it belongs together. */
export const ease = [0.22, 1, 0.36, 1] as const;
const HEADER = 82;

/* ---------------------------------------------------------------- scroll */

/** Native scroll, smoothed. Touch stays native; reduced motion disables it. */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.95,
      anchors: { offset: -HEADER, duration: 1.1 },
    });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
  return null;
}

/* ------------------------------------------------------- reveal primitives */

const revealItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease },
  },
};

/** Fade-up on entry. `stagger` animates direct children in sequence instead. */
export function Reveal({
  children,
  className = "",
  delay = 0,
  stagger,
  amount = 0.2,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  if (reduce)
    return (
      <div className={className} style={style}>
        {stagger
          ? Children.map(children, (child) =>
              child == null ? null : <div>{child}</div>,
            )
          : children}
      </div>
    );
  if (stagger)
    return (
      <motion.div
        className={className}
        style={style}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {Children.map(children, (child) =>
          child == null ? null : (
            <motion.div variants={revealItem}>{child}</motion.div>
          ),
        )}
      </motion.div>
    );
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Headline lines that rise out of a mask, one after another. */
export function Lines({
  lines,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.09,
  inView = true,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  stagger?: number;
  /** Animate on scroll into view (default) or immediately on mount. */
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[Tag];
  const trigger = inView
    ? {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, amount: 0.5, margin: "0px 0px -6% 0px" },
      }
    : { initial: "hidden", animate: "show" };
  return (
    <MotionTag
      className={className}
      {...(reduce ? {} : trigger)}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span className="sb-line" key={i}>
          <motion.span
            className="sb-line-inner"
            variants={{
              hidden: { y: "108%", rotate: 1.2 },
              show: { y: "0%", rotate: 0, transition: { duration: 1, ease } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Moves slower or faster than the page while the wrapper is on screen. */
export function Parallax({
  children,
  distance = 60,
  className,
  style,
}: {
  children: ReactNode;
  /** Pixels of travel across the viewport. Negative moves against the scroll. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y: reduce ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({
  text,
  as: Tag = "p",
  className,
}: {
  text: string;
  as?: "p" | "h2";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.45"],
  });
  const words = text.split(" ");
  if (reduce) return <Tag className={className}>{text}</Tag>;
  return (
    <div ref={ref}>
      <Tag className={className}>
        {words.map((w, i) => (
          <Word
            key={i}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          >
            {w}
          </Word>
        ))}
      </Tag>
    </div>
  );
}
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <span className="sb-word">
      <motion.span style={{ opacity }}>{children}</motion.span>{" "}
    </span>
  );
}

/** Pulls gently toward the pointer. For the one or two buttons that matter. */
export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse") return;
    const box = ref.current!.getBoundingClientRect();
    x.set((e.clientX - box.left - box.width / 2) * strength);
    y.set((e.clientY - box.top - box.height / 2) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.div>
  );
}

/** True on viewports at least `px` wide. False on the server and first paint. */
export function useMinWidth(px = 901) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [px]);
  return match;
}
