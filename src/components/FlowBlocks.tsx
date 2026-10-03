"use client";

import { Fragment } from "react";
import Prism from "./motion/Prism";
import { useScrollProgress } from "@/lib/useScrollProgress";

/** An architecture flow drawn as 3D blocks that turn as you scroll past. */
export default function FlowBlocks({ nodes }: { nodes: string[] }) {
  const ref = useScrollProgress<HTMLDivElement>("pass");
  const S = 92;
  const STEP = 136;
  const n = nodes.length;

  return (
    <div ref={ref} aria-hidden="true" className="relative h-[260px] w-full overflow-hidden sm:h-[320px]" style={{ perspective: 1600 }}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          transformStyle: "preserve-3d",
          transform: "scale(var(--fit, .8)) rotateX(60deg) rotateZ(calc(-50deg + var(--p, .5) * 40deg))",
        }}
      >
        {nodes.map((label, i) => {
          const x = (i - (n - 1) / 2) * STEP;
          return (
            <Fragment key={label}>
              {i < n - 1 && (
                <div className="absolute bg-[var(--signal)]" style={{ left: x + S / 2, top: -3, width: STEP - S, height: 6, transform: `translateZ(${S * 0.3}px)` }} />
              )}
              <div className="bob absolute" style={{ left: x - S / 2, top: -S / 2, transformStyle: "preserve-3d", animationDelay: `${i * -0.6}s` }}>
                <Prism
                  w={S}
                  h={i === n - 1 ? S * 0.9 : S * 0.6}
                  tone={i === n - 1 ? "signal" : "paper"}
                  top={
                    <div className={`mono flex h-full items-center justify-center p-1 text-center text-[11px] font-medium ${i === n - 1 ? "text-white" : "text-[#0b1220]"}`}>
                      {label}
                    </div>
                  }
                />
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
