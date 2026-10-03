"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { STACK } from "@/content/company";
import TechLogo from "./TechLogo";
import { createTechOrbit, type TechOrbit } from "./techOrbit";

/**
 * Home "Technology": every tool we use, as a logo tile on one of five rings
 * (one per group) orbiting the HashX block (techOrbit.ts draws it on canvas).
 *
 * The tabs tour the stack on their own: the whole orbit first, then each
 * group, where the figure turns until that ring faces you and names its
 * tools. The tour pauses while the pointer or focus is on the section and
 * stops once someone picks a tab or a logo. The cards under the figure say
 * what each tool is for; hovering a card lifts its tile and hovering a tile
 * lights its card. The figure can be dragged to spin it.
 */
const TABS = ["All", ...STACK.map((g) => g.group)];
const DUR = (tab: number) => (tab === 0 ? 5.5 : 6.5); // seconds per tab while touring
const OFF = STACK.map((_, k) => STACK.slice(0, k).reduce((n, g) => n + g.items.length, 0));
const TOTAL = STACK.reduce((n, g) => n + g.items.length, 0);
const pad = (n: number) => String(n).padStart(2, "0");

export default function TechStack() {
  const [tab, setTab] = useState(0);
  const [auto, setAuto] = useState(true);
  const [hold, setHold] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hot, setHot] = useState<number | null>(null);
  const root = useRef<HTMLElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const orbit = useRef<TechOrbit | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number, focus = false) => {
    setTab(i);
    setAuto(false);
    if (focus) tabs.current[i]?.focus();
  };

  useEffect(() => {
    const c = cv.current, s = root.current;
    if (!c || !s) return;
    const o = createTechOrbit(c, s, STACK, {
      reduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onVisible: setSeen,
      onHover: setHot,
      onPick: (k) => {
        setTab(k + 1);
        setAuto(false);
      },
    });
    orbit.current = o;
    return () => {
      o.destroy();
      orbit.current = null;
    };
  }, []);

  useEffect(() => {
    orbit.current?.setFocus(tab - 1);
  }, [tab]);

  // The sliding pill follows the active tab; on narrow screens the row scrolls to keep it in view.
  useLayoutEffect(() => {
    const l = list.current, b = tabs.current[tab];
    if (!l || !b) return;
    const place = () => {
      l.style.setProperty("--pl", `${b.offsetLeft}px`);
      l.style.setProperty("--pw", `${b.offsetWidth}px`);
    };
    place();
    if (l.scrollWidth > l.clientWidth + 1) {
      l.scrollTo({ left: b.offsetLeft - (l.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
    }
    const ro = new ResizeObserver(place);
    ro.observe(l);
    return () => ro.disconnect();
  }, [tab]);

  const onKey = (e: KeyboardEvent) => {
    const n = TABS.length;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) pick((tab + step + n) % n, true);
    else if (e.key === "Home") pick(0, true);
    else if (e.key === "End") pick(n - 1, true);
    else return;
    e.preventDefault();
  };

  const holdOn = (e: PointerEvent) => e.pointerType === "mouse" && setHold(true);
  const holdOff = () => setHold(false);

  return (
    <section
      ref={root}
      className={`tx${hold || !seen ? " is-hold" : ""}`}
      aria-labelledby="tx-title"
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
      }}
    >
      <div className="container-x">
        <div className="tx-top">
          <Reveal className="tx-head">
            <span className="eyebrow">Technology</span>
            <h2 id="tx-title" className="t-h2 mt-3">
              <Words text="Proven tools, chosen for the job" />
            </h2>
            <p className="t-lead mt-4">We pick the stack that fits your product and your team, and explain why in writing.</p>
          </Reveal>

          <div ref={list} role="tablist" aria-label="Technology groups" className="tx-tabs" onKeyDown={onKey} onPointerEnter={holdOn} onPointerLeave={holdOff}>
            <span className="tx-pill" aria-hidden="true" />
            {TABS.map((t, i) => {
              const on = i === tab;
              return (
                <button
                  key={t}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`tx-tab-${i}`}
                  aria-selected={on}
                  aria-controls={`tx-panel-${i}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(i)}
                >
                  <span>{t}</span>
                  <span className="tx-count">{i === 0 ? TOTAL : STACK[i - 1].items.length}</span>
                  {on && auto && (
                    <i
                      key={tab}
                      className="tx-run"
                      aria-hidden="true"
                      style={{ "--tx-dur": `${DUR(i)}s` } as CSSProperties}
                      onAnimationEnd={(e) => {
                        if (e.target === e.currentTarget) setTab((v) => (v + 1) % TABS.length);
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="tx-stage" onPointerEnter={holdOn} onPointerLeave={holdOff}>
          <canvas ref={cv} className="tx-canvas" aria-hidden="true" />
          <span className="tx-hint" aria-hidden="true">
            <span className="tx-hint-m">Drag to spin · click a logo</span>
            <span className="tx-hint-t">Swipe to spin · tap a logo</span>
          </span>
        </div>

        {/* All panels share one grid cell, so switching never changes the height. */}
        <div className="tx-panels" onPointerEnter={holdOn} onPointerLeave={holdOff}>
          <div role="tabpanel" id="tx-panel-0" aria-labelledby="tx-tab-0" className="tx-panel" data-on={tab === 0 || undefined} inert={tab !== 0}>
            <ul className="tx-groups">
              {STACK.map((g, k) => (
                <li key={g.group} style={{ "--j": k } as CSSProperties}>
                  <button type="button" className="tx-group" onClick={() => pick(k + 1)}>
                    <span className="tx-gn">{pad(k + 1)}</span>
                    <span className="tx-gt">{g.group}</span>
                    <span className="tx-glogos" aria-hidden="true">
                      {g.items.map((it) => (
                        <span key={it.name} className="tx-mini">
                          <TechLogo item={it} size={18} />
                        </span>
                      ))}
                    </span>
                    <span className="tx-gi">{g.items.map((it) => it.name).join(" · ")}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {STACK.map((g, k) => (
            <div
              key={g.group}
              role="tabpanel"
              id={`tx-panel-${k + 1}`}
              aria-labelledby={`tx-tab-${k + 1}`}
              className="tx-panel"
              data-on={tab === k + 1 || undefined}
              inert={tab !== k + 1}
            >
              <p className="tx-d">{g.d}</p>
              <ul className="tx-items" style={{ "--n": g.items.length } as CSSProperties}>
                {g.items.map((it, j) => (
                  <li
                    key={it.name}
                    className="tx-item"
                    style={{ "--j": j } as CSSProperties}
                    data-hot={hot === OFF[k] + j || undefined}
                    onPointerEnter={(e) => e.pointerType === "mouse" && orbit.current?.setHover(OFF[k] + j)}
                    onPointerLeave={() => orbit.current?.setHover(null)}
                  >
                    <span className="tx-tile">
                      <TechLogo item={it} />
                    </span>
                    <span className="tx-in">{it.name}</span>
                    <span className="tx-note">{it.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
