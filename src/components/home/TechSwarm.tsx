"use client";

import { useEffect, useRef, useState } from "react";
import { STACK } from "@/content/company";
import { createTechSwarm } from "./swarmField";

/**
 * Home "Technology", swarm version: a pinned dark stage where scrolling flies
 * every tool's logo through four formations (swarmField.ts draws them on one
 * canvas): a deep swarm, the HashX "X" around the core, a spinning sphere,
 * and five labelled columns, one per group. The captions change with the
 * formation; in the columns, hovering a tool shows what we use it for.
 *
 * Reduced motion: no pin, the columns are drawn still. The tool list is also
 * in the DOM for screen readers. Styles: "Tech swarm" in globals.css.
 * The other versions of this section are TechStack (orbit) and TechLayers.
 */
const ITEMS = STACK.flatMap((g) => g.items);
const STEPS = ["Tools", "One team", "Chosen", "Layers"];

export default function TechSwarm() {
  const [phase, setPhase] = useState(0);
  const [hot, setHot] = useState<number | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const c = cv.current, tr = track.current;
    if (!c || !tr) return;
    const s = createTechSwarm(c, tr, STACK, {
      reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onPhase: setPhase,
      onHover: setHot,
      bar: bar.current,
    });
    return () => s.destroy();
  }, []);

  const it = hot !== null ? ITEMS[hot] : null;

  return (
    <section className="tsw" aria-labelledby="tsw-title" data-phase={phase}>
      <div ref={track} className="tsw-track">
        <div className="tsw-stage">
          <div className="tsw-frame">
            <canvas ref={cv} className="tsw-canvas" aria-hidden="true" />

            <div className="tsw-head" data-on={phase === 0 || undefined}>
              <span className="eyebrow tsw-eyebrow">Technology</span>
              <h2 id="tsw-title" className="tsw-h">Proven tools, chosen for the job</h2>
              <p className="tsw-lead">Scroll to see the {ITEMS.length} tools we build with fall into place.</p>
            </div>

            <div className="tsw-caps" aria-live="polite">
              <div className="tsw-cap" data-on={phase === 1 || undefined}>
                <span className="tsw-k">One team, every layer</span>
                <p>Contracts, security, chains, AI and apps, designed and built by the same engineers. No hand-offs between specialists.</p>
              </div>
              <div className="tsw-cap" data-on={phase === 2 || undefined}>
                <span className="tsw-k">Picked per project</span>
                <p>We choose what fits your product and your team, and explain why in writing before you pay for it.</p>
              </div>
              <div className="tsw-cap" data-on={phase === 3 || undefined}>
                <span className="tsw-k">{it ? it.name : `${STACK.length} layers, ${ITEMS.length} tools`}</span>
                <p>{it ? it.note : "Hover any tool to see what we use it for."}</p>
              </div>
            </div>

            <div className="tsw-meta" aria-hidden="true">
              <ol className="tsw-steps">
                {STEPS.map((s, i) => (
                  <li key={s} data-on={i <= phase || undefined}>
                    <span>{String(i + 1).padStart(2, "0")}</span> {s}
                  </li>
                ))}
              </ol>
              <span className="tsw-bar">
                <span ref={bar} />
              </span>
            </div>

            <ul className="sr-only">
              {STACK.map((g) => (
                <li key={g.group}>
                  {g.group}: {g.items.map((x) => `${x.name} (${x.note})`).join(", ")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
