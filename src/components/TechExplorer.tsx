"use client";

import { useState } from "react";
import Reveal from "./Reveal";

type TechCategory = "Blockchain & Web3" | "AI & Machine Learning" | "Full-Stack & Mobile" | "DevOps & Security";

type TechItem = {
  name: string;
  category: TechCategory;
  description: string;
  badge: string;
};

const techItems: TechItem[] = [
  // Blockchain
  { name: "Solidity", category: "Blockchain & Web3", description: "Smart contract language for Ethereum & EVM chains", badge: "Primary" },
  { name: "Rust", category: "Blockchain & Web3", description: "High-performance smart contracts for Solana & Cosmos", badge: "Primary" },
  { name: "Foundry & Hardhat", category: "Blockchain & Web3", description: "Smart contract testing, fuzzing, and deployment framework", badge: "Tooling" },
  { name: "LayerZero & Chainlink", category: "Blockchain & Web3", description: "Cross-chain messaging protocols and decentralized oracles", badge: "Protocol" },
  { name: "Ethereum & Polygon", category: "Blockchain & Web3", description: "L1 and L2 EVM execution layers", badge: "L1 / L2" },
  { name: "Solana", category: "Blockchain & Web3", description: "High-throughput parallelized execution blockchain", badge: "L1" },

  // AI & ML
  { name: "Python & PyTorch", category: "AI & Machine Learning", description: "Deep learning framework for custom model training", badge: "Core AI" },
  { name: "LangChain & LlamaIndex", category: "AI & Machine Learning", description: "Agentic orchestration and RAG data indexing framework", badge: "GenAI" },
  { name: "Pinecone & Qdrant", category: "AI & Machine Learning", description: "High-scale vector databases for fast similarity search", badge: "Vector DB" },
  { name: "OpenAI GPT & Claude", category: "AI & Machine Learning", description: "State-of-the-art foundation models fine-tuned for enterprise", badge: "LLMs" },
  { name: "FastAPI & vLLM", category: "AI & Machine Learning", description: "Ultra-low latency model inference serving pipelines", badge: "Inference" },

  // Full Stack & Mobile
  { name: "Next.js & React 19", category: "Full-Stack & Mobile", description: "Full-stack React framework with Server Components & SSR", badge: "Frontend" },
  { name: "TypeScript & Node.js", category: "Full-Stack & Mobile", description: "Type-safe asynchronous backend APIs and services", badge: "Backend" },
  { name: "Go (Golang)", category: "Full-Stack & Mobile", description: "High-throughput microservices and concurrent network tools", badge: "Backend" },
  { name: "React Native & Flutter", category: "Full-Stack & Mobile", description: "Cross-platform mobile apps for iOS and Android", badge: "Mobile" },
  { name: "PostgreSQL & Redis", category: "Full-Stack & Mobile", description: "Relational database and high-speed in-memory cache", badge: "Database" },

  // DevOps & Security
  { name: "Docker & Kubernetes", category: "DevOps & Security", description: "Container orchestration and continuous deployment", badge: "DevOps" },
  { name: "AWS & Cloudflare Edge", category: "DevOps & Security", description: "Global serverless cloud infrastructure and DDoS defense", badge: "Cloud" },
  { name: "Slither & Mythril", category: "DevOps & Security", description: "Static analyzer for smart contract vulnerabilities", badge: "Audit" },
  { name: "Certora & Z3", category: "DevOps & Security", description: "Formal verification engines for mathematical proof of safety", badge: "Audit" },
];

const categories: TechCategory[] = [
  "Blockchain & Web3",
  "AI & Machine Learning",
  "Full-Stack & Mobile",
  "DevOps & Security",
];

export default function TechExplorer() {
  const [activeCategory, setActiveCategory] = useState<TechCategory>("Blockchain & Web3");

  const currentItems = techItems.filter((item) => item.category === activeCategory);

  return (
    <section
      id="tech-explorer"
      className="section-alt relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <span className="mono text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
              Tech Stack & Tooling
            </span>
          </div>
          <h2 className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-5">
            Battle-Tested <span className="gradient-text">Technologies</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)]">
            We build exclusively with proven, high-performance tech stacks engineered for resilience, throughput, and zero downtime.
          </p>
        </Reveal>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/25 border border-blue-400/40"
                  : "bg-[var(--bg-card)] text-[var(--t-mid)] hover:bg-[var(--bg-card-hover)] border border-[var(--line)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid of Tech Stack Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((tech) => (
            <div
              key={tech.name}
              className="glass-card spotlight p-6 rounded-2xl border border-[var(--line-strong)] hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-[var(--t-hi)]">
                    {tech.name}
                  </h3>
                  <span className="mono text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-cyan-300 border border-blue-500/20 font-bold uppercase">
                    {tech.badge}
                  </span>
                </div>
                <p className="text-sm text-[var(--t-mid)] leading-relaxed">
                  {tech.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--line)] flex items-center gap-2 text-xs text-emerald-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Production Verified by HashX</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
