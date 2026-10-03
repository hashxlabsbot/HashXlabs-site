"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";

interface Block {
  number: number;
  hash: string;
  txs: number;
  miner: string;
  gasUsed: string;
  timeAgo: string;
  payload: string;
  verifiedInvariants: string;
}

const INITIAL_BLOCKS: Block[] = [
  {
    number: 21948325,
    hash: "0x7f2a...88e1",
    txs: 184,
    miner: "Builder0x6b",
    gasUsed: "14.2M (47.3%)",
    timeAgo: "2s ago",
    payload: "ERC-4626 Vault Rebalance + Flash Arbitrage",
    verifiedInvariants: "invariant_solvency()",
  },
  {
    number: 21948324,
    hash: "0x3e19...c4b2",
    txs: 231,
    miner: "Titan Relay",
    gasUsed: "21.8M (72.6%)",
    timeAgo: "14s ago",
    payload: "RWA Settlement & Compliance Attestation",
    verifiedInvariants: "invariant_identityRegistry()",
  },
  {
    number: 21948323,
    hash: "0x9d44...5f0a",
    txs: 142,
    miner: "Flashbots",
    gasUsed: "11.1M (37.0%)",
    timeAgo: "26s ago",
    payload: "Cross-Chain LayerZero Bridge Sync",
    verifiedInvariants: "invariant_noFreeShares()",
  },
  {
    number: 21948322,
    hash: "0x1b87...31da",
    txs: 310,
    miner: "Builder0x6b",
    gasUsed: "28.4M (94.7%)",
    timeAgo: "38s ago",
    payload: "Autonomous AI Agent Trade Execution",
    verifiedInvariants: "invariant_strictMonotonicYield()",
  },
];

export default function OnChainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>(INITIAL_BLOCKS);
  const [selectedBlock, setSelectedBlock] = useState<Block>(INITIAL_BLOCKS[0]);
  const [isMining, setIsMining] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsMining(true);

      setTimeout(() => {
        setBlocks((prev) => {
          const nextNum = prev[0].number + 1;
          const randomHex = "0x" + Math.random().toString(16).slice(2, 6) + "..." + Math.random().toString(16).slice(2, 6);
          const payloads = [
            "ERC-4626 Vault Rebalance + Flash Arbitrage",
            "ZK-SNARK Proof Settlement on Arbitrum",
            "RWA Real Estate Token Yield Distribution",
            "Multi-Sig Timelock Execution (3/5 threshold)",
            "Automated Liquidation Engine Trigger",
          ];
          const invariants = [
            "invariant_solvency()",
            "invariant_strictMonotonicYield()",
            "invariant_noFreeShares()",
            "invariant_collateralRatio()",
          ];

          const newBlock: Block = {
            number: nextNum,
            hash: randomHex,
            txs: Math.floor(120 + Math.random() * 250),
            miner: Math.random() > 0.5 ? "Builder0x6b" : "Flashbots",
            gasUsed: `${(10 + Math.random() * 18).toFixed(1)}M (${(30 + Math.random() * 60).toFixed(0)}%)`,
            timeAgo: "just now",
            payload: payloads[Math.floor(Math.random() * payloads.length)],
            verifiedInvariants: invariants[Math.floor(Math.random() * invariants.length)],
          };

          return [newBlock, ...prev.slice(0, 3)];
        });

        setIsMining(false);
      }, 600);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-alt border-t border-[var(--line-strong)] py-20 sm:py-28 relative overflow-hidden bg-[#070b14] text-white">
      {/* Background Matrix/Grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end mb-12">
          <div className="lg:col-span-8">
            <span className="mono text-[11px] uppercase tracking-[0.14em] text-cyan-400">
              {"//"} Live Protocol Execution Layer
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl text-white font-[family-name:var(--font-head)]">
              Real-time block stream &amp; invariant proof verification.
            </h2>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <div className="mono text-xs text-white/60 flex items-center gap-2 border border-white/10 px-3 py-1.5 bg-[#0b1220]">
              <span className={`h-2 w-2 rounded-full ${isMining ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
              <span>{isMining ? "PRODUCING BLOCK..." : "CONSENSUS SYNCHRONIZED"}</span>
            </div>
          </div>
        </Reveal>

        {/* Live Block Stream Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive Block Chain Cards */}
          <div className="lg:col-span-7 space-y-3">
            <div className="mono text-[11px] text-white/50 uppercase tracking-wider mb-2">
              Latest blocks mined with HashX-verified contracts:
            </div>

            {blocks.map((b, idx) => {
              const isSelected = selectedBlock.number === b.number;
              return (
                <div
                  key={b.number}
                  onClick={() => setSelectedBlock(b)}
                  className={`ticks spotlight group relative p-4 sm:p-5 border transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-cyan-500 bg-[#0d1729] shadow-[0_0_24px_rgba(6,182,212,0.15)]"
                      : "border-white/10 bg-[#0b1220] hover:border-white/25 hover:bg-[#0d1627]"
                  }`}
                >
                  <span className="tk-b" />
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/60 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm">#{b.number}</span>
                      <span className="text-white/30">|</span>
                      <span className="text-cyan-400">{b.hash}</span>
                    </div>
                    <span className="text-white/40">{idx === 0 ? "⚡ Just Mined" : b.timeAgo}</span>
                  </div>

                  <div className="text-[14px] font-semibold text-white/90 group-hover:text-cyan-300 transition-colors">
                    {b.payload}
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between font-mono text-[10.5px] text-white/50 gap-2">
                    <span>Gas: {b.gasUsed}</span>
                    <span>Txs: {b.txs}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span>✓</span> {b.verifiedInvariants}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Block Deep Inspector */}
          <div className="lg:col-span-5">
            <div className="ticks border border-cyan-500/40 bg-[#0b1220] p-6 h-full flex flex-col justify-between">
              <span className="tk-b" />

              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                  <span className="text-white/50">BLOCK INSPECTOR</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    VALIDATED BY EQUIVALENCE PROOFS
                  </span>
                </div>

                <div className="mt-6 space-y-4 font-mono text-xs">
                  <div>
                    <span className="block text-white/40 text-[10.5px]">BLOCK HEIGHT</span>
                    <span className="text-xl font-bold text-white">#{selectedBlock.number}</span>
                  </div>

                  <div>
                    <span className="block text-white/40 text-[10.5px]">CANONICAL STATE ROOT</span>
                    <span className="text-cyan-300 break-all">{selectedBlock.hash}429188ae701c</span>
                  </div>

                  <div>
                    <span className="block text-white/40 text-[10.5px]">SECURITY SPECIFICATION</span>
                    <span className="text-white font-medium">{selectedBlock.payload}</span>
                  </div>

                  <div>
                    <span className="block text-white/40 text-[10.5px]">FORMAL INVARIANT GUARANTEE</span>
                    <div className="mt-1 p-2.5 rounded bg-[#070d18] border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
                      assert( {selectedBlock.verifiedInvariants} == TRUE )
                    </div>
                  </div>

                  <div>
                    <span className="block text-white/40 text-[10.5px]">BUILDER / PROPOSER</span>
                    <span className="text-white/80">{selectedBlock.miner}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 font-mono text-[11px] text-white/60">
                Every contract deployed by HashX Labs undergoes state-space exhaustiveness verification before mainnet slot propagation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
