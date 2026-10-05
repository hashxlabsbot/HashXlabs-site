import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import HorizonChain from "./HorizonChain";

/* Home hero (2026-10-05): a dark cinematic stage inset under the white header.
   Centred offer above a planet's horizon; real mainnet blocks (HorizonChain)
   stand on its rim, the newest over a light flare, and glide one step along
   the arc each time a block lands. No WebGL: crisp HTML, static paint for the
   planet and light, compositor-only motion. Headline words rise from an
   offset but never start transparent (LCP).
   Earlier heroes, unmounted: components/home/ProofHero, StreamHero.
   Styles: "X HERO" in globals.css. */

const PROOF = ["Findings delivered as failing tests", "Your code, tests and docs from day one", "Senior engineers, first call to mainnet"];
const LEAD = "We build and secure the smart contracts that".split(" ");
const HOLD = "hold your users’ money.";

const v = (i: number) => ({ "--i": i }) as CSSProperties;

export default function XHero() {
  return (
    <section className="xh" aria-labelledby="xh-title">
      <div className="xh-stage">
        <div className="xh-bg" aria-hidden="true">
          <span className="xh-aurora xh-aurora--a" />
          <span className="xh-aurora xh-aurora--b" />
          <span className="xh-dots" />
        </div>

        <div className="container-x xh-inner">
          {/* During TOKEN2049 week the badge links to the event page; afterwards remove it. */}
          <Link href="/token2049" className="xh-badge">
            <span className="xh-badge-k">TOKEN2049</span>
            Meet us in Singapore · 7–10 Oct
            <span className="xh-badge-arr" aria-hidden="true">
              →
            </span>
          </Link>

          <p className="xh-eyebrow">Blockchain engineering &amp; smart contract audits</p>
          <h1 id="xh-title" className="xh-title">
            {LEAD.map((w, i) => (
              <Fragment key={i}>
                <span className="xh-w" style={v(i)}>
                  {w}
                </span>{" "}
              </Fragment>
            ))}
            {/* Inline (no per-word transforms) so the gradient clips cleanly across a line wrap; a light sweep reveals it. */}
            <span className="xh-hold">{HOLD}</span>
          </h1>
          <p className="xh-sub">
            DeFi protocols, tokenized assets, stablecoins and custody, designed from a written spec and broken by invariant fuzzing before anyone else
            can.
          </p>

          <div className="xh-ctas">
            <Link href="/contact" className="xh-btn xh-btn--primary">
              <span>Book a 30-min technical call</span>
              <span className="xh-btn-arr" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href="/case-studies" className="xh-btn xh-btn--ghost">
              See our work
            </Link>
          </div>
        </div>

        {/* The horizon: light, the planet's rim, live blocks on it, proof on its surface. */}
        <div className="xh-horizon">
          <span className="xh-rays" aria-hidden="true" />
          <span className="xh-flare" aria-hidden="true" />
          <span className="xh-planet" aria-hidden="true" />
          <HorizonChain />
          <div className="xh-ground">
            <p className="xh-ground-k mono">
              <span className="xh-ground-dot" aria-hidden="true" />
              Live from mainnet, read in your browser
            </p>
            <ul className="xh-proof">
              {PROOF.map((p, i) => (
                <li key={p} style={v(i)}>
                  <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
