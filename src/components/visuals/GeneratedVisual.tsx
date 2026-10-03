"use client";

/**
 * Deterministic, CSP-safe artwork rendered as inline SVG.
 *
 * Replaces hotlinked Unsplash photos, which were blocked by this site's own
 * `img-src 'self' blob: data:` policy (see next.config.ts) and rendered as
 * broken alt text for every visitor. Drawing in code also means no external
 * requests, no licensing question, and correct colours in both themes.
 *
 * `seed` picks a stable variant, so the same card always looks the same.
 */

type Props = {
  seed: string;
  className?: string;
  /** Compact treatment for small square avatars. */
  variant?: "scene" | "avatar";
  label?: string;
};

const PALETTES: Array<[string, string, string]> = [
  ["#0052cc", "#00aaff", "#22d3ee"],
  ["#7c5cff", "#0077ff", "#22d3ee"],
  ["#0077ff", "#06b6d4", "#a855f7"],
  ["#00aaff", "#7c5cff", "#0052cc"],
  ["#06b6d4", "#0052cc", "#a855f7"],
  ["#a855f7", "#0077ff", "#22d3ee"],
];

/** Stable string → int hash so a given seed always maps to one palette. */
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export default function GeneratedVisual({
  seed,
  className = "",
  variant = "scene",
  label,
}: Props) {
  const h = hash(seed);
  const [c1, c2, c3] = PALETTES[h % PALETTES.length];
  const uid = `gv-${h.toString(36)}`;

  if (variant === "avatar") {
    const initials = (label ?? seed)
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase();

    return (
      <svg className={className} viewBox="0 0 100 100" role="img" aria-label={label ?? "Avatar"}>
        <defs>
          <linearGradient id={`${uid}-a`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${uid}-a)`} />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700"
          fontSize="38"
          fill="#ffffff"
          fillOpacity="0.92"
        >
          {initials}
        </text>
      </svg>
    );
  }

  // Scene: layered mesh gradient + circuit lines + node dots.
  const rot = h % 360;
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label ?? "Abstract technology artwork"}
    >
      <defs>
        <linearGradient id={`${uid}-bg`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#060b1a" />
          <stop offset="100%" stopColor="#0b1228" />
        </linearGradient>
        <radialGradient id={`${uid}-g1`} cx="30%" cy="30%" r="55%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.85" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-g2`} cx="75%" cy="65%" r="50%">
          <stop offset="0%" stopColor={c2} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-g3`} cx="55%" cy="20%" r="45%">
          <stop offset="0%" stopColor={c3} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c3} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="300" fill={`url(#${uid}-bg)`} />
      <g transform={`rotate(${rot} 200 150)`}>
        <rect x="-120" y="-120" width="640" height="540" fill={`url(#${uid}-g1)`} />
        <rect x="-120" y="-120" width="640" height="540" fill={`url(#${uid}-g2)`} />
        <rect x="-120" y="-120" width="640" height="540" fill={`url(#${uid}-g3)`} />
      </g>

      {/* Circuit grid */}
      <g stroke="#ffffff" strokeOpacity="0.09" strokeWidth="1">
        {[60, 120, 180, 240].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} />
        ))}
        {[80, 160, 240, 320].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="300" />
        ))}
      </g>

      {/* Nodes — positions derived from the seed so they're stable */}
      <g>
        {Array.from({ length: 7 }).map((_, i) => {
          const nx = ((h >> (i * 3)) % 380) + 10;
          const ny = ((h >> (i * 2 + 1)) % 280) + 10;
          const r = 2 + ((h >> i) % 3);
          return (
            <circle
              key={i}
              cx={nx}
              cy={ny}
              r={r}
              fill={i % 2 === 0 ? c3 : "#ffffff"}
              fillOpacity="0.75"
            />
          );
        })}
      </g>

      {/* No scrim here on purpose: every caller already overlays its own
          theme-aware gradient. Adding a second dark layer turned the artwork
          to grey mud in light mode. */}
    </svg>
  );
}
