"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CREATIVES } from "./hero/RingCards";
import CardDetail from "./hero/CardDetail";
import { RING_DETAILS } from "@/content/ringDetails";

// Light full-viewport hero. The desktop composition is authored on a fixed
// 1172×657 design canvas, every element absolutely positioned in design px, and
// the whole canvas is scaled by one transform. Phones (≤700px) get a real flow
// column instead. The site navbar sits above the canvas, so the canvas is
// offset to put design y=67 (the old nav-pill foot) right under the header.

const CW = 1172; // design canvas width
const CH = 657; // design canvas height
const NAV_FOOT = 67; // design y that should meet the bottom of the site header
const FOOT = 792; // design y of the ring cards' foot (card bottom 766 + shadow); the hero always shows it
const K_MIN = 0.8; // below this the type gets too small, so the hero grows past the viewport instead
const TAB_MAX = 1080;
const TAB_MIN = 701;
const DW_MIN = 920;

// 3D ring
const R = 891;
const N = 37;
const STEP = 360 / N;
const CULL = 42;
const SPEED = 1.9; // deg/s

// Scroll bend: the hero pins for 80vh of scroll (.hx-pin). The copy leaves
// first (fully gone before anything moves toward it), then the ring's curve
// flips from a smile (camera below: perspective-origin y 918) through flat
// (y 466, the card centre line) to an arch (y 14) while it rises to the centre
// of the space the copy vacated. The next section is pulled up (--hx-blank)
// over the strip the rise leaves under the cards, so there is no blank band.
const PO_FROM = 918;
const PO_TO = 14;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function Hero() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeTxtRef = useRef<HTMLElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  // Card detail: hover (mouse) or tap opens it; the ring eases to a stop while open.
  const [hot, setHot] = useState<{ i: number; rect: DOMRect } | null>(null);
  const paused = useRef(false);
  const openT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const open = useCallback((i: number, el: HTMLElement) => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
    paused.current = true;
    setHot({ i, rect: el.getBoundingClientRect() });
  }, []);
  const close = useCallback(() => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
    paused.current = false;
    setHot(null);
  }, []);
  const keep = useCallback(() => clearTimeout(closeT.current), []);
  const leave = useCallback(() => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
    closeT.current = setTimeout(close, 180);
  }, [close]);
  const dragging = useRef(false);
  const hoverIn = (i: number, el: HTMLElement) => {
    if (dragging.current) return;
    clearTimeout(closeT.current);
    clearTimeout(openT.current);
    // Small intent delay so sweeping the cursor across the ring doesn't flicker
    // panels; switching between cards while one is open is instant.
    if (hot) open(i, el);
    else openT.current = setTimeout(() => open(i, el), 110);
  };

  // While open: close on scroll, Escape, or a tap outside the panel and cards.
  useEffect(() => {
    if (!hot) return;
    const y0 = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - y0) > 24) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest(".cd, .hx-card")) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [hot, close]);
  useEffect(() => () => {
    clearTimeout(openT.current);
    clearTimeout(closeT.current);
  }, []);
  const riseRef = useRef(0); // design px the ring rises during the pin, set by layout()

  // Scale law + tablet ramp + badge sizing.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const px = (name: string) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0;

    const layout = () => {
      const vw = stage.clientWidth;
      const vh = window.innerHeight;
      const s = canvas.style;
      const badge = badgeRef.current;
      const txt = badgeTxtRef.current;

      if (vw <= 700) {
        for (const v of ["--k", "--fill", "--stshift", "--sshift", "--rs"]) s.removeProperty(v);
        s.removeProperty("top");
        stage.style.removeProperty("height");
        pinRef.current?.style.removeProperty("--hx-h");
        pinRef.current?.style.removeProperty("--hx-blank");
        riseRef.current = 0;
        if (badge) {
          badge.style.removeProperty("width");
          badge.style.removeProperty("left");
        }
        return;
      }

      const header = px("--bar-h") + px("--nav-h");
      const tablet = vw <= TAB_MAX;
      let W = CW;
      if (tablet) {
        W = DW_MIN + ((vw - TAB_MIN) * (CW - DW_MIN)) / (TAB_MAX - TAB_MIN);
        if (vh > vw * 1.15) W = Math.min(W, 900);
      }
      const k = Math.min(vw / W, Math.max((vh - header) / (FOOT - NAV_FOOT), K_MIN));
      const top = header - NAV_FOOT * k;
      let fill = Math.max(0, (vh - top) / k - CH);
      let ss = 0;
      let rs = 1;
      let st = 0;
      if (tablet && fill > 0) {
        const ramp = Math.min(1, (TAB_MAX - vw) / 120);
        ss = Math.min(fill * 0.55, 420) * ramp;
        rs = 1 + Math.min(fill / 1100, 0.75) * ramp;
        const slack = 219.5 - 125 * rs + ss;
        st = Math.max(0, slack / 2 - 28) * ramp;
        fill -= ss;
      }
      s.setProperty("--k", String(k));
      s.setProperty("--fill", `${fill}px`);
      s.setProperty("--stshift", `${st}px`);
      s.setProperty("--sshift", `${ss}px`);
      s.setProperty("--rs", String(rs));
      s.top = `${top}px`;

      // Size the stage so the full cards sit inside it, never cut by the fold.
      const foot = tablet ? 595 + (FOOT - 595) * rs + ss : FOOT;
      const stageH = Math.max(vh, Math.ceil(top + foot * k));
      stage.style.height = `${stageH}px`;
      pinRef.current?.style.setProperty("--hx-h", `${stageH}px`);

      // Rise: once the copy has gone, centre the final arch in the visible area
      // under the header. In the arch the side cards sag below the centre ones:
      // a card at angle a sits R(1-cos a) nearer the camera, so with
      // perspective = R it scales by 1/cos a about the perspective origin
      // (PO_TO). The lowest visible card is the one at the viewport edge.
      // What the rise leaves under the cards is overlapped by the next section.
      const aEdge = Math.min(Math.atan(vw / k / 2 / R), (CULL * Math.PI) / 180);
      const sag = PO_TO + (766 - PO_TO) / Math.cos(aEdge) + 26;
      const toStage = (y: number) => (tablet ? 595 + (y - 595) * rs + ss : y);
      const lowest = Math.max(foot, toStage(sag));
      const archMid = (toStage(466) + lowest) / 2;
      const rise = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : Math.max(0, Math.min(archMid - (NAV_FOOT + (vh - top) / k) / 2, toStage(466) - NAV_FOOT - 40));
      riseRef.current = rise;
      const blank = stageH - top - (lowest - rise) * k - 12;
      // Plus the next section's own header strip: with one shared backdrop there
      // is no seam to hide, so its (faded-in) top edge can slide under the cards.
      pinRef.current?.style.setProperty("--hx-blank", `${Math.max(0, Math.round(blank + header))}px`);

      // Badge: tile pinned left, label starts at 45px; box sized to the label, centred on x=586.
      if (badge && txt) {
        const w = Math.round(45 + txt.offsetWidth + 15);
        badge.style.width = `${w}px`;
        badge.style.left = `${586 - w / 2}px`;
      }
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(stage);
    window.addEventListener("resize", layout);
    document.fonts?.ready.then(layout);
    const t = setTimeout(layout, 600);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", layout);
      clearTimeout(t);
    };
  }, []);

  // Ring: cards tangent to a cylinder, camera at its centre. The ring has
  // momentum: scrolling and dragging fling it, and it eases back to its idle
  // drift. All easing is time-based (1 - e^-rate·dt), so it feels the same at
  // 60 and 120 Hz. Only transform / opacity / perspective-origin are written.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stage = stageRef.current;
    let phase = -2;
    let vel = -SPEED; // deg/s, eases back to -SPEED (or 0 while a detail is open)
    let last = 0;
    let raf = 0;
    let visible = true;
    let sp = 0; // eased scroll progress through the pin, 0..1
    let lastY = window.scrollY;
    // Cursor camera drift (mouse only), eased.
    let mx = 0, my = 0, ex = 0, ey = 0;
    let drawnPO = "";
    let drawnRise = "";
    let drawnFade = -1;

    const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

    // Scroll bend + lift + camera drift.
    const bend = (dt: number) => {
      const pin = pinRef.current;
      if (!pin || !stage) return;
      const extra = pin.offsetHeight - stage.offsetHeight;
      const target = extra > 0 && !reduce.matches ? Math.min(1, Math.max(0, -pin.getBoundingClientRect().top / extra)) : 0;
      sp += (target - sp) * ease(9, dt);
      if (Math.abs(target - sp) < 0.0005) sp = target;
      ex += (mx - ex) * ease(2.6, dt);
      ey += (my - ey) * ease(2.6, dt);
      // Copy is fully gone by 0.25; only then does the ring start to move.
      const fade = smooth(0, 0.25, sp);
      const b = smooth(0.22, 0.8, sp);
      // Rise completes before the next section's top edge comes into view.
      const rise = smooth(0.22, 0.65, sp);
      const ring = ringRef.current;
      const stack = stackRef.current;
      if (ring) {
        const po = `${(586 - ex * 64).toFixed(1)}px ${(PO_FROM + (PO_TO - PO_FROM) * b - ey * 26).toFixed(1)}px`;
        if (po !== drawnPO) ring.style.perspectiveOrigin = drawnPO = po;
        const r = `0 ${(-rise * riseRef.current).toFixed(1)}px`;
        if (r !== drawnRise) ring.style.translate = drawnRise = r;
      }
      if (stack && Math.abs(fade - drawnFade) > 0.0002) {
        drawnFade = fade;
        stack.style.opacity = (1 - fade).toFixed(3);
        stack.style.translate = `0 ${(-fade * 90).toFixed(1)}px`;
        stack.style.visibility = fade > 0.999 ? "hidden" : "visible";
      }
    };

    const place = () => {
      for (let i = 0; i < N; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const a = ((((i * STEP + phase) % 360) + 540) % 360) - 180;
        if (Math.abs(a) > CULL) {
          if (el.style.visibility !== "hidden") el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";
        const r = (a * Math.PI) / 180;
        const c = Math.cos(r);
        el.style.transform = `translate3d(${(R * Math.sin(r)).toFixed(2)}px,0,${(R * (1 - c)).toFixed(2)}px) rotateY(${-a}deg)`;
        // Side cards catch more light. A white overlay's opacity (compositor-only)
        // instead of filter: brightness(), which repainted every card every frame.
        const shine = el.firstElementChild as HTMLElement | null;
        if (shine) shine.style.opacity = Math.min(0.14, 0.3 * (1 / c - 1)).toFixed(3);
        // Specular sheen: a soft light band slides across the glass as the card turns past the camera.
        const gloss = shine?.nextElementSibling as HTMLElement | null;
        if (gloss) gloss.style.translate = `${(-a * 4.2).toFixed(1)}% 0`;
      }
    };

    // ── Drag to spin (mouse, pen and sideways touch swipes) ──
    let drag: { id: number; x: number; t: number; moved: boolean; v: number } | null = null;
    const degPerPx = () => {
      const k = parseFloat(canvasRef.current?.style.getPropertyValue("--k") || "") || 1;
      const rs = parseFloat(canvasRef.current?.style.getPropertyValue("--rs") || "") || 1;
      return 180 / Math.PI / (R * k * rs);
    };
    const onDown = (e: PointerEvent) => {
      if (reduce.matches || e.button !== 0 || !(e.target as Element).closest(".hx-card")) return;
      drag = { id: e.pointerId, x: e.clientX, t: e.timeStamp, moved: false, v: 0 };
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && stage) {
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
      }
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return;
        drag.moved = true;
        dragging.current = true;
        close();
        stage?.classList.add("is-drag");
      }
      const dt = Math.max(1, e.timeStamp - drag.t) / 1000;
      const d = dx * degPerPx();
      phase += d;
      // Smoothed release velocity, clamped so a hard flick still reads as a spin, not a blur.
      drag.v += (Math.max(-160, Math.min(160, d / dt)) - drag.v) * 0.35;
      drag.x = e.clientX;
      drag.t = e.timeStamp;
    };
    const onUp = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (drag.moved) {
        vel = e.timeStamp - drag.t > 90 ? vel * 0.2 : drag.v; // held still before letting go = no fling
        stage?.classList.remove("is-drag");
        // Swallow the click that ends a drag, so it doesn't open a card.
        const eat = (c: Event) => {
          c.stopPropagation();
          c.preventDefault();
        };
        window.addEventListener("click", eat, { capture: true, once: true });
        setTimeout(() => window.removeEventListener("click", eat, { capture: true }), 0);
      }
      dragging.current = false;
      drag = null;
    };

    const tick = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.1) : 0;
      last = t;
      if (!reduce.matches && visible) {
        // Scrolling flings the ring the same way the page moves.
        const y = window.scrollY;
        const dy = y - lastY;
        lastY = y;
        if (!drag?.moved && Math.abs(dy) < 400) vel = Math.max(-48, Math.min(48, vel - dy * 0.35));
        if (!drag?.moved) {
          vel += ((paused.current ? 0 : -SPEED) - vel) * ease(paused.current ? 8 : 1.5, dt);
          phase += vel * dt;
        }
        place();
      }
      if (visible) bend(dt);
      // Fully idle (no rAF at all) while the hero is off screen.
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    place();
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      last = 0;
      lastY = window.scrollY;
    };
    document.addEventListener("visibilitychange", onVis);
    stage?.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    // Stop animating when the hero is scrolled out of view.
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = 0;
      lastY = window.scrollY;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    if (stage) io.observe(stage);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      stage?.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      io.disconnect();
    };
  }, [close]);

  return (
    <div ref={pinRef} className="hx-pin">
    <section ref={stageRef} className="hx-stage" aria-labelledby="hx-title">
      <div className="hx-bgfx" aria-hidden="true" />

      <div ref={canvasRef} className="hx-canvas">
        <div ref={stackRef} className="hx-stack">
          <div ref={badgeRef} className="hx-badge hx-a">
            <i aria-hidden="true">
              <svg viewBox="5 1 14 22" preserveAspectRatio="none">
                <path
                  d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
                  fill="#fff"
                  stroke="rgba(255,255,255,.85)"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </i>
            <b ref={badgeTxtRef}>Blockchain engineering, security-first</b>
          </div>

          <h1 id="hx-title" className="hx-h1wrap">
            <span className="hx-h1 hx-l1 hx-a hx-wipe">Smart contracts that</span>{" "}
            <span className="hx-h1 hx-l2 hx-a hx-wipe">hold up.</span>
          </h1>

          <p className="hx-subwrap">
            <span className="hx-sub hx-s1 hx-a">
              <b>
                DeFi / RWA / Custody / <span className="whitespace-nowrap">Cross-chain</span>
              </b>{" "}
              engineered with
            </span>{" "}
            <span className="hx-sub hx-s2 hx-a">formal specs, invariant fuzzing and a clean path to mainnet.</span>
          </p>

          <a href="/contact" className="hx-btn hx-cta2 hx-a">
            <span>Start a project</span>
          </a>
        </div>

        <div className="hx-showcase">
          <div ref={ringRef} className={`hx-ring hx-a${hot ? " has-hot" : ""}`} aria-hidden="true">
            {Array.from({ length: N }, (_, i) => {
              const Creative = CREATIVES[i % CREATIVES.length];
              return (
                <div
                  key={i}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className={`hx-card${hot?.i === i ? " is-hot" : ""}`}
                  style={{ visibility: "hidden" }}
                  onPointerEnter={(e) => e.pointerType === "mouse" && hoverIn(i, e.currentTarget)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && leave()}
                  onClick={(e) => (hot?.i === i ? close() : open(i, e.currentTarget))}
                >
                  <div className="hx-shine" />
                  <div className="hx-gloss" />
                  <Creative />
                  <div className="hx-edge" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
    {hot && (
      <CardDetail
        key={hot.i % RING_DETAILS.length}
        d={RING_DETAILS[hot.i % RING_DETAILS.length]}
        n={hot.i % RING_DETAILS.length}
        total={RING_DETAILS.length}
        rect={hot.rect}
        onEnter={keep}
        onLeave={leave}
        onClose={close}
      />
    )}
    </div>
  );
}
