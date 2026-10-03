"use client";

import { useState } from "react";
import Reveal from "./Reveal";

const WORK = [
  {
    id: "amm",
    tag: "DeFi protocol",
    title: "Cross-chain AMM with staking and yield routing",
    std: "ERC-4626",
    stdLabel: "vault standard",
    summary:
      "A constant-product AMM with a staking module and cross-chain message passing. Reentrancy guards sit on every external call path, and the swap, deposit and withdrawal flows are covered by Foundry invariant tests.",
    flow: ["User", "AMM pool", "Staking vault", "Cross-chain router"],
    stack: ["Solidity", "Foundry", "LayerZero", "Slither", "Echidna"],
  },
  {
    id: "rwa",
    tag: "Asset manager",
    title: "Permissioned real-world asset tokenization portal",
    std: "ERC-3643",
    stdLabel: "permissioned token",
    summary:
      "Identity-gated transfers with on-chain compliance checks, a claims registry for KYC attestations, and automated pro-rata distribution to token holders.",
    flow: ["Investor", "Claims registry", "Compliance module", "Token"],
    stack: ["Solidity", "ERC-3643", "Polygon", "Chainlink"],
  },
  {
    id: "custody",
    tag: "Fintech startup",
    title: "Multi-signature custody wallet with a policy engine",
    std: "2-of-3",
    stdLabel: "threshold signing",
    summary:
      "Threshold-signature vaults with per-transaction spend policies and hardware-backed key storage, plus a mobile client built against the same signing service as the web app.",
    flow: ["Client", "Policy engine", "Signing service", "KMS"],
    stack: ["React Native", "Node.js", "PostgreSQL", "AWS KMS"],
  },
  {
    id: "rag",
    tag: "Logistics operator",
    title: "Retrieval-augmented agent over internal documents",
    std: "Hybrid",
    stdLabel: "vector + keyword",
    summary:
      "Hybrid vector and keyword retrieval over a chunked corpus, with a tool-calling agent loop and a human approving every write before it reaches the ERP.",
    flow: ["Question", "Retriever", "Agent loop", "Human approval"],
    stack: ["Python", "pgvector", "FastAPI", "LangChain"],
  },
];

export default function Engagements() {
  const [i, setI] = useState(0);
  const w = WORK[i];

  return (
    <section id="work" className="section-alt border-y border-[var(--line)] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <span className="eyebrow">Engagements</span>
          <h2 className="mt-5 text-4xl sm:text-5xl">
            What we have built, described honestly.
          </h2>
          <p className="mt-5 text-[var(--t-mid)]">
            Client names stay private under NDA, so what we can offer is the
            architecture. Pick one.
          </p>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-12">
          <ul className="lg:col-span-5 border-t border-[var(--line-strong)]" role="tablist" aria-label="Engagements">
            {WORK.map((x, idx) => (
              <li key={x.id} className="border-b border-[var(--line-strong)]">
                <button
                  role="tab"
                  aria-selected={i === idx}
                  onClick={() => setI(idx)}
                  className={`flex w-full items-start gap-4 px-1 py-5 text-left transition-colors cursor-pointer ${
                    i === idx ? "bg-[var(--bg-page)]" : "hover:bg-[var(--bg-page)]"
                  }`}
                >
                  <span className={`mono mt-1.5 text-[11px] ${i === idx ? "text-[var(--signal)]" : "text-[var(--t-lo)]"}`}>
                    0{idx + 1}
                  </span>
                  <span>
                    <span className="mono block text-[10.5px] uppercase tracking-[0.12em] text-[var(--t-lo)]">
                      {x.tag} · under NDA
                    </span>
                    <span
                      className={`mt-1.5 block font-[family-name:var(--font-head)] text-xl font-bold leading-tight tracking-tight [font-stretch:88%] sm:text-2xl ${
                        i === idx ? "text-[var(--signal)]" : ""
                      }`}
                    >
                      {x.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div key={w.id} className="animate-fade-in ticks border border-[var(--line-strong)] bg-[var(--bg-card)] p-6 sm:p-9 lg:col-span-7">
            <span className="tk-b" />
            <div className="flex items-end justify-between gap-6 border-b border-[var(--line)] pb-6">
              <div>
                <div className="font-[family-name:var(--font-head)] text-6xl font-bold leading-none tracking-tight text-[var(--signal)] [font-stretch:88%] sm:text-7xl">
                  {w.std}
                </div>
                <div className="mono mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--t-lo)]">
                  {w.stdLabel}
                </div>
              </div>
              <div className="mono text-right text-[11px] text-[var(--t-lo)]">
                {w.tag}
                <br />
                client under NDA
              </div>
            </div>

            <p className="mt-6 text-[var(--t-mid)]">{w.summary}</p>

            {/* flow */}
            <div className="mono mt-8 flex flex-wrap items-center gap-y-2 text-[11.5px]">
              {w.flow.map((f, n) => (
                <span key={f} className="flex items-center">
                  <span className="border border-[var(--line-strong)] bg-[var(--bg-page)] px-3 py-1.5">{f}</span>
                  {n < w.flow.length - 1 && <span className="px-2 text-[var(--signal)]">→</span>}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {w.stack.map((s) => (
                <span key={s} className="mono border border-[var(--line)] px-2.5 py-1 text-[10.5px] text-[var(--t-mid)]">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
