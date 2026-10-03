import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { SERVICE_AREAS } from "@/content/company";
import RailTrack from "./RailTrack";

/**
 * Home "Services": a pinned horizontal rail.
 *
 * Wide screens that support CSS scroll-driven animations pin the section and
 * turn vertical scroll into a sideways move through 50vw columns: the intro,
 * one column per service (photo card, title, link) and a closing column. Each
 * card rises into place as its column comes in, and its photo drifts inside
 * the frame. All of it is transform-only on the compositor; when the last
 * column arrives the pin releases and the page carries on down.
 *
 * Everywhere else the same markup is a heading plus a native swipe row.
 * Styles: "Services rail" in globals.css.
 */
const vars = (v: Record<string, string | number>) => v as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");

function More({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className="sv-more">
      <span>{children}</span>
      <span className="arr" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export default function ServicesRail() {
  const n = SERVICE_AREAS.length;
  return (
    <section id="services" className="sv" aria-labelledby="sv-title">
      <RailTrack count={n}>
        <div className="sv-col sv-intro">
          <Reveal className="sv-intro-in">
            <span className="eyebrow">Services</span>
            <h2 id="sv-title" className="sv-h">
              <Words text="Everything you need to ship on-chain and with AI" />
            </h2>
            <p className="sv-lead">From the first contract to production operations, one team designs, builds and secures it.</p>
            <More href="/services">All services</More>
          </Reveal>
        </div>

        {SERVICE_AREAS.map((a, i) => (
          <article key={a.title} className="sv-col sv-item" style={vars({ "--i": i + 1 })}>
            <div className="sv-body">
              <Link href={a.href} className="sv-card" tabIndex={-1} aria-hidden="true">
                <span className="sv-photo">
                  {/* Plain <img>: local, pre-sized photo (see PhotoVisual for why). */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/img/${a.photo}`} alt="" width={1200} height={760} loading="lazy" decoding="async" />
                </span>
                <span className="sv-frame" />
                <span className="sv-num mono">
                  {pad(i + 1)} / {pad(n)}
                </span>
                <span className="sv-word">{a.word}</span>
              </Link>
              <div className="sv-meta">
                <div>
                  <h3 className="sv-title">{a.title}</h3>
                  <p className="sv-d">{a.d}</p>
                  <p className="sv-points">{a.points.join(" · ")}</p>
                </div>
                <More href={a.href}>Learn more</More>
              </div>
            </div>
          </article>
        ))}

        <div className="sv-col sv-end">
          <div className="sv-end-in">
            <p className="sv-end-h">Explore the full range of blockchain, security and AI services we build and run.</p>
            <More href="/services">View all services</More>
          </div>
        </div>
      </RailTrack>
    </section>
  );
}
