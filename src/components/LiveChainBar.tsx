"use client";

import { CHAINS, fmt, selectChain, useLiveChain, useNow } from "@/lib/liveChain";

// Live mainnet readout above the navbar. Data comes from the shared poller in
// lib/liveChain, which the hero's explorer mock also reads.

export default function LiveChainBar() {
  const { chain, snap, status, tick } = useLiveChain();
  const now = useNow();

  const age = snap?.time != null && now ? Math.max(0, Math.round(now / 1000 - snap.time)) : null;

  // A public RPC failing is our problem, not the visitor's: show a calm paused
  // state instead of red error copy that makes the site itself look broken.
  const dot = status === "live" ? "bg-emerald-400" : status === "error" ? "bg-white/30" : "bg-amber-400";
  const statusText =
    status === "live" ? "Live" : status === "error" ? "Paused" : status === "stale" ? "Reconnecting" : "Connecting";

  return (
    <div
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#05070d] text-[#8e9bb3]"
      style={{ height: "var(--bar-h)" }}
    >
      <div className="mono mx-auto flex h-full max-w-[1280px] items-center gap-4 overflow-hidden px-5 text-[11px] sm:px-8">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {status === "live" && (
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${dot}`} />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${dot}`} />
          </span>
          <span className="hidden uppercase tracking-[0.12em] text-white/60 sm:inline" aria-live="polite">
            {statusText}
          </span>
          <label className="relative flex items-center">
            <span className="sr-only">Choose a blockchain to view live data</span>
            <select
              value={chain.id}
              onChange={(e) => selectChain(e.target.value)}
              className="cursor-pointer appearance-none rounded-[3px] border border-white/15 bg-white/5 py-[3px] pl-2 pr-6 font-semibold uppercase tracking-[0.08em] text-white outline-none transition-colors hover:border-white/35 focus-visible:border-[var(--signal)]"
            >
              {CHAINS.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0b1220] text-white">
                  {c.name}
                </option>
              ))}
            </select>
            <span aria-hidden="true" className="pointer-events-none absolute right-2 text-[9px] text-white/60">
              ▾
            </span>
          </label>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-4 whitespace-nowrap">
          {snap ? (
            <>
              <a
                href={chain.explorer + snap.height}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5"
                title={`Open ${snap.heightLabel.toLowerCase()} in explorer`}
              >
                <span className="text-white/50">{snap.heightLabel}</span>
                <span
                  key={tick}
                  className="font-semibold text-white tabular-nums group-hover:underline"
                  style={{ animation: tick ? "hx-tick 900ms var(--ease-out-expo)" : undefined }}
                >
                  #{fmt(snap.height)}
                </span>
                {age !== null && <span className="hidden text-white/40 md:inline">{age}s ago</span>}
              </a>
              {snap.stats.map((s) => (
                <span key={s.label} className={`items-center gap-1.5 ${s.wide ? "hidden lg:flex" : "hidden sm:flex"}`}>
                  <span className="text-white/20">|</span>
                  <span className="text-white/50">{s.label}</span>
                  <span className={`tabular-nums ${s.tone === "good" ? "text-emerald-400" : "text-white"}`}>{s.value}</span>
                </span>
              ))}
            </>
          ) : (
            <span className="text-white/40">
              {status === "error" ? `${chain.name} live feed paused` : `Reading ${chain.name} mainnet…`}
            </span>
          )}
        </div>

        <span className="hidden shrink-0 text-white/35 xl:inline">mainnet · public RPC</span>
      </div>
    </div>
  );
}
