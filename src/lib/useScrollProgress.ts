"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks how far an element has scrolled and writes it to a `--p` CSS
 * variable (0..1) on that element, so children can animate in pure CSS
 * without React re-rendering every frame.
 *
 * "pin":  0 when the element's top hits the viewport top, 1 when its
 *         bottom reaches the viewport bottom. For tall sticky sections.
 * "pass": 0 when the element enters from below, 1 when it leaves the top.
 */
export function useScrollProgress<T extends HTMLElement>(
  mode: "pin" | "pass",
  onChange?: (p: number) => void
) {
  const ref = useRef<T>(null);
  const cb = useRef(onChange);
  useEffect(() => {
    cb.current = onChange;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = mode === "pin" ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      const p = Math.min(1, Math.max(0, raw));
      el.style.setProperty("--p", p.toFixed(4));
      cb.current?.(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [mode]);

  return ref;
}

/** True when the user has asked for reduced motion. Client-only. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
