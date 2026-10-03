"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A terminal/editor panel that types itself out when scrolled into view.
 * Used in "How We Work" to make the process section feel like engineering
 * rather than marketing copy.
 */

type Line = { t: string; c: string };

const LINES: Line[] = [
  { t: "$ hashx init --stack next,postgres,ai", c: "text-[#22d3ee]" },
  { t: "✓ scaffolding architecture", c: "text-white/45" },
  { t: "✓ provisioning cloud infra", c: "text-white/45" },
  { t: "✓ wiring CI/CD pipeline", c: "text-white/45" },
  { t: "✓ 128 tests passing", c: "text-[#28c840]" },
  { t: "→ shipped to production in 1.2s", c: "text-[#7c5cff]" },
];

export default function CodeWindow() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion (or no IO support): show everything immediately.
    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(LINES.length);
      setDone(true);
      return;
    }

    // Declared up front so `step` can reassign it and cleanup can clear it.
    let timer = 0;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        let i = 0;
        const step = () => {
          i += 1;
          setShown(i);
          if (i < LINES.length) {
            timer = window.setTimeout(step, 520);
          } else {
            setDone(true);
          }
        };
        timer = window.setTimeout(step, 320);
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      // Without this, an in-flight timeout fires setState after unmount.
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-2xl border border-white/12 overflow-hidden shadow-2xl"
      style={{ background: "linear-gradient(160deg, #0a1022 0%, #060a18 100%)" }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 h-9 border-b border-white/8 bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="mono text-[10px] text-white/30 ml-2">zsh — hashx</span>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 min-h-[188px]">
        {LINES.slice(0, shown).map((l, i) => (
          <div
            key={i}
            className={`mono text-[11px] sm:text-xs leading-6 ${l.c}`}
            style={{ animation: "slide-up 0.4s cubic-bezier(0.22,1,0.36,1) both" }}
          >
            {l.t}
          </div>
        ))}
        {/* Cursor */}
        {shown > 0 && (
          <span
            className={`mono text-xs text-[#22d3ee] ${done ? "animate-blink" : ""}`}
          >
            ▍
          </span>
        )}
      </div>
    </div>
  );
}
