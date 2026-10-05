import Link from "next/link";
import type { ReactNode } from "react";
import Words from "@/components/fx/Words";

/**
 * Hero for the inner pages (Solutions, Work, About). Flat and editorial: the
 * copy sits on white paper, the visual on a solid full-bleed panel (`stage`:
 * near-black ink or warm paper) captioned like a technical drawing (`fig`).
 * No gradients or glows. `visual` sits beside the copy (split) or under it
 * (stack). Styles: "INNER PAGES" in globals.css.
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  lead,
  crumbs = [],
  actions,
  visual,
  fig,
  stage = "ink",
  layout = "split",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead: ReactNode;
  crumbs?: { href: string; label: string }[];
  actions?: ReactNode;
  visual?: ReactNode;
  fig?: string;
  stage?: "ink" | "paper";
  layout?: "split" | "stack";
}) {
  const n = title.split(" ").length;
  return (
    <section className={`ih ih--${layout} ih--${stage}`}>
      {visual && <div className="ih-stage" aria-hidden="true" />}
      <div className="container-x ih-grid">
        <div className="ih-copy">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="ih-crumbs ih-a">
              <Link href="/">Home</Link>
              {crumbs.map((c) => (
                <span key={c.href}>
                  <span aria-hidden="true">/</span>
                  <Link href={c.href}>{c.label}</Link>
                </span>
              ))}
            </nav>
          )}
          <span className="eyebrow ih-a">{eyebrow}</span>
          <h1 className="ih-title">
            <Words text={title} load />
            {accent && (
              <>
                {" "}
                <Words text={accent} start={n} load className="ih-accent" />
              </>
            )}
          </h1>
          <p className="ih-lead ih-a">{lead}</p>
          {actions && <div className="ih-actions ih-a">{actions}</div>}
        </div>
        {visual && (
          <div className="ih-visual">
            {fig && <p className="ih-fig mono">{fig}</p>}
            <div className="ih-a ih-visual-in">{visual}</div>
          </div>
        )}
      </div>
    </section>
  );
}
