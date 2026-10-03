"use client";

import { useEffect, useState } from "react";

interface BlockData {
  ethBlock: number;
  arbBlock: number;
  solSlot: number;
  gasGwei: number;
  tps: number;
  invariantsPassing: number;
}

export default function BlockchainStatusBar() {
  const [data, setData] = useState<BlockData>({
    ethBlock: 21948320,
    arbBlock: 312894510,
    solSlot: 318492040,
    gasGwei: 14.2,
    tps: 3410,
    invariantsPassing: 10429,
  });

  const [lastBlink, setLastBlink] = useState<string>("eth");

  useEffect(() => {
    // Tick block heights and simulate real-time blockchain telemetry
    const interval = setInterval(() => {
      setData((prev) => {
        const nextEth = prev.ethBlock + (Math.random() > 0.6 ? 1 : 0);
        const nextArb = prev.arbBlock + Math.floor(Math.random() * 3 + 1);
        const nextSol = prev.solSlot + Math.floor(Math.random() * 4 + 2);
        const nextGas = Number((12 + Math.sin(Date.now() / 4000) * 4 + Math.random() * 1.5).toFixed(1));
        const nextTps = Math.floor(3200 + Math.random() * 400);
        const nextInvariants = prev.invariantsPassing + (Math.random() > 0.8 ? 1 : 0);

        return {
          ethBlock: nextEth,
          arbBlock: nextArb,
          solSlot: nextSol,
          gasGwei: nextGas,
          tps: nextTps,
          invariantsPassing: nextInvariants,
        };
      });

      const chains = ["eth", "arb", "sol", "fuzz"];
      setLastBlink(chains[Math.floor(Math.random() * chains.length)]);
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-label="Live Blockchain Network Telemetry"
      className="hidden md:flex items-center justify-between border-b border-[var(--line-strong)] bg-[#0b1220] px-5 sm:px-8 py-1.5 text-[10.5px] font-mono text-[#8e9bb3] select-none"
    >
      <div className="flex items-center gap-6">
        {/* Node Status */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[#c9d3e6] font-semibold tracking-wider uppercase">Mainnet Nodes Synced</span>
        </div>

        {/* Chain blocks */}
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="text-white/50">ETH:</span>
            <span className={`text-white transition-opacity ${lastBlink === "eth" ? "text-cyan-400" : ""}`}>
              #{data.ethBlock.toLocaleString()}
            </span>
          </span>

          <span className="text-white/20">|</span>

          <span className="flex items-center gap-1.5">
            <span className="text-white/50">ARB:</span>
            <span className={`text-white transition-opacity ${lastBlink === "arb" ? "text-cyan-400" : ""}`}>
              #{data.arbBlock.toLocaleString()}
            </span>
          </span>

          <span className="text-white/20">|</span>

          <span className="flex items-center gap-1.5">
            <span className="text-white/50">SOL:</span>
            <span className={`text-white transition-opacity ${lastBlink === "sol" ? "text-purple-400" : ""}`}>
              slot {data.solSlot.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Gas & TPS */}
        <div className="flex items-center gap-1.5">
          <span className="text-white/50">BASE GAS:</span>
          <span className="text-emerald-400 font-medium">{data.gasGwei} Gwei</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-white/50">AGGREGATE TPS:</span>
          <span className="text-white font-medium">{data.tps.toLocaleString()} tx/s</span>
        </div>

        {/* Invariant status */}
        <div className="flex items-center gap-2 border-l border-white/15 pl-4">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
          <span className="text-white/70">FUZZ RUNS:</span>
          <span className="text-white font-bold tracking-tight">
            {data.invariantsPassing.toLocaleString()} PASSED
          </span>
        </div>
      </div>
    </div>
  );
}
