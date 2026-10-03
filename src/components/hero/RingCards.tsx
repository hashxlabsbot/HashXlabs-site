// 130×300 poster creatives for the hero's 3D ring, drawn entirely in code
// (no network images — see CSP). Each card pitches one service line to a Web3
// buyer: a hook, a one-line promise, three concrete deliverables, a visual.
// The hero sizes itself so every card is shown whole.
//
// Rule: no invented metrics, client names or guarantees on these cards.

import type { CSSProperties, ReactNode } from "react";

const M = "var(--font-mono-brand)";

interface Theme {
  bg: string;
  fg: string; // headline
  accent: string; // second headline line, ticks
  body: string; // promise + bullets
  muted: string; // eyebrow
  rule: string; // bullet dividers
}

function Poster({
  t,
  eyebrow,
  title,
  promise,
  bullets,
  children,
  serif,
  top,
}: {
  t: Theme;
  eyebrow: string;
  title: [string, string];
  promise: string;
  bullets: string[];
  children?: ReactNode;
  serif?: boolean;
  top?: ReactNode;
}) {
  const head: CSSProperties = serif
    ? { fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600, fontSize: 15.5, lineHeight: 1.02, whiteSpace: "nowrap" }
    : {};
  return (
    <>
      <div className="rc-fill" style={{ background: t.bg }} />
      {children}
      {top}
      <div className="rc-cv" style={{ top: 15, fontFamily: M, fontSize: 4.8, letterSpacing: ".16em", textTransform: "uppercase", color: t.muted }}>
        {eyebrow}
      </div>
      <div className={`rc-cv ${serif ? "" : "rc-big"}`} style={{ top: 27, fontSize: 19, color: t.fg, ...head }}>
        {title[0]}
      </div>
      <div className={`rc-cv ${serif ? "" : "rc-big"}`} style={{ top: 45.5, fontSize: 19, color: t.accent, ...head }}>
        {title[1]}
      </div>
      <div className="rc-cv" style={{ top: 71, fontSize: 7, lineHeight: 1.36, fontWeight: 600, color: t.fg }}>
        {promise}
      </div>
      <div className="rc-cv" style={{ top: 96 }}>
        {bullets.map((b) => (
          <div
            key={b}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "3.4px 0", borderTop: `1px solid ${t.rule}`, fontSize: 6.1, color: t.body, whiteSpace: "nowrap" }}
          >
            <svg width="6" height="6" viewBox="0 0 12 12" aria-hidden="true" style={{ flex: "none" }}>
              <path d="M2 6.5 5 9.2 10.2 3" fill="none" stroke={t.accent} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {b}
          </div>
        ))}
      </div>
    </>
  );
}

const LIGHT: Theme = { bg: "#eef2f7", fg: "#0b1220", accent: "#0057d9", body: "#2c3647", muted: "#6b7686", rule: "rgba(11,18,32,.08)" };

/** DeFi protocols — light, with an accounting curve. */
function Defi() {
  return (
    <Poster
      t={LIGHT}
      eyebrow="DeFi protocols"
      title={["Yield", "engines"]}
      promise="Vaults, AMMs and lending markets built to hold real TVL."
      bullets={["ERC-4626 share accounting", "Oracle + liquidation design", "Gas-tuned hot paths"]}
    >
      <svg className="rc-ph" style={{ top: 150, bottom: 0 }} viewBox="0 0 130 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="rcv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0057d9" stopOpacity=".32" />
            <stop offset="1" stopColor="#0057d9" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M10 120 C30 112 40 96 58 94 S86 76 98 56 S114 34 120 30 V150 H10Z" fill="url(#rcv)" />
        <path d="M10 120 C30 112 40 96 58 94 S86 76 98 56 S114 34 120 30" fill="none" stroke="#0057d9" strokeWidth="2.4" />
        <circle cx="120" cy="30" r="3.4" fill="#0057d9" />
      </svg>
    </Poster>
  );
}

/** Tokenized real-world assets — warm gold, a minted coin. */
function Rwa() {
  return (
    <Poster
      serif
      t={{ bg: "linear-gradient(170deg,#f7ecd2,#ecd49a 55%,#cfa650)", fg: "#4a3008", accent: "#8a5a06", body: "#4a3a1c", muted: "#8a6a2c", rule: "rgba(74,48,8,.14)" }}
      eyebrow="Real-world assets"
      title={["TOKENIZE", "REAL ASSETS"]}
      promise="Funds, credit and property on-chain, compliance built in."
      bullets={["ERC-3643 permissioned tokens", "KYC-gated transfers", "NAV + redemption flows"]}
    >
      <svg className="rc-ph" style={{ top: 158, height: 120 }} viewBox="0 0 130 120">
        <circle cx="65" cy="60" r="44" fill="#fff4d6" stroke="#9a6b12" strokeWidth="2" />
        <circle cx="65" cy="60" r="34" fill="none" stroke="#9a6b12" strokeWidth="1" strokeDasharray="2 3" />
        <path d="M49 70V52l16-10 16 10v18M45 70h40M55 70V56M65 70V56M75 70V56" stroke="#7a520c" strokeWidth="2.2" fill="none" strokeLinejoin="round" />
      </svg>
    </Poster>
  );
}

/** Custody — threshold signing, 2 of 3 keys lit. */
function Custody() {
  return (
    <Poster
      t={{ bg: "linear-gradient(180deg,#07142a,#0a2248 55%,#050b18)", fg: "#fff", accent: "#6fd3ff", body: "rgba(255,255,255,.78)", muted: "rgba(255,255,255,.5)", rule: "rgba(255,255,255,.1)" }}
      eyebrow="Digital custody"
      title={["Keys,", "secured"]}
      promise="MPC and multisig wallets with no single point of failure."
      bullets={["2-of-3 threshold signing", "Policy + approval engine", "Hot / warm / cold tiers"]}
    >
      <svg className="rc-ph" style={{ top: 150, height: 130 }} viewBox="0 0 130 130">
        <path d="M65 22 L22 108 L108 108 Z" fill="none" stroke="#6fd3ff" strokeOpacity=".35" strokeWidth="1.4" />
        <path d="M65 22 L22 108" stroke="#6fd3ff" strokeWidth="2.4" />
        {(
          [
            [65, 22, true],
            [22, 108, true],
            [108, 108, false],
          ] as const
        ).map(([x, y, on], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill={on ? "#0e3a6e" : "#0a1830"} stroke={on ? "#6fd3ff" : "#2a3d5c"} strokeWidth="1.6" />
            <circle cx={x} cy={y} r="3.4" fill={on ? "#bff0ff" : "#2a3d5c"} />
          </g>
        ))}
        <text x="65" y="80" textAnchor="middle" fontFamily={M} fontSize="11" fill="#fff" fontWeight="700">2 / 3</text>
      </svg>
    </Poster>
  );
}

/** Cross-chain — ribbon + heavy type. */
function Bridge() {
  return (
    <Poster
      t={{ bg: "linear-gradient(158deg,#23105e 0%,#4a1ca6 42%,#7b2fd6 68%,#2c0f70 100%)", fg: "#fff", accent: "#7fe3ff", body: "rgba(255,255,255,.85)", muted: "rgba(255,255,255,.6)", rule: "rgba(255,255,255,.14)" }}
      eyebrow="Cross-chain"
      title={["Bridge", "safely"]}
      promise="Move value across chains, designed for adversaries."
      bullets={["LayerZero · CCIP · Wormhole", "Rate limits + kill switches", "Replay-proof messaging"]}
    >
      <div className="rc-fill" style={{ background: "radial-gradient(46% 16% at 50% 72%, rgba(180,150,255,.55), rgba(180,150,255,0) 72%)" }} />
      <svg className="rc-ph" style={{ top: 160, height: 110 }} viewBox="0 0 130 110">
        <path d="M24 80 Q65 6 106 80" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" />
        <circle cx="24" cy="80" r="14" fill="#fff" />
        <circle cx="106" cy="80" r="14" fill="#19c3ff" />
        <text x="24" y="84" textAnchor="middle" fontFamily={M} fontSize="9" fontWeight="700" fill="#2c0f70">L1</text>
        <text x="106" y="84" textAnchor="middle" fontFamily={M} fontSize="9" fontWeight="700" fill="#07142a">L2</text>
      </svg>
    </Poster>
  );
}

/** Audit readiness — a paper checklist. */
function Audit() {
  return (
    <Poster
      t={{ bg: "#fbfaf7", fg: "#0b1220", accent: "#0057d9", body: "#1b2230", muted: "#8a8f98", rule: "#ebe8e1" }}
      eyebrow="Security review"
      title={["Audit", "ready"]}
      promise="Walk into your audit with the hard questions answered."
      bullets={["Threat model + invariants", "Reentrancy + access control", "Oracle + rounding review"]}
      top={<div className="rc-fill" style={{ bottom: "auto", height: 5, background: "#0057d9" }} />}
    >
      <div className="rc-cv" style={{ top: 150, fontFamily: M, fontSize: 5, lineHeight: 1.9, color: "#5b6475" }}>
        {["upgrade safety", "signature replay", "MEV exposure", "access roles"].map((x) => (
          <div key={x} style={{ borderBottom: "1px dashed #e3dfd6" }}>
            <span style={{ color: "#0057d9" }}>[✓]</span> {x}
          </div>
        ))}
      </div>
    </Poster>
  );
}

/** Invariant fuzzing — a terminal. */
function Fuzz() {
  const lines: [string, string][] = [
    ["#6b7a90", "// runs before any feature"],
    ["#c792ea", "function"],
    ["#82aaff", " invariant_solvency()"],
    ["#e6edf6", "  public view {"],
    ["#ffcb6b", "  assertGe(assets, debt);"],
    ["#e6edf6", "}"],
  ];
  return (
    <Poster
      t={{ bg: "#070b12", fg: "#fff", accent: "#3fe3a0", body: "rgba(230,237,246,.8)", muted: "#3fe3a0", rule: "rgba(255,255,255,.08)" }}
      eyebrow="Spec first"
      title={["Break it", "first"]}
      promise="Fuzz campaigns against the rules your protocol must never break."
      bullets={["Foundry invariant suites", "Echidna + Slither in CI", "Fork tests on mainnet state"]}
    >
      <div className="rc-cv" style={{ top: 150, fontFamily: M, fontSize: 5.2, lineHeight: 1.75 }}>
        {lines.map(([c, t], i) => (
          <div key={i} style={{ color: c, whiteSpace: "pre" }}>{t}</div>
        ))}
        <div style={{ marginTop: 6, color: "#6b7a90" }}>$ forge test --mt invariant</div>
      </div>
    </Poster>
  );
}

/** Solana programs. */
function Solana() {
  return (
    <Poster
      t={{ bg: "linear-gradient(160deg,#9945ff 0%,#5a64f0 52%,#14c98f 100%)", fg: "#fff", accent: "#d9fff0", body: "rgba(255,255,255,.92)", muted: "rgba(255,255,255,.75)", rule: "rgba(255,255,255,.2)" }}
      eyebrow="Solana programs"
      title={["Rust.", "Anchor."]}
      promise="High-throughput programs, compute budget planned from day one."
      bullets={["PDAs + CPIs done right", "Token-2022 extensions", "Compute-unit profiling"]}
    >
      <svg className="rc-ph" style={{ top: 168, height: 80 }} viewBox="0 0 130 80">
        {[14, 32, 50].map((y, i) => (
          <path key={y} d={`M${i === 1 ? 26 : 34} ${y}h66l-9 11H${i === 1 ? 17 : 25}Z`} fill="#fff" fillOpacity={0.9 - i * 0.2} transform={i === 1 ? "scale(-1,1) translate(-130,0)" : undefined} />
        ))}
      </svg>
    </Poster>
  );
}

/** DAO treasuries — governance + timelock. */
function Dao() {
  return (
    <Poster
      serif
      t={{ bg: "linear-gradient(180deg,#062a2a,#0a3b3a 50%,#041818)", fg: "#e8fff9", accent: "#34e0b4", body: "rgba(232,255,249,.8)", muted: "rgba(232,255,249,.55)", rule: "rgba(232,255,249,.1)" }}
      eyebrow="DAOs + treasuries"
      title={["GOVERN", "ON-CHAIN"]}
      promise="Proposals to execution, with timelocks guarding every step."
      bullets={["OpenZeppelin Governor", "Timelock + Safe execution", "Delegation + snapshots"]}
    >
      <div className="rc-cv" style={{ top: 154 }}>
        {(
          [
            ["Propose", 1],
            ["Vote", 0.72],
            ["Queue", 0.46],
            ["Execute", 0.24],
          ] as const
        ).map(([t, w]) => (
          <div key={t} style={{ marginBottom: 9 }}>
            <div style={{ fontSize: 4.8, letterSpacing: ".1em", color: "rgba(232,255,249,.7)", textTransform: "uppercase" }}>{t}</div>
            <div style={{ marginTop: 3, height: 5, borderRadius: 3, background: "rgba(255,255,255,.1)" }}>
              <div style={{ width: `${w * 100}%`, height: "100%", borderRadius: 3, background: "#34e0b4" }} />
            </div>
          </div>
        ))}
      </div>
    </Poster>
  );
}

/** On-chain AI agents. */
function Agents() {
  const nodes = [
    [30, 26], [100, 20], [65, 56], [22, 88], [108, 82], [65, 112],
  ];
  const edges = [[0, 2], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [0, 1]];
  return (
    <Poster
      t={{ bg: "radial-gradient(120% 70% at 50% 85%,#1b2a4e,#07090f 70%)", fg: "#fff", accent: "#9cc8ff", body: "rgba(255,255,255,.8)", muted: "rgba(156,200,255,.7)", rule: "rgba(255,255,255,.1)" }}
      eyebrow="On-chain AI"
      title={["Agents", "that sign"]}
      promise="AI that transacts inside hard limits you set on-chain."
      bullets={["Spend caps + allow-lists", "ERC-4337 session keys", "Every action auditable"]}
    >
      <svg className="rc-ph" style={{ top: 156, height: 130 }} viewBox="0 0 130 130">
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="#7fb8ff" strokeOpacity=".45" strokeWidth="1.2" />
        ))}
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === 2 ? 7 : 4} fill={i === 2 ? "#7fb8ff" : "#0d1a33"} stroke="#7fb8ff" strokeWidth="1.4" />
        ))}
      </svg>
    </Poster>
  );
}

/** Stablecoins. */
function Stable() {
  return (
    <Poster
      t={{ bg: "linear-gradient(180deg,#041124,#06224a 45%,#030914)", fg: "#fff", accent: "#3fe3ff", body: "rgba(255,255,255,.8)", muted: "rgba(63,227,255,.7)", rule: "rgba(255,255,255,.1)" }}
      eyebrow="Stablecoins"
      title={["Issue your", "stablecoin"]}
      promise="Mint, burn, attest and redeem on rails regulators can read."
      bullets={["Proof-of-reserve hooks", "Freeze + blocklist controls", "Multi-chain supply sync"]}
    >
      <div style={{ position: "absolute", left: 0, right: 0, top: 138, textAlign: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 130, lineHeight: 1, color: "rgba(63,227,255,.12)" }}>$</div>
    </Poster>
  );
}

/** Token launch. */
function Launch() {
  return (
    <Poster
      t={{ bg: "linear-gradient(165deg,#ff5f3d 0%,#ff2d6f 55%,#9b1bd6 100%)", fg: "#fff", accent: "#ffe45c", body: "rgba(255,255,255,.92)", muted: "rgba(255,255,255,.75)", rule: "rgba(255,255,255,.22)" }}
      eyebrow="Token launch"
      title={["Launch", "your token"]}
      promise="From tokenomics model to TGE day, contracts and all."
      bullets={["Vesting + cliff schedules", "Merkle airdrops", "Liquidity bootstrapping"]}
    >
      <svg className="rc-ph" style={{ top: 160, height: 120 }} viewBox="0 0 130 120">
        {[0.25, 0.45, 0.7, 1].map((h, i) => (
          <rect key={i} x={18 + i * 26} y={100 - h * 80} width="16" height={h * 80} rx="3" fill="#fff" fillOpacity={0.35 + i * 0.18} />
        ))}
        <path d="M18 70 L44 58 L70 40 L112 14" stroke="#ffe45c" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M104 12 L113 13 L111 22" stroke="#ffe45c" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Poster>
  );
}

/** Smart accounts / wallet UX. */
function Wallets() {
  return (
    <Poster
      t={{ bg: "#f4f1ff", fg: "#140a3a", accent: "#6a3cff", body: "#2d2356", muted: "#7a6fa8", rule: "rgba(20,10,58,.08)" }}
      eyebrow="Wallet UX"
      title={["Gasless.", "Seedless."]}
      promise="Web2-smooth onboarding on ERC-4337 smart accounts."
      bullets={["Paymasters + sponsored gas", "Passkey sign-in", "Batched transactions"]}
    >
      <div style={{ position: "absolute", left: 22, right: 22, top: 156, height: 124, borderRadius: 14, background: "#140a3a", boxShadow: "0 10px 24px rgba(20,10,58,.25)" }}>
        <div style={{ position: "absolute", left: 10, right: 10, top: 14, height: 26, borderRadius: 8, background: "rgba(255,255,255,.08)" }} />
        <div style={{ position: "absolute", left: 10, top: 50, fontSize: 5, color: "rgba(255,255,255,.6)", letterSpacing: ".1em" }}>SIGN IN WITH</div>
        <div style={{ position: "absolute", left: 10, right: 10, top: 62, height: 20, borderRadius: 10, background: "#6a3cff", display: "grid", placeItems: "center", fontSize: 6, fontWeight: 700, color: "#fff" }}>Passkey</div>
        <div style={{ position: "absolute", left: 10, right: 10, top: 88, fontSize: 4.6, textAlign: "center", color: "rgba(255,255,255,.55)" }}>network fee: sponsored</div>
      </div>
    </Poster>
  );
}

/** Exchanges. */
function Exchange() {
  const bids = [0.9, 0.7, 0.55, 0.4, 0.3];
  const asks = [0.35, 0.5, 0.62, 0.8, 0.95];
  return (
    <Poster
      t={{ bg: "#06080d", fg: "#fff", accent: "#f0b90b", body: "rgba(255,255,255,.8)", muted: "rgba(240,185,11,.8)", rule: "rgba(255,255,255,.08)" }}
      eyebrow="Exchanges"
      title={["Build an", "exchange"]}
      promise="CEX, DEX or perps, from matching engine to settlement."
      bullets={["Order-book + AMM engines", "On-chain settlement", "Custody + wallet infra"]}
    >
      <div className="rc-cv" style={{ top: 154, fontFamily: M, fontSize: 5 }}>
        {asks.map((w, i) => (
          <div key={`a${i}`} style={{ position: "relative", height: 8, marginBottom: 2 }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: "rgba(246,70,93,.22)" }} />
          </div>
        ))}
        <div style={{ margin: "4px 0", fontSize: 7, fontWeight: 700, color: "#f0b90b" }}>spread</div>
        {bids.map((w, i) => (
          <div key={`b${i}`} style={{ position: "relative", height: 8, marginBottom: 2 }}>
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: `${w * 100}%`, background: "rgba(14,203,129,.22)" }} />
          </div>
        ))}
      </div>
    </Poster>
  );
}

export const CREATIVES = [Defi, Rwa, Custody, Bridge, Launch, Audit, Fuzz, Solana, Wallets, Dao, Agents, Stable, Exchange];
