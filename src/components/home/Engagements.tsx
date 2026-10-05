import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { IndexList } from "@/components/ui";
import { ENGAGEMENTS } from "@/content/company";

/**
 * Home "Ways to work with us": four engagements read as a path from
 * "start small" to "end to end". The section's top fades in from the grey of
 * the Technology section above, so there is no seam. As it scrolls in, a line
 * draws across the four steps; each card unfolds from a slight tilt as the
 * line reaches it and its dot lights. Pure CSS scroll-driven animation
 * (transform / opacity on the compositor); without support, or under reduced
 * motion, it is a plain row of cards. Styles: "Engagements" in globals.css.
 */
const pad = (n: number) => String(n).padStart(2, "0");

export default function Engagements() {
  return (
    <section className="eg" aria-labelledby="eg-title">
      <div className="container-x">
        <Reveal className="eg-head">
          <span className="eyebrow">Ways to work with us</span>
          <h2 id="eg-title" className="t-h2 mt-3">
            <Words text="Start small or go end to end" />
          </h2>
          <p className="t-lead mt-4">Every engagement begins with a short conversation and a written scope.</p>
        </Reveal>

        <div className="eg-path">
          <div className="eg-rail" aria-hidden="true">
            <span className="eg-fill" />
            <span className="eg-from">Start small</span>
            <span className="eg-to">End to end</span>
          </div>
          <ol className="eg-list">
            {ENGAGEMENTS.map((e, i) => (
              <li key={e.title} className="eg-item" style={{ "--i": i } as CSSProperties}>
                <span className="eg-dot" aria-hidden="true">
                  <span>{pad(i + 1)}</span>
                </span>
                <div className="eg-card card spotlight">
                  <span className="eg-best">
                    <b>Best for</b> {e.best.toLowerCase()}
                  </span>
                  <h3 className="eg-t">{e.title}</h3>
                  <p className="eg-d">{e.d}</p>
                  <div className="eg-rule" />
                  <IndexList items={e.points} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
