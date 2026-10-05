import type { CSSProperties } from "react";

/**
 * An architecture as a row of nodes with a pulse running along each link
 * (transform-only CSS animation). `hot` marks the node the tests guard.
 * Wraps into a column on phones. Styles: "INNER PAGES" in globals.css.
 */
export default function Flow({ nodes, hot, label }: { nodes: string[]; hot?: number; label: string }) {
  return (
    <ol className="fl" aria-label={label}>
      {nodes.map((n, i) => (
        <li key={n} className="fl-item" style={{ "--i": i } as CSSProperties}>
          <span className={`fl-node${i === hot ? " fl-node--hot" : ""}`}>
            {n}
            {i === hot && <span className="fl-flag mono">tested hardest</span>}
          </span>
          {i < nodes.length - 1 && (
            <span className="fl-link" aria-hidden="true">
              <span className="fl-pulse" />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
