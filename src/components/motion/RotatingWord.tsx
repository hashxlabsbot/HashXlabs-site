"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/useScrollProgress";

const HEX = "0123456789abcdef";
const DECODE_MS = 700;

/**
 * Headline phrase that cycles through `words`. Each change rolls the old
 * phrase out upwards, rolls the new one in letter by letter, and decodes it
 * out of hex noise.
 * Hover pauses; click advances. Screen readers get a single, stable label.
 */
export default function RotatingWord({ words, interval = 3200, label }: { words: string[]; interval?: number; label: string }) {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [text, setText] = useState(words[0]);
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // bumps on every change to remount the animations
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
  }, []);

  const go = (next: number) => {
    setPrev(i);
    setI(next);
    setTick((t) => t + 1);
  };

  // Drop the outgoing phrase once it has rolled out, so it stops holding width.
  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 450);
    return () => clearTimeout(t);
  }, [prev, tick]);

  // Auto-advance.
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go((i + 1) % words.length), interval);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused, interval, words.length, tick]);

  // Decode the new word out of hex.
  useEffect(() => {
    const word = words[i];
    if (reduced.current) {
      setText(word);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / DECODE_MS);
      setText(
        word
          .split("")
          .map((ch, n) => (ch === " " || n / word.length < k * 1.15 - 0.15 ? ch : HEX[(Math.random() * 16) | 0]))
          .join("")
      );
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [i, words]);

  // Outgoing letters leave fast; incoming letters wait until the line is clear.
  const chars = (s: string, cls: string) =>
    s.split("").map((ch, n) => (
      <span
        key={n}
        className={`inline-block ${cls}`}
        style={{ animationDelay: cls === "rw-out" ? `${n * 10}ms` : `${160 + n * 22}ms` }}
      >
        {ch === " " ? " " : ch}
      </span>
    ));

  return (
    <span
      className="group relative inline-block cursor-pointer align-bottom"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => go((i + 1) % words.length)}
      aria-label={label}
      role="text"
    >
      <span aria-hidden="true" className="relative inline-grid overflow-hidden pb-[0.12em] align-bottom">
        {prev !== null && (
          <span key={`out-${tick}`} className="col-start-1 row-start-1 whitespace-nowrap text-[var(--signal)]">
            {chars(words[prev], "rw-out")}
          </span>
        )}
        <span key={`in-${tick}`} className="col-start-1 row-start-1 whitespace-nowrap text-[var(--signal)]">
          {chars(text, tick === 0 ? "" : "rw-in")}
        </span>
      </span>
    </span>
  );
}
