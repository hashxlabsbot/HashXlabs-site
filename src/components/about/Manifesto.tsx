import type { CSSProperties } from "react";

/**
 * /about "Why we exist", set large. Where scroll-driven animations are
 * supported, the words light up in reading order as the block scrolls
 * through the viewport (one view timeline on the block, a staggered range
 * per word, opacity only). Elsewhere the text is simply there.
 * *Starred* phrases are set in the accent colour.
 */
const PARAGRAPHS = [
  "On a blockchain, *a bug is not a support ticket.* Money moves in a single transaction, and anyone can call your code in any order.",
  "Most exploits are not exotic: a line in the wrong order, a rounding direction, a key with too much power.",
  "So we build these systems the way they deserve. We *specify what must always be true,* write it as tests, and *break the code ourselves* before anyone else can.",
  "The result is software your team can *understand, run and own.*",
];

export default function Manifesto() {
  const words = PARAGRAPHS.map((p) => {
    let hl = false;
    return p.split(" ").map((raw) => {
      const start = raw.startsWith("*");
      const end = raw.endsWith("*");
      if (start) hl = true;
      const w = { t: raw.replace(/\*/g, ""), hl };
      if (end) hl = false;
      return w;
    });
  });
  const total = words.reduce((n, p) => n + p.length, 0);
  let i = 0;

  return (
    <section className="mf" aria-labelledby="mf-title">
      <div className="container-x mf-grid">
        <div className="mf-side">
          <span className="eyebrow">Who we are</span>
          <h2 id="mf-title" className="mf-title">
            Why we exist
          </h2>
        </div>
        <div className="mf-text">
          {words.map((p, pi) => (
            <p key={pi} className="mf-p">
              {p.map((w, wi) => {
                const style = { "--p": (i++ / total).toFixed(4) } as CSSProperties;
                return (
                  <span key={wi}>
                    <span className={`mf-w${w.hl ? " mf-hl" : ""}`} style={style}>
                      {w.t}
                    </span>
                    {wi < p.length - 1 ? " " : null}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
