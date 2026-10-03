import type { CSSProperties } from "react";
import { CUBES, EXIT_MS, HASHES, HASH_REELS, LABS_REELS, LINKS, NODES, PACKETS, PULSE_START, REEL_EASE, type Reel } from "./scene";

/* Load intro, "genesis block". A network boots outward from the centre, 13
   isometric blocks fly in out of it and lock into the logo's X, a validation
   pulse runs down the chain, the X shrinks into the wordmark while HASH and
   LABS decode from hex, then the screen cracks along the X and the wordmark
   flies into the header logo's place.

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

function ReelText({ reels }: { reels: Reel[] }) {
  return reels.map((r, i) => (
    <span key={i} className="hxi-rl" style={{ "--d": `${r.d}s` } as Vars}>
      <span className="hxi-rl-sz">{r.ch}</span>
      <span className="hxi-rl-strip">
        {r.strip.map((c, j) => (
          <span key={j} className="hxi-rl-hex">
            {c}
          </span>
        ))}
        <span>{r.ch}</span>
      </span>
    </span>
  ));
}

export default function Intro() {
  return (
    <>
      <div id="hxi" className="hxi" aria-hidden="true" style={{ "--reel-ease": REEL_EASE } as Vars}>
        <svg className="hxi-defs" width="0" height="0" focusable="false">
          <defs>
            <linearGradient id="hxi-top" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#e2f4ff" />
              <stop offset="1" stopColor="#68bcff" />
            </linearGradient>
            <linearGradient id="hxi-left" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2d9bff" />
              <stop offset="1" stopColor="#0a5ee4" />
            </linearGradient>
            <linearGradient id="hxi-right" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0a4fc8" />
              <stop offset="1" stopColor="#062a78" />
            </linearGradient>
            <symbol id="hxi-cube" viewBox="-0.87 -1 1.74 2">
              <polygon points="0,0 -0.814,-0.47 0,-0.94 0.814,-0.47" fill="url(#hxi-top)" />
              <polygon points="0,0 -0.814,-0.47 -0.814,0.47 0,0.94" fill="url(#hxi-left)" />
              <polygon points="0,0 0.814,-0.47 0.814,0.47 0,0.94" fill="url(#hxi-right)" />
              <path
                d="M0 -0.94 L0.814 -0.47 L0.814 0.47 L0 0.94 L-0.814 0.47 L-0.814 -0.47 Z M0 0 L0 0.94 M0 0 L-0.814 -0.47 M0 0 L0.814 -0.47"
                fill="none"
                stroke="#bfe6ff"
                strokeOpacity=".7"
                strokeWidth=".035"
                strokeLinejoin="round"
              />
            </symbol>
            <symbol id="hxi-hex" viewBox="-0.87 -1 1.74 2">
              <polygon points="0,-0.94 0.814,-0.47 0.814,0.47 0,0.94 -0.814,0.47 -0.814,-0.47" />
            </symbol>
          </defs>
        </svg>

        {/* Four shards meeting along the X's diagonals; they part on exit. */}
        <i className="hxi-sh hxi-sh-t" />
        <i className="hxi-sh hxi-sh-r" />
        <i className="hxi-sh hxi-sh-b" />
        <i className="hxi-sh hxi-sh-l" />

        {/* Everything decorative fades as one layer on exit. */}
        <div className="hxi-fx">
          <i className="hxi-glow" />

          <div className="hxi-net">
            {LINKS.map((l, i) => (
              <i
                key={`l${i}`}
                className="hxi-l"
                style={{ left: `${l.x}%`, top: `${l.y}%`, width: `${l.len}%`, rotate: `${l.deg}deg`, "--d": `${l.d}s` } as Vars}
              >
                {PACKETS.filter((p) => p.link === i).map((p) => (
                  <b key={p.link} className="hxi-p" style={{ "--d": `${p.d}s`, "--t": `${p.t}s` } as Vars} />
                ))}
              </i>
            ))}
            {NODES.map((n, i) => (
              <i key={`n${i}`} className={`hxi-n${n.big ? " is-big" : ""}`} style={{ left: `${n.x}%`, top: `${n.y}%`, "--d": `${n.d}s` } as Vars} />
            ))}
            {HASHES.map((t, i) => (
              <span key={`h${i}`} className="hxi-hash" style={{ left: `${t.x}%`, top: `${t.y}%`, "--d": `${t.d}s` } as Vars}>
                {t.text}
              </span>
            ))}
          </div>

          <div className="hxi-x" style={{ "--pulse": `${PULSE_START}s` } as Vars}>
            {CUBES.map((c, i) => (
              <div
                key={i}
                className="hxi-cube"
                style={
                  {
                    "--x": c.x,
                    "--y": c.y,
                    "--d": `${c.d}s`,
                    "--fx": `${c.fx}vmin`,
                    "--fy": `${c.fy}vmin`,
                    "--fr": `${c.fr}deg`,
                    "--i": i,
                    zIndex: c.z,
                  } as Vars
                }
              >
                <svg className="hxi-ring" focusable="false">
                  <use href="#hxi-hex" />
                </svg>
                <svg focusable="false">
                  <use href="#hxi-cube" />
                </svg>
                <svg className="hxi-flash" focusable="false">
                  <use href="#hxi-hex" />
                </svg>
              </div>
            ))}
          </div>

          <i className="hxi-burst" />
          <svg className="hxi-wave" focusable="false">
            <use href="#hxi-hex" />
          </svg>
          <i className="hxi-xglow" />

          <div className="hxi-tag">
            <span>Blockchain &amp; AI engineering</span>
            <i />
          </div>
        </div>

        {/* Wordmark, laid out on the same 200×40 grid as HashXLogo so it can
            fly straight into the header logo's place. */}
        <div className="hxi-lk">
          <div className="hxi-lk-in" suppressHydrationWarning>
            <span className="hxi-g hxi-g-hash">
              <ReelText reels={HASH_REELS} />
            </span>
            <span className="hxi-g hxi-g-x">X</span>
            <span className="hxi-g hxi-g-labs">
              <ReelText reels={LABS_REELS} />
            </span>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `(${introScript.toString()})(${EXIT_MS})` }} />
    </>
  );
}
