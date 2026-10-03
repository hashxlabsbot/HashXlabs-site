import type { CSSProperties } from "react";

/* Splits a heading into words that slide up out of a mask. `load` animates on
   page load (hero/page headers); otherwise the words animate when an
   ancestor Reveal becomes visible. The text is in the page once: an earlier
   version added a screen-reader copy and hid the split words, which made
   every heading read twice to crawlers ("See you at See you at"). The words
   keep real spaces between them, so assistive tech still reads a sentence. */
export default function Words({ text, start = 0, load, className = "" }: { text: string; start?: number; load?: boolean; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={`split ${load ? "split-load" : ""} ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">
            <span style={{ "--i": start + i } as CSSProperties}>{w}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
