// Scene data for the load intro (Intro.tsx). Seeded, so the server markup is
// identical on every build. Network coordinates are percent of a 100vmax
// square centred on the viewport, so angles and lengths never depend on the
// viewport's aspect ratio.

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r2 = (n: number) => Math.round(n * 100) / 100;
const HEX = "0123456789abcdef";

/* ── Network: nodes + links, booting outward from the centre ── */
export type Node = { x: number; y: number; big: boolean; d: number };
export type Link = { x: number; y: number; len: number; deg: number; d: number };
export type Packet = { link: number; d: number; t: number };
export type HashLabel = { x: number; y: number; text: string; d: number };

const rand = rng(20261002);
const pts: { x: number; y: number }[] = [];
for (let tries = 0; pts.length < 40 && tries < 4000; tries++) {
  const x = 3 + rand() * 94;
  const y = 3 + rand() * 94;
  // keep the middle clear for the X and the wordmark
  if (Math.abs(x - 50) < 19 && Math.abs(y - 50) < 11) continue;
  if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 9.5)) continue;
  pts.push({ x, y });
}

const dist = (p: { x: number; y: number }) => Math.hypot(p.x - 50, p.y - 50);
const minD = Math.min(...pts.map(dist));
const maxD = Math.max(...pts.map(dist));
// Nodes pop in a ring sweeping outward from the centre, from first paint.
const popAt = (p: { x: number; y: number }) => 0.02 + ((dist(p) - minD) / (maxD - minD)) * 0.5;

export const NODES: Node[] = pts.map((p) => ({ x: r2(p.x), y: r2(p.y), big: rand() < 0.28, d: r2(popAt(p)) }));

// Each node links to its two nearest neighbours. Links are drawn from the
// outer node toward the inner one, so lines and packets flow to the centre.
const seen = new Set<string>();
export const LINKS: Link[] = [];
pts.forEach((p, i) => {
  pts
    .map((q, j) => ({ j, d: Math.hypot(q.x - p.x, q.y - p.y) }))
    .filter((o) => o.j !== i && o.d < 24)
    .sort((a, b) => a.d - b.d)
    .slice(0, 2)
    .forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      const [a, b] = dist(pts[i]) >= dist(pts[j]) ? [pts[i], pts[j]] : [pts[j], pts[i]];
      LINKS.push({
        x: r2(a.x),
        y: r2(a.y),
        len: r2(Math.hypot(b.x - a.x, b.y - a.y)),
        deg: r2((Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI),
        d: r2(Math.max(popAt(a), popAt(b)) + 0.04),
      });
    });
});

// A packet rides every third link, looping until the intro ends.
export const PACKETS: Packet[] = LINKS.flatMap((l, i) =>
  i % 3 === 0 ? [{ link: i, d: r2(l.d + 0.5 + rand() * 0.5), t: r2(0.9 + rand() * 0.8) }] : [],
);

const hash = () => {
  let s = "0x";
  for (let i = 0; i < 4; i++) s += HEX[Math.floor(rand() * 16)];
  s += "…";
  for (let i = 0; i < 4; i++) s += HEX[Math.floor(rand() * 16)];
  return s;
};
export const HASHES: HashLabel[] = NODES.filter((_, i) => i % 6 === 2).map((n) => ({ x: n.x, y: n.y, text: hash(), d: r2(n.d + 0.15) }));

/* ── The X: 13 isometric blocks on two 60° hex-lattice diagonals ──
   Coordinates are in units of the block radius r (centre to vertex). Edge
   neighbours on a pointy-top hex lattice sit √3·r apart, so one step along
   a diagonal is (±0.866, -1.5). The chain order traces the X like two pen
   strokes: bottom-left → top-right, then top-left → bottom-right. */
export type Cube = { x: number; y: number; z: number; d: number; fx: number; fy: number; fr: number };

const steps: [number, number][] = [];
for (let k = -3; k <= 3; k++) steps.push([0.866 * k, -1.5 * k]);
for (let k = 3; k >= -3; k--) if (k !== 0) steps.push([-0.866 * k, -1.5 * k]);

const CUBE_START = 0.18;
const CUBE_STEP = 0.042;
export const CUBES: Cube[] = steps.map(([x, y], i) => {
  // Each block flies in from beyond its own side of the X, out of the network.
  const a = x === 0 && y === 0 ? rand() * Math.PI * 2 : Math.atan2(y, x) + (rand() - 0.5) * 0.9;
  const far = 34 + rand() * 22; // vmin
  return {
    x: r2(x),
    y: r2(y),
    z: Math.round(y * 10) + 50,
    d: r2(CUBE_START + i * CUBE_STEP),
    fx: r2(Math.cos(a) * far),
    fy: r2(Math.sin(a) * far),
    fr: Math.round((rand() - 0.5) * 120),
  };
});
// Blocks land 0.62s after they start; the validation pulse sets off just
// before the last one lands and catches up with it.
export const PULSE_START = r2(CUBE_START + (CUBES.length - 1) * CUBE_STEP + 0.56);

/* ── Wordmark reels: each letter rolls through hex digits and locks ──
   Order is inside-out from the X, so the name "decodes" away from it. */
export type Reel = { ch: string; strip: string[]; d: number };
const REEL_START = 1.92;
const reel = (ch: string, order: number): Reel => {
  const strip: string[] = [];
  for (let i = 0; i < 9; i++) strip.push(HEX[Math.floor(rand() * 16)].toUpperCase());
  return { ch, strip, d: r2(REEL_START + order * 0.055) };
};
export const HASH_REELS: Reel[] = ["H", "A", "S", "H"].map((c, i) => reel(c, 3 - i));
export const LABS_REELS: Reel[] = ["L", "A", "B", "S"].map((c, i) => reel(c, i));

// Stepped easing for the reels: nine jumps, each held longer than the last,
// so the digits flicker fast and then tick into place.
export const REEL_EASE = (() => {
  const n = 9;
  const parts = ["0 0%"];
  for (let k = 1; k <= n; k++) {
    const t = r2(Math.pow(k / n, 1.7) * 100);
    parts.push(`${((k - 1) / n).toFixed(4)} ${t}%`, `${(k / n).toFixed(4)} ${t}%`);
  }
  return `linear(${parts.join(", ")})`;
})();

// When the inline script starts the exit (ms after first paint).
export const EXIT_MS = 2900;
