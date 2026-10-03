"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import PhotoVisual from "./visuals/PhotoVisual";

type CaseStudy = {
  id: string;
  title: string;
  category: "Web3 & DeFi" | "AI & GenAI" | "FinTech & RWA" | "Enterprise SaaS";
  client: string;
  metric: string;
  metricLabel: string;
  summary: string;
  imageUrl: string;
  tags: string[];
};

const caseStudies: CaseStudy[] = [
  {
    id: "amm-staking",
    title: "Cross-chain AMM with staking and yield routing",
    category: "Web3 & DeFi",
    client: "DeFi protocol · under NDA",
    metric: "ERC-4626",
    metricLabel: "Vault standard implemented",
    summary:
      "Constant-product AMM with a staking module and cross-chain message passing. Reentrancy guards on every external call path; invariant tests in Foundry covering swap, deposit and withdrawal flows.",
    imageUrl: "defi.jpg",
    tags: ["Solidity", "Foundry", "LayerZero", "Slither", "Echidna"],
  },
  {
    id: "rag-agent",
    title: "Retrieval-augmented agent over internal document stores",
    category: "AI & GenAI",
    client: "Logistics operator · under NDA",
    metric: "Sub-second",
    metricLabel: "Median retrieval latency",
    summary:
      "Hybrid vector and keyword retrieval over a chunked corpus, with a tool-calling agent loop and human-in-the-loop approval before any write action reaches the ERP.",
    imageUrl: "ai-neural.jpg",
    tags: ["Python", "LangChain", "pgvector", "FastAPI"],
  },
  {
    id: "rwa-tokenization",
    title: "Permissioned real-world asset tokenization portal",
    category: "FinTech & RWA",
    client: "Asset manager · under NDA",
    metric: "ERC-3643",
    metricLabel: "Permissioned token standard",
    summary:
      "Identity-gated transfers with on-chain compliance checks, a claims registry for KYC attestations, and automated pro-rata distribution to token holders.",
    imageUrl: "realestate.jpg",
    tags: ["Solidity", "ERC-3643", "Polygon", "Chainlink"],
  },
  {
    id: "custody-wallet",
    title: "Multi-signature custody wallet with policy engine",
    category: "FinTech & RWA",
    client: "Fintech startup · under NDA",
    metric: "2-of-3",
    metricLabel: "Threshold signing scheme",
    summary:
      "Threshold-signature vaults with per-transaction spend policies, hardware-backed key storage, and a mobile client built against the same signing service as the web app.",
    imageUrl: "fintech.jpg",
    tags: ["React Native", "Node.js", "PostgreSQL", "AWS KMS"],
  },
];

const categories = ["All Projects", "Web3 & DeFi", "AI & GenAI", "FinTech & RWA"] as const;

export default function CaseStudies() {
  const [activeCategory, setActiveCategory] = useState<string>("All Projects");

  const filteredStudies =
    activeCategory === "All Projects"
      ? caseStudies
      : caseStudies.filter((item) => item.category === activeCategory);

  return (
    <section
      id="case-studies"
      className="section-alt relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="eyebrow">Proven Impact</span>
              <div className="h-px w-20 bg-gradient-to-r from-blue-500 to-transparent" />
            </div>
            <h2 className="display text-3xl sm:text-5xl text-[var(--t-hi)]">
              Featured <span className="gradient-text">Case Studies</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-[var(--bg-card)] text-[var(--t-mid)] hover:bg-[var(--bg-card-hover)] border border-[var(--line)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Grid of Case Studies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredStudies.map((study) => (
            <article
              key={study.id}
              className="glass-card spotlight rounded-2xl overflow-hidden group border border-[var(--line-strong)] flex flex-col justify-between"
            >
              <div>
                {/* Visual */}
                <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-slate-950">
                  <PhotoVisual
                    src={study.imageUrl}
                    alt={study.title}
                    seed={study.title}
                    className="w-full h-full object-cover photo-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-90" />

                  {/* Impact Metric Badge Overlay */}
                  <div className="absolute bottom-4 left-4 p-3 rounded-xl border border-white/20 bg-[#04060f]/80 backdrop-blur-md">
                    <div className="text-xl sm:text-2xl font-black gradient-text">
                      {study.metric}
                    </div>
                    <div className="mono text-[10px] text-white/80 font-medium">
                      {study.metricLabel}
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="mono text-[10px] font-bold text-cyan-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 uppercase">
                      {study.category}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-7">
                  <div className="mono text-xs text-blue-500 dark:text-cyan-400 font-bold mb-2">
                    Client: {study.client}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--t-hi)] mb-3 leading-snug group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors">
                    {study.title}
                  </h3>
                  <p className="text-sm text-[var(--t-mid)] leading-relaxed mb-6">
                    {study.summary}
                  </p>
                </div>
              </div>

              {/* Tags footer */}
              <div className="px-6 pb-6 pt-0 flex flex-wrap gap-2 items-center">
                {study.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono text-[10px] px-2.5 py-1 rounded-lg bg-[var(--bg-input)] border border-[var(--line)] text-[var(--t-mid)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
