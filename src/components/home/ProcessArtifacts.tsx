import type { CSSProperties, ReactNode } from "react";

/**
 * The five deliverables shown in the home "How we work" chain, one per
 * PROCESS step, all from the same illustrative engagement (a token vault).
 * Pure markup; every size is in em so a card scales with its font-size.
 * `.pc-k` parts (with --k) reveal in order while their card is on screen.
 * Styles: "PROCESS CHAIN" in globals.css.
 */
const k = (n: number) => ({ "--k": n }) as CSSProperties;

function Frame({ file, tag, tone, children }: { file: string; tag: string; tone?: "dark"; children: ReactNode }) {
  return (
    <div className={`pa${tone === "dark" ? " pa--dark" : ""}`}>
      <div className="pa-bar">
        <span className="pa-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="pa-file">{file}</span>
        <span className="pa-tag">{tag}</span>
      </div>
      <div className="pa-body">{children}</div>
    </div>
  );
}

function Spec() {
  return (
    <Frame file="SPEC.md" tag="Reviewed">
      <p className="pa-h">Vault: specification</p>
      <p className="pa-sub">Who uses it, what it does, and what must never happen.</p>
      <div className="pa-sec">Users</div>
      <div className="pa-lines">
        <span style={{ width: "92%" }} />
        <span style={{ width: "78%" }} />
      </div>
      <div className="pa-sec">Must never happen</div>
      <ul className="pa-inv">
        {[
          ["I-1", "Total assets cover every share"],
          ["I-2", "Only the guardian can pause"],
          ["I-3", "No withdrawal exceeds a balance"],
        ].map(([id, t], i) => (
          <li key={id} className="pc-k" style={k(i)}>
            <b className="mono">{id}</b>
            {t}
            <span className="pa-mark" />
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Design() {
  return (
    <Frame file="architecture.fig" tag="Approved">
      <div className="pa-arch">
        <span className="pa-node">App</span>
        <span className="pa-wire pc-k" style={k(0)} />
        <span className="pa-node">API</span>
        <span className="pa-wire pc-k" style={k(1)} />
        <span className="pa-node pa-node--hi">Vault</span>
        <span className="pa-wire pa-wire--back pc-k" style={k(2)} />
        <span className="pa-node">Oracle</span>
      </div>
      <div className="pa-sec">Threat model</div>
      <ul className="pa-threats">
        {[
          ["Price manipulation", "TWAP + bounds"],
          ["Reentrancy", "Checks-effects + guard"],
          ["Key loss", "2-of-3 multisig"],
        ].map(([t, m], i) => (
          <li key={t}>
            <span>{t}</span>
            <span className="pa-arrow">→</span>
            <span>{m}</span>
            <b className="pa-ok pc-k" style={k(3 + i)}>
              Mitigated
            </b>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Build() {
  return (
    <Frame file="Pull request #42" tag="Merged">
      <p className="pa-h">feat(vault): enforce deposit cap</p>
      <pre className="pa-diff mono">
        <span>{"  function deposit(uint256 assets) external {"}</span>
        <span className="add pc-k" style={k(0)}>
          {"+   if (totalAssets() + assets > cap) revert CapExceeded();"}
        </span>
        <span>{"    _mint(msg.sender, previewDeposit(assets));"}</span>
        <span className="add pc-k" style={k(1)}>
          {"+ function test_DepositRespectsCap() public { … }"}
        </span>
      </pre>
      <ul className="pa-checks">
        {["Unit tests", "Invariant tests", "Static analysis", "Two approvals"].map((c, i) => (
          <li key={c}>
            {c}
            <span className="pa-pass mono pc-k" style={k(2 + i)}>
              passed
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Test() {
  return (
    <Frame file="forge test" tag="Passing" tone="dark">
      <pre className="pa-term mono">
        <span className="pa-cmd">$ forge test --match-contract Invariant</span>
        <span className="pc-k" style={k(0)}>
          <b className="ok">[PASS]</b> invariant_assetsCoverShares()
        </span>
        <span className="pc-k" style={k(1)}>
          <b className="ok">[PASS]</b> invariant_onlyGuardianPauses()
        </span>
        <span className="pc-k" style={k(2)}>
          <b className="ok">[PASS]</b> invariant_noOverdraw()
        </span>
      </pre>
      <div className="pa-run">
        <span className="pa-run-fill" />
      </div>
      <ul className="pa-finds">
        {[
          ["M-01", "Rounding favours the caller", "Fixed + test"],
          ["L-02", "Missing event on cap change", "Fixed"],
          ["I-03", "Unused import", "Fixed"],
        ].map(([id, t, s], i) => (
          <li key={id} className="pc-k" style={k(3 + i)}>
            <b className="mono">{id}</b>
            <span>{t}</span>
            <em>{s}</em>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function Launch() {
  return (
    <Frame file="RUNBOOK.md" tag="Mainnet">
      <p className="pa-h">Launch checklist</p>
      <ul className="pa-list">
        {["Dry run on a mainnet fork", "Ownership moved to a 2-of-3 multisig", "Contracts verified on the explorer", "Alerts on pause and large withdrawals", "Runbook handed over"].map(
          (c, i) => (
            <li key={c}>
              <span className="pa-n mono">{String(i + 1).padStart(2, "0")}</span>
              {c}
              <span className="pa-done mono pc-k" style={k(i)}>
                done
              </span>
            </li>
          )
        )}
      </ul>
      <span className="pa-stamp pc-k" style={k(5)}>
        Mainnet
      </span>
    </Frame>
  );
}

export const ARTIFACTS = [Spec, Design, Build, Test, Launch];
