"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { prefersReducedMotion } from "@/lib/useScrollProgress";

type Line = { t: string; hot?: boolean };
const CASES: { n: string; name: string; why: string; bug: Line[]; fix: Line[]; test: string }[] = [
  {
    n: "01",
    name: "Call order",
    why: "Money leaves before the books are updated.",
    bug: [
      { t: "function withdraw(uint amt) external {" },
      { t: "  token.transfer(msg.sender, amt);", hot: true },
      { t: "  balance[msg.sender] -= amt;", hot: true },
      { t: "}" },
    ],
    fix: [
      { t: "function withdraw(uint amt) external {" },
      { t: "  balance[msg.sender] -= amt;", hot: true },
      { t: "  token.transfer(msg.sender, amt);", hot: true },
      { t: "}" },
    ],
    test: "invariant_solvency()",
  },
  {
    n: "02",
    name: "Rounding",
    why: "Dust rounds in the caller's favour, again and again.",
    bug: [
      { t: "function previewWithdraw(uint a)" },
      { t: "  public view returns (uint) {" },
      { t: "  return a * supply / assets;", hot: true },
      { t: "}" },
    ],
    fix: [
      { t: "function previewWithdraw(uint a)" },
      { t: "  public view returns (uint) {" },
      { t: "  return a.mulDivUp(supply, assets);", hot: true },
      { t: "}" },
    ],
    test: "invariant_noFreeShares()",
  },
  {
    n: "03",
    name: "Admin keys",
    why: "One key can swap the code under everyone's money.",
    bug: [
      { t: "function upgradeTo(address impl)" },
      { t: "  external onlyOwner {", hot: true },
      { t: "  _upgrade(impl);" },
      { t: "}" },
    ],
    fix: [
      { t: "function upgradeTo(address impl)" },
      { t: "  external onlyTimelock {", hot: true },
      { t: "  _upgrade(impl);" },
      { t: "}" },
    ],
    test: "test_upgradeTimelocked()",
  },
];

function Case({ c, delay }: { c: (typeof CASES)[number]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);
  const [touched, setTouched] = useState(false);

  // Show the bug first, then flip to the fix once the card is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        t = setTimeout(() => setFixed((f) => (touched ? f : true)), 1400 + delay);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, [delay, touched]);

  const lines = fixed ? c.fix : c.bug;

  return (
    <div ref={ref} className="ticks flex h-full flex-col border border-[var(--line-strong)] bg-[var(--bg-card)]">
      <span className="tk-b" />
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
        <span className="mono text-[11px] text-[var(--t-lo)]">
          {c.n} · <span className="text-[var(--t-hi)]">{c.name}</span>
        </span>
        <span
          className="mono px-2 py-0.5 text-[10.5px] font-medium text-white transition-colors duration-300"
          style={{ background: fixed ? "var(--ok)" : "var(--bad)" }}
        >
          {fixed ? "PASS" : "FAIL"}
        </span>
      </div>

      <p className="px-5 pt-5 font-[family-name:var(--font-head)] text-xl font-bold leading-snug tracking-tight [font-stretch:92%]">
        {c.why}
      </p>

      <pre className="mono mx-5 mt-5 overflow-x-auto bg-[#0b1220] py-3 text-[11.5px] leading-[1.9] text-[#c9d3e6]">
        {lines.map((l, i) => (
          <div
            key={`${fixed}-${i}`}
            className={`whitespace-pre px-4 transition-colors duration-300 ${
              l.hot ? (fixed ? "bg-[#1a6bff]/20 text-[#b9d0ff]" : "bg-[#ff5a4a]/15 text-[#ffb3aa]") : ""
            }`}
          >
            {l.t}
          </div>
        ))}
      </pre>

      <div className="mt-auto flex items-center justify-between gap-3 px-5 py-4">
        <span className="mono truncate text-[11px] text-[var(--t-mid)]">
          caught by <span className="text-[var(--signal)]">{c.test}</span>
        </span>
        <button
          onClick={() => {
            setTouched(true);
            setFixed((f) => !f);
          }}
          className="mono shrink-0 text-[11px] text-[var(--t-hi)] underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--signal)] cursor-pointer"
        >
          {fixed ? "show bug" : "show fix"}
        </button>
      </div>
    </div>
  );
}

export default function Manifesto() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <Reveal className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow">Why we work this way</span>
            <h2 className="mt-5 text-4xl sm:text-6xl">
              Most exploits are <span className="em">not exotic.</span>
            </h2>
          </div>
          <p className="max-w-md text-[var(--t-mid)] lg:col-span-5 lg:justify-self-end">
            They are ordinary mistakes: a line in the wrong order, a rounding direction, a key with too much
            power. We make each one fail a test long before it can fail on mainnet.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.n} delay={i * 90} className="h-full min-w-0">
              <Case c={c} delay={i * 450} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
