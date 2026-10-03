"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { STACK } from "@/content/company";
import TechLogo from "./TechLogo";

/**
 * Home "Technology": a logo wall. All tools sit in one hairline grid (7 × 4 on
 * desktop); a soft light follows the cursor along the hairlines, cells fade in
 * as a diagonal wave the first time the grid scrolls into view, and hovering a
 * cell slides in what we use the tool for. The chips filter by group: the
 * other cells go quiet and the group's one-line summary shows under the grid.
 * Styles: "Tech grid" in globals.css. Earlier takes on this section
 * (TechStack, TechLayers, TechSwarm) are still in this folder, unmounted.
 */
const CELLS = STACK.flatMap((g, k) => g.items.map((it) => ({ ...it, k })));
const COLS = 7;
const pad = (n: number) => String(n).padStart(2, "0");

export default function TechGrid() {
  const [group, setGroup] = useState(-1);
  const [shown, setShown] = useState(false);
  const grid = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const light = (e: PointerEvent<HTMLUListElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <section className="section section-soft tg" aria-labelledby="tg-title">
      <div className="container-x">
        <div className="tg-top">
          <Reveal className="max-w-2xl">
            <span className="eyebrow">Technology</span>
            <h2 id="tg-title" className="t-h2 mt-3">
              <Words text="Proven tools, chosen for the job" />
            </h2>
            <p className="t-lead mt-4">We pick the stack that fits your product and your team, and explain why in writing.</p>
          </Reveal>
          <div className="tg-chips" role="group" aria-label="Filter by group">
            {[{ group: "All" }, ...STACK].map((g, i) => (
              <button key={g.group} type="button" aria-pressed={group === i - 1} onClick={() => setGroup(i - 1)}>
                {g.group}
              </button>
            ))}
          </div>
        </div>

        <ul
          ref={grid}
          className={`tg-grid${shown ? " is-shown" : ""}`}
          data-filter={group >= 0 || undefined}
          onPointerMove={light}
          onPointerLeave={(e) => e.currentTarget.style.setProperty("--x", "-999px")}
        >
          {CELLS.map((c, i) => (
            <li
              key={c.name}
              className="tg-cell"
              data-on={group === c.k || undefined}
              style={{ "--d": (i % COLS) + Math.floor(i / COLS) } as CSSProperties}
            >
              <span className="tg-n">{pad(c.k + 1)}</span>
              <span className="tg-logo">
                <TechLogo item={c} size={34} />
              </span>
              <span className="tg-name">{c.name}</span>
              <span className="tg-note">{c.note}</span>
            </li>
          ))}
        </ul>

        <div className="tg-foot" aria-live="polite">
          {group < 0 ? (
            <p key="all">
              {CELLS.length} tools across {STACK.length} groups: {STACK.map((g) => g.group.toLowerCase()).join(", ")}.
            </p>
          ) : (
            <p key={group}>
              <strong>{STACK[group].group}.</strong> {STACK[group].d}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
