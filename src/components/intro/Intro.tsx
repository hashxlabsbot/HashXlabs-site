import type { CSSProperties } from "react";
import { COLUMNS, EXIT_MS } from "./scene";

/* Load intro, "ledger". A light screen where transactions stream past in the
   background (address to address, amount, each one confirming in turn) while
   the wordmark settles in the middle under a progress line. When it is done
   the screen clears and the wordmark flies into the header logo's place.

   Every movement is a CSS transform/opacity animation (globals.css → INTRO),
   so it runs on the compositor from first paint and stays smooth while React
   hydrates underneath. The inline script below only flips classes on <html>:
   it starts the intro (skipped for reduced motion, and without JS nothing is
   shown), holds the page's own entrance animations, measures the header logo
   for the hand-off, and lets any click, key or scroll skip straight in.
   Rendered in the root layout, so it plays on full page loads only. */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

// Stringified into the page, so it must stay self-contained (no imports,
// nothing that compiles to a helper).
function introScript(exitMs: number) {
  const d = document;
  const cl = d.documentElement.classList;
  const root = d.getElementById("hxi");
  const evs = ["pointerdown", "keydown", "wheel", "touchstart"];
  let timers: number[] = [];
  let done = false;
  // Not for reduced motion, nor for a tab opened in the background (it would
  // finish unseen and then hold the page on a static frame). Not on the
  // TOKEN2049 pages either: people land there straight from search, and the
  // ~3 s hold pushed the main text's paint (LCP) to 4.5 s in Lighthouse.
  if (!root || !window.matchMedia || matchMedia("(prefers-reduced-motion: reduce)").matches || d.visibilityState === "hidden") return;
  if (/^\/token2049(\/|$)/.test(location.pathname)) return;
  cl.add("hx-intro");

  function later(fn: () => void, ms: number) {
    timers.push(window.setTimeout(fn, ms));
  }
  function stop() {
    evs.forEach(function (e) {
      removeEventListener(e, skip, true);
    });
    timers.forEach(clearTimeout);
    timers = [];
  }
  function end() {
    stop();
    cl.remove("hx-intro", "hx-intro-out", "hx-intro-go", "hx-intro-land", "hx-intro-skip");
  }
  // FLIP the wordmark box onto the header logo (same 200×40 proportions).
  function flip() {
    const box = root!.querySelector(".hxi-lk");
    const inner = root!.querySelector<HTMLElement>(".hxi-lk-in");
    const logo = d.querySelector(".hx-brand svg");
    if (!box || !inner || !logo) return;
    const a = box.getBoundingClientRect();
    const b = logo.getBoundingClientRect();
    if (!a.width || !b.width) return;
    inner.style.setProperty("--fx", (b.left + b.width / 2 - (a.left + a.width / 2)).toFixed(1) + "px");
    inner.style.setProperty("--fy", (b.top + b.height / 2 - (a.top + a.height / 2)).toFixed(1) + "px");
    inner.style.setProperty("--fs", (b.width / a.width).toFixed(4));
    inner.setAttribute("data-flip", "");
  }
  function exit() {
    if (done) return;
    done = true;
    stop();
    try {
      flip();
    } catch {}
    cl.add("hx-intro-out");
    // Release the page's entrance once the wordmark has cleared the middle.
    later(function () {
      cl.add("hx-intro-go");
    }, 300);
    later(function () {
      cl.add("hx-intro-land");
    }, 980);
    later(end, 1350);
  }
  function skip() {
    if (done) return;
    done = true;
    stop();
    cl.add("hx-intro-skip");
    later(end, 450);
  }
  evs.forEach(function (e) {
    addEventListener(e, skip, { capture: true, passive: true });
  });
  later(exit, exitMs);
}

export default function Intro() {
  return (
    <>
      <div id="hxi" className="hxi" aria-hidden="true">
        <div className="hxi-fx">
          <div className="hxi-cols">
            {COLUMNS.map((c, i) => (
              <div key={i} className="hxi-col" style={{ "--s": `${c.shift}px` } as Vars}>
                {c.rows.map((r, j) => (
                  <p key={j} className="hxi-tx">
                    <span className="hxi-a">{r.from}</span>
                    <span className="hxi-arr">→</span>
                    <span className="hxi-a">{r.to}</span>
                    <span className="hxi-amt">
                      {r.amt} {r.unit}
                    </span>
                    <i className="hxi-ok" style={{ "--d": `${r.d}s` } as Vars} />
                  </p>
                ))}
              </div>
            ))}
          </div>
          <i className="hxi-veil" />
          <div className="hxi-prog">
            <i />
            <span>Processing transactions</span>
          </div>
        </div>

        {/* Wordmark, laid out on the same 200×40 grid as HashXLogo so it can
            fly straight into the header logo's place. */}
        <div className="hxi-lk">
          <div className="hxi-lk-in" suppressHydrationWarning>
            <span className="hxi-g hxi-g-hash">HASH</span>
            <span className="hxi-g hxi-g-x">X</span>
            <span className="hxi-g hxi-g-labs">LABS</span>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `(${introScript.toString()})(${EXIT_MS})` }} />
    </>
  );
}
