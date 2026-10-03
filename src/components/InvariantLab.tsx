"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "safe" | "reentrancy" | "rounding";
type Kind = "dim" | "run" | "ok" | "bad" | "plain";
type Line = { text: string; kind: Kind; wait: number };
type Code = { text: string; hot?: boolean };

const VARIANTS: { id: Variant; label: string; blurb: string }[] = [
  { id: "safe", label: "checked", blurb: "State updated before the external call." },
  { id: "reentrancy", label: "reentrancy", blurb: "External call happens before the balance update." },
  { id: "rounding", label: "rounding", blurb: "previewWithdraw rounds the wrong way." },
];

const CODE: Record<Variant, Code[]> = {
  safe: [
    { text: "function withdraw(uint256 shares) external nonReentrant {" },
    { text: "    uint256 assets = previewRedeem(shares);" },
    { text: "    balanceOf[msg.sender] -= shares;" },
    { text: "    totalShares -= shares;", },
    { text: "    token.safeTransfer(msg.sender, assets);" },
    { text: "}" },
  ],
  reentrancy: [
    { text: "function withdraw(uint256 shares) external {" },
    { text: "    uint256 assets = previewRedeem(shares);" },
    { text: "    token.safeTransfer(msg.sender, assets);", hot: true },
    { text: "    balanceOf[msg.sender] -= shares;", hot: true },
    { text: "    totalShares -= shares;" },
    { text: "}" },
  ],
  rounding: [
    { text: "function previewWithdraw(uint256 assets) public view returns (uint256) {" },
    { text: "    // must round UP: the caller pays the dust" },
    { text: "    return assets * totalShares / totalAssets();", hot: true },
    { text: "}" },
  ],
};

const P = 60; // base pacing in ms

const SCRIPT: Record<Variant, Line[]> = {
  safe: [
    { text: "$ forge test --match-contract VaultInvariants", kind: "plain", wait: 0 },
    { text: "Compiling 14 files with solc 0.8.28", kind: "dim", wait: P * 6 },
    { text: "[PASS] invariant_solvency()        runs: 256  calls: 128000", kind: "ok", wait: P * 9 },
    { text: "[PASS] invariant_sharePriceMonotonic()  runs: 256", kind: "ok", wait: P * 7 },
    { text: "[PASS] invariant_noFreeShares()    runs: 256", kind: "ok", wait: P * 7 },
    { text: "3 invariants held. No counterexample found.", kind: "ok", wait: P * 6 },
  ],
  reentrancy: [
    { text: "$ forge test --match-contract VaultInvariants", kind: "plain", wait: 0 },
    { text: "Compiling 14 files with solc 0.8.28", kind: "dim", wait: P * 6 },
    { text: "[PASS] invariant_sharePriceMonotonic()  runs: 256", kind: "ok", wait: P * 8 },
    { text: "[FAIL] invariant_solvency()", kind: "bad", wait: P * 9 },
    { text: "  shrunk to 3 calls:", kind: "dim", wait: P * 4 },
    { text: "    1. attacker.deposit(1 ether)", kind: "plain", wait: P * 4 },
    { text: "    2. vault.withdraw(1e18)  ->  attacker.receive()", kind: "plain", wait: P * 4 },
    { text: "    3. vault.withdraw(1e18)  // balance not yet decremented", kind: "plain", wait: P * 4 },
    { text: "  assertion: totalAssets() >= totalShares() * price", kind: "bad", wait: P * 5 },
    { text: "  reason: assets left the vault twice for one deposit", kind: "bad", wait: P * 3 },
  ],
  rounding: [
    { text: "$ forge test --match-contract VaultInvariants", kind: "plain", wait: 0 },
    { text: "Compiling 14 files with solc 0.8.28", kind: "dim", wait: P * 6 },
    { text: "[PASS] invariant_solvency()        runs: 256", kind: "ok", wait: P * 8 },
    { text: "[FAIL] invariant_noFreeShares()", kind: "bad", wait: P * 9 },
    { text: "  shrunk to 3 calls:", kind: "dim", wait: P * 4 },
    { text: "    1. attacker.deposit(1 wei)", kind: "plain", wait: P * 4 },
    { text: "    2. token.transfer(vault, 1e18)  // donation", kind: "plain", wait: P * 4 },
    { text: "    3. attacker.withdraw(1 wei)  ->  receives 1e18 + 1", kind: "plain", wait: P * 4 },
    { text: "  assertion: assetsOut <= assetsIn + earnedYield", kind: "bad", wait: P * 5 },
    { text: "  reason: share price inflated, dust rounds in the caller's favour", kind: "bad", wait: P * 3 },
  ],
};

const KIND_CLASS: Record<Kind, string> = {
  dim: "text-[#7f8a9e]",
  run: "text-[#8ab4ff]",
  ok: "text-[#7ddc6a]",
  bad: "text-[#ff7a6b]",
  plain: "text-[#dfe6f2]",
};

export default function InvariantLab() {
  const [variant, setVariant] = useState<Variant>("reentrancy");
  const [lines, setLines] = useState<Line[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const termRef = useRef<HTMLDivElement>(null);

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  useEffect(() => stop, []);

  useEffect(() => {
    const el = termRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const reset = (v: Variant) => {
    stop();
    setVariant(v);
    setLines([]);
    setRunning(false);
    setDone(false);
  };

  const run = (v: Variant = variant) => {
    stop();
    setLines([]);
    setDone(false);
    setRunning(true);
    const script = SCRIPT[v];
    let i = 0;
    const next = () => {
      const l = script[i];
      setLines((prev) => [...prev, l]);
      i += 1;
      if (i >= script.length) {
        setRunning(false);
        setDone(true);
        return;
      }
      timer.current = setTimeout(next, script[i].wait);
    };
    next();
  };

  const failed = done && variant !== "safe";
  const code = CODE[variant];

  return (
    <div className="ticks border border-[var(--line-strong)] bg-[var(--bg-card)]">
      <span className="tk-b" />
      {/* header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 py-2.5">
        <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--t-lo)]">
          invariant lab
        </span>
        <span className="mono text-[10px] text-[var(--t-lo)]">simulated output · not client data</span>
      </div>

      {/* variant tabs */}
      <div role="tablist" aria-label="Contract variant" className="flex border-b border-[var(--line)]">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={variant === v.id}
            onClick={() => reset(v.id)}
            className={`mono flex-1 border-r border-[var(--line)] px-3 py-2.5 text-[11px] transition-colors last:border-r-0 cursor-pointer ${
              variant === v.id
                ? "bg-[var(--t-hi)] text-[var(--bg-page)]"
                : "text-[var(--t-mid)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--t-hi)]"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <p className="border-b border-[var(--line)] px-4 py-2.5 text-[13px] text-[var(--t-mid)]">
        {VARIANTS.find((v) => v.id === variant)?.blurb}
      </p>

      {/* code */}
      <pre className="mono overflow-x-auto bg-[#0b1220] px-0 py-3 text-[11.5px] leading-[1.75] text-[#c9d3e6]">
        {code.map((c, i) => (
          <div
            key={`${variant}-${i}`}
            className={`flex px-4 ${c.hot ? "bg-[#ff5a4a]/15 text-[#ffb3aa]" : ""}`}
          >
            <span className="mr-4 w-4 select-none text-right text-[#56627a]">{i + 1}</span>
            <span className="whitespace-pre">{c.text}</span>
          </div>
        ))}
      </pre>

      {/* terminal */}
      <div
        ref={termRef}
        aria-live="polite"
        className="mono h-[210px] overflow-y-auto border-t border-[#1d2740] bg-[#070b14] px-4 py-3 text-[11.5px] leading-[1.7]"
      >
        {lines.length === 0 && !running && (
          <span className="text-[#56627a]">
            press run to fuzz this contract<span className="caret" />
          </span>
        )}
        {lines.map((l, i) => (
          <div key={i} className={`animate-fade-in whitespace-pre-wrap ${KIND_CLASS[l.kind]}`}>
            {l.text}
          </div>
        ))}
        {running && <span className="caret" />}
      </div>

      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--line)] px-4 py-3">
        <button onClick={() => run()} disabled={running} className="btn-primary h-9 px-4 disabled:opacity-50 disabled:pointer-events-none">
          {running ? "fuzzing…" : done ? "run again" : "run fuzz"}
        </button>
        {failed && (
          <button onClick={() => { setVariant("safe"); run("safe"); }} className="btn-ghost h-9 px-4">
            apply fix → re-run
          </button>
        )}
        <span className="mono ml-auto text-[10.5px] text-[var(--t-lo)]">
          {done ? (failed ? "counterexample found" : "all invariants held") : "3 invariants · foundry"}
        </span>
      </div>
    </div>
  );
}
