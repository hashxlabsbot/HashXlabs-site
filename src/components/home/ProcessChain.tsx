import type { CSSProperties } from "react";
import Words from "@/components/fx/Words";
import { IndexList } from "@/components/ui";
import { PROCESS } from "@/content/company";
import { ARTIFACTS } from "./ProcessArtifacts";
import ProcessStage from "./ProcessStage";

/**
 * Home "How we work": five steps as five blocks on a chain to mainnet.
 *
 * Wide screens with scroll-driven animations get a pinned dark stage. Each
 * step owns one segment of the pin: its deliverable (spec, architecture,
 * pull request, test run, runbook) flies in out of depth, its details play
 * (invariants highlight, wires draw, checks tick, the MAINNET stamp lands),
 * then the card shrinks into the next socket of the chain along the bottom.
 * When the fifth lands, the chain completes and a pulse runs to "mainnet".
 * Only transform / translate / scale / rotate / opacity animate.
 *
 * Everywhere else it is the five steps as a list, and the deliverables as a
 * swipeable strip. Styles: "PROCESS CHAIN" in globals.css. The previous
 * three.js version is components/home/ProcessFactory (unmounted).
 */
const vars = (v: Record<string, string | number>) => v as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

export default function ProcessChain() {
  const n = PROCESS.length;
  return (
    <section id="process" className="pc" aria-labelledby="pc-title">
      <ProcessStage count={n} labels={PROCESS.map((p) => p.k)}>
        <div className="pc-copy">
          <span className="eyebrow pc-eyebrow">How we work</span>
          <h2 id="pc-title" className="t-h2 pc-title">
            <Words text="Five blocks from idea to mainnet" />
          </h2>
          <p className="pc-lead">The same five steps on every project. Each one ends with something you can read, run or approve.</p>

          <ol className="pc-steps">
            {PROCESS.map((p, i) => (
              <li key={p.k} className="pc-step" data-i={i} style={vars({ "--i": i })}>
                <span className="mono pc-num">
                  Block {pad(i + 1)}
                  <span aria-hidden="true"> / {pad(n)}</span>
                </span>
                <h3 className="pc-k-title">{p.k}</h3>
                <p className="pc-d">{p.d}</p>
                <span className="pc-get">You get</span>
                <IndexList items={p.get} className="pc-list" />
              </li>
            ))}
          </ol>
        </div>

        <div className="pc-scene" aria-hidden="true">
          <div className="pc-tilt">
            {ARTIFACTS.map((Card, i) => (
              <div key={i} className="pc-card" style={vars({ "--i": i })}>
                <Card />
                <span className="pc-card-label">
                  {pad(i + 1)} · {PROCESS[i].k}
                </span>
              </div>
            ))}

            <div className="pc-done">
              <p className="pc-done-k">Chain complete · 5 / 5</p>
              <p className="pc-done-t">
                Idea to <span>mainnet</span>,
                <br />
                one verifiable block at a time.
              </p>
              <p className="pc-done-d">And we stay on after launch.</p>
            </div>

            <div className="pc-chain">
              {PROCESS.map((p, i) => (
                <div key={p.k} className="pc-socket" style={vars({ "--i": i })}>
                  <span className="pc-socket-n mono">{pad(i + 1)}</span>
                  <span className="pc-flash" />
                  {i < n - 1 && <span className="pc-link" />}
                </div>
              ))}
              <span className="pc-mainnet mono">
                <i />
                mainnet
              </span>
              <span className="pc-pulse" />
            </div>
          </div>
          <p className="pc-cap">Illustrative deliverables from a typical engagement.</p>
        </div>
      </ProcessStage>
    </section>
  );
}
