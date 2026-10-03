"use client";

import { useEffect, useRef } from "react";
import Prism, { type Tone } from "./Prism";
import { useScrollProgress, prefersReducedMotion } from "@/lib/useScrollProgress";

// Height maps (4x4). 0 = empty cell. Each variant reads as a different
// "block" arrangement so every page hero has its own shape.
const MAPS: number[][][] = [
  [[3, 1, 0, 2], [1, 4, 2, 1], [0, 2, 5, 1], [2, 1, 1, 3]],
  [[1, 1, 1, 1], [1, 3, 3, 1], [1, 3, 5, 1], [1, 1, 1, 1]],
  [[5, 0, 0, 1], [0, 3, 0, 2], [0, 0, 2, 0], [1, 2, 0, 4]],
  [[2, 2, 2, 2], [0, 0, 0, 2], [4, 3, 1, 2], [0, 0, 0, 2]],
  [[1, 2, 3, 4], [2, 3, 4, 3], [3, 4, 3, 2], [4, 3, 2, 1]],
];
const HOT: [number, number][][] = [
  [[2, 2]], [[2, 2], [1, 1]], [[0, 0], [3, 3]], [[2, 0]], [[0, 3], [3, 0]],
];

const S = 64; // cell size
const G = 14; // gap
const U = 22; // height unit

export default function BlockCluster({ variant = 0, className = "" }: { variant?: number; className?: string }) {
  const map = MAPS[variant % MAPS.length];
  const hot = HOT[variant % HOT.length];
  const ref = useScrollProgress<HTMLDivElement>("pass");
  const stage = useRef<HTMLDivElement>(null);
  const size = 4 * S + 3 * G;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      el.style.setProperty("--fit", String(Math.min(1, e.contentRect.width / 430)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.current?.style.setProperty("--rx", String(x * 24));
    stage.current?.style.setProperty("--ry", String(-y * 14));
  };
  const onLeave = () => {
    stage.current?.style.setProperty("--rx", "0");
    stage.current?.style.setProperty("--ry", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-hidden="true"
      className={`relative aspect-square w-full select-none ${className}`}
      style={{ perspective: 1800 }}
    >
      <div
        ref={stage}
        className="absolute left-1/2 top-[55%] transition-transform duration-500 ease-out"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
          transformStyle: "preserve-3d",
          transform:
            "scale(var(--fit, 1)) rotateX(calc(56deg + var(--ry, 0) * 1deg)) rotateZ(calc(-40deg + var(--rx, 0) * 1deg + var(--p, 0.5) * 36deg))",
        }}
      >
        {/* floor */}
        <div
          className="absolute"
          style={{
            inset: -60,
            backgroundImage:
              "linear-gradient(rgba(11,18,32,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(11,18,32,.09) 1px, transparent 1px)",
            backgroundSize: `${S + G}px ${S + G}px`,
            backgroundPosition: `${60 - G / 2}px ${60 - G / 2}px`,
            maskImage: "radial-gradient(circle, #000 40%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(circle, #000 40%, transparent 72%)",
          }}
        />
        {map.flatMap((row, r) =>
          row.map((h, c) => {
            if (!h) return null;
            const tone: Tone = hot.some(([hr, hc]) => hr === r && hc === c) ? "signal" : "paper";
            return (
              <div
                key={`${r}-${c}`}
                className="absolute bob"
                style={{
                  left: c * (S + G),
                  top: r * (S + G),
                  width: S,
                  height: S,
                  transformStyle: "preserve-3d",
                  animationDelay: `${(r + c) * -0.45}s`,
                }}
              >
                <Prism w={S} h={h * U} tone={tone} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
