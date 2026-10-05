"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Client shell for the pinned "How we work" chain. The choreography is CSS
 * (scroll-driven animations); this only handles what CSS cannot:
 *  - which step is current (for the rail, and `inert` on the hidden steps),
 *  - the rail (click a step to jump to it),
 *  - a mouse-only tilt of the 3D scene.
 */
const SEG = 0.18; // each step's share of the pin; keep in sync with --seg in globals.css

export default function ProcessStage({ count, labels, children }: { count: number; labels: string[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const at = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);

  // Same condition as the pinned block in globals.css.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    const sync = () => setPinned(mq.matches && CSS.supports("animation-timeline", "view()"));
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || !pinned) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    el.querySelectorAll<HTMLElement>(".pc-sentinel").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pinned]);

  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>(".pc-step").forEach((s, i) => s.toggleAttribute("inert", pinned && i !== active));
  }, [pinned, active]);

  const tilt = (e: React.PointerEvent) => {
    if (!pinned || e.pointerType !== "mouse") return;
    at.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const t = root.current?.querySelector<HTMLElement>(".pc-tilt");
      if (t) t.style.transform = `rotateX(${(10 - at.current.y * 8).toFixed(2)}deg) rotateY(${(-12 + at.current.x * 14).toFixed(2)}deg)`;
    });
  };
  const rest = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    const t = root.current?.querySelector<HTMLElement>(".pc-tilt");
    if (t) t.style.transform = "";
  };

  // Land in the middle of the step's hold, where its card is front and centre.
  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (i + 0.5) * SEG * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <div ref={root} className="pc-track" style={{ "--n": count } as CSSProperties}>
      <div className="pc-stage" onPointerMove={tilt} onPointerLeave={rest}>
        <div className="pc-bg" aria-hidden="true">
          <span className="pc-aurora pc-aurora--a" />
          <span className="pc-aurora pc-aurora--b" />
          <span className="pc-dots" />
        </div>
        <div className="container-x pc-inner">{children}</div>
        <nav className="pc-rail" aria-label="Process steps">
          {labels.map((l, i) => (
            <button key={l} type="button" className="pc-tick" aria-current={i === active ? "step" : undefined} onClick={() => go(i)}>
              <i />
              <span>{l}</span>
            </button>
          ))}
        </nav>
      </div>
      {labels.map((l, i) => (
        <i key={l} className="pc-sentinel" data-i={i} style={{ "--i": i } as CSSProperties} aria-hidden="true" />
      ))}
      <i className="pc-sentinel pc-sentinel--pre" data-i={0} aria-hidden="true" />
      <i className="pc-sentinel pc-sentinel--post" data-i={count - 1} aria-hidden="true" />
    </div>
  );
}
