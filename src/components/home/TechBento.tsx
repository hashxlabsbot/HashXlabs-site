"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { STACK } from "@/content/company";
import TechLogo from "./TechLogo";

/**
 * Home "Technology": a bento of the five tool groups around a live
 * architecture diagram. The diagram shows how the layers connect in a typical
 * build (apps → services and AI → contracts inside a security ring → chains),
 * using the real tool logos; its lines draw in when it scrolls into view and
 * data pulses keep flowing along them. Hovering a group card lights its part
 * of the diagram and dims the rest. Everything is SVG + CSS (dash offsets,
 * opacity, translate); the only script is the hover state and one
 * IntersectionObserver. Styles: "Tech bento" in globals.css.
 */
const AREA = ["sc", "sec", "ch", "ai", "app"];
const pad = (n: number) => String(n).padStart(2, "0");

type Node = { g: string; x: number; y: number; w: number; logos: string[]; t: string; s: string; i: number };
const NODES: Node[] = [
  { g: "4", x: 150, y: 18, w: 220, logos: ["nextjs.svg", "react.svg"], t: "Web & mobile apps", s: "Next.js · React Native", i: 0 },
  { g: "4", x: 22, y: 150, w: 210, logos: ["nodejs.svg", "postgresql.svg"], t: "Services & data", s: "Node.js · PostgreSQL", i: 1 },
  { g: "3", x: 288, y: 150, w: 210, logos: ["python.svg", "langchain.svg"], t: "AI & retrieval", s: "Python · pgvector", i: 2 },
  { g: "0 1", x: 150, y: 290, w: 220, logos: ["solidity.svg", "rust.svg"], t: "Smart contracts", s: "Solidity · Rust / Anchor", i: 3 },
  { g: "2", x: 115, y: 416, w: 290, logos: ["ethereum.svg", "solana.svg", "chainlink.svg"], t: "Chains & oracles", s: "EVM · Solana · Chainlink", i: 4 },
];
const EDGES = [
  { d: "M215 82 C215 118 127 112 127 150", g: "4", i: 0 },
  { d: "M305 82 C305 118 393 112 393 150", g: "3 4", i: 1 },
  { d: "M232 182 L288 182", g: "3 4", i: 2 },
  { d: "M127 214 C127 252 215 252 215 290", g: "0 1 4", i: 3 },
  { d: "M393 214 C393 252 305 252 305 290", g: "0 1 3", i: 4 },
  { d: "M260 354 L260 416", g: "0 1 2", i: 5 },
];

export default function TechBento() {
  const [hl, setHl] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const fig = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = fig.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const card = (k: number) => {
    const g = STACK[k];
    return (
      <article
        key={g.group}
        className={`tb-card card spotlight${k === 2 ? " tb-wide" : ""}`}
        style={{ gridArea: AREA[k] } as CSSProperties}
        data-on={hl === k || undefined}
        onPointerEnter={() => setHl(k)}
        onPointerLeave={() => setHl(null)}
        onFocus={() => setHl(k)}
        onBlur={() => setHl(null)}
        tabIndex={0}
      >
        <div className="tb-top">
          <span className="tb-n">{pad(k + 1)}</span>
          <span className="tb-count">{g.items.length} tools</span>
        </div>
        <h3 className="tb-t">{g.group}</h3>
        <p className="tb-d">{g.d}</p>
        <ul className="tb-logos">
          {g.items.map((it, j) => (
            <li key={it.name} style={{ "--j": j } as CSSProperties}>
              <span className="tb-logo">
                <TechLogo item={it} size={22} />
              </span>
              <span className="tb-name">{it.name}</span>
            </li>
          ))}
        </ul>
      </article>
    );
  };

  return (
    <section className="section section-soft tb" aria-labelledby="tb-title" data-hl={hl ?? undefined}>
      <div className="container-x">
        <Reveal className="mb-12 max-w-2xl lg:mb-14">
          <span className="eyebrow">Technology</span>
          <h2 id="tb-title" className="t-h2 mt-3">
            <Words text="Proven tools, chosen for the job" />
          </h2>
          <p className="t-lead mt-4">We pick the stack that fits your product and your team, and explain why in writing.</p>
        </Reveal>

        <div className="tb-grid">
          {[0, 1].map(card)}
          <div ref={fig} className={`tb-fig${inView ? " is-in" : ""}`} style={{ gridArea: "fig" }}>
            <div className="tb-fig-head">
              <span className="tb-fig-k">How it fits together</span>
              <span className="tb-fig-s">A typical build, simplified</span>
            </div>
            <svg viewBox="0 0 520 480" className="tb-svg" role="img" aria-label="Apps talk to services and AI, which call smart contracts protected by security tooling, which run on EVM chains and Solana with Chainlink oracles.">
              <defs>
                <filter id="tb-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.4" />
                </filter>
              </defs>
              {/* Security ring around the contracts */}
              <g className="tb-ring" data-g="1" style={{ "--i": 3 } as CSSProperties}>
                <rect x="128" y="268" width="264" height="108" rx="22" />
                <text x="260" y="262" textAnchor="middle">Slither · Echidna · invariants · fork tests</text>
              </g>
              {EDGES.map((e) => (
                <g key={e.i} className="tb-edge" data-g={e.g} style={{ "--i": e.i } as CSSProperties}>
                  <path d={e.d} pathLength={1} className="tb-line" />
                  <path d={e.d} pathLength={100} className="tb-pulse" filter="url(#tb-glow)" />
                  <path d={e.d} pathLength={100} className="tb-pulse tb-pulse-core" />
                </g>
              ))}
              {NODES.map((n) => (
                <g key={n.t} className="tb-node" data-g={n.g} style={{ "--i": n.i } as CSSProperties}>
                  <rect x={n.x} y={n.y} width={n.w} height={n.y === 416 ? 58 : 64} rx="14" />
                  {n.logos.map((l, j) => (
                    <image key={l} href={`/tech/${l}`} x={n.x + 14 + j * 30} y={n.y + (n.y === 416 ? 17 : 20)} width="24" height="24" />
                  ))}
                  <text className="tb-nt" x={n.x + 22 + n.logos.length * 30} y={n.y + (n.y === 416 ? 26 : 29)}>
                    {n.t}
                  </text>
                  <text className="tb-ns" x={n.x + 22 + n.logos.length * 30} y={n.y + (n.y === 416 ? 43 : 46)}>
                    {n.s}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          {[3, 4, 2].map(card)}
        </div>
      </div>
    </section>
  );
}
