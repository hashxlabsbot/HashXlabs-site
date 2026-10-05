import type { Work } from "@/content/site";
import Shot from "@/components/Shot";
import Flow from "@/components/inner/Flow";
import { Arrow, IndexList } from "@/components/ui";
import Link from "next/link";

/**
 * One /case-studies engagement as a dossier: on wide screens the facts stay
 * pinned on the left (sticky) while the interface, the challenge, the
 * architecture and what was built and tested scroll past on the right.
 */
export default function CaseDossier({ w, i, n }: { w: Work; i: number; n: number }) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return (
    <article id={w.id} className="dz" aria-labelledby={`dz-${w.id}`}>
      <div className="dz-side">
        <div className="dz-meta">
          <span className="dz-n mono">
            {pad(i + 1)}
            <span aria-hidden="true"> / {pad(n)}</span>
          </span>
          <span className="dz-tag">{w.tag}</span>
        </div>
        <h3 id={`dz-${w.id}`} className="dz-title">
          {w.title}
        </h3>
        <p className="dz-sum">{w.summary}</p>
        <dl className="dz-facts">
          <div>
            <dt>Standard</dt>
            <dd>
              <b>{w.std}</b> {w.stdLabel}
            </dd>
          </div>
          <div>
            <dt>Client</dt>
            <dd>
              <b>Under NDA</b> name withheld
            </dd>
          </div>
        </dl>
        <ul className="dz-stack" aria-label="Stack">
          {w.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <Link href="/contact" className="link dz-cta">
          Discuss a similar build <Arrow />
        </Link>
      </div>

      <div className="dz-main">
        {w.shot && <Shot shot={w.shot} sizes="(min-width: 1024px) 680px, calc(100vw - 40px)" />}
        <div className="dz-block">
          <span className="dz-k mono">The challenge</span>
          <p className="dz-challenge">{w.context}</p>
        </div>
        <div className="dz-block dz-arch">
          <span className="dz-k mono">How it fits together</span>
          <Flow nodes={w.flow} label={`${w.title}: architecture`} />
        </div>
        <div className="dz-two">
          <div>
            <span className="dz-k mono">What we built</span>
            <IndexList items={w.built} />
          </div>
          <div>
            <span className="dz-k mono">What we tested</span>
            <IndexList items={w.tested} />
          </div>
        </div>
      </div>
    </article>
  );
}
