"use client";

import { useId, useState } from "react";

/** Single-open accordion for FAQs. Plain buttons + regions, keyboard friendly. */
export default function Accordion({ items, defaultOpen = 0 }: { items: [string, string][]; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const base = useId();

  return (
    <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
      {items.map(([q, a], i) => {
        const isOpen = open === i;
        const id = `${base}-${i}`;
        return (
          <div key={q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={id}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-5 text-left font-[family-name:var(--font-body)] text-[17px] font-semibold tracking-normal text-[var(--t-hi)] transition-colors hover:text-[var(--signal)]"
              >
                {q}
                <span
                  aria-hidden="true"
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[var(--line-strong)] text-lg leading-none transition-transform duration-300 ${
                    isOpen ? "rotate-45 border-[var(--signal)] text-[var(--signal)]" : ""
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div
              id={id}
              role="region"
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 text-[15.5px] leading-relaxed text-[var(--t-mid)]">{a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
