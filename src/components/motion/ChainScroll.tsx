"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Prism from "./Prism";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { METHOD } from "@/content/site";

const N = METHOD.length;
const S = 120; // block size
const STEP = 190; // spacing
const HASH = ["0x3fa9", "0x81c2", "0x5e07", "0xd4b1", "0x9a6e"];

/**
 * Pinned 3D section: as you scroll, five blocks drop onto a line, link
 * up into a chain and the camera orbits. Each block is one step of how
 * we work. Under reduced motion the chain is shown already assembled.
 */
export default function ChainScroll({ id = "method" }: { id?: string }) {
  const [active, setActive] = useState(0);
  const ref = useScrollProgress<HTMLElement>("pin", (p) => {
    const a = Math.max(0, Math.min(N - 1, Math.floor(p * (N + 1) - 0.6)));
    setActive((prev) => (prev === a ? prev : a));
  });
  const stageBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stageBox.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      el.style.setProperty("--fit", String(Math.min(1, e.contentRect.width / (e.contentRect.width < 640 ? 900 : 1000))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const s = METHOD[active];

  return (
    <section ref={ref} id={id} className="chain feather [--fc:var(--signal)] relative bg-[var(--signal)] text-white" style={{ height: "440vh" }}>
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-[var(--header-h)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative mx-auto grid w-full max-w-[1280px] flex-1 items-center gap-6 px-5 sm:px-8 lg:grid-cols-12">
          <div className="pt-8 lg:col-span-4 lg:pt-0">
            <span className="mono text-[11px] uppercase tracking-[0.14em] text-white/70">{"//"} How we work</span>
            <h2 className="mt-4 text-3xl text-white sm:text-5xl">Five blocks. Every project.</h2>
            <div key={active} className="animate-fade-in mt-8 hidden sm:block">
              <div className="flex items-end gap-3">
                <span className="font-[family-name:var(--font-head)] text-7xl font-bold leading-[0.8] tracking-[-0.05em] tabular-nums [font-stretch:85%]">
                  0{active + 1}
                </span>
                <span className="mono mb-1 text-[12px] text-white/70">/ 0{N}</span>
              </div>
              <h3 className="mt-5 text-3xl text-white">{s.k}</h3>
              <p className="mt-3 max-w-sm text-white/85">{s.d}</p>
              <span className="mono mt-5 inline-flex items-center gap-2 border border-white/40 px-3 py-1.5 text-[11px]">
                <span className="h-1.5 w-1.5 bg-white" /> {s.out}
              </span>
            </div>
            <p key={`m${active}`} className="mt-4 text-sm text-white/85 sm:hidden">
              <b className="text-white">0{active + 1} {s.k}.</b> {s.d}
            </p>
          </div>

          <div ref={stageBox} className="relative h-[46vh] lg:col-span-8 lg:h-full" style={{ perspective: 1800 }} aria-hidden="true">
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                transformStyle: "preserve-3d",
                transform: "scale(var(--fit, 1)) rotateX(58deg) rotateZ(calc(-36deg + var(--p, 0) * 30deg))",
              }}
            >
              {METHOD.map((m, i) => {
                const x = (i - (N - 1) / 2) * STEP;
                const l = `clamp(0, calc(var(--p, 0) * ${N + 1} - ${i}), 1)`;
                const on = i === active;
                return (
                  <Fragment key={m.k}>
                    {i < N - 1 && (
                      <div
                        className="chain-link absolute"
                        style={{
                          left: x + S / 2,
                          top: -4,
                          width: STEP - S,
                          height: 8,
                          background: "#fff",
                          transformOrigin: "left",
                          transform: `translateZ(${S / 2}px) scaleX(clamp(0, calc(var(--p, 0) * ${N + 1} - ${i + 1}), 1))`,
                        }}
                      />
                    )}
                    <div
                      className="chain-block absolute"
                      style={{
                        left: x - S / 2,
                        top: -S / 2,
                        width: S,
                        height: S,
                        transformStyle: "preserve-3d",
                        opacity: `calc(${l} * 2)`,
                        transform: `translateZ(calc((1 - ${l}) * 620px)) rotateZ(calc((1 - ${l}) * -140deg))`,
                      }}
                    >
                      <Prism
                        w={S}
                        h={S}
                        tone={on ? "ink" : "paper"}
                        top={
                          <div className={`flex h-full flex-col justify-between p-3 ${on ? "text-white" : "text-[#0b1220]"}`}>
                            <span className="mono text-[10px] opacity-60">blk {String(i + 1).padStart(2, "0")}</span>
                            <span className="font-[family-name:var(--font-head)] text-[19px] font-bold leading-none tracking-tight">
                              {m.k}
                            </span>
                          </div>
                        }
                        front={
                          <div className={`mono flex h-full items-end p-2 text-[10px] ${on ? "text-white/70" : "text-[#0b1220]/60"}`}>
                            {HASH[i]}
                          </div>
                        }
                      />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative mx-auto mb-8 w-full max-w-[1280px] px-5 sm:px-8">
          <div className="flex gap-1">
            {METHOD.map((m, i) => (
              <div key={m.k} className="h-[3px] flex-1 bg-white/25">
                <div className="h-full bg-white transition-[width] duration-300" style={{ width: i <= active ? "100%" : "0%" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
