"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import PhotoVisual from "./visuals/PhotoVisual";

const icon = (d: string) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

const industries = [
  {
    label: "Web3 & DeFi",
    icon: icon("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
    headline: "Institutional Crypto & Protocol Architecture",
    body: "Automated market makers (AMMs), staking hubs, cross-chain DEX aggregators, and zero-knowledge privacy layers built for extreme liquidity and safety.",
    wins: ["Non-custodial crypto wallet infrastructure", "Sub-second swap & liquidity routing", "Slither & Certora audited smart contracts"],
    imageUrl: "defi.jpg",
  },
  {
    label: "Enterprise AI",
    icon: icon("M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"),
    headline: "Autonomous LLM Agents & Internal Copilots",
    body: "Custom agentic workflows that integrate directly with enterprise ERPs, vector knowledge bases, and live communication channels.",
    wins: ["Private LLM hosting & fine-tuning", "RAG search across 5M+ vector embeddings", "Sub-second AI inference pipelines"],
    imageUrl: "ai-neural.jpg",
  },
  {
    label: "FinTech & RWA",
    icon: icon("M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"),
    headline: "Compliant Asset Tokenization & Neobanking",
    body: "Real-world asset tokenization (ERC-3643), fractional real estate ownership, SEPA/ACH banking rails, and automated dividend distribution.",
    wins: ["SEC-compliant security token issuance", "Dual fiat/crypto transaction rails", "Automated KYC/AML verification"],
    imageUrl: "fintech.jpg",
  },
  {
    label: "Supply Chain",
    icon: icon("M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"),
    headline: "Immutable On-Chain Tracking & Logistics",
    body: "Blockchain-based shipment provenance, IoT sensor data synchronization, smart contract escrow releases, and automated customs documentation.",
    wins: ["Real-time cargo IoT tracking", "Automated smart contract escrows", "Zero-tamper audit logs"],
    imageUrl: "logistics.jpg",
  },
  {
    label: "Gaming & Metaverse",
    icon: icon("M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z"),
    headline: "On-Chain Gaming Economies & Dynamic NFTs",
    body: "Web3 game backends, player item tokenization, gasless meta-transactions, and high-frequency in-game marketplace economies.",
    wins: ["Gasless ERC-4337 Account Abstraction", "High-throughput game state synchronization", "Cross-game NFT interoperability"],
    imageUrl: "gaming.jpg",
  },
  {
    label: "Healthcare & AI",
    icon: icon("M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"),
    headline: "HIPAA-Compliant Patient AI & Records",
    body: "Zero-knowledge medical record sharing, AI diagnostic assistance, patient consent management, and secure cloud storage.",
    wins: ["Zero-Knowledge data privacy", "AI clinical report generation", "HIPAA & GDPR audit readiness"],
    imageUrl: "healthcare.jpg",
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const current = industries[active];

  return (
    <section
      id="industries"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
      aria-labelledby="industries-heading"
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-500" />
            <span className="eyebrow">Sector Expertise</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          <h2 id="industries-heading" className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-5">
            Verticals We <span className="gradient-text">Transform</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)]">
            Explore how HashX Labs deploys Web3, AI, and enterprise engineering across specialized industries.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-8 items-start">
          {/* Selector Grid */}
          <Reveal variant="left">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3" role="tablist">
              {industries.map((ind, i) => {
                const on = i === active;
                return (
                  <button
                    key={ind.label}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    className={`group flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      on
                        ? "border-blue-500 bg-blue-500/15 text-[var(--t-hi)] shadow-lg"
                        : "border-[var(--line)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--t-mid)]"
                    }`}
                  >
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                        on ? "text-white bg-blue-600" : "text-[var(--t-mid)] bg-[var(--bg-input)]"
                      }`}
                    >
                      {ind.icon}
                    </span>
                    <span className="text-sm font-bold leading-tight">
                      {ind.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Detail Panel */}
          <Reveal variant="right" delay={100}>
            <div className="glass-card rounded-2xl overflow-hidden border border-[var(--line-strong)] shadow-2xl">
              {/* Top Image */}
              <div className="relative h-48 sm:h-56 w-full bg-slate-900 overflow-hidden">
                <PhotoVisual
                  src={current.imageUrl}
                  alt={current.label}
                  seed={current.label}
                  className="w-full h-full object-cover photo-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-90" />
                
                <div className="absolute top-4 left-4">
                  <span className="mono text-xs font-bold text-cyan-300 bg-blue-600/90 px-3 py-1 rounded-full border border-white/20 uppercase">
                    {current.label} Vertical
                  </span>
                </div>
              </div>

              {/* Panel Content */}
              <div className="p-7 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--t-hi)] mb-3">
                  {current.headline}
                </h3>

                <p className="text-sm sm:text-base text-[var(--t-mid)] leading-relaxed mb-6">
                  {current.body}
                </p>

                <div className="h-px bg-[var(--line)] mb-6" />

                <div className="mono text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-3">
                  Key Deliverables & Innovations
                </div>

                <ul className="space-y-2.5 mb-6" role="list">
                  {current.wins.map((w) => (
                    <li key={w} className="flex items-center gap-3 text-sm text-[var(--t-hi)]">
                      <svg className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {w}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-cyan-300 hover:underline"
                >
                  Consult Our {current.label} Specialist →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
