import type { CSSProperties } from "react";
import type { StackItem } from "@/content/company";

/** A tool's logo from public/tech, or a typographic tile for an ERC standard. */
export default function TechLogo({ item, size = 28 }: { item: StackItem; size?: number }) {
  if (item.logo.startsWith("erc:")) {
    return (
      <span className="tx-erc" style={{ "--s": `${size}px` } as CSSProperties} aria-hidden="true">
        <small>ERC</small>
        {item.logo.slice(4)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/tech/${item.logo}`} alt="" width={size} height={size} loading="lazy" decoding="async" className="tx-img" style={{ width: size, height: size }} />
  );
}
