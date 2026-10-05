"use client";

import { useEffect, useState, type CSSProperties } from "react";

/* The hero's horizon: real Ethereum mainnet blocks standing on a planet's rim.
   Newest block at the centre (over the light flare), older blocks curve away
   to the left, the next slot fills on the right over the slot time, faint
   empty sockets beyond it. When a new block arrives every tile glides one step
   along the arc (CSS transform transition on small elements only).
   Data: our own /api/chain (app/api/chain/route.ts), which reads the chain on
   the server and is cached at the CDN, so it never touches a visitor's network
   or a public node's rate limit. If it can't be reached the centre says so and
   keeps retrying; it never fakes a block. Styles: "X HERO" in globals.css. */

type Row = { height: number; time: number; txs: number; gas: number };
type Feed = { height: number; rows: Row[]; at: number; stale?: boolean };

const KEEP = 9; // blocks remembered (the feed returns 6; history grows as blocks arrive)
const SHOW_OLD = 4; // older blocks visible to the left of the newest
const SLOT_S = 12; // Ethereum slot time
const POLL_MS = 12000;
const EXPLORER = "https://etherscan.io/block/";

const fmt = (n: number) => n.toLocaleString("en-US");
const ago = (now: number, t: number) => {
  if (!now) return "";
  const s = Math.max(0, Math.round(now / 1000 - t));
  return s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
};
const pos = (p: number) => ({ "--p": p, opacity: Math.max(0, 1 - Math.abs(p) * 0.17) }) as CSSProperties;

/** Polls /api/chain while the tab is visible; keeps the last good answer across failures. */
function useChainFeed() {
  const [rows, setRows] = useState<Row[]>([]);
  const [state, setState] = useState<"loading" | "live" | "down">("loading");
  const [now, setNow] = useState(0);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let fails = 0;

    const tick = async () => {
      if (document.hidden) {
        timer = setTimeout(tick, 1500);
        return;
      }
      try {
        const res = await fetch("/api/chain", { cache: "no-store", signal: AbortSignal.timeout(10000) });
        if (!res.ok) throw new Error(String(res.status));
        const feed = (await res.json()) as Feed;
        if (!alive) return;
        fails = 0;
        setState("live");
        setRows((h) => {
          const by = new Map(h.map((r) => [r.height, r]));
          feed.rows.forEach((r) => by.set(r.height, r));
          return [...by.values()].sort((a, b) => b.height - a.height).slice(0, KEEP);
        });
      } catch {
        if (!alive) return;
        fails += 1;
        setState((s) => (s === "live" && fails < 3 ? "live" : "down"));
      } finally {
        if (alive) timer = setTimeout(tick, fails ? Math.min(60000, POLL_MS * 2 ** Math.min(fails, 3)) : POLL_MS);
      }
    };
    tick();
    const clock = setInterval(() => setNow(Date.now()), 1000);
    setNow(Date.now());
    return () => {
      alive = false;
      clearTimeout(timer);
      clearInterval(clock);
    };
  }, []);

  return { rows, state, now };
}

export default function HorizonChain() {
  const { rows: hist, state, now } = useChainFeed();

  // Let the caption under the planet follow the real feed state (no "live" dot while it is down).
  useEffect(() => {
    const host = document.querySelector(".xh-horizon");
    host?.setAttribute("data-feed", state);
    return () => host?.removeAttribute("data-feed");
  }, [state]);
  const head = hist[0];
  const elapsed = head && now ? Math.max(0, now / 1000 - head.time) : 0;

  return (
    <div className="xh-orbit" role="region" aria-label="Latest Ethereum blocks, read live">
      {head ? (
        <>
          {hist.slice(0, SHOW_OLD + 2).map((r, k) => (
            <a
              key={r.height}
              href={`${EXPLORER}${r.height}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`xh-blk${k === 0 ? " is-head" : ""}${k > SHOW_OLD ? " is-gone" : ""}`}
              style={pos(-k)}
              aria-label={`Block ${fmt(r.height)}, ${r.txs} transactions`}
            >
              <span className="xh-blk-top">
                <span className="mono xh-blk-n">#{fmt(r.height)}</span>
                {k === 0 && <span className="xh-blk-tag">Latest</span>}
              </span>
              <span className="xh-blk-m">
                {fmt(r.txs)} txs{k === 0 ? ` · ${ago(now, r.time)}` : ` · ${r.gas}% gas`}
              </span>
            </a>
          ))}
          <span className="xh-blk is-next" style={pos(1)} aria-hidden="true">
            <span className="xh-blk-top">
              <span className="mono xh-blk-n">#{fmt(head.height + 1)}</span>
            </span>
            <span className="xh-blk-m">Next block</span>
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
            <span className="mono xh-blk-n">Ethereum mainnet</span>
          </span>
          <span className="xh-blk-m">{state === "down" ? "Feed unavailable, retrying" : "Reading the latest block"}</span>
        </span>
      )}
    </div>
  );
}
