import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import Magnetic from "@/components/fx/Magnetic";
import { IndexList } from "@/components/ui";
import { LIVE_PROJECTS, type LiveProject } from "@/content/company";
import LiveStage from "./LiveStage";

/**
 * Home "Live projects": client sites we built that are running in production,
 * shown with real full-page screenshots (scripts/capture-sites.mjs).
 *
 * Each project is a browser window and a phone in one 3D rig. As the project
 * scrolls through the viewport the rig swings in from a tilt, both screenshots
 * scroll through the real page at different speeds, the phone rises on its own
 * parallax and the domain drifts behind in giant outline type. All of that is
 * CSS scroll-driven animation of transform / translate only (compositor). The
 * client island (LiveStage) adds a mouse-only tilt with a moving glare and
 * types the address bar once the project is on screen.
 *
 * Without scroll-driven animations the screenshot scrolls on hover instead;
 * under reduced motion everything is still. Styles: "Live projects" in
 * globals.css.
 */
const vars = (v: Record<string, string | number>) => v as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

// Frame shapes, kept in sync with .lp-view / .lp-screen in globals.css.
const DESK_ASPECT = 10 / 16;
const PHONE_ASPECT = 19.5 / 9;
const PHONE_PAN_CAP = 0.55; // the phone covers a little over half its page: fast enough to read as scrolling, slow enough to see

const src = (p: LiveProject, kind: "desktop" | "mobile", w: number) => `/img/sites/${p.id}-${kind}-${w}.webp`;

function Project({ p, i, n }: { p: LiveProject; i: number; n: number }) {
  const [dw, dh] = p.desk;
  const [pw, ph] = p.phone;
  const panD = (1 - (dw * DESK_ASPECT) / dh) * 100;
  const panP = Math.min(1 - (pw * PHONE_ASPECT) / ph, PHONE_PAN_CAP) * 100;
  const flip = i % 2 === 1;

  return (
    <article
      className={`lp${flip ? " lp--flip" : ""}`}
      aria-labelledby={`lp-${p.id}`}
      style={vars({ "--acc": p.accent, "--pan-d": `${panD.toFixed(2)}%`, "--pan-p": `${panP.toFixed(2)}%`, "--len": p.domain.length })}
    >
      <div className="lp-ghost" aria-hidden="true">
        <span>{p.domain}</span>
        <span>{p.domain}</span>
      </div>

      <Reveal className="lp-copy">
        <div className="lp-meta">
          <span className="mono lp-count">
            {pad(i + 1)}
            <span aria-hidden="true"> / {pad(n)}</span>
          </span>
          <span className="lp-kind">{p.kind}</span>
        </div>
        <h3 id={`lp-${p.id}`} className="lp-name">
          {p.name}
        </h3>
        <p className="lp-title">{p.title}</p>
        <p className="lp-d">{p.d}</p>
        <div className="lp-built">
          <span className="lp-k">What we built</span>
          <IndexList items={p.built} />
        </div>
        <dl className="lp-facts">
          {p.facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>
                {f.href ? (
                  <a href={f.href} target="_blank" rel="noopener noreferrer" className="lp-fact-link">
                    {f.v}
                    <span aria-hidden="true">{"\u00a0↗"}</span>
                  </a>
                ) : (
                  f.v
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="lp-actions">
          <Magnetic>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary lp-visit">
              Visit {p.domain}
              <span className="arr" aria-hidden="true">
                ↗
              </span>
            </a>
          </Magnetic>
          <ul className="lp-stack" aria-label="Built with">
            {p.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <LiveStage className="lp-scene">
        <div className="lp-rig">
          <div className="lp-tilt">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-browser"
              aria-label={`Open ${p.domain} in a new tab`}
            >
              <div className="lp-bar" aria-hidden="true">
                <span className="lp-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="lp-url">
                  <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                    <path d="M4.5 7V5.2a3.5 3.5 0 0 1 7 0V7M3.5 7h9v6.5h-9z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span className="lp-type mono">{p.domain}</span>
                </span>
                <span className="lp-open">Open ↗</span>
              </div>
              <div className="lp-view">
                {/* Plain <img>: pre-sized WebP from our own origin (see PhotoVisual for why). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="lp-pan lp-pan-d"
                  src={src(p, "desktop", 1200)}
                  srcSet={`${src(p, "desktop", 720)} 720w, ${src(p, "desktop", 1200)} 1200w`}
                  sizes="(min-width: 1024px) 640px, calc(100vw - 40px)"
                  width={dw}
                  height={dh}
                  alt={`The ${p.name} website on desktop: a full-page screenshot of ${p.domain}.`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="lp-glare" aria-hidden="true" />
            </a>

            <div className="lp-phone" aria-hidden="true">
              <div className="lp-screen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="lp-pan lp-pan-p" src={src(p, "mobile", 390)} width={pw} height={ph} alt="" loading="lazy" decoding="async" />
              </div>
              <span className="lp-notch" />
            </div>

            <div className="lp-card" aria-hidden="true">
              <span className="lp-card-dot" />
              <div>
                <span className="lp-k">{p.facts[0].k}</span>
                <b>{p.facts[0].v}</b>
              </div>
              <div>
                <span className="lp-k">{p.facts[1].k}</span>
                <b>{p.facts[1].v}</b>
              </div>
            </div>
          </div>
        </div>
        <p className="lp-cap">Real screenshots of the live site, captured October 2026.</p>
      </LiveStage>
    </article>
  );
}

export default function LiveProjects() {
  const n = LIVE_PROJECTS.length;
  return (
    <section className="lps" aria-labelledby="lps-title">
      <div className="container-x">
        <Reveal className="lps-head">
          <span className="eyebrow">Live projects</span>
          <h2 id="lps-title" className="t-h2 mt-3">
            <Words text="Shipped, live, and one click away" />
          </h2>
          <p className="t-lead mt-4">
            Two client sites we built, running in production today. Scroll through them here, then open the real thing.
          </p>
        </Reveal>
        {LIVE_PROJECTS.map((p, i) => (
          <Project key={p.id} p={p} i={i} n={n} />
        ))}
      </div>
    </section>
  );
}
