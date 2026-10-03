"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import Icon from "./icons/Icon";

type Model = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  highlights: string[];
  bestFor: string;
  ctaText: string;
};

const engagementModels: Model[] = [
  {
    id: "dedicated-team",
    title: "Dedicated Engineering Team",
    subtitle: "Augment your workforce with top 1% Web3 & AI engineers",
    badge: "Most Popular for Scale-ups",
    description:
      "Seamlessly extend your internal development team with senior Rust, Solidity, Python AI, and DevOps specialists working exclusively on your product under your direct agile management.",
    highlights: [
      "Dedicated developers and architects",
      "Direct Slack/Jira Integration with Your Team",
      "Flexible Scale Up / Scale Down SLA",
      "Zero Hiring & Onboarding Overhead",
    ],
    bestFor: "Scale-ups & Enterprises needing long-term technical talent.",
    ctaText: "Hire Dedicated Team",
  },
  {
    id: "turnkey-project",
    title: "Turnkey Fixed-Scope Delivery",
    subtitle: "End-to-end delivery with fixed scope and milestones",
    badge: "Best for MVPs & New Protocols",
    description:
      "We take complete ownership of your Web3 protocol, AI agent platform, or SaaS product — from architecture design and smart contract audits to mainnet launch with fixed timelines.",
    highlights: [
      "Fixed Scope & Agreed Milestone Timeline",
      "Dedicated Project Manager & Solution Architect",
      "Full IP & Code Repository Handover",
      "Post-Launch Maintenance & SLA Warranty",
    ],
    bestFor: "Startups & Foundations launching new protocols or MVPs.",
    ctaText: "Start Turnkey Project",
  },
  {
    id: "cto-advisory",
    title: "CTO Advisory & Security Audit",
    subtitle: "Expert guidance for tokenomics, security & architecture",
    badge: "Security & Governance",
    description:
      "Access veteran Web3 architects for tokenomics modeling, formal verification smart contract audits, regulatory compliance readiness, and zero-knowledge privacy design.",
    highlights: [
      "Formal Smart Contract Verification & Audit Reports",
      "Tokenomics & Governance Mechanism Design",
      "Zero-Knowledge & Layer-2 Scaling Architecture",
      "Investor & Technical Due Diligence",
    ],
    bestFor: "Projects needing security audits or technical advisory.",
    ctaText: "Request Advisory Session",
  },
];

export default function EngagementModels({ onOpenModal }: { onOpenModal?: () => void }) {
  const [activeTab, setActiveTab] = useState<string>("dedicated-team");

  const currentModel = engagementModels.find((m) => m.id === activeTab) || engagementModels[0];

  return (
    <section
      id="engagement"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-500" />
            <span className="eyebrow">Engagement Frameworks</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          <h2 className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-5">
            Flexible <span className="gradient-text">Engagement Models</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)]">
            Whether you need a dedicated team of Web3 specialists, a turnkey project delivery, or a security audit — we adapt to your operating structure.
          </p>
        </Reveal>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {engagementModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setActiveTab(model.id)}
              className={`px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                activeTab === model.id
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-500/25 border border-blue-400/40"
                  : "bg-[var(--bg-card)] text-[var(--t-mid)] hover:bg-[var(--bg-card-hover)] border border-[var(--line)]"
              }`}
            >
              {model.title}
            </button>
          ))}
        </div>

        {/* Display Card */}
        <div className="glass-card spotlight rounded-3xl p-8 sm:p-10 border border-[var(--line-strong)] max-w-5xl mx-auto shadow-2xl">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left Model Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-cyan-300 mono text-xs font-bold uppercase">
                {currentModel.badge}
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[var(--t-hi)] mb-2">
                  {currentModel.title}
                </h3>
                <p className="text-sm font-semibold text-blue-600 dark:text-cyan-400">
                  {currentModel.subtitle}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[var(--t-mid)] leading-relaxed">
                {currentModel.description}
              </p>

              <div className="space-y-3 pt-2">
                <div className="mono text-xs font-bold text-[var(--t-hi)] uppercase tracking-wider">
                  Key Advantages
                </div>
                <ul className="space-y-2.5" role="list">
                  {currentModel.highlights.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-xs sm:text-sm text-[var(--t-hi)]">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        <Icon name="check" className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Summary Box */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl border border-[var(--line-strong)] bg-[var(--bg-input)] space-y-6">
                <div>
                  <div className="mono text-xs text-[var(--t-lo)] uppercase tracking-wider mb-2">
                    Ideal Fit
                  </div>
                  <p className="text-sm font-bold text-[var(--t-hi)] leading-snug">
                    {currentModel.bestFor}
                  </p>
                </div>

                <div className="pt-4 border-t border-[var(--line)]">
                  <div className="mono text-xs text-[var(--t-lo)] uppercase tracking-wider mb-2">
                    Deployment Timeframe
                  </div>
                  <p className="text-sm font-bold text-cyan-500 dark:text-cyan-400">
                    SLA Activation within 48-72 Hours
                  </p>
                </div>

                <button
                  onClick={onOpenModal}
                  className="btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-xl cursor-pointer"
                >
                  {currentModel.ctaText} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
