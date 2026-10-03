"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "./Reveal";
import Scramble from "./motion/Scramble";

// What we do. On desktop the section pins and scroll walks the list: the
// active row's title fills blue left-to-right with its progress, its detail
// opens with the points staggering in, the rest dim; on the left a line glyph
// for the active row draws itself above the progress ticks.
// Clicking a row scrolls to it. Phones and reduced motion get the plain
// tap-to-open accordion.

const ROWS = [
  {
    n: "01",
    title: "Smart contracts",
    tag: "Solidity · Rust · Foundry",
    body: "Vaults, AMMs, staking, token standards. Written against a spec, with invariant and fork tests in the repo from the first commit.",
    points: ["ERC-4626, ERC-20, ERC-3643", "Upgrade and access-control design", "Gas and storage-layout review"],
  },
  {
    n: "02",
    title: "Protocol design",
    tag: "Mechanism · Threat model",
    body: "Before code: what must always be true, who can break it, and what it costs them. We write that down and build to it.",
    points: ["Invariant and threat-model docs", "Cross-chain message-passing design", "Economic edge-case review"],
  },
  {
    n: "03",
    title: "Audit tooling & review",
    tag: "Slither · Echidna · manual",
    body: "Static analysis, property-based fuzzing and manual review of our own and your code. Findings come with a failing test, not a paragraph.",
    points: ["Static and dynamic analysis", "Reproducible counterexamples", "Fix verification"],
  },
  {
    n: "04",
    title: "RWA & tokenization",
    tag: "Permissioned tokens",
    body: "Identity-gated transfers, on-chain compliance checks, claims registries and holder distributions for regulated assets.",
    points: ["Identity and claims registry", "Transfer restrictions", "Pro-rata distribution"],
  },
  {
    n: "05",
    title: "Applied AI",
    tag: "Retrieval · Agents",
    body: "Retrieval and tool-calling agents wired into real systems, with a human approving anything that writes.",
    points: ["Hybrid vector + keyword retrieval", "Approval-gated actions", "Evaluation harnesses"],
  },
  {
    n: "06",
    title: "Product & infrastructure",
    tag: "Next.js · Node · AWS",
    body: "The app, API, indexers and deployment around the contracts, built by the same people so nothing gets lost in a handoff.",
    points: ["Web and mobile clients", "Indexers and backends", "CI/CD and key management"],
  },
];
const N = ROWS.length;

// One minimal line glyph per row, 120×120, drawn with pathLength=1 dashes.
const GLYPHS: string[][] = [
  // contract: page with code lines and braces
  ["M30 14h46l18 18v74H30z", "M76 14v18h18", "M44 52l-8 8 8 8", "M80 52l8 8-8 8", "M52 76h20", "M48 88h28"],
  // protocol: three nodes, a triangle and its invariant circle
  ["M60 22L98 88H22z", "M60 22m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", "M98 88m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", "M22 88m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", "M60 66m-14 0a14 14 0 1 0 28 0a14 14 0 1 0-28 0"],
  // audit: magnifier over a code grid
  ["M20 30h50", "M20 46h34", "M20 62h26", "M20 78h40", "M70 64m-20 0a20 20 0 1 0 40 0a20 20 0 1 0-40 0", "M84 78l18 18"],
  // RWA: columned building with a token seal
  ["M18 46L60 20l42 26z", "M26 52v38", "M46 52v38", "M74 52v38", "M94 52v38", "M16 98h88", "M60 38m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0"],
  // AI: agent node graph with an approval check
  ["M30 34m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0", "M90 34m-8 0a8 8 0 1 0 16 0a8 8 0 1 0-16 0", "M60 60m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0", "M36 40l16 13", "M84 40l-16 13", "M60 70v14", "M46 92l10 10 20-20"],
  // product: stacked layers
  ["M60 18l44 20-44 20-44-20z", "M16 60l44 20 44-20", "M16 82l44 20 44-20"],
];

export default function Capabilities() {
  const [open, setOpen] = useState(0);
  const [pinned, setPinned] = useState(false);
  const root = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
    const on = () => setPinned(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const el = root.current;
    if (!el) return;
    let raf = 0;
    let running = false;
    let q = -1;
    let last = -1;
    const written: string[] = [];

    const frame = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      if (q < 0) q = p;
      q += (p - q) * 0.14;
      const f = Math.min(N - 0.0001, q * N);
      const act = Math.floor(f);
      // Row progress: fill completes in the first 70% of the row's scroll.
      for (let i = 0; i < N; i++) {
        const t = i < act ? 1 : i > act ? 0 : Math.min(1, (f - act) / 0.7);
        const v = t.toFixed(3);
        if (written[i] !== v) {
          written[i] = v;
          rows.current[i]?.style.setProperty("--t", v);
        }
      }
      if (act !== last) {
        last = act;
        setOpen(act);
      }
      raf = running && Math.abs(p - q) > 0.0002 ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => {
      if (running && !raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      kick();
    });
    io.observe(el);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      rows.current.forEach((li) => li?.style.removeProperty("--t"));
    };
  }, [pinned]);

  const pick = (i: number) => {
    const el = root.current;
    if (!pinned || !el) {
      setOpen(open === i ? -1 : i);
      return;
    }
    const r = el.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    window.scrollTo({ top: window.scrollY + r.top + ((i + 0.75) / N) * span, behavior: "smooth" });
  };

  return (
    <section
      ref={root}
      id="capabilities"
      className={`cap ${pinned ? "is-pinned" : "py-20 sm:py-28"}`}
      style={pinned ? { height: `${N * 55 + 100}vh` } : undefined}
    >
      <div className="cap-stage">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4 cap-left">
              <Reveal>
                <span className="eyebrow">What we do</span>
                <h2 className="mt-5 text-4xl sm:text-5xl">End-to-end blockchain engineering.</h2>
                <p className="mt-5 max-w-sm text-[var(--t-mid)]">
                  From the first contract to mainnet operations. {pinned ? "Scroll the list" : "Open a row"}, or browse the{" "}
                  <Link href="/services/blockchain-development#catalog" className="text-[var(--signal)] underline underline-offset-4">
                    full blockchain catalogue
                  </Link>
                  .
                </p>
              </Reveal>

              {pinned && (
                <div className="cap-dial" aria-hidden="true">
                  <div className="cap-glyphs">
                    {GLYPHS.map((paths, i) => (
                      <svg key={i} viewBox="0 0 120 120" className={i === open ? "on" : ""}>
                        {paths.map((d, j) => (
                          <path key={j} d={d} pathLength={1} style={{ transitionDelay: i === open ? `${0.12 + j * 0.07}s` : "0s" }} />
                        ))}
                      </svg>
                    ))}
                  </div>
                  <div className="cap-ticks">
                    {ROWS.map((r, i) => (
                      <i key={r.n} className={i < open ? "done" : i === open ? "on" : ""} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-8">
              <ul className="cap-list border-t border-[var(--line-strong)]">
                {ROWS.map((r, i) => {
                  const active = open === i;
                  return (
                    <li
                      key={r.n}
                      ref={(el) => {
                        rows.current[i] = el;
                      }}
                      className={`cap-row border-b border-[var(--line-strong)]${active ? " is-on" : ""}`}
                    >
                      <button
                        onClick={() => pick(i)}
                        aria-expanded={active}
                        className="group flex w-full items-baseline gap-4 py-5 text-left cursor-pointer sm:gap-8 cap-btn"
                      >
                        <span className="cap-n mono w-7 shrink-0 text-[11px] text-[var(--t-lo)]">{r.n}</span>
                        <span className="cap-title flex-1 font-[family-name:var(--font-head)] text-2xl font-bold tracking-tight [font-stretch:88%] sm:text-4xl">
                          <span className="cap-title-base">{r.title}</span>
                          <span className="cap-title-fill" aria-hidden="true">
                            {r.title}
                          </span>
                        </span>
                        <span className="mono hidden text-[11px] text-[var(--t-lo)] md:block">
                          {active && pinned ? <Scramble key={i} text={r.tag} /> : r.tag}
                        </span>
                        <span aria-hidden="true" className="cap-plus mono text-lg leading-none">
                          +
                        </span>
                      </button>
                      <div className="cap-body grid">
                        <div className="overflow-hidden">
                          <div className="grid gap-6 pb-7 pl-11 sm:pl-[3.75rem] md:grid-cols-5">
                            <p className="cap-p text-[var(--t-mid)] md:col-span-3">{r.body}</p>
                            <ul className="mono space-y-2 text-[11.5px] text-[var(--t-hi)] md:col-span-2">
                              {r.points.map((p, j) => (
                                <li key={p} className="cap-pt flex gap-2" style={{ transitionDelay: active ? `${0.18 + j * 0.08}s` : "0s" }}>
                                  <span className="text-[var(--signal)]">→</span>
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
