"use client";

import { useRef, type CSSProperties } from "react";
import { WORK } from "@/content/site";
import { SHOT_H, SHOT_W, shotSrc } from "@/lib/shots";

/**
 * /case-studies hero visual: the four case-study interfaces fanned out like a
 * hand of cards. They are dealt in on load; hovering one straightens and
 * lifts it, clicking jumps to its write-up. The whole fan leans toward the
 * pointer (mouse only, rAF-throttled, one CSS variable pair on one element).
 * Styles: "INNER PAGES" in globals.css.
 */
export default function WorkDeck() {
  const fan = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const items = WORK.filter((w) => w.shot);
  const mid = (items.length - 1) / 2;

  const lean = (x: number, y: number) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      fan.current?.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
      fan.current?.style.setProperty("--rx", `${(8 - y * 6).toFixed(2)}deg`);
    });
  };

  return (
    <div
      className="wd"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        lean((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        cancelAnimationFrame(raf.current);
        fan.current?.style.removeProperty("--rx");
        fan.current?.style.removeProperty("--ry");
      }}
    >
      <div ref={fan} className="wd-fan">
        {items.map((w, i) => {
          const o = i - mid;
          return (
            <a
              key={w.id}
              href={`#${w.id}`}
              className={`wd-slot${o > 0 ? " wd-slot--r" : ""}`}
              style={{ "--o": o, "--i": i, zIndex: 10 - Math.ceil(Math.abs(o)) } as CSSProperties}
              aria-label={`${w.tag}: ${w.title}`}
            >
              <span className="wd-card">
                {/* Plain <img>: pre-sized WebP from our own origin (see PhotoVisual for why). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shotSrc(w.shot!.name, 1024)} width={SHOT_W} height={SHOT_H} alt="" decoding="async" fetchPriority={i === 1 ? "high" : "auto"} />
                <span className="wd-label">
                  <span className="mono">0{i + 1}</span>
                  {w.tag}
                </span>
              </span>
            </a>
          );
        })}
      </div>
      <p className="wd-cap">Illustrative interfaces, not client screenshots. Pick one to read how it was built.</p>
    </div>
  );
}
