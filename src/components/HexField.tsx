"use client";

import { useEffect, useRef } from "react";

/**
 * A field of small hex glyphs that light up and scramble near the cursor.
 * Decorative only. Pauses off-screen, draws one static frame under
 * prefers-reduced-motion, and reads its colours from the CSS tokens.
 */
export default function HexField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CELL_X = 34;
    const CELL_Y = 30;
    const GLYPHS = "0123456789abcdef";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0, cols = 0, rows = 0;
    let chars: string[] = [];
    let mx = -9999, my = -9999;
    let raf = 0;
    let visible = true;
    let ink = "11,18,32";
    let sig = "0,87,217";

    const rgb = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      const m = v.match(/^#([0-9a-f]{6})$/i);
      if (!m) return fallback;
      const n = parseInt(m[1], 16);
      return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL_X) + 1;
      rows = Math.ceil(h / CELL_Y) + 1;
      chars = Array.from({ length: cols * rows }, () => GLYPHS[(Math.random() * 16) | 0]);
      ink = rgb("--t-hi", ink);
      sig = rgb("--signal", sig);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = '11px "Martian Mono", ui-monospace, monospace';
      ctx.textBaseline = "middle";
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = x * CELL_X + 8;
          const py = y * CELL_Y + 8;
          const d = Math.hypot(px - mx, py - my);
          const near = Math.max(0, 1 - d / 170);
          const i = y * cols + x;
          if (near > 0.35 && Math.random() < 0.12 * near) chars[i] = GLYPHS[(Math.random() * 16) | 0];
          const drift = 0.5 + 0.5 * Math.sin(t / 1800 + x * 0.35 + y * 0.6);
          const base = 0.04 + drift * 0.04;
          if (near > 0.02) {
            ctx.fillStyle = `rgba(${sig},${Math.min(1, base + near * 0.9)})`;
          } else {
            ctx.fillStyle = `rgba(${ink},${base})`;
          }
          ctx.fillText(chars[i], px, py);
        }
      }
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const onLeave = () => { mx = my = -9999; };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    if (reduce) {
      draw(0);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none block h-full w-full ${className}`} />;
}
