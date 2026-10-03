import type { CSSProperties, ReactNode } from "react";

export type Tone = "paper" | "signal" | "ink";

// top, front/back, left/right
const TONES: Record<Tone, [string, string, string, string]> = {
  paper: ["#ffffff", "#e3eaf7", "#c9d6ee", "rgba(11,18,32,0.2)"],
  signal: ["#1a6bff", "#0057d9", "#0046ad", "rgba(255,255,255,0.22)"],
  ink: ["#1a2336", "#0b1220", "#060a13", "rgba(255,255,255,0.14)"],
};

/**
 * A CSS-3D box standing on the ground plane (x/y), rising along +z.
 * Put it inside a `transform-style: preserve-3d` stage that is tilted
 * with rotateX(...) rotateZ(...). Faces use backface culling, so no
 * manual depth sorting is needed.
 */
export default function Prism({
  w,
  d = w,
  h,
  tone = "paper",
  top,
  front,
  style,
  className = "",
}: {
  w: number;
  d?: number;
  h: number;
  tone?: Tone;
  top?: ReactNode;
  front?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const [t, f, s, edge] = TONES[tone];
  const base: CSSProperties = {
    position: "absolute",
    border: `1px solid ${edge}`,
    backfaceVisibility: "hidden",
    transition: "background-color .4s ease",
  };

  return (
    <div
      className={className}
      style={{ position: "absolute", width: w, height: d, transformStyle: "preserve-3d", ...style }}
    >
      <div style={{ ...base, left: 0, top: 0, width: w, height: d, background: t, transform: `translateZ(${h}px)` }}>
        {top}
      </div>
      <div style={{ ...base, left: 0, top: d - h, width: w, height: h, background: f, transformOrigin: "bottom", transform: "rotateX(-90deg)" }}>
        {front}
      </div>
      <div style={{ ...base, left: 0, top: 0, width: w, height: h, background: f, transformOrigin: "top", transform: "rotateX(90deg)" }} />
      <div style={{ ...base, left: w - h, top: 0, width: h, height: d, background: s, transformOrigin: "right", transform: "rotateY(90deg)" }} />
      <div style={{ ...base, left: 0, top: 0, width: h, height: d, background: s, transformOrigin: "left", transform: "rotateY(-90deg)" }} />
    </div>
  );
}
