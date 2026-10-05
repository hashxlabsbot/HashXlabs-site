import type { CSSProperties } from "react";
import { CHAINS, COMPANY } from "@/content/company";

/**
 * /about hero visual: the company as a one-page README. Every row is a fact
 * the rest of the site backs up; nothing here is a metric.
 */
const ROWS: [string, string][] = [
  ["Builds", "Smart contracts, DeFi, tokenized assets, wallets and AI agents"],
  ["Led by", "Senior engineers, from the first call to mainnet"],
  ["Starts with", "A written specification of what must never happen"],
  ["Ships with", "Tests, docs and runbooks, in your repository"],
  ["Builds on", CHAINS.slice(0, 6).join(" · ")],
  ["Won't", "Promise zero exploits. Nobody honest can."],
];

export default function ProfileCard() {
  return (
    <div className="abp">
      <div className="abp-back" aria-hidden="true" />
      <div className="abp-card">
        <div className="abp-bar">
          <span className="abp-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="abp-file mono">README.md</span>
          <span className="abp-tag mono">hashx-labs</span>
        </div>
        <div className="abp-body">
          <p className="abp-h">
            <span className="abp-hash mono" aria-hidden="true">
              #
            </span>
            HashX Labs
          </p>
          <p className="abp-sub">{COMPANY.tagline}</p>
          <dl className="abp-rows">
            {ROWS.map(([k, v], i) => (
              <div key={k} className="abp-row" style={{ "--i": i } as CSSProperties}>
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a href={`mailto:${COMPANY.email}`} className="abp-mail">
            <span className="mono">Contact</span>
            {COMPANY.email}
            <span className="arr" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
