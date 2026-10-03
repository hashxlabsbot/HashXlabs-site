"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const metrics = [
  { end: 500, prefix: "$", suffix: "M+", label: "TVL & Capital Secured" },
  { end: 150, prefix: "", suffix: "+", label: "Smart Contracts Audited" },
  { end: 50, prefix: "", suffix: "+", label: "Global Enterprise Clients" },
  { end: 99.9, prefix: "", suffix: "%", label: "System & SLA Uptime" },
];

const differentiators = [
  {
    title: "Formal verification and adversarial testing",
    description:
      "Every smart contract and enterprise API we ship undergoes automated formal verification, static analysis, and multi-tier penetration testing.",
  },
  {
    title: "Top 1% Senior Web3 & AI Engineers",
    description:
      "Direct collaboration with veteran protocol architects, Rust & Solidity experts, and Machine Learning researchers — no junior offshore outsourcing.",
  },
  {
    title: "Sub-Second Latency Architecture",
    description:
      "Optimized EVM / Solana transactions, private RPC node clusters, and edge-cached LLM inferencing designed for extreme concurrent volume.",
  },
  {
    title: "Full Lifecycle Partnership & Governance",
    description:
      "From tokenomics design and regulatory readiness to mainnet deployment and 24/7 on-call DevOps support.",
  },
];

function AnimatedMetric({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    let raf = 0;
    let fallback = 0;

    const settle = () =>
      setCount(end % 1 !== 0 ? parseFloat(end.toFixed(1)) : Math.round(end));

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
          settle();
          return;
        }

        const duration = 1600;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const val = (1 - Math.pow(1 - t, 3)) * end;
          setCount(end % 1 !== 0 ? parseFloat(val.toFixed(1)) : Math.round(val));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        // See Hero: without this the metric can sit at 0 forever.
        fallback = window.setTimeout(settle, duration + 400);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (fallback) window.clearTimeout(fallback);
    };
  }, [end]);

  return <span ref={ref} className="tabular-nums">{prefix}{count}{suffix}</span>;
}

export default function WhyUs() {
  return (
    <section
      id="why-us"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
      aria-labelledby="why-heading"
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics Strip */}
        <Reveal className="mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 rounded-2xl overflow-hidden border border-[var(--line-strong)] bg-[var(--bg-card)] backdrop-blur-md shadow-xl">
            {metrics.map((m, i) => (
              <div
                key={m.label}
                className={`flex flex-col items-center justify-center p-6 text-center ${
                  i < metrics.length - 1 ? "border-b sm:border-b-0 sm:border-r border-[var(--line)]" : ""
                }`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gradient-text">
                  <AnimatedMetric end={m.end} prefix={m.prefix} suffix={m.suffix} />
                </div>
                <div className="mono text-[11px] text-[var(--t-mid)] tracking-wider uppercase mt-2 font-medium">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
          {/* Header */}
          <Reveal variant="left" className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-4">
              <span className="eyebrow">The HashX Advantage</span>
              <div className="h-px w-14 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>
            <h2 id="why-heading" className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-5">
              Why Global Leaders <span className="gradient-text">Choose HashX</span>
            </h2>
            <p className="text-base sm:text-lg text-[var(--t-mid)] leading-relaxed">
              We combine deep cryptographic rigor with enterprise AI expertise, giving your team an unbeatable technical edge.
            </p>
          </Reveal>

          {/* Differentiators */}
          <div>
            {differentiators.map((d, i) => (
              <Reveal key={d.title} variant="right" delay={i * 85}>
                <div className="group relative flex items-start gap-6 py-7 border-b border-[var(--line)] hover:border-blue-500/40 transition-colors duration-300">
                  <span className="mono text-4xl sm:text-5xl font-extrabold text-[var(--t-lo)] opacity-40 select-none group-hover:text-blue-500 transition-colors duration-300">
                    0{i + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--t-hi)] mb-2 group-hover:translate-x-1 transition-transform duration-300">
                      {d.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[var(--t-mid)] leading-relaxed">
                      {d.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
