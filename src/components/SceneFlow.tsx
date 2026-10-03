"use client";

import { useEffect } from "react";

// Makes section changes read as one surface changing in place rather than
// the page scrolling to the next block. Every top-level light section (and
// the footer) is a "scene": while it leaves, its content fades out and lags
// behind scroll; the next one then fades in and settles at reduced speed.
// The two are sequenced on the same scroll variable (the shared edge's
// position), so the old one is gone before the new one appears: content
// changes in place over the fixed page backdrop instead of text stacking.
//
// Solid-colour sections (.feather) are left alone: their colour must stay
// locked to their own background and soft edge fades, and moving their
// full-bleed stage exposes its rectangle.
//
// For pinned sections the scene is their sticky stage (one viewport tall),
// so their own scroll choreography is untouched and we never composite a
// multi-viewport layer. Only `translate` and `opacity` are written (never
// `transform`, which components own), and only when values change.

const K = 0.42; // share of scroll distance a scene's motion is slowed by

function smooth(a: number, b: number, v: number) {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

type Scene = { box: HTMLElement; layer: HTMLElement; first: boolean; last: boolean; solid: boolean; prev: string };

function stickyChild(el: HTMLElement): HTMLElement | null {
  for (const c of Array.from(el.children) as HTMLElement[]) {
    if (getComputedStyle(c).position === "sticky") return c;
  }
  return null;
}

export default function SceneFlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.querySelector("main");
    if (!main) return;

    let scenes: Scene[] = [];
    const collect = () => {
      for (const s of scenes) clear(s.layer);
      const boxes = [...(Array.from(main.children) as HTMLElement[]), ...(Array.from(document.querySelectorAll("body > footer, main + footer")) as HTMLElement[])];
      scenes = boxes
        .filter((b) => b.offsetHeight > 0)
        .map((box, i, all) => ({ box, layer: stickyChild(box) ?? box, first: i === 0, last: i === all.length - 1, solid: box.classList.contains("feather"), prev: "" }));
    };
    const clear = (el: HTMLElement) => {
      el.style.removeProperty("opacity");
      el.style.removeProperty("translate");
      el.style.removeProperty("pointer-events");
    };

    let raf = 0;
    const frame = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (const s of scenes) {
        const r = s.box.getBoundingClientRect();
        if (s.solid || r.bottom < -vh || r.top > 2 * vh) continue;
        let ty = 0;
        let o = 1;
        if (!s.first && r.top > 0) {
          // Entering: e 0 → 1 as the box's top climbs from the fold to the top.
          // Starts only once the previous scene has faded (it uses the same edge).
          const e = Math.min(1, 1 - r.top / vh);
          ty = -Math.min(r.top, vh) * K;
          o = smooth(0.4, 0.85, e);
        } else if (!s.last && r.bottom < vh) {
          // Leaving: l 0 → 1 as the box's bottom climbs from the fold to the top.
          const l = Math.min(1, 1 - Math.max(0, r.bottom) / vh);
          ty = (vh - Math.max(0, r.bottom)) * K;
          o = 1 - smooth(0.05, 0.42, l);
        }
        const v = `${o.toFixed(3)}|${ty.toFixed(1)}`;
        if (v === s.prev) continue;
        s.prev = v;
        if (o === 1 && ty === 0) {
          clear(s.layer);
          continue;
        }
        s.layer.style.opacity = o.toFixed(3);
        s.layer.style.translate = `0 ${ty.toFixed(1)}px`;
        // A faded-out scene can be translated over its neighbour; it must not
        // swallow clicks/taps meant for the visible one underneath.
        s.layer.style.pointerEvents = o < 0.05 ? "none" : "";
      }
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    collect();
    frame();
    // Sections switch between pinned and flow layouts at breakpoints.
    const onResize = () => {
      collect();
      kick();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(main);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      for (const s of scenes) clear(s.layer);
    };
  }, []);

  return null;
}
