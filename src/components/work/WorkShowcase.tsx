import Link from "next/link";
import type { CSSProperties } from "react";
import Icon from "@/components/icons/Icon";
import { Arrow, SectionHeader } from "@/components/ui";
import { WORK, type Work } from "@/content/site";
import { SHOT_H, SHOT_W, shotSrc, shotSrcSet } from "@/lib/shots";
import WorkStage from "./WorkStage";

/**
 * "Selected work" on the home page.
 *
 * Wide screens that support CSS scroll-driven animations get a pinned scroll
 * tour: the stage sticks while each project's interface flies in and out in 3D,
 * its copy cascades in, and floating cards (standard / built / tested / stack,
 * all taken from the case-study data) drift at different depths. Everything on
 * the scroll path animates only transform and opacity, on the compositor.
 *
 * Everywhere else (phones, tablets, reduced motion, Firefox) the same markup is
 * a plain list of project rows. Styles: "Work showcase" in globals.css.
 */
const vars = (v: Record<string, string | number>) => v as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

function Slide({ w, i, n }: { w: Work; i: number; n: number }) {
  if (!w.shot) return null;
  const first = i === 0;
  const last = i === n - 1;
  return (
    <article className="wk-slide" data-i={i} data-pos={first ? "first" : last ? "last" : undefined} style={vars({ "--i": i })}>
      <div className="wk-copy">
        <div className="wk-b wk-meta" style={vars({ "--k": 0 })}>
          <span className="mono wk-count">
            {pad(i + 1)}
            <span aria-hidden="true"> / {pad(n)}</span>
          </span>
          <span className="wk-tag">{w.tag}</span>
          <span className="wk-nda">Under NDA</span>
        </div>
        <h3 className="wk-b wk-title" style={vars({ "--k": 1 })}>
          {w.title}
        </h3>
        <p className="wk-b wk-sum" style={vars({ "--k": 2 })}>
          {w.summary}
        </p>
        <div className="wk-b" style={vars({ "--k": 3 })} aria-label={`Architecture: ${w.flow.join(" to ")}`}>
          <div className="flow-track" aria-hidden="true">
            <span className="flow-dot" style={{ animationDelay: `${i * 0.4}s` }} />
          </div>
          <ol className="mt-3 flex justify-between gap-2 text-[12.5px] font-medium text-[var(--t-mid)]">
            {w.flow.map((f) => (
              <li key={f} className="whitespace-nowrap">
                {f}
              </li>
            ))}
          </ol>
        </div>
        <div className="wk-b flex flex-wrap gap-2" style={vars({ "--k": 4 })}>
          {w.stack.slice(0, 4).map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </div>
        <div className="wk-b" style={vars({ "--k": 5 })}>
          <Link href={`/case-studies#${w.id}`} className="link text-[15px]">
            Read the case study <Arrow />
          </Link>
        </div>
        <p className="wk-b wk-cap wk-cap--copy" style={vars({ "--k": 6 })}>
          Illustrative interface, not a client screenshot.
        </p>
      </div>

      <div className="wk-scene">
        <div className="wk-visual">
          <div className="wk-tilt">
            <div className="wk-dash">
              {/* Plain <img>: pre-sized WebP from our own origin (see PhotoVisual for why). */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shotSrc(w.shot.name)}
                srcSet={shotSrcSet(w.shot.name)}
                sizes="(min-width: 1024px) 750px, (min-width: 768px) 58vw, calc(100vw - 40px)"
                width={SHOT_W}
                height={SHOT_H}
                alt={w.shot.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
            {/* Decorative echoes of the case study, floating at different depths. */}
            <div className="wk-w wk-w1" aria-hidden="true">
              <div className="wk-in wk-chip">
                <span className="k">Standard</span>
                <b>{w.std}</b>
                <em>{w.stdLabel}</em>
              </div>
            </div>
            <div className="wk-w wk-w2" aria-hidden="true">
              <div className="wk-in wk-note">
                <span className="ico">
                  <Icon name="code" className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <span className="k">Built</span>
                  <p>{w.built[0]}</p>
                </div>
              </div>
            </div>
            <div className="wk-w wk-w3" aria-hidden="true">
              <div className="wk-in wk-note ok">
                <span className="ico">
                  <Icon name="shield" className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <span className="k">Tested</span>
                  <p>{w.tested[0]}</p>
                </div>
              </div>
            </div>
            <div className="wk-w wk-w4" aria-hidden="true">
              <div className="wk-in wk-pills">
                {w.stack.slice(0, 3).map((s) => (
                  <span key={s} className="wk-pill">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="wk-cap wk-cap--scene">Illustrative interface, not a client screenshot.</p>
      </div>
    </article>
  );
}

export default function WorkShowcase() {
  const items = WORK.filter((w) => w.shot);
  const n = items.length;
  return (
    <section id="work" className="wk">
      <div className="container-x wk-head">
        <SectionHeader
          eyebrow="Selected work"
          title="Systems we have built"
          lead="Client names stay private under NDA. The engineering is described as it was built."
          action={
            <Link href="/case-studies" className="link">
              View all work <Arrow />
            </Link>
          }
        />
      </div>
      <WorkStage count={n} labels={items.map((w) => w.tag)}>
        {items.map((w, i) => (
          <Slide key={w.id} w={w} i={i} n={n} />
        ))}
      </WorkStage>
    </section>
  );
}
