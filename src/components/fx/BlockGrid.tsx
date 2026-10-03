"use client";

import { useEffect, useRef } from "react";

/* Live "block grid" for hero backgrounds. Sits over the CSS .bg-grid and
   lights its cells: cells near the cursor glow, and every second or two a
   chain of blocks links up across the grid. One small 2D canvas: DPR capped
   at 2, paused off-screen, off entirely under reduced motion. The cell size
   and origin match .bg-grid (56px from the element's top-left). */

export default function BlockGrid({ cell = 56, className = "" }: { cell?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let W = 0;
    let H = 0;
    let cols = 0;
    let rows = 0;
    let e = new Float32Array(0);
    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(1, Math.ceil(W / cell));
      rows = Math.max(1, Math.ceil(H / cell));
      e = new Float32Array(cols * rows);
    };
    size();

    let mx = -1e4;
    let my = -1e4;
    const onMove = (ev: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      mx = ev.clientX - r.left;
      my = ev.clientY - r.top;
    };

    type Link = { a: number; b: number; t: number };
    let links: Link[] = [];
    let chain: { c: number; r: number; left: number; next: number } | null = null;
    let nextChain = 600;
    let raf = 0;
    let last = 0;
    let visible = true;

    const frame = (t: number) => {
      raf = 0;
      if (!visible) return;
      const dt = last ? Math.min(50, t - last) : 16;
      last = t;
      const decay = Math.pow(0.935, dt / 16);

      // Cursor glow
      if (mx > -1e3 && mx < W + cell && my > -cell && my < H + cell) {
        const c0 = Math.floor(mx / cell);
        const r0 = Math.floor(my / cell);
        for (let r = r0 - 3; r <= r0 + 3; r++) {
          for (let c = c0 - 3; c <= c0 + 3; c++) {
            if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
            const v = 1 - Math.hypot((c + 0.5) * cell - mx, (r + 0.5) * cell - my) / (cell * 2.7);
            if (v > 0) {
              const i = r * cols + c;
              e[i] = Math.max(e[i], v * 0.6);
            }
          }
        }
      }

      // Block chains linking up across the grid
      if (!chain && t > nextChain) {
        chain = { c: Math.floor(Math.random() * cols), r: Math.floor(Math.random() * rows * 0.85), left: 4 + Math.floor(Math.random() * 4), next: t };
        nextChain = t + 1200 + Math.random() * 1400;
      }
      if (chain && t >= chain.next) {
        const i = chain.r * cols + chain.c;
        e[i] = 1;
        const right = Math.random() < 0.62;
        const nc = chain.c + (right ? 1 : 0);
        const nr = chain.r + (right ? 0 : Math.random() < 0.5 ? 1 : -1);
        chain.left--;
        if (chain.left <= 0 || nc >= cols || nr < 0 || nr >= rows) chain = null;
        else {
          links.push({ a: i, b: nr * cols + nc, t: 1 });
          chain.c = nc;
          chain.r = nr;
          chain.next = t + 150;
        }
      }

      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < e.length; i++) {
        const v = e[i];
        if (v < 0.01) {
          if (v) e[i] = 0;
          continue;
        }
        const c = i % cols;
        const r = (i / cols) | 0;
        ctx.fillStyle = `rgba(0,87,217,${(v * 0.15).toFixed(3)})`;
        ctx.fillRect(c * cell + 1, r * cell + 1, cell - 1, cell - 1);
        if (v > 0.55) {
          ctx.strokeStyle = `rgba(0,87,217,${((v - 0.55) * 1.1).toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(c * cell + 0.5, r * cell + 0.5, cell, cell);
        }
        e[i] = v * decay;
      }

      ctx.lineWidth = 2;
      links = links.filter((l) => {
        l.t *= decay;
        if (l.t < 0.03) return false;
        const ac = l.a % cols;
        const ar = (l.a / cols) | 0;
        const bc = l.b % cols;
        const br = (l.b / cols) | 0;
        ctx.strokeStyle = `rgba(0,87,217,${(l.t * 0.6).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo((ac + 0.5) * cell, (ar + 0.5) * cell);
        ctx.lineTo((bc + 0.5) * cell, (br + 0.5) * cell);
        ctx.stroke();
        ctx.fillStyle = `rgba(0,87,217,${(l.t * 0.9).toFixed(3)})`;
        ctx.fillRect((bc + 0.5) * cell - 3, (br + 0.5) * cell - 3, 6, 6);
        return true;
      });

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!raf && visible) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) start();
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => size());
    ro.observe(cv);
    window.addEventListener("pointermove", onMove, { passive: true });
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [cell]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
