"use client";

import { Children, type ReactNode } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";

/**
 * Cards that pin one over another as you scroll; each card sinks back
 * slightly as the next one lands on it.
 */
export default function StackCards({ children }: { children: ReactNode }) {
  const ref = useScrollProgress<HTMLDivElement>("pin");
  const items = Children.toArray(children);
  const n = items.length;

  return (
    <div ref={ref} className="relative">
      {items.map((child, i) => (
        <div
          key={i}
          className="sticky mb-[14vh] last:mb-0"
          style={{ top: `calc(var(--header-h) + 28px + ${i * 22}px)` }}
        >
          <div
            className="origin-top transition-transform duration-100 motion-reduce:!transform-none"
            style={{
              transform: `scale(calc(1 - clamp(0, calc(var(--p, 0) * ${n} - ${i} - 0.35), ${n}) * 0.045))`,
            }}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}
