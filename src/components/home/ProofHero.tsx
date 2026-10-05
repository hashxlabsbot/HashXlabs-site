import type { CSSProperties } from "react";
import Link from "next/link";
import InvariantRun from "./InvariantRun";
import HeroField from "./HeroField";
import { CHAINS } from "@/content/company";

/* Home hero (2026-10): a clear offer on the left, proof on the right.
   Replaced the image-corridor hero (components/home/StreamHero, still in the
   repo), whose slogan, unreadable dashboard cards and single "Start a
   project" button gave visitors no reason to stay. The text never starts
   transparent, so the headline is the page's first paint (LCP).
   Behind both, a live 3D network (HeroField) where transactions converge
   into blocks; it loads after the page and never holds up the headline.
   Styles: "PROOF HERO" in globals.css. */

const PROOF = ["Findings delivered as failing tests", "Your code, tests and docs, from day one", "Senior engineers from first call to mainnet"];

export default function ProofHero() {
  return (
    <section className="ph" aria-labelledby="ph-title">
      <div className="ph-bg" aria-hidden="true" />
      <HeroField />
      <div className="container-x ph-grid">
        <div className="ph-copy">
          {/* During TOKEN2049 week the badge links to the event page; afterwards remove it. */}
          <Link href="/token2049" className="hxs-badge hxs-badge-link ph-badge hx-a">
            <i aria-hidden="true">
              <svg viewBox="5 1 14 22" preserveAspectRatio="none">
                <path
                  d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
                  fill="#fff"
                />
              </svg>
            </i>
            Meet us at TOKEN2049 Singapore · 7–10 Oct
            <span className="hxs-badge-arr" aria-hidden="true">
              →
            </span>
          </Link>

          <p className="ph-eyebrow">Blockchain engineering &amp; smart contract audits</p>
          <h1 id="ph-title" className="ph-title">
            We build and secure the smart contracts that <span>hold your users&apos; money.</span>
          </h1>
          <p className="ph-sub">
            DeFi protocols, tokenized assets, stablecoins and custody, designed from a written spec and broken by invariant fuzzing before anyone
            else can.
          </p>

          <div className="ph-ctas">
            <Link href="/contact" className="btn btn-primary ph-btn">
              Book a 30-min technical call <span className="arr" aria-hidden="true">→</span>
            </Link>
            <Link href="/case-studies" className="btn btn-secondary ph-btn">
              See our work
            </Link>
          </div>

          <ul className="ph-proof">
            {PROOF.map((p, i) => (
              <li key={p} style={{ "--i": i } as CSSProperties}>
                <span className="ph-proof-n mono" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="ph-chains">
            <span>Shipping on</span> {CHAINS.slice(0, 6).join(" · ")}
          </p>
        </div>

        <div className="ph-visual">
          <InvariantRun />
        </div>
      </div>
    </section>
  );
}
