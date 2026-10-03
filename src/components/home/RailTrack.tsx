"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Client shell for the services rail. The motion is pure CSS (scroll-driven
 * animations); this only keeps keyboard users oriented: when Tab lands on a
 * link in a column that is still off to the side, scroll the page to the point
 * where that column sits in view.
 */
export default function RailTrack({ count, children }: { count: number; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  const onFocus = (e: React.FocusEvent) => {
    const el = root.current;
    const col = (e.target as HTMLElement).closest<HTMLElement>(".sv-col");
    // The stage is sticky only in the pinned block in globals.css.
    if (!el || !col || getComputedStyle(el.firstElementChild as Element).position !== "sticky") return;
    const k = Array.prototype.indexOf.call(col.parentElement!.children, col);
    // Columns are 50vw; the strip travels count * 50vw. Put the column's left edge at 25vw.
    const p = Math.min(1, Math.max(0, (k * 50 - 25) / (count * 50)));
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <div ref={root} className="sv-track" style={{ "--ns": count } as CSSProperties} onFocus={onFocus}>
      <div className="sv-stage">
        <div className="sv-strip">{children}</div>
      </div>
    </div>
  );
}
