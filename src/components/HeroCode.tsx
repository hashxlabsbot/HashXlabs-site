"use client";

import { useState } from "react";
import Link from "next/link";

type Line = { text: string; color?: string; bold?: boolean };

interface Scenario {
  id: string;
  name: string;
  badge: string;
  command: string;
  description: string;
  lines: Line[];
  summary: {
    status: "PASS" | "EXPLOIT PREVENTED" | "DEPLOYED";
    gasUsed: string;
    invariants: string;
    coverage: string;
  };
}

const SCENARIOS: Scenario[] = [
  {
    id: "fuzz",
    name: "Foundry Fuzzing",
    badge: "Invariant Engine",
    command: "forge test --match-contract InvariantSolvency -vvvv",
    description: "Multi-actor invariant fuzz campaign simulating 50,000 randomized state sequences.",
    lines: [
      { text: "$ forge test --match-contract InvariantSolvency -vvvv", color: "#6b7890" },
      { text: "[⠊] Compiling 28 Solidity contracts with solc 0.8.28...", color: "#8ab4ff" },
      { text: "[⠒] Linking cryptographic libraries: Solady, OpenZeppelin v5", color: "#8ab4ff" },
      { text: "", color: "" },
      { text: "[RUNNING] InvariantSolvency::invariant_solvency()", color: "#ff9e7a" },
      { text: "  ├─ Actor 0x71...8e: deposit(1,450,000 USDC)", color: "#b9e98a" },
      { text: "  ├─ Actor 0x3f...12: flashLoan(98,000,000 WETH)", color: "#f5d67b" },
      { text: "  ├─ Actor 0x09...aa: triggerRebalance(slippage: 0.05%)", color: "#b9e98a" },
      { text: "  └─ Invariant Check: totalAssets() >= totalOwed() ✓ [HELD]", color: "#34d399", bold: true },
      { text: "", color: "" },
      { text: "[PASS] invariant_solvency() (runs: 50000, calls: 750000)", color: "#34d399", bold: true },
      { text: "[PASS] invariant_noFreeShares() (runs: 50000, calls: 750000)", color: "#34d399", bold: true },
      { text: "[PASS] invariant_strictMonotonicYield() (runs: 50000, calls: 750000)", color: "#34d399", bold: true },
      { text: "", color: "" },
      { text: "Suite result: 3 passed, 0 failed, 0 counter-examples found in 1.48s", color: "#34d399" },
    ],
    summary: {
      status: "PASS",
      gasUsed: "142,390 avg",
      invariants: "3/3 held",
      coverage: "99.4%",
    },
  },
  {
    id: "reentrancy",
    name: "Exploit Defense",
    badge: "Formal Check",
    command: "medusa fuzz --target VaultAttackVector.sol",
    description: "Simulating adversarial cross-function reentrancy and sandwich attacks.",
    lines: [
      { text: "$ medusa fuzz --target VaultAttackVector.sol", color: "#6b7890" },
      { text: "[INIT] Initializing symbolic execution EVM harness...", color: "#8ab4ff" },
      { text: "[ALERT] Adversary attempting recursive reentrancy on withdraw():", color: "#f59e0b" },
      { text: "  1. Attacker calls Vault::withdraw(500 stETH)", color: "#f87171" },
      { text: "  2. Hook fallback invoked via raw token receive()", color: "#f87171" },
      { text: "  3. Re-enter Vault::withdraw(500 stETH) before state decrement", color: "#f87171" },
      { text: "", color: "" },
      { text: "[PROTECTION ENGAGED] ReentrancyGuardReentrantCall() reverted.", color: "#38bdf8", bold: true },
      { text: "[PROTECTION ENGAGED] CEI Pattern enforced: balances updated prior to transfer.", color: "#38bdf8", bold: true },
      { text: "", color: "" },
      { text: "✓ Invariant held: Drain impossible under adversarial harness.", color: "#34d399", bold: true },
      { text: "✓ Counter-example search space exhausted: 0 viable exploits.", color: "#34d399" },
    ],
    summary: {
      status: "EXPLOIT PREVENTED",
      gasUsed: "48,912 revert",
      invariants: "Zero Loss",
      coverage: "100% paths",
    },
  },
  {
    id: "deploy",
    name: "Mainnet Broadcast",
    badge: "Orchestration",
    command: "forge script script/Deploy.s.sol --broadcast --verify",
    description: "Automated deterministic CREATE2 deployment with bytecode verification.",
    lines: [
      { text: "$ forge script script/Deploy.s.sol --broadcast --verify", color: "#6b7890" },
      { text: "[INFO] Target Chain: Arbitrum One (Chain ID 42161)", color: "#8ab4ff" },
      { text: "[INFO] Deployer: 0x8A42...99C1 (Balance: 2.45 ETH)", color: "#8ab4ff" },
      { text: "", color: "" },
      { text: "[1/3] Deploying TimelockController via CREATE2...", color: "#b9e98a" },
      { text: "      Contract: 0x391f586940a4AcFe55dD10375E01348b61c9Ec42", color: "#38bdf8" },
      { text: "[2/3] Deploying RWA_VaultImplementation (solc 0.8.28 + viaIR)...", color: "#b9e98a" },
      { text: "      Contract: 0x981C0e9F37f8D44A6Eb79Ec6270E4582f34Ac877", color: "#38bdf8" },
      { text: "[3/3] Initializing multi-sig roles & renouncing deployer root...", color: "#b9e98a" },
      { text: "      Admin: 0x0000000000000000000000000000000000000000 (Burned)", color: "#34d399" },
      { text: "", color: "" },
      { text: "✓ Bytecode verified on Arbiscan & Blockscout automatically.", color: "#34d399", bold: true },
      { text: "✓ Zero warnings. Zero uninitialized implementation slots.", color: "#34d399" },
    ],
    summary: {
      status: "DEPLOYED",
      gasUsed: "1,842,109",
      invariants: "CREATE2 match",
      coverage: "Verified",
    },
  },
];

export default function HeroCode() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(100);

  const scenario = SCENARIOS[activeTab];

  const handleRun = () => {
    setIsRunning(true);
    setVisibleCount(2);

    let current = 2;
    const interval = setInterval(() => {
      current += 2;
      setVisibleCount(current);
      if (current >= scenario.lines.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 120);
  };

  const handleSelectTab = (idx: number) => {
    setActiveTab(idx);
    setIsRunning(false);
    setVisibleCount(100);
  };

  return (
    <div className="ticks relative border border-[var(--line-strong)] bg-[#0b1220] shadow-[12px_12px_0_0_var(--signal)]">
      <span className="tk-b" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 bg-[#0f172a]">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          <span className="ml-2 font-mono text-[11px] text-white/50">hashx-cli v2.8.4 // verification harness</span>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`font-mono text-[11px] px-2.5 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
            isRunning
              ? "bg-white/10 text-white/40 cursor-wait"
              : "bg-[var(--signal)] text-white hover:brightness-110 active:scale-95"
          }`}
        >
          {isRunning ? (
            <>
              <span className="inline-block animate-spin">⠋</span> Running...
            </>
          ) : (
            <>
              <span>▶</span> Execute
            </>
          )}
        </button>
      </div>

      {/* Scenario Tabs */}
      <div role="tablist" aria-label="Terminal Scenarios" className="flex overflow-x-auto border-b border-white/10 bg-[#070d18]">
        {SCENARIOS.map((s, idx) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={idx === activeTab}
            onClick={() => handleSelectTab(idx)}
            className={`font-mono relative shrink-0 border-r border-white/10 px-4 py-2.5 text-[11px] transition-colors cursor-pointer flex items-center gap-2 ${
              idx === activeTab ? "bg-[#0b1220] text-white" : "text-[#7a8699] hover:text-[#c9d3e6]"
            }`}
          >
            <span>{s.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/60 uppercase">
              {s.badge}
            </span>
            {idx === activeTab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--signal)]" />
            )}
          </button>
        ))}
      </div>

      {/* Code Console */}
      <pre className="font-mono h-[280px] overflow-auto bg-[#0b1220] px-4 py-4 text-[11.5px] leading-[1.85] text-[#dfe6f2]">
        {scenario.lines.slice(0, visibleCount).map((ln, n) => (
          <div key={n} className="flex">
            <span className="mr-4 w-5 shrink-0 select-none text-right text-[#3a4459]">{n + 1}</span>
            <span
              className="whitespace-pre"
              style={{
                color: ln.color || "#dfe6f2",
                fontWeight: ln.bold ? 700 : 400,
              }}
            >
              {ln.text}
            </span>
          </div>
        ))}
      </pre>

      {/* Telemetry Summary Bar */}
      <div className="grid grid-cols-4 border-t border-white/10 bg-[#070d18] px-4 py-2.5 font-mono text-[10.5px]">
        <div>
          <span className="block text-white/40">RESULT</span>
          <span className={`font-bold ${scenario.summary.status === "EXPLOIT PREVENTED" ? "text-cyan-400" : "text-emerald-400"}`}>
            {scenario.summary.status}
          </span>
        </div>
        <div>
          <span className="block text-white/40">GAS BENCH</span>
          <span className="text-white">{scenario.summary.gasUsed}</span>
        </div>
        <div>
          <span className="block text-white/40">INVARIANTS</span>
          <span className="text-white">{scenario.summary.invariants}</span>
        </div>
        <div>
          <span className="block text-white/40">TEST COVERAGE</span>
          <span className="text-emerald-400">{scenario.summary.coverage}</span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#0b1220] px-4 py-3">
        <span className="text-[12.5px] text-[#8e9bb3] font-mono">
          Spec, fuzzing &amp; invariants before a single dollar is deployed.
        </span>
        <Link href="/lab" className="btn-ghost h-8 px-3 text-[11px] text-white border-white/20 hover:border-[var(--signal)]">
          Open Invariant Lab →
        </Link>
      </div>
    </div>
  );
}
