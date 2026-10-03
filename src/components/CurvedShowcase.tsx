"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

type Glyph =
  | "curve" | "vault" | "keys" | "kink" | "depth" | "bridge" | "orbit" | "pipeline"
  | "timeline" | "hex" | "peg" | "accounts" | "merkle" | "index" | "fuzz";

type CardItem = {
  id: string;
  kind: "engagement" | "capability";
  group: string;
  tag: string;
  title: string;
  std: string;
  stdLabel: string;
  summary: string;
  chains: string[];
  flow: string[];
  glyph: Glyph;
  href: string;
};

// Engagements are real, anonymised (NDA) client work — full write-ups live in WORK (content/site).
// Capabilities are protocol types we build; they describe scope, never results. No invented metrics.
const ITEMS: CardItem[] = [
  {
    id: "amm", kind: "engagement", group: "DeFi", tag: "DeFi protocol",
    title: "Cross-chain AMM with ERC-4626 staking vaults",
    std: "ERC-4626", stdLabel: "tokenized vault standard",
    summary: "Constant-product pools, share-based staking and a LayerZero router, with swap and solvency invariants fuzzed in Foundry.",
    chains: ["Ethereum", "Arbitrum"], flow: ["Swap", "Vault", "Bridge"], glyph: "curve", href: "/case-studies#amm",
  },
  {
    id: "rwa", kind: "engagement", group: "RWA", tag: "Asset manager",
    title: "Permissioned real-world asset tokenization",
    std: "ERC-3643", stdLabel: "permissioned security token",
    summary: "Identity-gated transfers, an on-chain claims registry and pro-rata distributions that reconcile to the smallest unit.",
    chains: ["Polygon", "Ethereum"], flow: ["Investor", "Claims", "Compliance"], glyph: "vault", href: "/case-studies#rwa",
  },
  {
    id: "custody", kind: "engagement", group: "Wallets", tag: "Digital asset custody",
    title: "Threshold-signing custody with a policy engine",
    std: "2-of-3", stdLabel: "threshold signatures",
    summary: "Spend limits, allowlists and multi-party approval in front of KMS-backed keys, so no single device can move funds.",
    chains: ["EVM", "AWS KMS"], flow: ["Request", "Policy", "Signers"], glyph: "keys", href: "/case-studies#custody",
  },
  {
    id: "lending", kind: "capability", group: "DeFi", tag: "Money market",
    title: "Isolated lending markets with liquidation engine",
    std: "Isolated", stdLabel: "per-asset risk markets",
    summary: "Kinked interest-rate curves, health-factor accounting and keeper-driven liquidations with oracle staleness guards.",
    chains: ["Ethereum", "Base"], flow: ["Supply", "Borrow", "Liquidate"], glyph: "kink", href: "/services/blockchain-development",
  },
  {
    id: "perps", kind: "capability", group: "Exchanges", tag: "Derivatives exchange",
    title: "Perpetuals DEX with off-chain matching, on-chain settlement",
    std: "CLOB", stdLabel: "central limit order book",
    summary: "A Rust matching engine, signed orders, funding-rate accrual and margin checks enforced by settlement contracts.",
    chains: ["Arbitrum", "Rust"], flow: ["Order", "Match", "Settle"], glyph: "depth", href: "/services/blockchain-development",
  },
  {
    id: "bridge", kind: "capability", group: "Infrastructure", tag: "Interoperability",
    title: "Cross-chain token bridge and message relay",
    std: "CCIP", stdLabel: "cross-chain messaging",
    summary: "Burn-and-mint token transfers with rate limits, replay protection and a pause path that works when one chain halts.",
    chains: ["Ethereum", "Avalanche"], flow: ["Source", "Relay", "Destination"], glyph: "bridge", href: "/services/blockchain-development",
  },
  {
    id: "staking", kind: "capability", group: "DeFi", tag: "Liquid staking",
    title: "Liquid staking and restaking vault",
    std: "LST", stdLabel: "liquid staking token",
    summary: "Validator deposit queues, exchange-rate accounting for rewards and slashing, and a withdrawal queue that cannot be jumped.",
    chains: ["Ethereum", "EigenLayer"], flow: ["Stake", "Validators", "Rewards"], glyph: "orbit", href: "/services/blockchain-development",
  },
  {
    id: "aa", kind: "capability", group: "Wallets", tag: "Account abstraction",
    title: "Smart accounts with sponsored gas and session keys",
    std: "ERC-4337", stdLabel: "account abstraction",
    summary: "Modular smart accounts, paymaster gas sponsorship and scoped session keys for wallet-less onboarding.",
    chains: ["Base", "Optimism"], flow: ["UserOp", "Bundler", "EntryPoint"], glyph: "pipeline", href: "/services/blockchain-development",
  },
  {
    id: "stablecoin", kind: "capability", group: "Stablecoins", tag: "Stablecoin",
    title: "Collateral-backed stablecoin with oracle guards",
    std: "CDP", stdLabel: "collateralised debt position",
    summary: "Vault-based minting, stability fees, circuit breakers on oracle deviation and a redemption path that holds the peg.",
    chains: ["Ethereum", "Chainlink"], flow: ["Deposit", "Mint", "Redeem"], glyph: "peg", href: "/services/blockchain-development",
  },
  {
    id: "governance", kind: "capability", group: "Governance", tag: "DAO governance",
    title: "On-chain governance with timelocked treasury",
    std: "Governor", stdLabel: "governor + timelock",
    summary: "Snapshot-based voting power, a full proposal lifecycle and a timelock between every vote and treasury execution.",
    chains: ["Ethereum", "Arbitrum"], flow: ["Propose", "Vote", "Execute"], glyph: "timeline", href: "/services/blockchain-development",
  },
  {
    id: "nft", kind: "capability", group: "Tokens", tag: "Digital collectibles",
    title: "Multi-token collection with on-chain royalties",
    std: "ERC-1155", stdLabel: "multi-token standard",
    summary: "Batch minting, allowlist phases via Merkle proofs, ERC-2981 royalties and metadata that can be frozen for good.",
    chains: ["Base", "Polygon"], flow: ["Allowlist", "Mint", "Royalties"], glyph: "hex", href: "/services/blockchain-development",
  },
  {
    id: "solana", kind: "capability", group: "Infrastructure", tag: "Solana program",
    title: "Solana programs with Anchor and PDA state",
    std: "Anchor", stdLabel: "Solana program framework",
    summary: "Program-derived account layouts, CPI into SPL Token and account-validation constraints tested in Bankrun.",
    chains: ["Solana", "Rust"], flow: ["Instruction", "Program", "Accounts"], glyph: "accounts", href: "/services/blockchain-development",
  },
  {
    id: "zk", kind: "capability", group: "Next-gen", tag: "Zero knowledge",
    title: "Zero-knowledge membership and private claims",
    std: "Groth16", stdLabel: "zk-SNARK proving system",
    summary: "Circom circuits over a Merkle membership set, nullifiers against double-claims and an on-chain Solidity verifier.",
    chains: ["Circom", "EVM"], flow: ["Witness", "Prove", "Verify"], glyph: "merkle", href: "/services/blockchain-development",
  },
  {
    id: "indexer", kind: "capability", group: "Infrastructure", tag: "Data layer",
    title: "Event indexer and protocol analytics API",
    std: "Subgraph", stdLabel: "event indexing",
    summary: "Reorg-safe event ingestion, derived positions and TVL views, served over GraphQL to the dApp and dashboards.",
    chains: ["The Graph", "PostgreSQL"], flow: ["Event", "Index", "API"], glyph: "index", href: "/services/blockchain-development",
  },
  {
    id: "audit", kind: "capability", group: "Security", tag: "Security review",
    title: "Invariant-driven smart contract audits",
    std: "Invariants", stdLabel: "stateful fuzzing",
    summary: "Manual review backed by property suites in Foundry and Echidna, Slither static analysis and a failing test per finding.",
    chains: ["Foundry", "Echidna"], flow: ["Scope", "Fuzz", "Report"], glyph: "fuzz", href: "/services/smart-contract-audit",
  },
];

/** Code-drawn blueprint for each protocol type. Strokes use currentColor; accents use --signal. */
function Blueprint({ kind }: { kind: Glyph }) {
  const s = { stroke: "currentColor", strokeWidth: 1.2, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const a = { stroke: "var(--signal)", strokeWidth: 1.6, fill: "none", vectorEffect: "non-scaling-stroke" as const };
  const dot = { fill: "var(--signal)" };
  const faint = { ...s, opacity: 0.35, strokeDasharray: "3 3" };

  let body: ReactNode;
  switch (kind) {
    case "curve": // x · y = k
      body = (<>
        <path {...faint} d="M20 10 V90 H220" />
        <path {...a} d="M34 12 C 48 60, 90 78, 214 84" />
        <path {...faint} d="M84 67 V90 M20 67 H84" />
        <circle cx="84" cy="67" r="3.5" {...dot} />
        <text x="150" y="30" className="bp-t">x · y = k</text>
      </>);
      break;
    case "vault":
      body = (<>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={40 + i * 8} y={20 + i * 14} width={120 - i * 16} height="12" {...(i === 3 ? a : s)} />)}
        <path {...faint} d="M175 30 H215 M175 50 H215 M175 70 H215" />
        <text x="170" y="92" className="bp-t">identity → transfer</text>
      </>);
      break;
    case "keys":
      body = (<>
        {[[60, 50], [120, 20], [180, 50]].map(([x, y], i) => (
          <g key={i}><circle cx={x} cy={y + 10} r="14" {...(i < 2 ? a : s)} /><path {...(i < 2 ? a : faint)} d={`M${x} ${y + 24} L120 82`} /></g>
        ))}
        <rect x="108" y="76" width="24" height="14" {...s} />
        <text x="150" y="92" className="bp-t">2 of 3</text>
      </>);
      break;
    case "kink":
      body = (<>
        <path {...faint} d="M20 10 V90 H220 M168 10 V90" />
        <path {...a} d="M20 84 L168 64 L220 14" />
        <circle cx="168" cy="64" r="3.5" {...dot} />
        <text x="100" y="30" className="bp-t">kink · 80%</text>
      </>);
      break;
    case "depth":
      body = (<>
        <path {...s} d="M20 90 V70 H40 V58 H60 V44 H80 V30 H112 V90" />
        <path {...a} d="M128 90 V36 H156 V50 H176 V62 H198 V74 H220 V90" />
        <path {...faint} d="M120 10 V92" />
      </>);
      break;
    case "bridge":
      body = (<>
        {[0, 1, 2].map((i) => <rect key={"l" + i} x="24" y={24 + i * 20} width="40" height="14" {...s} />)}
        {[0, 1, 2].map((i) => <rect key={"r" + i} x="176" y={24 + i * 20} width="40" height="14" {...s} />)}
        <path {...a} d="M64 40 C 100 -6, 140 -6, 176 40" />
        <path {...faint} d="M64 70 C 100 40, 140 40, 176 70" />
        <circle cx="120" cy="6" r="3.5" {...dot} />
      </>);
      break;
    case "orbit":
      body = (<>
        <circle cx="120" cy="50" r="10" {...a} />
        <ellipse cx="120" cy="50" rx="70" ry="22" {...s} />
        <ellipse cx="120" cy="50" rx="100" ry="38" {...faint} />
        {[[50, 50], [190, 50], [120, 28], [150, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" {...dot} />)}
      </>);
      break;
    case "pipeline":
      body = (<>
        {[0, 1, 2].map((i) => <rect key={i} x={20 + i * 76} y="34" width="56" height="32" {...(i === 2 ? a : s)} />)}
        <path {...a} d="M76 50 H96 M152 50 H172" />
        <path {...faint} d="M124 66 V88 H40" />
        <text x="44" y="96" className="bp-t">paymaster</text>
      </>);
      break;
    case "timeline":
      body = (<>
        <path {...s} d="M20 50 H220" />
        <path {...a} d="M20 50 H150" />
        {[20, 80, 150, 220].map((x, i) => <circle key={i} cx={x} cy="50" r="5" {...(i < 3 ? { fill: "var(--signal)" } : s)} />)}
        <path {...faint} d="M150 30 H220 V70 H150 Z" />
        <text x="160" y="24" className="bp-t">48h delay</text>
      </>);
      break;
    case "hex": {
      const hex = (cx: number, cy: number) => {
        const p = Array.from({ length: 6 }, (_, k) => {
          const t = (Math.PI / 3) * k + Math.PI / 6;
          return `${(cx + 14 * Math.cos(t)).toFixed(1)},${(cy + 14 * Math.sin(t)).toFixed(1)}`;
        });
        return p.join(" ");
      };
      const cells = [[60, 30], [84, 30], [108, 30], [132, 30], [156, 30], [72, 52], [96, 52], [120, 52], [144, 52], [168, 52], [84, 74], [108, 74], [132, 74], [156, 74]];
      body = <>{cells.map(([x, y], i) => <polygon key={i} points={hex(x, y)} {...([2, 7, 11].includes(i) ? a : s)} opacity={[2, 7, 11].includes(i) ? 1 : 0.6} />)}</>;
      break;
    }
    case "peg":
      body = (<>
        <path {...faint} d="M20 50 H220" />
        <path {...a} d="M20 50 C 40 30, 55 70, 75 46 S 110 58, 130 49 S 170 52, 220 50" />
        <text x="190" y="42" className="bp-t">$1</text>
        <path {...s} opacity="0.5" d="M20 20 H220 M20 80 H220" />
      </>);
      break;
    case "accounts": // program → PDAs derived from seeds
      body = (<>
        <circle cx="46" cy="50" r="16" {...a} />
        <text x="30" y="92" className="bp-t">program</text>
        {[18, 34, 50, 66, 82].map((y, i) => (
          <g key={i}>
            <path {...(i === 2 ? a : faint)} d={`M62 50 C 110 50, 130 ${y}, 170 ${y}`} />
            <circle cx="176" cy={y} r={i === 2 ? 5 : 3.5} {...(i === 2 ? dot : { ...s, opacity: 0.6 })} />
          </g>
        ))}
        <text x="190" y="54" className="bp-t">PDA</text>
      </>);
      break;
    case "merkle":
      body = (<>
        <path {...s} d="M120 14 L70 44 M120 14 L170 44 M70 44 L45 78 M70 44 L95 78 M170 44 L145 78 M170 44 L195 78" />
        <path {...a} d="M120 14 L70 44 L95 78" />
        {[[120, 14], [70, 44], [170, 44], [45, 78], [95, 78], [145, 78], [195, 78]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 0 ? 6 : 4.5} {...([0, 1, 4].includes(i) ? (i === 0 ? dot : a) : s)} />
        ))}
      </>);
      break;
    case "index":
      body = (<>
        <path {...faint} d="M20 90 H220" />
        {[30, 48, 22, 64, 40, 72, 56, 80, 50, 68].map((h, i) => (
          <rect key={i} x={24 + i * 19} y={90 - h} width="11" height={h} {...(i === 7 ? a : s)} opacity={i === 7 ? 1 : 0.6} />
        ))}
      </>);
      break;
    case "fuzz":
      body = (<>
        <rect x="30" y="14" width="180" height="72" {...faint} />
        {Array.from({ length: 34 }, (_, i) => {
          const x = 36 + ((i * 53) % 168), y = 20 + ((i * 29) % 60);
          return <circle key={i} cx={x} cy={y} r="1.8" fill="currentColor" opacity="0.55" />;
        })}
        <path {...a} d="M30 60 L90 36 L150 52 L210 24" />
        <text x="150" y="98" className="bp-t">invariant holds</text>
      </>);
      break;
  }
  return (
    <svg viewBox="0 0 240 100" className="h-full w-full" aria-hidden>
      {body}
    </svg>
  );
}

export default function CurvedShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const total = ITEMS.length;

  useEffect(() => {
    let animId = 0;
    let target = 0;
    let current = 0;

    const read = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      target = Math.min(1, Math.max(0, -rect.top / scrollable));
    };

    // Inertia lerp; idles once settled so the section costs nothing off-screen.
    const loop = () => {
      current += (target - current) * 0.085;
      if (Math.abs(target - current) < 0.0004) current = target;
      setProgress(current);
      animId = current === target ? 0 : requestAnimationFrame(loop);
    };
    const onScroll = () => {
      read();
      if (!animId) animId = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animId);
    };
  }, []);

  const activeIndex = Math.round(progress * (total - 1));
  const active = ITEMS[activeIndex];

  const jumpTo = (i: number) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (i / (total - 1)) * scrollable, behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="work"
      className="feather [--fc:#d4d4d2] relative bg-[#d4d4d2] text-[#111214]"
      style={{ height: `${100 + total * 20}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-[var(--header-h)] pb-6 select-none">

        {/* Soft studio light: bright pool behind the front card, falling off to the sides.
            Sides only: top/bottom must stay the flat base colour so the .feather fades meet it seamlessly. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 50% 55%, rgba(255,255,255,.55), transparent 70%), linear-gradient(90deg, rgba(17,18,20,.09), transparent 28%, transparent 72%, rgba(17,18,20,.09))",
          }}
        />

        {/* Giant BUILT / ON-CHAIN: one solid, one outlined, drifting apart on scroll */}
        <div aria-hidden className="absolute inset-0 flex flex-col justify-center pointer-events-none z-0">
          <div className="w-full pl-6 sm:pl-14 will-change-transform" style={{ transform: `translate3d(${(progress - 0.5) * -260}px,0,0)` }}>
            <span className="font-[family-name:var(--font-head)] text-[clamp(4.5rem,15vw,19rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.045em] text-[#1c1d21]/[0.13]">
              Built
            </span>
          </div>
          <div className="w-full flex justify-end pr-6 sm:pr-14 mt-2 will-change-transform" style={{ transform: `translate3d(${(progress - 0.5) * 300}px,0,0)` }}>
            <span
              className="font-[family-name:var(--font-head)] text-[clamp(4.5rem,15vw,19rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.045em] text-transparent"
              style={{ WebkitTextStroke: "1.5px rgba(28,29,33,.28)" }}
            >
              On‑chain
            </span>
          </div>
        </div>

        {/* Arc guide */}
        <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none z-[1] opacity-30" preserveAspectRatio="none" viewBox="0 0 1440 800" fill="none">
          <path d="M -100 620 C 350 320, 1090 280, 1540 650" stroke="#1c1d21" strokeWidth="1.2" strokeDasharray="3 6" />
          <path d="M -100 660 C 350 360, 1090 320, 1540 690" stroke="var(--signal)" strokeWidth="1.5" strokeDasharray="2400" strokeDashoffset={2400 - progress * 2400} />
        </svg>

        {/* Header */}
        <div className="relative z-10 mx-auto w-full max-w-[1340px] px-5 sm:px-8 pt-4 flex items-end justify-between gap-6">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#1c1d21]/70 font-semibold flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 bg-[var(--signal)]" />
              Protocol index · {total} systems
            </div>
            <div className="mono mt-2 text-[10.5px] uppercase tracking-[0.14em] text-[#1c1d21]/50">
              {active.kind === "engagement" ? "Client engagement · under NDA" : "Capability · what we build"}
            </div>
          </div>
          <div className="flex items-baseline gap-2 font-[family-name:var(--font-head)] tabular-nums leading-none">
            <span key={activeIndex} className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#111214] [animation:fadeIn_.45s_var(--ease-out-expo)]">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <span className="mono text-xs text-[#1c1d21]/50">/ {String(total).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Category rail (desktop) */}
        <nav aria-label="Jump to protocol" className="absolute left-5 xl:left-8 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-1">
          {ITEMS.map((it, i) => (
            <button
              key={it.id}
              onClick={() => jumpTo(i)}
              className={`group mono flex items-center gap-2 text-left text-[10px] uppercase tracking-[0.14em] transition-colors ${i === activeIndex ? "text-[#111214]" : "text-[#1c1d21]/40 hover:text-[#111214]"}`}
            >
              <span className={`h-px transition-all duration-500 ${i === activeIndex ? "w-7 bg-[var(--signal)]" : "w-3 bg-current"}`} />
              <span className={`bg-[#d4d4d2]/90 px-1 ${i === activeIndex ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}`}>{it.std}</span>
            </button>
          ))}
        </nav>

        {/* 3D arc reel */}
        <div className="relative z-10 w-full flex-1 flex items-center justify-center" style={{ perspective: "1200px", perspectiveOrigin: "50% 58%" }}>
          <div className="relative w-full h-[480px] flex items-center justify-center" style={{ transformStyle: "preserve-3d", transform: "rotateZ(-7deg) rotateX(12deg)" }}>
            {ITEMS.map((item, index) => {
              const offset = index - progress * (total - 1);
              const distance = Math.abs(offset);
              if (distance > 3.6) return null;

              const angleDeg = offset * 26;
              const rad = (angleDeg * Math.PI) / 180;
              const radius = 1100;
              const x = Math.sin(rad) * radius;
              const z = (Math.cos(rad) - 1) * radius * 0.95;
              const y = (Math.cos(rad) - 1) * -180 + offset * 20;
              const scale = Math.max(0.66, 1 - distance * 0.12);
              const opacity = Math.max(0, 1 - distance * 0.3);
              const front = Math.max(0, 1 - distance * 1.6); // 1 at centre → 0 by ~0.6 away
              const isFront = front > 0.5;

              return (
                <div
                  key={item.id}
                  className="absolute w-[72vw] sm:w-[84vw] max-w-[440px] will-change-transform"
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${angleDeg * 1.15}deg) rotateZ(${offset * -4.5}deg) rotateX(-6deg) scale(${scale})`,
                    opacity,
                    zIndex: Math.round(100 - distance * 10),
                    pointerEvents: opacity > 0.4 ? "auto" : "none",
                  }}
                >
                  <Link
                    href={item.href}
                    tabIndex={isFront ? 0 : -1}
                    className="group relative block overflow-hidden border p-6 sm:p-8 transition-[background-color,color,border-color,box-shadow] duration-300"
                    style={{
                      backgroundColor: isFront ? "#0e0f12" : "#fbfbfa",
                      color: isFront ? "#f3f4f6" : "#111214",
                      borderColor: isFront ? "#0e0f12" : "rgba(17,18,20,.18)",
                      boxShadow: isFront
                        ? "0 2px 4px rgba(0,0,0,.08), 0 24px 48px -12px rgba(0,0,0,.35), 0 60px 110px -30px rgba(0,87,217,.35)"
                        : "0 10px 30px -12px rgba(0,0,0,.18)",
                    }}
                  >
                    {/* Corner ticks */}
                    <span aria-hidden className="absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-[var(--signal)]" />
                    <span aria-hidden className="absolute right-2 bottom-2 h-2.5 w-2.5 border-r border-b border-[var(--signal)]" />

                    <div className="flex items-center justify-between mb-5">
                      <span className="mono text-xs font-bold text-[var(--signal)] [filter:brightness(1.35)]">
                        {String(index + 1).padStart(2, "0")} <span className="opacity-60 font-normal">/ {item.group}</span>
                      </span>
                      <span className="mono text-[10px] uppercase tracking-wider opacity-60 border border-current/25 px-2 py-0.5">
                        {item.kind === "engagement" ? `${item.tag} · NDA` : item.tag}
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-[family-name:var(--font-head)] text-4xl sm:text-5xl font-extrabold tracking-tight [font-stretch:88%] leading-none">
                          {item.std}
                        </div>
                        <div className="mono mt-2 text-[10.5px] uppercase tracking-wider opacity-55">{item.stdLabel}</div>
                      </div>
                    </div>

                    {/* Blueprint */}
                    <div
                      className="relative my-5 h-[88px] border-y border-dashed px-1 py-2 transition-opacity duration-500"
                      style={{ borderColor: isFront ? "rgba(255,255,255,.12)" : "rgba(17,18,20,.12)", opacity: isFront ? 1 : 0.7 }}
                    >
                      <Blueprint kind={item.glyph} />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold leading-snug mb-2">{item.title}</h3>
                    <p className="text-[13px] leading-relaxed opacity-70 line-clamp-3 mb-4">{item.summary}</p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {item.chains.map((c) => (
                        <span key={c} className="mono text-[10px] uppercase tracking-wider opacity-65 border border-current/20 px-2 py-0.5">
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="mono flex flex-wrap items-center gap-1.5 pt-4 border-t border-current/10 text-[10.5px]">
                      {item.flow.map((f, fi) => (
                        <span key={f} className="flex items-center">
                          <span className="px-2 py-0.5" style={{ background: isFront ? "rgba(255,255,255,.08)" : "rgba(17,18,20,.05)" }}>{f}</span>
                          {fi < item.flow.length - 1 && <span className="px-1 text-[var(--signal)] [filter:brightness(1.35)]">→</span>}
                        </span>
                      ))}
                      <span className="ml-auto font-semibold text-[var(--signal)] [filter:brightness(1.35)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        {item.kind === "engagement" ? "Case study" : "Service"} <span>↗</span>
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
