"use client";

import { useEffect, useRef, useState } from "react";

/* Hero visual: the way we work, shown rather than claimed. An invariant test
   on a vault, then a terminal that replays a Foundry run: the invariant
   breaks, the counterexample is printed, a one-line fix lands, the run
   passes. Illustrative (the card says so), with Foundry's default 256 runs.

   Lines appear on a timer (no rAF), the loop pauses off screen and in a
   background tab, and reduced motion shows the finished run. */

type Line = { t: string; c?: "cmd" | "fail" | "pass" | "dim" | "fix" };

const RUN: Line[] = [
  { t: "$ forge test --match-contract VaultInvariants", c: "cmd" },
  { t: "[FAIL] invariant_solvency()", c: "fail" },
  { t: "  ↳ deposit(1) → donate(1e18) → withdraw(1)", c: "dim" },
  { t: "  ↳ owed 1e18 + 1 > balance 1e18", c: "dim" },
  { t: "fix: round shares down in withdraw()", c: "fix" },
  { t: "$ forge test --match-contract VaultInvariants", c: "cmd" },
  { t: "[PASS] invariant_solvency()      (runs: 256)", c: "pass" },
  { t: "[PASS] invariant_noFreeShares()  (runs: 256)", c: "pass" },
  { t: "Suite result: ok. 2 passed; 0 failed", c: "pass" },
];
const STEP = [700, 900, 500, 500, 1300, 1200, 900, 450, 450]; // ms before each line
const HOLD = 4200; // ms the finished run stays up before replaying

export default function InvariantRun() {
  const [shown, setShown] = useState(0);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(RUN.length);
      return;
    }
    let n = 0, timer = 0, visible = true;
    const tick = () => {
      if (!visible || document.hidden) return;
      if (n >= RUN.length) {
        n = 0;
        setShown(0);
        timer = window.setTimeout(tick, STEP[0]);
        return;
      }
      n += 1;
      setShown(n);
      timer = window.setTimeout(tick, n >= RUN.length ? HOLD : STEP[n]);
    };
    const restart = () => {
      clearTimeout(timer);
      if (visible && !document.hidden) timer = window.setTimeout(tick, STEP[Math.min(n, STEP.length - 1)]);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      restart();
    });
    if (root.current) io.observe(root.current);
    document.addEventListener("visibilitychange", restart);
    return () => {
      clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);

  const failing = shown >= 2 && shown < 7;
  const passed = shown >= 7;

  return (
    <div ref={root} className="ph-card" aria-label="Illustrative example: an invariant test catches a rounding bug, the fix makes it pass">
      <div className="ph-bar">
        <span className="ph-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ph-file">test/VaultInvariants.t.sol</span>
        <span className={`ph-state ${failing ? "is-fail" : passed ? "is-pass" : ""}`}>{failing ? "1 failing" : passed ? "all passing" : "running"}</span>
      </div>

      <pre className="code ph-code" aria-hidden="true">
        <span className="c">{"// What must never happen, written as tests."}</span>
        {"\n"}
        <span className="k">function</span> <span className="f">invariant_solvency</span>() <span className="k">public</span> {"{"}
        {"\n  "}
        <span className="f">assertGe</span>(asset.<span className="f">balanceOf</span>(<span className="k">address</span>(vault)),
        {"\n           "}vault.<span className="f">totalAssets</span>());
        {"\n}"}
      </pre>

      <div className="ph-term" role="log" aria-live="off">
        {RUN.slice(0, shown).map((l, i) => (
          <div key={i} className={`ph-line ${l.c ? `is-${l.c}` : ""}`}>
            {l.t}
          </div>
        ))}
        {shown < RUN.length && <span className="ph-caret" aria-hidden="true" />}
      </div>

      <p className="ph-caption">Illustrative run. On real projects, every finding reaches you as a failing test like this one.</p>
    </div>
  );
}
