"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/**
 * Client shell for the pinned work tour. The scroll choreography itself is CSS
 * (scroll-driven animations); this only handles what CSS cannot:
 *  - which project is centred (for the progress rail and to make the others
 *    `inert`, so hidden slides can't be tabbed to or clicked),
 *  - the progress rail (click a tick to jump to that project),
 *  - a small pointer-driven lean on the active interface (mouse only).
 */
export default function WorkStage({ count, labels, children }: { count: number; labels: string[]; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLElement | null>(null);
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

  // Which project sits at the viewport's centre line. Sentinels span each
  // project's share of the pin distance (see .wk-sentinel in globals.css).
  useEffect(() => {
    const el = root.current;
    if (!el || !pinned) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    el.querySelectorAll<HTMLElement>(".wk-sentinel").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pinned]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    el.querySelectorAll<HTMLElement>(".wk-slide").forEach((s, i) => s.toggleAttribute("inert", pinned && i !== active));
    tilt.current = el.querySelector<HTMLElement>(`.wk-slide[data-i="${active}"] .wk-tilt`);
    return () => {
      if (tilt.current) tilt.current.style.transform = "";
    };
  }, [pinned, active]);

  const lean = (e: React.PointerEvent) => {
    if (!pinned || e.pointerType !== "mouse") return;
    at.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      if (tilt.current) tilt.current.style.transform = `rotateX(${(-at.current.y * 5).toFixed(2)}deg) rotateY(${(at.current.x * 8).toFixed(2)}deg)`;
    });
  };
  const rest = () => {
    cancelAnimationFrame(raf.current);
    raf.current = 0;
    if (tilt.current) tilt.current.style.transform = "";
  };

  const go = (i: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + ((i + 0.5) / count) * (el.offsetHeight - window.innerHeight), behavior: "smooth" });
  };

  return (
    <div ref={root} className="wk-track" style={{ "--n": count } as CSSProperties}>
      <div className="wk-stage" onPointerMove={lean} onPointerLeave={rest}>
        <div className="wk-bg" aria-hidden="true" />
        <div className="container-x wk-inner">{children}</div>
        <nav className="wk-rail" aria-label="Projects">
          {labels.map((l, i) => (
            <button key={l} type="button" className="wk-tick" aria-current={i === active ? "true" : undefined} aria-label={`Show project ${i + 1}: ${l}`} onClick={() => go(i)}>
              <i />
              <span>{l}</span>
            </button>
          ))}
        </nav>
      </div>
      {labels.map((l, i) => (
        <i key={l} className="wk-sentinel" data-i={i} style={{ "--i": i } as CSSProperties} aria-hidden="true" />
      ))}
      {/* Cover the stretches before and after the pin, so a jump (End key, anchor link) still resolves to the first / last project. */}
      <i className="wk-sentinel wk-sentinel--pre" data-i={0} aria-hidden="true" />
      <i className="wk-sentinel wk-sentinel--post" data-i={count - 1} aria-hidden="true" />
    </div>
  );
}
