"use client";

import { useRef, useState, type CSSProperties } from "react";

/* Hero visual: real-looking code from the two halves of the business, an
   invariant test and an approval-gated AI tool. Illustrative snippets, no
   run results or numbers. */

const TABS = [
  {
    file: "VaultInvariants.t.sol",
    lines: [
      <><span className="c">{"// Rules the vault must never break."}</span></>,
      <><span className="k">function</span> <span className="f">invariant_solvency</span>() <span className="k">public</span> {"{"}</>,
      <>{"  "}<span className="f">assertGe</span>(asset.<span className="f">balanceOf</span>(<span className="k">address</span>(vault)),</>,
      <>{"           "}vault.<span className="f">totalAssets</span>());</>,
      <>{"}"}</>,
      <>{" "}</>,
      <><span className="k">function</span> <span className="f">invariant_noFreeShares</span>() <span className="k">public</span> {"{"}</>,
      <>{"  "}<span className="f">assertEq</span>(vault.<span className="f">previewRedeem</span>(<span className="n">0</span>), <span className="n">0</span>);</>,
      <>{"}"}</>,
    ],
    note: "Every contract ships with tests like these.",
  },
  {
    file: "agent_tools.py",
    lines: [
      <><span className="c"># Reads run freely. Writes wait for a person.</span></>,
      <><span className="s">@tool</span>(read_only=<span className="k">True</span>)</>,
      <><span className="k">def</span> <span className="f">find_shipment</span>(ref: <span className="n">str</span>) -&gt; Shipment:</>,
      <>{"    "}<span className="k">return</span> erp.<span className="f">get</span>(ref)</>,
      <>{" "}</>,
      <><span className="s">@tool</span>(requires_approval=<span className="k">True</span>)</>,
      <><span className="k">def</span> <span className="f">update_status</span>(ref: <span className="n">str</span>, status: <span className="n">str</span>):</>,
      <>{"    "}<span className="k">return</span> erp.<span className="f">update</span>(ref, status=status)</>,
    ],
    note: "AI agents act only inside the limits you set.",
  },
];

export default function CodeCard() {
  const [tab, setTab] = useState(0);
  const t = TABS[tab];
  const tilt = useRef<HTMLDivElement>(null);

  // Tilt toward the cursor (transform only, mouse only).
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !tilt.current) return;
    const r = tilt.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt.current.style.transform = `perspective(1000px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (tilt.current) tilt.current.style.transform = "";
  };

  return (
    <div className="float-y relative" onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={tilt} className="tilt overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0b1220] shadow-[0_30px_80px_-30px_rgba(11,18,32,.55)]">
        <div className="flex items-center gap-4 border-b border-white/10 px-4">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div role="tablist" aria-label="Code examples" className="flex">
            {TABS.map((x, i) => (
              <button
                key={x.file}
                role="tab"
                type="button"
                aria-selected={i === tab}
                onClick={() => setTab(i)}
                className={`cursor-pointer border-b-2 px-3 py-3 font-[family-name:var(--font-mono)] text-[11.5px] transition-colors ${
                  i === tab ? "border-[var(--signal)] text-white" : "border-transparent text-white/45 hover:text-white/80"
                }`}
              >
                {x.file}
              </button>
            ))}
          </div>
        </div>
        <pre className="code min-h-[260px] overflow-x-auto px-5 py-5 text-[#e2e8f0]" role="tabpanel">
          {t.lines.map((l, i) => (
            <div key={`${tab}-${i}`} className="code-line flex" style={{ "--d": i } as CSSProperties}>
              <span aria-hidden="true" className="mr-5 w-4 shrink-0 select-none text-right text-white/20">
                {i + 1}
              </span>
              <span className="whitespace-pre">
                {l}
                {i === t.lines.length - 1 && <span key={`c${tab}`} className="type-caret" style={{ "--d": i } as CSSProperties} aria-hidden="true" />}
              </span>
            </div>
          ))}
        </pre>
        <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-[12.5px] text-white/60">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--signal)]" aria-hidden="true" />
          {t.note}
        </div>
      </div>
    </div>
  );
}
