"use client";
import { useEffect, useRef } from "react";

type Point = { x: number; y: number; z: number };

/** A procedural, monochrome block. No video, WebGL or image downloads. */
export default function BlockSculpture({ paused }: { paused: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d", { alpha: true });
    if (!ctx) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let width = 600,
      height = 600,
      frame = 0,
      visible = true,
      previous = 0;
    let pointerX = 0,
      pointerY = 0,
      easedX = 0,
      easedY = 0;
    const start = performance.now();
    const resize = () => {
      const box = el.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.75);
      el.width = Math.round(width * ratio);
      el.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      previous = 0;
      if (paused || reduce) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(paint);
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    resize();
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(el);
    const move = (e: PointerEvent) => {
      const box = el.getBoundingClientRect();
      pointerX = (e.clientX - box.left) / box.width - 0.5;
      pointerY = (e.clientY - box.top) / box.height - 0.5;
    };
    const leave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    function paint(now: number) {
      frame = requestAnimationFrame(paint);
      if ((!visible || document.hidden) && previous) return;
      if (now - previous < (width < 500 ? 32 : 20)) return;
      previous = now;
      const t = paused || reduce ? 2.4 : (now - start) / 1000;
      easedX += (pointerX - easedX) * 0.035;
      easedY += (pointerY - easedY) * 0.035;
      ctx!.clearRect(0, 0, width, height);
      const size = Math.min(width * 0.265, height * 0.26);
      const ry =
        -0.62 + Math.sin(t * 0.16) * 0.28 + (reduce ? 0 : easedX * 0.4);
      const rx =
        -0.42 + Math.cos(t * 0.13) * 0.08 + (reduce ? 0 : easedY * 0.2);
      const rz = -0.08 + Math.sin(t * 0.11) * 0.035;
      const project = (p: Point) => {
        const x1 = p.x * Math.cos(ry) + p.z * Math.sin(ry);
        const z1 = -p.x * Math.sin(ry) + p.z * Math.cos(ry);
        const y1 = p.y * Math.cos(rx) - z1 * Math.sin(rx);
        const z2 = p.y * Math.sin(rx) + z1 * Math.cos(rx);
        const x2 = x1 * Math.cos(rz) - y1 * Math.sin(rz);
        const y2 = x1 * Math.sin(rz) + y1 * Math.cos(rz);
        const perspective = 5.8 / (5.8 + z2);
        return {
          x: width * 0.5 + x2 * size * perspective,
          y: height * 0.49 + y2 * size * perspective,
          z: z2,
        };
      };
      const path = (
        points: Point[],
        stroke: string,
        fill?: string,
        lineWidth = 0.75,
      ) => {
        ctx!.beginPath();
        points.forEach((p, i) => {
          const q = project(p);
          if (!i) ctx!.moveTo(q.x, q.y);
          else ctx!.lineTo(q.x, q.y);
        });
        if (fill) {
          ctx!.closePath();
          ctx!.fillStyle = fill;
          ctx!.fill();
        }
        ctx!.strokeStyle = stroke;
        ctx!.lineWidth = lineWidth;
        ctx!.stroke();
      };
      // A quiet technical grid grounds the sculpture without a coloured glow.
      ctx!.strokeStyle = "rgba(255,255,255,.035)";
      ctx!.lineWidth = 1;
      for (let x = 16; x < width; x += 48) {
        ctx!.beginPath();
        ctx!.moveTo(x, 40);
        ctx!.lineTo(x, height - 40);
        ctx!.stroke();
      }
      for (let y = 40; y < height - 30; y += 48) {
        ctx!.beginPath();
        ctx!.moveTo(16, y);
        ctx!.lineTo(width - 16, y);
        ctx!.stroke();
      }
      const corner = 1.03;
      const faces = [
        [
          { x: -corner, y: -corner, z: -corner },
          { x: corner, y: -corner, z: -corner },
          { x: corner, y: corner, z: -corner },
          { x: -corner, y: corner, z: -corner },
        ],
        [
          { x: -corner, y: -corner, z: corner },
          { x: corner, y: -corner, z: corner },
          { x: corner, y: corner, z: corner },
          { x: -corner, y: corner, z: corner },
        ],
        [
          { x: -corner, y: -corner, z: -corner },
          { x: -corner, y: -corner, z: corner },
          { x: -corner, y: corner, z: corner },
          { x: -corner, y: corner, z: -corner },
        ],
        [
          { x: corner, y: -corner, z: -corner },
          { x: corner, y: -corner, z: corner },
          { x: corner, y: corner, z: corner },
          { x: corner, y: corner, z: -corner },
        ],
        [
          { x: -corner, y: -corner, z: -corner },
          { x: corner, y: -corner, z: -corner },
          { x: corner, y: -corner, z: corner },
          { x: -corner, y: -corner, z: corner },
        ],
        [
          { x: -corner, y: corner, z: -corner },
          { x: corner, y: corner, z: -corner },
          { x: corner, y: corner, z: corner },
          { x: -corner, y: corner, z: corner },
        ],
      ];
      faces
        .map((points, i) => ({
          points,
          i,
          z: points.reduce((n, p) => n + project(p).z, 0) / 4,
        }))
        .sort((a, b) => b.z - a.z)
        .forEach(({ points, i }) =>
          path(
            points,
            "rgba(255,255,255,.16)",
            ["#101010", "#191919", "#121212", "#202020", "#272727", "#111111"][
              i
            ],
            1,
          ),
        );
      // Fine contour ribbons separate and settle, retaining the same cubic form.
      const spread = 1 + Math.pow((Math.sin(t * 0.42) + 1) / 2, 4) * 0.22;
      const rings = 46,
        segments = 100;
      for (let row = 0; row <= rings; row++) {
        const y = ((row / rings) * 2.22 - 1.11) * spread;
        const points: Point[] = [];
        const twist = Math.sin(t * 0.28 + row * 0.055) * 0.025;
        for (let j = 0; j <= segments; j++) {
          const a = (j / segments) * Math.PI * 2 + Math.PI / 4;
          const c = Math.cos(a),
            s = Math.sin(a);
          const x = Math.sign(c) * Math.pow(Math.abs(c), 0.16) * 1.13;
          const z = Math.sign(s) * Math.pow(Math.abs(s), 0.16) * 1.13;
          points.push({
            x: x * Math.cos(twist) - z * Math.sin(twist),
            y,
            z: x * Math.sin(twist) + z * Math.cos(twist),
          });
        }
        // Draw short segments with depth-dependent silver highlights.
        for (let j = 1; j < points.length; j++) {
          const p = project(points[j - 1]),
            q = project(points[j]);
          const front = Math.max(0, Math.min(1, (1.8 - q.z) / 3.6));
          const shine =
            0.09 +
            front * 0.46 +
            Math.max(0, Math.sin(j * 0.068 + row * 0.06 + t * 0.3)) * 0.09;
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(q.x, q.y);
          ctx!.strokeStyle = `rgba(235,235,235,${shine})`;
          ctx!.lineWidth = 0.7;
          ctx!.stroke();
        }
      }
      // A handful of travelling points trace the form, rather than random confetti.
      for (let i = 0; i < 18; i++) {
        const a = t * 0.12 + i * 2.399,
          y = (((i * 7) % 18) / 18) * 2.22 - 1.11;
        const c = Math.cos(a),
          s = Math.sin(a);
        const p = project({
          x: Math.sign(c) * Math.pow(Math.abs(c), 0.16) * 1.14,
          y: y * spread,
          z: Math.sign(s) * Math.pow(Math.abs(s), 0.16) * 1.14,
        });
        ctx!.fillStyle = `rgba(255,255,255,${p.z < 0 ? 0.82 : 0.22})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.z < 0 ? 1.5 : 1, 0, Math.PI * 2);
        ctx!.fill();
      }
      if (paused || reduce) cancelAnimationFrame(frame);
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(paint);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [paused]);
  return <canvas ref={canvas} className="sb-sculpture" aria-hidden="true" />;
}
