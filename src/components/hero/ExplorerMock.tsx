"use client";

import { CHAINS, fmt, selectChain, useLiveChain, useNow } from "@/lib/liveChain";

// The browser mock in front of the ring. It is a real, working mini block
// explorer: same live data as the top bar, and the chain tabs switch both.

export default function ExplorerMock() {
  const { chain, snap, status, tick } = useLiveChain();
  const now = useNow();

  return (
    <div className="hx-browser">
      <div className="hx-bar">
        <div className="hx-dots" aria-hidden="true">
          <i style={{ background: "#ee5c62" }} />
          <i style={{ background: "#f6b719" }} />
          <i style={{ background: "#12c02f" }} />
        </div>
        <div className="hx-omni">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.8-3.8" />
          </svg>
          <span>
            {chain.name} mainnet · live
          </span>
        </div>
        <div className="hx-tools" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M12 16V4m0 0L8 8m4-4 4 4" />
            <path d="M4 15v5h16v-5" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M12 3 3 8l9 5 9-5-9-5Z" fill="#fff" opacity=".95" />
            <path d="M3 13l9 5 9-5" opacity=".55" />
          </svg>
        </div>
      </div>

      <div className="hx-page">
        <div className="hx-ann">
          <span className={`hx-pulse ${status === "live" ? "is-live" : status === "error" ? "is-err" : ""}`} />
          <span>
            {status === "live"
              ? "Streaming from public mainnet RPC"
              : status === "error"
                ? "RPC unreachable, retrying"
                : "Connecting to mainnet RPC"}
          </span>
        </div>

        <div className="hx-xhead">
          <div className="hx-xlogo">
            <b>HashX</b> Explorer
          </div>
          <div className="hx-tabs" role="tablist" aria-label="Chain">
            {CHAINS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={c.id === chain.id}
                onClick={() => selectChain(c.id)}
                className={c.id === chain.id ? "on" : ""}
              >
                {c.short}
              </button>
            ))}
          </div>
        </div>

        <div className="hx-stats">
          <div className="hx-stat hx-stat-main">
            <u>{snap?.heightLabel ?? "Block"}</u>
            <b key={tick} className={tick ? "hx-flash" : ""}>
              {snap ? `#${fmt(snap.height)}` : "—"}
            </b>
          </div>
          {(snap?.stats ?? [0, 1, 2].map(() => null)).slice(0, 3).map((s, i) => (
            <div key={s?.label ?? i} className="hx-stat">
              <u>{s?.label ?? "…"}</u>
              <b className={s?.tone === "good" ? "good" : ""}>{s?.value ?? "—"}</b>
            </div>
          ))}
        </div>

        <div className="hx-table">
          <div className="hx-tr hx-th">
            <span>{snap?.heightLabel ?? "Block"}</span>
            <span>{chain.kind === "solana" ? "Window" : "Age"}</span>
            <span>Txs</span>
            <span>{snap?.cols[0] ?? "Gas used"}</span>
            <span>{snap?.cols[1] ?? "Fee recipient"}</span>
          </div>
          {(snap?.rows ?? []).map((r, i) => (
            <a
              key={r.height}
              className={`hx-tr ${i === 0 && tick ? "hx-new" : ""}`}
              href={chain.explorer + r.height}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="hx-num">#{fmt(r.height)}</span>
              <span>{r.time != null && now ? `${Math.max(0, Math.round(now / 1000 - r.time))}s ago` : "60s"}</span>
              <span>{fmt(r.txs)}</span>
              <span>{r.a}</span>
              <span className="hx-mono">{r.b}</span>
            </a>
          ))}
          {!snap &&
            [0, 1, 2, 3].map((i) => (
              <div key={i} className="hx-tr hx-skel" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
