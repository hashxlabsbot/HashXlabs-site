import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import { SectionHeader } from "@/components/ui";
import { PROCESS } from "@/content/company";

/**
 * /about process timeline: a line draws through five nodes that light up in
 * turn when the row is revealed. Horizontal on wide screens, vertical on
 * phones.
 */
export default function Steps() {
  return (
    <section className="section section-soft">
      <div className="container-x">
        <SectionHeader eyebrow="How we work" title="The same five steps on every project" lead="Each step ends with something you can read, run or approve." />
        <Reveal className="st">
          <span className="st-line" aria-hidden="true" />
          <ol className="st-list">
            {PROCESS.map((p, i) => (
              <li key={p.k} className="st-item" style={{ "--i": i } as CSSProperties}>
                <span className="st-node mono">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="st-k">{p.k}</h3>
                <p className="st-d">{p.d}</p>
                <span className="st-get mono">You get</span>
                <ul className="st-gets">
                  {p.get.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
