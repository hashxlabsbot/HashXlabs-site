"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  { k: "Spec", d: "We write down what the system must always do and must never do. Those invariants become the acceptance test for everything after.", out: "SPEC.md · 12 invariants" },
  { k: "Threat model", d: "Who can call what, with what money, in what order. Each risk gets an owner: a guard, a test, or an explicit decision to accept it.", out: "THREATS.md · risks with owners" },
  { k: "Build", d: "Small contracts, explicit access control, no cleverness we cannot test. Every pull request carries its own tests.", out: "src/ · test/ in the same PR" },
  { k: "Break", d: "Invariant fuzzing, static analysis, fork tests and manual review. Findings arrive as failing tests you can run yourself.", out: "forge test · slither · echidna" },
  { k: "Ship", d: "Deployment scripts, key ceremonies, monitoring and a runbook. We stay on for the first weeks on mainnet.", out: "deploy/ · RUNBOOK.md" },
];

export default function Method() {
  const [a, setA] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setA(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="method" className="relative overflow-hidden bg-[var(--signal)] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
            <span className="mono text-[11px] uppercase tracking-[0.14em] text-white/70">{"//"} Method</span>
            <h2 className="mt-5 text-4xl text-white sm:text-6xl">Tests are the spec. We write them first.</h2>
            <div className="mt-10 flex items-end gap-4">
              <span className="font-[family-name:var(--font-head)] text-[7rem] font-bold leading-[0.8] tracking-[-0.05em] [font-stretch:85%] tabular-nums">
                0{a + 1}
              </span>
              <span className="mono mb-2 text-[12px] text-white/70">/ 05 · {STEPS[a].k}</span>
            </div>
            <div className="mt-6 h-[3px] w-full max-w-xs bg-white/20">
              <div className="h-full bg-white transition-[width] duration-500" style={{ width: `${((a + 1) / STEPS.length) * 100}%` }} />
            </div>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {STEPS.map((s, i) => (
            <li
              key={s.k}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-i={i}
              className="border-t border-white/25 py-10 transition-opacity duration-500 last:border-b lg:py-16"
              style={{ opacity: i === a ? 1 : 0.4 }}
            >
              <div className="mono text-[11px] text-white/70">step {String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-3 text-3xl text-white sm:text-5xl">{s.k}</h3>
              <p className="mt-4 max-w-xl text-lg text-white/85">{s.d}</p>
              <div className="mono mt-6 inline-flex items-center gap-2 border border-white/40 px-3 py-1.5 text-[11px]">
                <span className="h-1.5 w-1.5 bg-white" /> {s.out}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
