"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import Code from "@/components/inner/Code";
import { PRINCIPLES } from "@/content/company";

/**
 * /about "Five rules we work by". Picking a rule (hover, focus or tap) shows
 * what it looks like in practice: a small illustrative artifact from a
 * typical engagement. All five are rendered and cross-faded, so switching
 * never changes layout. Flat ink band.
 */
function Art({ file, tag, children }: { file: string; tag: string; children: ReactNode }) {
  return (
    <div className="pp-art">
      <div className="pp-bar">
        <span className="pp-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="pp-file mono">{file}</span>
        <span className="pp-tag mono">{tag}</span>
      </div>
      <div className="pp-body">{children}</div>
    </div>
  );
}

const ARTIFACTS: ReactNode[] = [
  <Art key="spec" file="SPEC.md → test/Invariants.t.sol" tag="1 rule = 1 test">
    <p className="pp-spec">
      <b className="mono">I-1</b> Total assets always cover every share.
    </p>
    <span className="pp-arrow" aria-hidden="true" />
    <Code
      className="pp-code"
      lines={[
        "// SPEC.md I-1",
        "function invariant_I1_solvency() public {",
        "  assertGe(vault.totalAssets(),",
        "           vault.convertToAssets(vault.totalSupply()));",
        "}",
      ]}
    />
  </Art>,
  <Art key="team" file="PROJECT.md" tag="Hand-offs: none">
    <table className="pp-table">
      <thead>
        <tr>
          <th>Phase</th>
          <th>Who</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["Scoping call", "Lead engineer"],
          ["Architecture & threat model", "Lead engineer"],
          ["Build", "Lead engineer + engineers"],
          ["Review & launch", "Lead engineer"],
          ["After launch", "Same team"],
        ].map(([a, b]) => (
          <tr key={a}>
            <td>{a}</td>
            <td>
              <span className="pp-who">{b}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Art>,
  <Art key="no" file="RECOMMENDATION.md" tag="Before kickoff">
    <p className="pp-q mono">Q. Do we need our own token?</p>
    <p className="pp-a">
      <b>No.</b> Your users already pay in USDC. A token would add a regulatory question and no utility.
    </p>
    <span className="pp-k mono">Removed from scope</span>
    <ul className="pp-cut">
      <li>Token contract</li>
      <li>Its audit</li>
      <li>Its legal review</li>
    </ul>
  </Art>,
  <Art key="boring" file="Vault.sol · review" tag="Simpler">
    <pre className="code pp-diff">
      <span className="del">{"- function withdraw(uint256 a) external {"}</span>
      <span className="del">{"-   assembly { /* hand-rolled transfer */ }"}</span>
      <span className="add">{"+ function withdraw(uint256 a) external nonReentrant {"}</span>
      <span className="add">{"+   asset.safeTransfer(msg.sender, a);"}</span>
      <span>{"  }"}</span>
    </pre>
    <p className="pp-note">Well-known patterns, explicit roles, nothing clever. Clever code is where exploits hide.</p>
  </Art>,
  <Art key="own" file="your-protocol/" tag="Owner: you">
    <pre className="code pp-tree">
      {[
        ["├─ ", "contracts/", ""],
        ["├─ ", "test/invariants/", "runs in your CI"],
        ["├─ ", "script/Deploy.s.sol", ""],
        ["├─ ", "docs/ARCHITECTURE.md", ""],
        ["├─ ", "docs/THREAT-MODEL.md", ""],
        ["└─ ", "RUNBOOK.md", "what to do at 3 a.m."],
      ].map(([b, f, c]) => (
        <span key={f}>
          <span className="c">{b}</span>
          {f}
          {c && <span className="c">{`  # ${c}`}</span>}
          {"\n"}
        </span>
      ))}
    </pre>
  </Art>,
];

export default function Principles() {
  const [on, setOn] = useState(0);
  return (
    <section className="pp" aria-labelledby="pp-title">
      <div className="container-x pp-grid">
        <div>
          <span className="eyebrow pp-eyebrow">Principles</span>
          <h2 id="pp-title" className="t-h2 mt-3 text-white">
            Five rules we work by
          </h2>
          <p className="pp-lead">Pick one to see what it looks like on a real project.</p>
          <ol className="pp-list" role="tablist" aria-label="Principles">
            {PRINCIPLES.map(([t, d], i) => (
              <li key={t}>
                <button
                  type="button"
                  role="tab"
                  id={`pp-tab-${i}`}
                  aria-selected={on === i}
                  aria-controls="pp-stage"
                  className="pp-row"
                  onClick={() => setOn(i)}
                  onMouseEnter={() => setOn(i)}
                  onFocus={() => setOn(i)}
                >
                  <span className="pp-n mono">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pp-t">{t}</span>
                  <span className="pp-d">
                    <span>{d}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="pp-side">
          <div id="pp-stage" role="tabpanel" aria-labelledby={`pp-tab-${on}`} className="pp-stage">
            {ARTIFACTS.map((a, i) => (
              <div key={i} className="pp-slot" data-on={on === i || undefined} aria-hidden={on !== i || undefined}>
                {a}
              </div>
            ))}
          </div>
          <p className="pp-cap">Illustrative artifacts from a typical engagement.</p>
          <Link href="/lab" className="pp-lab">
            See these rules in running code: the Invariant Lab <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
