"use client";

/**
 * Hero visual: the delivery stack HashX actually ships.
 *
 * Replaces a stock photo captioned "Live Web3 & AI Node Stream" with a
 * pulsing dot and a "v4.2" version badge — none of which were real. A
 * static JPEG claiming to be live telemetry is a claim the page can't
 * back, and a prospect who looks twice notices.
 *
 * This says something true instead: the four layers of a delivery, with
 * the concrete technologies used at each. Theme-aware via CSS tokens.
 */

const LAYERS = [
  {
    tier: "Interface",
    detail: "Next.js · React Native · TypeScript",
    note: "Web & mobile clients",
  },
  {
    tier: "Services",
    detail: "Node · Go · Python · REST / GraphQL",
    note: "APIs, auth, business logic",
  },
  {
    tier: "Protocol",
    detail: "Solidity · Rust · EVM · ZK circuits",
    note: "On-chain contracts & audits",
  },
  {
    tier: "Infrastructure",
    detail: "AWS · Docker · Kubernetes · CI/CD",
    note: "Deploy, scale, monitor",
  },
];

export default function StackDiagram() {
  return (
    <div className="relative">
      <div className="glass-card rounded-2xl p-6 sm:p-7 border border-[var(--line-strong)]">
        {/* Header — describes the diagram, claims nothing */}
        <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-[var(--line)]">
          <span className="eyebrow text-[var(--t-mid)]">Delivery Stack</span>
          <span className="mono text-[11px] text-[var(--t-lo)]">
            end&#8209;to&#8209;end
          </span>
        </div>

        <ol className="space-y-2.5">
          {LAYERS.map((l, i) => (
            <li
              key={l.tier}
              className="group/row relative flex items-start gap-4 rounded-xl border border-[var(--line)] bg-[var(--bg-input)] p-3.5 transition-colors duration-300 hover:border-[var(--line-accent)]"
            >
              {/* Tier index */}
              <span className="mono text-[11px] font-semibold text-[var(--t-lo)] pt-0.5 w-5 flex-shrink-0 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                  <span className="text-sm font-semibold text-[var(--t-hi)]">
                    {l.tier}
                  </span>
                  <span className="text-[11px] text-[var(--t-lo)]">{l.note}</span>
                </div>
                <div className="mono text-[11px] text-[var(--t-mid)] mt-1 break-words">
                  {l.detail}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* Footer: a real, checkable fact rather than a fake version badge */}
        <div className="mt-5 pt-4 border-t border-[var(--line)] flex items-center justify-between gap-3">
          <span className="text-[11px] text-[var(--t-mid)]">
            One team across every layer
          </span>
          <span className="mono text-[11px] text-[var(--t-lo)] whitespace-nowrap">
            no handoffs
          </span>
        </div>
      </div>
    </div>
  );
}
