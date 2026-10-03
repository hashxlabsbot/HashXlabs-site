import type { CSSProperties } from "react";

/* Splits a heading into words that slide up out of a mask. `load` animates on
   page load (hero/page headers); otherwise the words animate when an
   ancestor Reveal becomes visible. Screen readers get the plain text. */
export default function Words({ text, start = 0, load, className = "" }: { text: string; start?: number; load?: boolean; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={`split ${load ? "split-load" : ""} ${className}`}>
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">
              <span style={{ "--i": start + i } as CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </>
  );
}
