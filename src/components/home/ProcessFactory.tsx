"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { PROCESS } from "@/content/company";
import type { StationId } from "@/components/ui/agentic-factory-3d";

/* Home "How we work": the five process steps beside an interactive 3D model
   of them (components/ui/agentic-factory-3d, embed mode: the machine sits in
   the right 58 % of a wide frame, the copy over the left). three.js (~150 KB
   gzip) is only fetched once the section is within ~600 px of the viewport,
   so it never touches the page's first load. Steps and stations stay in sync
   both ways: click a step to light its station (the camera stays put, so the
   machine never slides under the copy), click a station to highlight its step. Styles: "PROCESS FACTORY" in globals.css. */

const Factory = dynamic(() => import("@/components/ui/agentic-factory-3d"), { ssr: false });

/** Stations in process order (the scene's step 1–5), matching PROCESS. */
const STATIONS: StationId[] = ["cabinet", "engine", "admin", "storefront", "cashdesk"];

export default function ProcessFactory() {
  const root = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pick = (i: number) => {
    const next = active === i ? null : i;
    setActive(next);
    window.__machine?.highlight(next === null ? null : STATIONS[next]);
  };
  const overview = () => {
    setActive(null);
    window.__machine?.highlight(null);
    window.__machine?.setCamera("overview");
  };

  return (
    <section ref={root} id="process" className="pf" aria-labelledby="pf-title">
      <div className="pf-stage" aria-hidden={!ready}>
        {near && (
          <Factory
            embed
            height="100%"
            className="pf-factory"
            onReady={() => setReady(true)}
            onStation={(id) => {
              setActive(STATIONS.indexOf(id));
              window.__machine?.highlight(id);
            }}
          />
        )}
      </div>

      <div className="container-x pf-inner">
        <Reveal className="pf-copy">
          <span className="eyebrow pf-eyebrow">How we work</span>
          <h2 id="pf-title" className="t-h2 pf-title">
            <Words text="A clear process from idea to mainnet" />
          </h2>
          <p className="pf-lead">Five steps, the same on every project. You see working software and written decisions at each one.</p>

          <ol className="pf-steps">
            {PROCESS.map((p, i) => (
              <li key={p.k}>
                <button type="button" className={`pf-step ${active === i ? "is-on" : ""}`} onClick={() => pick(i)} aria-pressed={active === i}>
                  <span className="pf-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pf-k">{p.k}</span>
                  <span className="pf-d">{p.d}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="pf-hint">
            {ready ? (
              <>
                Drag the model to look around, or pick a step.{" "}
                <button type="button" className="pf-reset" onClick={overview}>
                  Reset view
                </button>
              </>
            ) : (
              "Interactive model of our delivery process."
            )}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
