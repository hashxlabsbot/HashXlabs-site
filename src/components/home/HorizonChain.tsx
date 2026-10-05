"use client";

import { useState, type CSSProperties } from "react";
import { fmt, useLiveChain, useNow, type Row, type Snapshot } from "@/lib/liveChain";

/* The hero's horizon: real mainnet blocks standing on a planet's rim.
   Newest block at the centre (over the light flare), older blocks curve away
   to the left, the next slot fills on the right over the chain's slot time,
   faint empty sockets beyond it. When a real block arrives, every tile glides
   one step along the arc (CSS transform transition on small elements only).
   Data: lib/liveChain, read from a public node in the visitor's browser. If
   the feed fails, the centre says so instead of pretending. Styles: "X HERO". */

const KEEP = 9; // blocks remembered (the feed returns 6; history grows as blocks arrive)
const SHOW_OLD = 4; // older blocks visible to the left of the newest
const SLOT_S = 12; // Ethereum slot time; other EVM chains are faster, the bar just completes sooner

const ago = (now: number, t: number | null) => {
  if (!t || !now) return "";
  const s = Math.max(0, Math.round(now / 1000 - t));
  return s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
};
const pos = (p: number) => ({ "--p": p, opacity: Math.max(0, 1 - Math.abs(p) * 0.17) }) as CSSProperties;

export default function HorizonChain() {
  const { chain, snap, status } = useLiveChain();
  const now = useNow();
  // Merge each new snapshot into a short history keyed by height (newest first),
  // adjusted during render (React's pattern for state derived from changing input).
  // A chain switch elsewhere on the site starts the history over.
  const [h, setH] = useState<{ snap: Snapshot | null; id: string; rows: Row[] }>({ snap: null, id: chain.id, rows: [] });
  let hist = h.rows;
  if (snap !== h.snap || chain.id !== h.id) {
    const by = new Map((chain.id === h.id ? h.rows : []).map((r) => [r.height, r]));
    snap?.rows.forEach((r) => by.set(r.height, r));
    hist = [...by.values()].sort((a, b) => b.height - a.height).slice(0, KEEP);
    setH({ snap, id: chain.id, rows: hist });
  }

  const head = hist[0];
  const down = status === "error";
  const elapsed = head?.time && now ? Math.max(0, now / 1000 - head.time) : 0;
  const unit = chain.kind === "solana" ? "Slot" : "Block";

  return (
    <div className="xh-orbit" role="region" aria-label={`Latest ${chain.name} ${unit.toLowerCase()}s, read live`}>
      {head ? (
        <>
          {hist.slice(0, SHOW_OLD + 2).map((r, k) => (
            <a
              key={r.height}
              href={`${chain.explorer}${r.height}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`xh-blk${k === 0 ? " is-head" : ""}${k > SHOW_OLD ? " is-gone" : ""}`}
              style={pos(-k)}
              aria-label={`${unit} ${fmt(r.height)}, ${r.txs} transactions`}
            >
              <span className="xh-blk-top">
                <span className="mono xh-blk-n">#{fmt(r.height)}</span>
                {k === 0 && <span className="xh-blk-tag">Latest</span>}
              </span>
              <span className="xh-blk-m">
                {fmt(r.txs)} txs{k === 0 ? ` · ${ago(now, r.time)}` : chain.kind === "evm" ? ` · ${r.a} gas` : ""}
              </span>
            </a>
          ))}
          <span className="xh-blk is-next" style={pos(1)} aria-hidden="true">
            <span className="xh-blk-top">
              <span className="mono xh-blk-n">#{fmt(head.height + 1)}</span>
            </span>
            <span className="xh-blk-m">Next {unit.toLowerCase()}</span>
            <span className="xh-blk-bar">
              {/* Restarts per block; the negative delay starts it at the time already elapsed. */}
              <i key={head.height} style={{ animationDelay: `-${Math.min(elapsed, SLOT_S).toFixed(1)}s` }} />
            </span>
          </span>
          {[2, 3, 4].map((p) => (
            <span key={p} className="xh-blk is-empty" style={pos(p)} aria-hidden="true" />
          ))}
        </>
      ) : (
        <span className="xh-blk is-head is-wait" style={pos(0)}>
          <span className="xh-blk-top">
            <span className="mono xh-blk-n">{down ? "Feed paused" : "Connecting…"}</span>
          </span>
          <span className="xh-blk-m">{chain.name} mainnet</span>
        </span>
      )}
    </div>
  );
}
