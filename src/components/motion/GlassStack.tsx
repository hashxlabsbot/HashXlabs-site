"use client";

import { useEffect, useRef, useState } from "react";
import Scramble from "./Scramble";
import { prefersReducedMotion, useScrollProgress } from "@/lib/useScrollProgress";

const LAYERS = [
  { k: "AI Products", d: "Models wired into real products, with evaluation and guardrails." },
  { k: "Blockchain Protocols", d: "Contracts and mechanisms written against a spec, tested as invariants." },
  { k: "Web3 Solutions", d: "Wallets, dApps and indexers your users actually touch." },
  { k: "Enterprise Integration", d: "Connecting on-chain systems to the stack you already run." },
];

const N = LAYERS.length;
const S = 380; // slab footprint (square)
const H = 62; // slab thickness
const PITCH = 86; // vertical distance between slab centres

// Scroll timeline (0..1 over the pinned section)
const IN_START = 0.04; // bottom slab starts dropping in
const OUT_START = 0.6; // top slab starts lifting off
const STEP = 0.1; // stagger between slabs
const DUR = 0.13; // how long one slab takes
const FLASH = 0.035; // width of the landing flash
const RING = 0.09; // how long the landing shockwave lasts

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIn = (t: number) => t * t * t;
const landAt = (i: number) => IN_START + (N - 1 - i) * STEP + DUR;

/**
 * Pinned 3D section: four glass slabs drop in one by one (bottom first),
 * flash and send a shockwave as they land, charge a light beam when the
 * stack is complete, then lift off one by one (top first). The camera
 * orbits with scroll and tilts toward the pointer. Per-slab progress is
 * written as CSS vars, so there are no React re-renders per frame.
 * Reduced motion shows the built stack, still.
 */
export default function GlassStack({ id = "stack" }: { id?: string }) {
  const slabs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(-1);

  const ref = useScrollProgress<HTMLElement>("pin", (p) => {
    const still = prefersReducedMotion();
    let landed = -1;
    slabs.current.forEach((el, i) => {
      if (!el) return;
      const inT = still ? 1 : clamp01((p - (IN_START + (N - 1 - i) * STEP)) / DUR);
      const outT = still ? 0 : clamp01((p - (OUT_START + i * STEP)) / DUR);
      const since = p - landAt(i);
      el.style.setProperty("--in", easeOut(inT).toFixed(4));
      el.style.setProperty("--out", easeIn(outT).toFixed(4));
      el.style.setProperty("--flash", still ? "0" : Math.max(0, 1 - Math.abs(since) / FLASH).toFixed(3));
      el.style.setProperty("--ring", still || since < 0 || since > RING ? "-1" : (since / RING).toFixed(3));
      // Filters only while a slab is moving or flashing: a resting filter (even
      // blur(0)) keeps every slab on an expensive filtered layer.
      const blur = (1 - easeOut(inT)) * 7 + easeIn(outT) * 12;
      const flash = still ? 0 : Math.max(0, 1 - Math.abs(since) / FLASH);
      const f = blur > 0.05 || flash > 0 ? `blur(${blur.toFixed(2)}px) brightness(${(1 + flash * 0.9).toFixed(3)})` : "none";
      if (el.style.filter !== f) el.style.filter = f;
      if (inT > 0.6 && outT < 0.4 && landed === -1) landed = i; // top-most slab on the stack
    });
    const s = ref.current;
    if (s) {
      const full = still ? 1 : clamp01((p - landAt(0)) / 0.03) * (1 - clamp01((p - OUT_START) / 0.03));
      s.style.setProperty("--full", full.toFixed(3));
      s.style.setProperty("--cam", still ? "0" : ((p - 0.5) * 40).toFixed(2));
    }
    setActive((prev) => (prev === landed ? prev : landed));
  });

  // Pointer tilt, eased toward the target while the section is on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, on = false;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = on ? requestAnimationFrame(tick) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      on = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", move);
    };
  }, [ref]);

  const stageBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stageBox.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      el.style.setProperty("--fit", String(Math.min(1, width / 640, height / 560)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cur = active >= 0 ? LAYERS[active] : null;
  const face = (w: number, h: number, t: string) => ({ width: w, height: h, margin: `${-h / 2}px 0 0 ${-w / 2}px`, transform: t });

  return (
    <section ref={ref} id={id} className="gs feather [--fc:#05060a] relative bg-[#05060a] text-white" style={{ height: "460vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-[var(--header-h)]">
        <div aria-hidden="true" className="gs-sky absolute inset-0" />
        <div aria-hidden="true" className="gs-floor absolute inset-x-0 bottom-0">
          <div className="gs-floor-grid" />
        </div>

        <div aria-hidden="true" className="gs-count absolute inset-0 hidden items-center pl-[3vw] md:flex">
          <span key={active} className="gs-count-n">{active >= 0 ? `0${N - active}` : "00"}</span>
        </div>

        <div className="relative z-20 mx-auto w-full max-w-[1280px] px-5 pt-8 text-center sm:px-8">
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-white/60">{"//"} What we build</span>
          <h2 className="mt-3 text-3xl text-white sm:text-5xl">
            One stack, <span className="gs-grad">four layers.</span>
          </h2>
        </div>

        <div ref={stageBox} className="relative z-10 flex-1" aria-hidden="true">
          <div className="gs-beam absolute left-1/2 top-1/2" />
          <div className="gs-glow absolute left-1/2 top-1/2" />
          <div className="absolute left-1/2 top-1/2" style={{ transform: "scale(var(--fit, 1))" }}>
            {LAYERS.map((l, i) => {
              const y = (i - (N - 1) / 2) * PITCH;
              return (
                <div
                  key={l.k}
                  ref={(el) => {
                    slabs.current[i] = el;
                  }}
                  className="gs-slab absolute left-0"
                  style={{ top: y, perspectiveOrigin: `0 ${-y}px`, ["--i" as string]: i }}
                >
                  <div className="gs-rig">
                    <div className="gs-ring" style={face(S * 1.6, S * 1.6, `rotateX(90deg) translateZ(${-H / 2}px) scale(calc(0.4 + var(--ring, -1) * 1.1))`)} />
                    <div className="gs-face gs-bottom" style={face(S, S, `rotateX(-90deg) translateZ(${H / 2}px)`)} />
                    <div className="gs-face gs-back" style={face(S, H, `rotateY(180deg) translateZ(${S / 2}px)`)} />
                    <div className="gs-face gs-right" style={face(S, H, `rotateY(90deg) translateZ(${S / 2}px)`)} />
                    <div className="gs-face gs-top" style={face(S, S, `rotateX(90deg) translateZ(${H / 2}px)`)} />
                    <div className="gs-face gs-left gs-sheen" style={face(S, H, `rotateY(-90deg) translateZ(${S / 2}px)`)} />
                    <div className="gs-face gs-front gs-sheen" style={face(S, H, `translateZ(${S / 2}px)`)}>
                      <span className="gs-label">{l.k}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <svg aria-hidden="true" className="gs-rocks absolute inset-x-0 bottom-0 z-[5] w-full" viewBox="0 0 1440 260" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gs-rim" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#1c2233" />
              <stop offset="1" stopColor="#0b0d13" />
            </linearGradient>
          </defs>
          <path d="M0 260V120l60-40 40 30 70-90 50 70 40-20 60 80 50 20 60 40 40 50Z" fill="url(#gs-rim)" />
          <path d="M1440 260V90l-50-30-40 40-60-70-60 90-40-10-70 90-60 30-50 60Z" fill="url(#gs-rim)" />
          <path d="M0 260v-60l120-30 140 20 200 20 160 10 240 0 180-10 220-20 180-30v100Z" fill="#07080c" />
        </svg>

        <ol className="gs-rail absolute right-8 top-1/2 z-20 hidden -translate-y-1/2 lg:grid" aria-hidden="true">
          {LAYERS.map((l, i) => (
            <li key={l.k} className={i === active ? "is-on" : active >= 0 && i > active ? "is-in" : ""}>
              <span>0{N - i}</span> {l.k}
            </li>
          ))}
        </ol>

        <div className="relative z-20 mx-auto mb-8 min-h-[3.5rem] w-full max-w-[640px] px-5 text-center sm:px-8">
          {cur && (
            <p key={cur.k} className="animate-fade-in text-sm text-white/75 sm:text-base">
              <b className="text-white">
                <Scramble text={cur.k} />.
              </b>{" "}
              {cur.d}
            </p>
          )}
        </div>

        {/* Screen-reader version of the stack */}
        <ul className="sr-only">
          {LAYERS.map((l) => (
            <li key={l.k}>
              {l.k}: {l.d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
