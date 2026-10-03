"use client";

import { useEffect, useRef, useState } from "react";

// Pinned scroll flythrough of the stack. Five depth planes (one per layer)
// sit down a z-axis; scrolling moves the camera through them, so each
// layer's tools stream past on a tunnel while a grid floor rushes below.
// The grid tunnel and speed lines are drawn on one 2D canvas: as DOM they
// needed huge 3D layers + masks that exhausted GPU memory and stalled paint.
// Scroll is eased (lerped) for inertia; speed lines follow scroll velocity.
// Reduced motion gets a static layer grid instead.

const LAYERS: { k: string; items: string[] }[] = [
  { k: "Languages", items: ["Solidity", "Rust", "Anchor", "TypeScript", "Python"] },
  { k: "Security", items: ["Foundry", "Echidna", "Slither", "OpenZeppelin", "Invariant suites", "Fork tests"] },
  { k: "Standards", items: ["ERC-4626", "ERC-3643", "ERC-4337", "ERC-20", "Token-2022"] },
  { k: "Cross-chain", items: ["LayerZero", "Chainlink", "CCIP", "Wormhole", "Safe"] },
  { k: "Product", items: ["Next.js", "React Native", "Node", "PostgreSQL", "AWS KMS", "pgvector"] },
];
const N = LAYERS.length;
const TOOLS = LAYERS.reduce((n, l) => n + l.items.length, 0);

const GAP = 1500; // z distance between planes
const START = 350; // plane 0's distance from the camera at p = 0
const TRAVEL = START + N * GAP + 1400; // total camera travel over the pin
const P = 900; // perspective
const GRID = 140; // tunnel grid cell, px
const FAR = 7000; // tunnel draw distance

function clamp(v: number, a = 0, b = 1) {
  return Math.min(b, Math.max(a, v));
}

export default function StackWarp() {
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const planes = useRef<(HTMLDivElement | null)[]>([]);
  const finale = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    const st = stage.current;
    if (!el || !st) return;

    let raf = 0;
    let running = false;
    let smooth = -1;
    let vel = 0;
    let lastActive = -1;

    // Tunnel canvas
    const cv = canvas.current;
    const ctx = cv?.getContext("2d") ?? null;
    let W = 0;
    let H = 0;
    let top = 0; // header height: the tunnel is centred in the area below it
    const size = () => {
      if (!cv || !ctx) return;
      top = st.querySelector<HTMLElement>(".sw-world")?.offsetTop ?? 0;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (cam: number, v: number, p: number) => {
      if (!ctx || !W) return;
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = top + (H - top) / 2;
      const zN = P - 40;
      const sN = P / (P - zN);
      const sF = P / (P + FAR);
      const off = cam % GRID;
      // Grid fades with distance: full at the camera, half by 2100px, gone by 4300px.
      const fade = (z: number) => (z > -2100 ? 1 - (-Math.min(0, z) / 2100) * 0.5 : Math.max(0, 0.5 * (1 - (-z - 2100) / 2200)));
      ctx.lineWidth = 2;
      for (const [Y, k] of [[(H - top) / 2, 1], [-(H - top) / 2, 0.4]] as const) {
        const yAt = (z: number) => cy + (Y * P) / (P - z);
        const g = ctx.createLinearGradient(0, yAt(zN), 0, yAt(-4300));
        const a = 0.34 * k;
        // Screen y is non-linear in z, so place stops at the projected depths.
        const span = yAt(-4300) - yAt(zN);
        for (const z of [zN, 0, -1000, -2100, -3200, -4300]) {
          g.addColorStop(clamp((yAt(z) - yAt(zN)) / span), `rgba(0,87,217,${(a * fade(z)).toFixed(3)})`);
        }
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const n = Math.ceil((W * 2.5) / GRID);
        for (let j = -n; j <= n; j++) {
          const X = j * GRID;
          ctx.moveTo(cx + X * sN, cy + Y * sN);
          ctx.lineTo(cx + X * sF, cy + Y * sF);
        }
        ctx.stroke();
        for (let z = off; z > -4300; z -= GRID) {
          if (z > zN) continue;
          // Lines thin with depth like a real textured plane; sub-pixel ones fade instead.
          const w = (2 * P) / (P - z);
          ctx.lineWidth = Math.max(1, w);
          ctx.strokeStyle = `rgba(0,87,217,${(a * fade(z) * Math.min(1, w)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(0, yAt(z));
          ctx.lineTo(W, yAt(z));
          ctx.stroke();
        }
      }
      // Speed rays: thin wedges from the vanishing point, strongest mid-radius.
      if (v > 0.01) {
        const R = Math.max(W, H) * 0.8 * (1 + v * 0.25);
        const rot = p * Math.PI * 0.5;
        const D = Math.PI / 180;
        ctx.globalAlpha = Math.min(1, v * 0.9);
        for (const [start, width, rgb, al] of [
          [3.1, 0.2, "0,87,217", 0.5],
          [7, 0.12, "11,18,32", 0.28],
        ] as const) {
          const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
          rg.addColorStop(0, `rgba(${rgb},0)`);
          rg.addColorStop(0.14, `rgba(${rgb},0)`);
          rg.addColorStop(0.4, `rgba(${rgb},${al})`);
          rg.addColorStop(1, `rgba(${rgb},0)`);
          ctx.fillStyle = rg;
          ctx.beginPath();
          for (let b = 0; b < 360; b += 11) {
            const a0 = (b + start) * D + rot;
            const a1 = a0 + width * D;
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a0) * R, cy + Math.sin(a0) * R);
            ctx.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R);
            ctx.closePath();
          }
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      // Erase toward the top edge so the tunnel rises out of the page backdrop
      // (and out from under the hero's cards) instead of starting at a line.
      const fadeTo = top + (H - top) * 0.32;
      const eg = ctx.createLinearGradient(0, 0, 0, fadeTo);
      eg.addColorStop(0, "rgba(0,0,0,1)");
      eg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = eg;
      ctx.fillRect(0, 0, W, fadeTo);
      ctx.globalCompositeOperation = "source-over";
    };

    const target = () => {
      const r = el.getBoundingClientRect();
      return clamp(-r.top / Math.max(1, r.height - window.innerHeight));
    };

    // Only touch the DOM when a value actually changes: every style write
    // costs a restyle, and custom properties on a parent restyle its subtree.
    const written = new WeakMap<HTMLElement, Record<string, string>>();
    const put = (node: HTMLElement | null, prop: "opacity" | "transform" | "visibility" | "pointerEvents", v: string) => {
      if (!node) return;
      let cache = written.get(node);
      if (!cache) written.set(node, (cache = {}));
      if (cache[prop] === v) return;
      cache[prop] = v;
      node.style[prop] = v;
    };
    const titles = planes.current.map((pl) => pl?.querySelector<HTMLElement>(".sw-title") ?? null);
    const hint = st.querySelector<HTMLElement>(".sw-hud-scroll");
    const bar = st.querySelector<HTMLElement>(".sw-bar i");
    let prevT = 0;

    const frame = (now: number) => {
      // Frame-rate independent easing, so 120Hz screens glide the same as 60Hz.
      const dt = prevT ? Math.min(64, now - prevT) : 16.7;
      prevT = now;
      const k = 1 - Math.pow(1 - 0.1, dt / 16.7);
      const p = target();
      if (smooth < 0) smooth = p;
      const d = p - smooth;
      smooth += d * k;
      vel += (clamp(Math.abs(d) * 40) - vel) * (1 - Math.pow(1 - 0.16, dt / 16.7));

      const cam = smooth * TRAVEL;
      put(bar, "transform", `scaleX(${smooth.toFixed(4)})`);
      put(hint, "opacity", clamp(1 - smooth * 8).toFixed(2));
      draw(cam, vel, smooth);

      // The HUD names the layer that is on screen: the last plane that has
      // fully faded in (z > -1000). Planes pass the camera before the next
      // one gets there, so this never points at a layer that has flown by.
      let act = 0;
      for (let i = 0; i < N; i++) {
        const pl = planes.current[i];
        if (!pl) continue;
        const z = cam - START - i * GAP;
        if (z > -1050) act = i;
        const fadeIn = clamp((z + 2100) / 1100);
        // Fade out while passing the camera (gone at ~2x scale) so the passing layer
        // never crowds the next one; replaces the old per-frame blur, which forced
        // every pill to re-rasterise each frame.
        const fadeOut = clamp((470 - z) / 380);
        const o = fadeIn * fadeOut;
        if (o <= 0.001) {
          put(pl, "visibility", "hidden");
          continue;
        }
        put(pl, "visibility", "visible");
        put(pl, "opacity", o.toFixed(3));
        put(titles[i], "opacity", (clamp((z + 1000) / 600) * clamp((320 - z) / 300)).toFixed(3));
        pl.style.transform = `translate3d(0,0,${z.toFixed(1)}px) rotateZ(${(z * 0.004).toFixed(2)}deg)`;
      }

      const fin = finale.current;
      if (fin) {
        const z = Math.min(0, cam - START - N * GAP - 600);
        const o = clamp((z + 2600) / 1600);
        put(fin, "opacity", o.toFixed(3));
        put(fin, "visibility", o > 0.001 ? "visible" : "hidden");
        put(fin, "transform", `translate3d(0,0,${z.toFixed(1)}px)`);
        put(fin, "pointerEvents", o > 0.9 ? "auto" : "none");
        if (o > 0.5) act = N;
      }

      if (act !== lastActive) {
        lastActive = act;
        setActive(act);
      }

      if (running && (Math.abs(p - smooth) > 0.00005 || vel > 0.002)) raf = requestAnimationFrame(frame);
      else {
        raf = 0;
        prevT = 0;
      }
    };

    const kick = () => {
      if (running && !raf) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      kick();
    });
    io.observe(el);
    const ro = new ResizeObserver(() => {
      size();
      smooth = -1;
      kick();
    });
    if (cv) ro.observe(cv);
    size();
    running = true;
    frame(performance.now());
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section aria-labelledby="sw-h" className="border-y border-[var(--line)] bg-[var(--bg-raise)] py-20">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--signal)]">{"//"} The stack</span>
          <h2 id="sw-h" className="mt-4 text-3xl sm:text-5xl">From opcode to app store.</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {LAYERS.map((l, i) => (
              <div key={l.k}>
                <span className="mono text-[11px] text-[var(--t-lo)]">Layer 0{i + 1}</span>
                <h3 className="mt-1 text-xl">{l.k}</h3>
                <ul className="mt-3 space-y-1 text-[var(--t-mid)]">
                  {l.items.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const label = active < N ? LAYERS[active].k : "Full stack";

  return (
    <section ref={root} aria-labelledby="sw-h" className="sw" style={{ height: "560vh" }}>
      <div ref={stage} className="sw-stage">
        <div className="sw-glow" aria-hidden="true" />
        <canvas ref={canvas} className="sw-tunnel" aria-hidden="true" />

        <div className="sw-world">
          {LAYERS.map((l, i) => (
            <div
              key={l.k}
              ref={(el) => {
                planes.current[i] = el;
              }}
              className="sw-plane"
              style={{ visibility: "hidden" }}
            >
              <div className="sw-title">
                <span>
                  Layer 0{i + 1} / 0{N}
                </span>
                <b>{l.k}</b>
              </div>
              {l.items.map((t, j) => {
                const a = (j / l.items.length) * Math.PI * 2 + i * 0.7 + 0.35;
                const r = j % 2 ? 1 : 0.84;
                return (
                  <span
                    key={t}
                    className={`sw-item${(i + j) % 2 ? " is-out" : ""}`}
                    style={{
                      left: `calc(50% + ${(Math.cos(a) * r).toFixed(3)} * var(--rx))`,
                      top: `calc(50% + ${(Math.sin(a) * r).toFixed(3)} * var(--ry))`,
                    }}
                  >
                    <i aria-hidden="true" />
                    {t}
                  </span>
                );
              })}
            </div>
          ))}

          <div ref={finale} className="sw-plane sw-finale" style={{ visibility: "hidden" }}>
            <span className="sw-kicker">
              {N} layers · {TOOLS} tools · one delivery path
            </span>
            <h2 id="sw-h">
              From opcode
              <br />
              <em>to app store.</em>
            </h2>
            <a href="/services" className="sw-cta">
              See what we build <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        <div className="sw-hud" aria-hidden="true">
          <div className="sw-hud-top">
            <span>{"//"} The stack</span>
            <div className="sw-ticks">
              {LAYERS.map((l, i) => (
                <span key={l.k} className={i < active ? "done" : i === active ? "on" : ""} />
              ))}
            </div>
          </div>
          <div className="sw-hud-bot">
            <div key={active} className="sw-hud-now">
              <u>{active < N ? `0${active + 1} / 0${N}` : "Done"}</u>
              <b>{label}</b>
            </div>
          </div>
          <span className="sw-hud-scroll">Scroll to fly through ↓</span>
          <div className="sw-bar">
            <i />
          </div>
        </div>
      </div>
    </section>
  );
}
