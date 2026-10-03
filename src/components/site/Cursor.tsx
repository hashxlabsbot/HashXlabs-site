"use client";

import { useEffect, useRef } from "react";

/* A ring that eases after the cursor and grows over anything clickable.
   Desktop mouse only (hover + fine pointer), never under reduced motion.
   The native cursor stays, so nothing about pointing changes. The rAF loop
   runs only while the ring is catching up. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = -100;
    let y = -100;
    let tx = -100;
    let ty = -100;
    let raf = 0;

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!el.classList.contains("on")) {
        x = tx;
        y = ty;
        el.classList.add("on");
      }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      el.classList.toggle("big", !!t?.closest("a, button, [role=tab], input, textarea, select, label, summary"));
    };
    const onDown = () => el.classList.add("down");
    const onUp = () => el.classList.remove("down");
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) el.classList.remove("on");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-ring" aria-hidden="true">
      <span />
    </div>
  );
}
