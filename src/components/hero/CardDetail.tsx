"use client";

import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { RingDetail } from "@/content/ringDetails";

// The hover/tap detail for a hero ring card. Portalled to <body> so the
// hero's scaled, overflow-hidden canvas can't clip or scale it.

const W = 460;

export function panelPlacement(rect: DOMRect): { style: CSSProperties; side: "left" | "right" | "sheet" } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (vw <= 700) return { style: {}, side: "sheet" };
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 96;
  const w = Math.min(W, vw - 32);
  const right = rect.left + rect.width / 2 < vw / 2;
  const left = right ? rect.right + 18 : rect.left - 18 - w;
  // Aim near the card, but keep the whole panel (~640px) on screen when there's room.
  const top = Math.max(header + 16, Math.min(rect.top - 60, vh - 656));
  return {
    side: right ? "right" : "left",
    style: { left: Math.min(Math.max(left, 16), vw - w - 16), top, width: w, maxHeight: vh - top - 16 },
  };
}

export default function CardDetail({
  d,
  n,
  total,
  rect,
  onEnter,
  onLeave,
  onClose,
}: {
  d: RingDetail;
  n: number;
  total: number;
  rect: DOMRect;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  const { style, side } = panelPlacement(rect);
  return createPortal(
    <div
      className={`cd cd-${side}`}
      style={{ ...style, ["--tone" as string]: d.tone }}
      role="dialog"
      aria-label={d.title}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
    >
      <div className="cd-top">
        <span className="cd-eyebrow">
          <i aria-hidden="true" />
          {d.eyebrow}
        </span>
        <span className="cd-n">
          {String(n + 1).padStart(2, "0")} / {total}
        </span>
        <button type="button" className="cd-x" aria-label="Close" onClick={onClose}>
          ×
        </button>
      </div>

      <h3 className="cd-title">{d.title}</h3>
      <p className="cd-concept">
        <b>The hard part.</b> {d.concept}
      </p>

      <div className="cd-label">What we do</div>
      <ul className="cd-what">
        {d.what.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>

      <div className="cd-label">How we build it</div>
      <ol className="cd-how">
        {d.how.map(([k, v], i) => (
          <li key={k}>
            <u>0{i + 1}</u>
            <b>{k}</b>
            <span>{v}</span>
          </li>
        ))}
      </ol>

      <div className="cd-stack">
        {d.stack.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>

      <Link href={d.href} className="cd-cta">
        {d.cta} <span aria-hidden="true">→</span>
      </Link>
    </div>,
    document.body
  );
}
