"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import Icon from "@/components/icons/Icon";
import { AUDIENCES } from "@/content/company";
import { createAudienceField, type AudienceField } from "./audienceField";

/**
 * Home "Who we work with": audience tabs beside a live particle figure.
 *
 * The tabs advance on their own (the progress line under the active one is a
 * CSS animation; its animationend moves to the next), pause while the pointer
 * or focus is on the list or the section is off screen, and stop for good once
 * someone picks one. The figure (audienceField.ts) morphs into a form for each
 * audience: a rocket, a coin, an institution, a network globe. Under reduced
 * motion the figure is drawn still and nothing advances.
 */
const DUR = 6.5; // seconds per audience while auto-advancing
const pad = (n: number) => String(n).padStart(2, "0");

export default function Audiences() {
  const n = AUDIENCES.length;
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const root = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const field = useRef<AudienceField | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const intent = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const c = cv.current, s = root.current;
    if (!c || !s) return;
    const f = createAudienceField(c, s, {
      reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onVisible: setSeen,
    });
    field.current = f;
    return () => {
      f.destroy();
      field.current = null;
    };
  }, []);

  useEffect(() => {
    field.current?.setShape(active);
  }, [active]);

  useEffect(() => () => clearTimeout(intent.current), []);

  const pick = (i: number, focus = false) => {
    clearTimeout(intent.current);
    setActive(i);
    setAuto(false);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step) pick((active + step + n) % n, true);
    else if (e.key === "Home") pick(0, true);
    else if (e.key === "End") pick(n - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <section ref={root} className="au" aria-labelledby="au-title">
      <div className="container-x au-grid">
        <Reveal className="au-head">
          <span className="eyebrow">Who we work with</span>
          <h2 id="au-title" className="t-h2 mt-3">
            <Words text="Built for teams where the money is real" />
          </h2>
          <p className="t-lead mt-4">Founders, fintechs, issuers and enterprises come to us when a mistake would be expensive.</p>
        </Reveal>

        <div className={`au-ui${hold || !seen ? " is-hold" : ""}`}>
          <div
            role="tablist"
            aria-label="Who we work with"
            aria-orientation="vertical"
            className="au-list"
            onKeyDown={onKey}
            onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
            onPointerLeave={() => {
              clearTimeout(intent.current);
              setHold(false);
            }}
            onFocus={() => setHold(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
            }}
          >
            {AUDIENCES.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.title}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`au-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`au-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  className="au-row"
                  onClick={() => pick(i)}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== "mouse" || on) return;
                    clearTimeout(intent.current);
                    intent.current = setTimeout(() => setActive(i), 140);
                  }}
                >
                  <span className="au-n">{pad(i + 1)}</span>
                  <span className="au-t">{x.title}</span>
                  <Icon name={x.icon} className="au-ic" />
                  <span className="au-bar" aria-hidden="true">
                    {on && (
                      <i
                        key={`${active}-${auto}`}
                        className={auto ? "run" : undefined}
                        style={{ "--au-dur": `${DUR}s` } as CSSProperties}
                        onAnimationEnd={(e) => {
                          if (e.target === e.currentTarget) setActive((v) => (v + 1) % n);
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* All panels share one grid cell, so switching never changes the height. */}
          <div className="au-details">
            {AUDIENCES.map((x, i) => (
              <div key={x.title} role="tabpanel" id={`au-panel-${i}`} aria-labelledby={`au-tab-${i}`} className="au-panel" data-on={i === active || undefined}>
                <p className="au-d">{x.d}</p>
                <ul className="au-pts">
                  {x.points.map((p, j) => (
                    <li key={p} style={{ "--j": j } as CSSProperties}>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link href={x.href} className="sv-more">
                  <span>{x.cta}</span>
                  <span className="arr" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <Link href="/solutions" className="link au-more">
            See solutions by use case{" "}
            <span className="arr" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div
          className="au-stage"
          aria-hidden="true"
          onPointerMove={(e) => e.pointerType !== "touch" && field.current?.setPointer(e.clientX, e.clientY)}
          onPointerLeave={() => field.current?.setPointer(null)}
        >
          <canvas ref={cv} className="au-canvas" />
          <span className="au-corner tl" />
          <span className="au-corner tr" />
          <span className="au-corner bl" />
          <span className="au-corner br" />
          <span className="au-fig">
            {AUDIENCES.map((x, i) => (
              <span key={x.fig} data-on={i === active || undefined}>
                Fig. {pad(i + 1)} · {x.fig}
              </span>
            ))}
          </span>
          <span className="au-hint">Move your cursor</span>
          <span className="au-count">
            {pad(active + 1)} / {pad(n)}
          </span>
        </div>
      </div>
    </section>
  );
}
