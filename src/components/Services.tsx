"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Reveal from "./Reveal";
import PhotoVisual from "./visuals/PhotoVisual";

type Service = {
  id: string;
  title: string;
  category: "Web3 & Blockchain" | "AI & GenAI" | "Enterprise & Cloud" | "Security & Audit";
  description: string;
  imageUrl: string;
  features: string[];
  techStack: string[];
  icon: ReactNode;
  span: string;
  highlighted?: boolean;
};

const iconSvg = (d: string) => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={d} />
  </svg>
);

const services: Service[] = [
  {
    id: "web3-blockchain",
    title: "Web3 & Blockchain Protocol Engineering",
    category: "Web3 & Blockchain",
    description:
      "Bespoke L1/L2 blockchains, EVM & Solana smart contracts, DeFi protocols, DEXs, cross-chain bridges, and non-custodial crypto wallet infrastructures engineered for zero latency and enterprise security.",
    imageUrl: "blockchain.jpg",
    features: [
      "DeFi & DEX Protocol Architecture",
      "Solidity, Rust & Move Smart Contracts",
      "Custom Subnets & Layer-2 Scaling",
      "Cross-Chain Interoperability (LayerZero, Chainlink CCIP)",
    ],
    techStack: ["Solidity", "Rust", "EVM", "Solana", "Hardhat", "Foundry"],
    icon: iconSvg("M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.022.547l-1.096 1.097a1.5 1.5 0 001.06 2.56h14.915a1.5 1.5 0 001.06-2.56l-1.097-1.097zM12 3v9"),
    span: "lg:col-span-2",
    highlighted: true,
  },
  {
    id: "ai-genai",
    title: "Enterprise Artificial Intelligence & GenAI Agents",
    category: "AI & GenAI",
    description:
      "Autonomous AI agents, fine-tuned LLM models, Retrieval-Augmented Generation (RAG) engines, and real-time computer vision pipelines that automate complex enterprise operations.",
    imageUrl: "ai-neural.jpg",
    features: [
      "Custom Autonomous Agentic Workflows",
      "LLM Fine-Tuning & Private Model Hosting",
      "RAG Architecture over Enterprise Vector DBs",
      "Predictive Analytics & Automated Decisions",
    ],
    techStack: ["Python", "PyTorch", "LangChain", "OpenAI", "Pinecone", "TensorFlow"],
    icon: iconSvg("M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"),
    span: "lg:col-span-1",
    highlighted: true,
  },
  {
    id: "rwa-tokenization",
    title: "Real-World Asset (RWA) Tokenization",
    category: "Web3 & Blockchain",
    description:
      "Transform real estate, treasury bills, commodities, and private equity into compliant on-chain digital tokens with automated yield distribution and KYC/AML smart contract rules.",
    imageUrl: "realestate.jpg",
    features: [
      "Fractional Ownership & Secondary Trading",
      "SEC & Regulatory Compliant Security Tokens",
      "Automated Dividend & Yield Distribution",
      "Institutional Custody Integrations",
    ],
    techStack: ["ERC-3643", "ERC-1400", "Polymath", "Polygon", "Chainlink"],
    icon: iconSvg("M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"),
    span: "lg:col-span-1",
  },
  {
    id: "smart-contract-audit",
    title: "Smart Contract Audits & Security Hardening",
    category: "Security & Audit",
    description:
      "Rigorous static analysis, formal verification, manual line-by-line penetration testing, and zero-knowledge proof review, with every finding documented and severity-rated.",
    imageUrl: "smart-contract.jpg",
    features: [
      "Slither, Mythril & Echidna Automated Scans",
      "Mathematical Formal Verification",
      "Reentrancy & Logic Exploit Prevention",
      "Comprehensive Audit Certification Reports",
    ],
    techStack: ["Slither", "Foundry", "Certora", "Z3 Solver", "Halmos"],
    icon: iconSvg("M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"),
    span: "lg:col-span-2",
  },
  {
    id: "enterprise-saas",
    title: "Enterprise SaaS & Cloud Engineering",
    category: "Enterprise & Cloud",
    description:
      "High-scale web platforms, distributed microservices, multi-tenant cloud backends, and React Native / Flutter mobile applications built for millions of concurrent users.",
    imageUrl: "cloud-saas.jpg",
    features: [
      "Multi-Tenant Distributed Microservices",
      "Sub-Second Dynamic Data Queries & Caching",
      "AWS / GCP / Cloudflare Edge Infrastructure",
      "Cross-Platform iOS & Android Mobile Apps",
    ],
    techStack: ["Next.js", "Node.js", "Go", "PostgreSQL", "Docker", "Kubernetes"],
    icon: iconSvg("M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"),
    span: "lg:col-span-3",
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      className={`glass-card spotlight group relative flex flex-col rounded-2xl overflow-hidden ${service.span} transition-all duration-500`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* 3D Unsplash Image Preview */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-900">
        <PhotoVisual
          src={service.imageUrl}
          alt={service.title}
          seed={service.title}
          className="w-full h-full object-cover photo-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent opacity-90" />
        
        {/* Category Pill */}
        <div className="absolute top-4 left-4">
          <span className="mono text-[10px] font-bold text-cyan-300 dark:text-cyan-200 bg-blue-600/80 backdrop-blur-md px-3 py-1 rounded-full border border-blue-400/30 uppercase tracking-widest">
            {service.category}
          </span>
        </div>

        {/* Icon Overlay */}
        <div className="absolute bottom-4 left-6 w-12 h-12 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shadow-lg backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-300">
          {service.icon}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--t-hi)] mb-3 leading-snug group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors duration-300">
            {service.title}
          </h3>

          <p className="text-sm sm:text-base text-[var(--t-mid)] leading-relaxed mb-6">
            {service.description}
          </p>

          {/* Key Feature Bullets */}
          <ul className="space-y-2 mb-6" role="list">
            {service.features.map((feat) => (
              <li key={feat} className="flex items-center gap-2.5 text-xs sm:text-sm text-[var(--t-hi)]">
                <svg className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack Pills */}
        <div className="pt-4 border-t border-[var(--line)] flex flex-wrap gap-1.5 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {service.techStack.map((tech) => (
              <span
                key={tech}
                className="mono text-[10.5px] px-2.5 py-1 rounded-lg bg-[var(--bg-input)] border border-[var(--line)] text-[var(--t-mid)] font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          <a
            href="#contact"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-cyan-300 group-hover:translate-x-1 transition-transform duration-300"
          >
            Consult Team →
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32 overflow-hidden transition-colors duration-300"
      aria-labelledby="services-heading"
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-16 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="eyebrow">Enterprise Capabilities</span>
            <div className="h-px w-20 bg-gradient-to-r from-blue-500 to-transparent" />
          </div>
          <h2 id="services-heading" className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-6">
            End-to-End <span className="gradient-text">Web3, AI & Software</span> Engineering
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)] leading-relaxed">
            From smart contract protocol design and custom enterprise AI agents to full-stack Web & Mobile platforms — we deliver high-throughput, security-first solutions.
          </p>
        </Reveal>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-fr">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
