"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Pinned horizontal scroll: while the section is on screen, vertical
 * scrolling moves the track sideways. Falls back to a native swipeable
 * row on small screens and under reduced motion.
 */
export default function HScroll({ head, children }: { head?: ReactNode; children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const set = () => setPinned(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (!pinned) return;
    const o = outer.current;
    const t = track.current;
    if (!o || !t) return;

    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = o.getBoundingClientRect();
      const d = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / d));
      t.style.transform = `translate3d(${-p * (t.scrollWidth - window.innerWidth)}px,0,0)`;
      o.style.setProperty("--p", p.toFixed(4));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [pinned]);

  const pad = "px-5 sm:px-8 lg:px-[max(32px,calc((100vw-1280px)/2+32px))]";

  if (!pinned) {
    return (
      <div className="py-20 sm:py-24">
        {head && <div className="mx-auto mb-10 max-w-[1280px] px-5 sm:px-8">{head}</div>}
        <div className="snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:thin]">
          <div className={`flex w-max gap-4 ${pad}`}>{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={outer} style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-[var(--header-h)]">
        {head && <div className="mx-auto mb-10 w-full max-w-[1280px] px-8">{head}</div>}
        <div ref={track} className={`flex w-max gap-6 will-change-transform ${pad}`}>
          {children}
        </div>
        <div className="mx-auto mt-10 w-full max-w-[1280px] px-8">
          <div className="h-[2px] bg-[var(--line)]">
            <div className="h-full origin-left bg-[var(--signal)]" style={{ transform: "scaleX(var(--p, 0))" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
