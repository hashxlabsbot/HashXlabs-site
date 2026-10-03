"use client";

import Reveal from "./Reveal";

const items = [
  {
    k: "01",
    title: "Web3 & DeFi Protocols",
    description: "Cross-chain liquidity pools, yield aggregators, DEXs, and EVM/Solana smart contract suites.",
  },
  {
    k: "02",
    title: "Enterprise AI Agents",
    description: "Autonomous LLM agents, private RAG knowledge engines, and automated business workflows.",
  },
  {
    k: "03",
    title: "Real-World Asset (RWA) Tokenization",
    description: "Compliant SEC security tokens for real estate, private equity, and treasury asset pools.",
  },
  {
    k: "04",
    title: "High-Scale SaaS & Mobile Platforms",
    description: "Multi-tenant cloud platforms and iOS/Android applications built for millions of concurrent users.",
  },
  {
    k: "05",
    title: "Smart Contract Auditing & Security",
    description: "Automated static analysis, mathematical formal verification, and exploit prevention.",
  },
];

export default function WhatWeBuild() {
  return (
    <section
      id="solutions"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
      aria-labelledby="wwb-heading"
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
          {/* Left: Sticky intro */}
          <Reveal variant="left" className="lg:sticky lg:top-28">
            <div className="flex items-center gap-3 mb-4">
              <span className="eyebrow">Solutions Matrix</span>
              <div className="h-px w-14 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>

            <h2 id="wwb-heading" className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-6">
              Engineering Built for <br />
              <span className="gradient-text">Global Market Impact</span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--t-mid)] leading-relaxed mb-8">
              We translate disruptive technical concepts into production-grade software that scales under heavy load and passes institutional security standards.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 mb-9">
              {["Security Audited", "Sub-Second Latency", "Enterprise Ready"].map((label) => (
                <div key={label} className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-cyan-400">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg cursor-pointer"
            >
              Consult Solution Architect
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </Reveal>

          {/* Right: Numbered list */}
          <div>
            {items.map((item, i) => (
              <Reveal key={item.k} variant="right" delay={i * 80}>
                <div className="group flex items-start gap-5 sm:gap-7 py-6 border-b border-[var(--line)] hover:border-blue-500/50 transition-colors duration-300">
                  <span className="mono text-xs font-bold text-blue-600 dark:text-cyan-400 pt-1.5 opacity-80">
                    {item.k}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-[var(--t-hi)] mb-1.5 group-hover:translate-x-1 transition-transform duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[var(--t-mid)] leading-relaxed">
                      {item.description}
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
