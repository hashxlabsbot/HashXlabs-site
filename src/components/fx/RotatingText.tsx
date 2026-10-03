"use client";

import { useEffect, useState } from "react";

/* Cycles through words, sliding each up and out. The box is as wide as the
   longest word (all words share one grid cell), so nothing around it jumps. */
export default function RotatingText({ words, every = 2200, className = "" }: { words: string[]; every?: number; className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), every);
    return () => clearInterval(id);
  }, [words.length, every]);

  const prev = (i - 1 + words.length) % words.length;
  return (
    <span className={`rot ${className}`}>
      <span className="sr-only">{words.join(", ")}</span>
      {words.map((w, k) => (
        <span key={w} aria-hidden="true" className={k === i ? "on" : k === prev ? "out" : ""}>
          {w}
        </span>
      ))}
    </span>
  );
}
