"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's visual anchor: a fake product dashboard.
 *
 * This is the "tech image" — drawn in code rather than a stock photo so it
 * stays sharp at any DPI, themes with the brand, and costs no image bytes.
 * Animated bars + live-ish counters make it read as a real running product.
 */

const bars = [38, 62, 45, 78, 55, 92, 70, 84, 60, 96, 74, 88];

const rows = [
  { name: "api-gateway",    status: "healthy",  ms: "42ms",  tone: "ok" },
  { name: "auth-service",   status: "healthy",  ms: "28ms",  tone: "ok" },
  { name: "ml-inference",   status: "scaling",  ms: "118ms", tone: "warn" },
  { name: "postgres-primary", status: "healthy", ms: "11ms", tone: "ok" },
];

export default function DashboardMock() {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);

  // Only animate once the mock is actually on screen — avoids burning
  // a timer on a component the user has scrolled past.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => setLive(e.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!live) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 2600);
    return () => clearInterval(id);
  }, [live]);

  // Deterministic pseudo-jitter so numbers feel live without being random
  // on the server (which would cause a hydration mismatch).
  const rps = 12480 + ((tick * 137) % 640);
  const uptime = (99.93 + ((tick * 7) % 6) / 100).toFixed(2);

  return (
    <div ref={ref} className="relative w-full max-w-full select-none" aria-hidden="true">
      {/* Glow behind the panel */}
      <div
        className="absolute -inset-8 rounded-[2rem] blur-3xl opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 60% at 60% 30%, rgba(0,119,255,0.4), transparent 70%), radial-gradient(50% 50% at 20% 80%, rgba(124,92,255,0.25), transparent 70%)",
        }}
      />

      {/* Main window */}
      <div
        className="relative rounded-2xl border border-white/12 overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #0b1228 0%, #070c1c 100%)",
          boxShadow: "0 40px 100px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 h-10 border-b border-white/8 bg-white/[0.03]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <div className="flex-1 text-center">
            <span className="mono text-[10px] text-white/35">
              hashxlabs — platform/observability
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2.5 mb-4">
            {[
              { k: "Requests/sec", v: rps.toLocaleString(), d: "+12.4%" },
              { k: "Uptime", v: `${uptime}%`, d: "30d" },
              { k: "p99 Latency", v: "84ms", d: "−18ms" },
            ].map((m) => (
              <div
                key={m.k}
                className="rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2.5"
              >
                <div className="mono text-[9px] uppercase tracking-wider text-white/35 mb-1 truncate">
                  {m.k}
                </div>
                <div className="text-sm sm:text-base font-bold text-white tabular-nums">
                  {m.v}
                </div>
                <div className="mono text-[9px] text-[#22d3ee]">{m.d}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-lg border border-white/8 bg-white/[0.02] p-3 mb-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className="mono text-[9px] uppercase tracking-wider text-white/35">
                Throughput · 24h
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee] animate-pulse" />
                <span className="mono text-[9px] text-white/45">live</span>
              </span>
            </div>
            <div className="flex items-end gap-[3px] h-20">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t origin-bottom"
                  style={{
                    height: `${h}%`,
                    background:
                      i === 9
                        ? "linear-gradient(to top, #22d3ee, #7c5cff)"
                        : "linear-gradient(to top, rgba(0,119,255,0.85), rgba(0,170,255,0.45))",
                    animation: live
                      ? `rise 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms both`
                      : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Service table */}
          <div className="rounded-lg border border-white/8 bg-white/[0.02] divide-y divide-white/[0.06]">
            {rows.map((r) => (
              <div key={r.name} className="flex items-center gap-3 px-3 py-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    r.tone === "ok" ? "bg-[#28c840]" : "bg-[#febc2e]"
                  }`}
                />
                <span className="mono text-[10px] text-white/70 flex-1 truncate">
                  {r.name}
                </span>
                <span
                  className={`mono text-[9px] hidden sm:inline ${
                    r.tone === "ok" ? "text-white/35" : "text-[#febc2e]"
                  }`}
                >
                  {r.status}
                </span>
                <span className="mono text-[10px] text-white/50 tabular-nums w-12 text-right">
                  {r.ms}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating "deploy" chip — sits just outside the panel's right edge */}
      <div
        className="absolute -right-4 lg:-right-8 top-[38%] z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-[#22d3ee]/30 bg-[#04060f]/95 backdrop-blur-md shadow-xl animate-float"
        style={{ animationDelay: "0.4s" }}
      >
        <svg className="w-3.5 h-3.5 text-[#22d3ee]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        <span className="mono text-[10px] text-white/80">deploy ✓ 1.2s</span>
      </div>

      {/* Floating build chip — hangs off the bottom-left corner, clear of the table */}
      <div
        className="absolute -left-4 lg:-left-8 -bottom-5 z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-white/12 bg-[#04060f]/95 backdrop-blur-md shadow-xl animate-float"
        style={{ animationDelay: "1.6s" }}
      >
        <span className="w-2 h-2 rounded-full bg-[#7c5cff] animate-pulse" />
        <span className="mono text-[10px] text-white/70">CI · 128 tests pass</span>
      </div>
    </div>
  );
}
