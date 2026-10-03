"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/useScrollProgress";

const HEX = "0123456789abcdef";

/**
 * Text that resolves out of hex noise the first time it scrolls into
 * view — like a hash settling. Screen readers get the plain text.
 */
export default function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 700;
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / dur);
        const shown = Math.floor(k * text.length);
        setOut(
          text
            .split("")
            .map((ch, i) => (i < shown || ch === " " ? ch : HEX[(Math.random() * 16) | 0]))
            .join("")
        );
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
