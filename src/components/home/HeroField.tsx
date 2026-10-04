"use client";

import { useEffect, useRef } from "react";

/* Mounts the hero's 3D network backdrop (hero-field/field.ts). three.js and
   the scene load only after the page has finished loading, the browser is
   idle and the load intro has cleared, so none of it competes with the
   headline's first paint (LCP) or with hydration. The canvas fades in once
   its first frame is drawn. Without WebGL nothing is shown and the hero's
   CSS grid stays as the background. */

export default function HeroField() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const cv = canvas.current;
    const host = el?.closest<HTMLElement>(".ph");
    if (!el || !cv || !host) return;
    const html = document.documentElement;
    let dispose: (() => void) | undefined;
    let dead = false;
    let idle = 0;
    let mo: MutationObserver | undefined;

    const start = () => {
      import("./hero-field/field").then(({ createField }) => {
        if (dead) return;
        dispose = createField({
          canvas: cv,
          host,
          anchor: host.querySelector<HTMLElement>(".ph-visual"),
          reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
          onReady: () => el.setAttribute("data-ready", ""),
        });
      });
    };
    // Wait for the intro to open (hx-intro-go) or skip, if it is playing.
    const afterIntro = () => {
      const playing = () => html.classList.contains("hx-intro") && !html.classList.contains("hx-intro-go") && !html.classList.contains("hx-intro-skip");
      if (!playing()) return start();
      mo = new MutationObserver(() => {
        if (playing()) return;
        mo?.disconnect();
        start();
      });
      mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    };
    const kick = () => {
      idle = typeof requestIdleCallback === "function" ? requestIdleCallback(afterIntro, { timeout: 1500 }) : window.setTimeout(afterIntro, 300);
    };
    if (document.readyState === "complete") kick();
    else window.addEventListener("load", kick, { once: true });

    return () => {
      dead = true;
      window.removeEventListener("load", kick);
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idle);
      clearTimeout(idle);
      mo?.disconnect();
      dispose?.();
    };
  }, []);

  return (
    <div ref={wrap} className="ph-field" aria-hidden="true">
      <canvas ref={canvas} />
    </div>
  );
}
