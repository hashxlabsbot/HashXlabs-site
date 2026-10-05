"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Client shell for one "Live projects" scene. The scroll choreography is CSS;
 * this only adds what CSS cannot:
 *  - `is-in` once the scene is on screen (types the address bar, starts the
 *    card float),
 *  - a mouse-only tilt of the rig toward the cursor, with a glare that slides
 *    across the browser glass. Both are transform-only and rAF-throttled; the
 *    rig eases back (CSS transition) when the pointer leaves.
 */
export default function LiveStage({ className, children }: { className?: string; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const at = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const parts = () => {
    const el = root.current;
    return { tilt: el?.querySelector<HTMLElement>(".lp-tilt"), glare: el?.querySelector<HTMLElement>(".lp-glare") };
  };

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    at.current = { x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const { tilt, glare } = parts();
      const { x, y } = at.current;
      if (tilt) {
        tilt.classList.add("is-live");
        tilt.style.transform = `rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 13).toFixed(2)}deg)`;
      }
      if (glare) glare.style.transform = `translate(${(x * 70).toFixed(1)}%, ${(y * 70).toFixed(1)}%)`;
    });
  };

  const rest = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    const { tilt, glare } = parts();
    if (tilt) {
      tilt.classList.remove("is-live");
      tilt.style.transform = "";
    }
    if (glare) glare.style.transform = "";
  };

  return (
    <div ref={root} className={className} onPointerMove={move} onPointerLeave={rest}>
      {children}
    </div>
  );
}
