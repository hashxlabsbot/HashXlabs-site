"use client";

import { useRef, type ReactNode } from "react";

/* Pulls its child a few pixels toward the cursor while hovered. Uses the
   `translate` property, so it never fights a child's own transform. */
export default function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * strength;
        const y = (e.clientY - (r.top + r.height / 2)) * strength * 1.4;
        el.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.translate = "0 0";
      }}
    >
      {children}
    </span>
  );
}
