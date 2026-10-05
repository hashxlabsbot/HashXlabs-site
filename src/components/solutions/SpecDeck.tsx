"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Code from "@/components/inner/Code";
import { SOLUTIONS } from "@/content/site";

/**
 * /solutions hero visual: one spec card per kind of system, stacked like a
 * deck. The front card shows how that system fails and the test that guards
 * it; every few seconds it is dealt off the front and slides to the back.
 *
 * Timing is the active tab's progress bar (a CSS animation): its
 * `animationend` deals the next card, so hovering the deck (CSS pauses the
 * bar), leaving the viewport (data-paused) and reduced motion (no animation,
 * so no end event) all stop the cycle without any timers.
 */
const DEAL_MS = 460;

export default function SpecDeck() {
  const n = SOLUTIONS.length;
  const [top, setTop] = useState(0);
  const [out, setOut] = useState(-1);
  const [paused, setPaused] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPaused(!e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, []);

  const go = (next: number) => {
    if (out !== -1 || next === top) return;
    setOut(top);
    timer.current = window.setTimeout(() => {
      setTop(next);
      setOut(-1);
    }, DEAL_MS);
  };

  return (
    <div ref={ref} className="sd" data-paused={paused || undefined}>
      <div className="sd-stack">
        {SOLUTIONS.map((s, i) => {
          const k = (i - top + n) % n;
          const front = k === 0;
          return (
            <article
              key={s.n}
              className="sd-card"
              data-out={i === out || undefined}
              style={{ "--k": k } as CSSProperties}
              aria-hidden={!front || undefined}
              inert={!front || undefined}
            >
              <header className="sd-bar">
                <span className="sd-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="sd-file mono">{s.file}</span>
                <span className="sd-run mono">{s.runner}</span>
              </header>
              <div className="sd-body">
                <div className="sd-head">
                  <span className="sd-n mono">{s.n}</span>
                  <h2 className="sd-title">{s.title}</h2>
                </div>
                <p className="sd-label sd-label--bad mono">Fails when</p>
                <ul className="sd-fails">
                  {s.fails.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="sd-label sd-label--ok mono">Must always hold</p>
                <Code lines={s.spec} className="sd-code" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="sd-tabs" role="tablist" aria-label="Kinds of system">
        {SOLUTIONS.map((s, i) => (
          <button
            key={s.n}
            type="button"
            role="tab"
            aria-selected={i === top}
            className="sd-tab"
            onClick={() => go(i)}
          >
            <span className="sd-tab-t">{s.title}</span>
            <span className="sd-prog" aria-hidden="true">
              {i === top && out === -1 && <span key={top} className="sd-prog-fill" onAnimationEnd={() => go((top + 1) % n)} />}
            </span>
          </button>
        ))}
      </div>
      <p className="sd-cap">Illustrative tests, one per kind of system.</p>
    </div>
  );
}
