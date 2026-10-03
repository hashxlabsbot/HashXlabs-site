/* Point clouds for the "Who we work with" figure (components/home/Audiences.tsx).

   One shape per audience, every one with the same particle count so any shape
   can morph into any other. Model units run roughly -1..1 with y up; the
   figure's floor ring sits at y = -1.02. The last K points of every shape are
   "live": a function of time instead of a fixed position (rocket exhaust,
   payment orbits, freshly minted token cubes, data packets on the network). */

export type Shape = {
  /** N*3 positions; live slots hold where that point rests at t = 0. */
  pos: Float32Array;
  /** The last K points are live. */
  K: number;
  /** Writes live point k at time t (seconds) into out[0..2]; returns its alpha 0..1. */
  live: (k: number, t: number, out: Float32Array) => number;
};

const TAU = Math.PI * 2;
type R = () => number;
type Sampler = (r: R, p: number[]) => void;

/** mulberry32: small seeded PRNG, so the figure is identical on every load. */
export function rng(seed: number): R {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const randoms = (n: number, r: R) => Float32Array.from({ length: n }, r);

/** Sample M points from weighted parts, then order them by height (with a
 *  little jitter) so a morph carries bottom to bottom and top to top. */
function cloud(M: number, parts: [number, Sampler][], r: R): Float32Array {
  const W = parts.reduce((s, [w]) => s + w, 0);
  const counts = parts.map(([w]) => Math.floor((M * w) / W));
  counts[0] += M - counts.reduce((s, c) => s + c, 0);
  const p: number[] = [];
  parts.forEach(([, f], j) => {
    for (let i = 0; i < counts[j]; i++) f(r, p);
  });
  const key = Array.from({ length: M }, (_, i) => p[i * 3 + 1] + (r() - 0.5) * 0.16);
  const order = Array.from({ length: M }, (_, i) => i).sort((a, b) => key[a] - key[b]);
  const out = new Float32Array(M * 3);
  order.forEach((s, d) => {
    out[d * 3] = p[s * 3];
    out[d * 3 + 1] = p[s * 3 + 1];
    out[d * 3 + 2] = p[s * 3 + 2];
  });
  return out;
}

/** A point on a box: on one of its 12 edges with probability `edge`, otherwise on a face (no bottom). */
function box(r: R, p: number[], x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, edge: number) {
  const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
  const a = r() < 0.5, b = r() < 0.5, u = r(), v = r();
  if (r() < edge) {
    const q = r() * (dx + dy + dz);
    if (q < dx) p.push(x0 + u * dx, a ? y0 : y1, b ? z0 : z1);
    else if (q < dx + dy) p.push(a ? x0 : x1, y0 + u * dy, b ? z0 : z1);
    else p.push(a ? x0 : x1, b ? y0 : y1, z0 + u * dz);
    return;
  }
  const top = dx * dz, fb = dx * dy, lr = dy * dz;
  const q = r() * (top + 2 * fb + 2 * lr);
  if (q < top) p.push(x0 + u * dx, y1, z0 + v * dz);
  else if (q < top + 2 * fb) p.push(x0 + u * dx, y0 + v * dy, a ? z0 : z1);
  else p.push(a ? x0 : x1, y0 + u * dy, z0 + v * dz);
}

const ring = (rad: number, y: number): Sampler => (r, p) => {
  const a = r() * TAU;
  p.push(Math.cos(a) * rad, y, Math.sin(a) * rad);
};

function finish(N: number, K: number, M: Float32Array, live: Shape["live"]): Shape {
  const pos = new Float32Array(N * 3);
  pos.set(M);
  const o = new Float32Array(3);
  for (let k = 0; k < K; k++) {
    live(k, 0, o);
    pos.set(o, (N - K + k) * 3);
  }
  return { pos, K, live };
}

/* ── 01 Launch: a rocket on the pad, exhaust streaming out of the nozzle ── */
function rocket(N: number, K: number, r: R): Shape {
  const B = 0.24; // body radius
  const TOP = 0.34, BOT = -0.42;
  const fins = [TAU / 4, TAU / 4 + TAU / 3, TAU / 4 + (2 * TAU) / 3];
  // Fin outline (radius, y): root top, tip top, tip bottom, root bottom.
  const F = [
    [B, -0.04],
    [0.53, -0.46],
    [0.53, -0.66],
    [B, -0.42],
  ];
  const M = cloud(
    N - K,
    [
      // body
      [30, (r, p) => {
        const a = r() * TAU;
        p.push(Math.cos(a) * B, lerp(BOT, TOP, r()), Math.sin(a) * B);
      }],
      // ogive nose
      [17, (r, p) => {
        const s = 1 - Math.sqrt(1 - r());
        const rad = B * Math.pow(1 - s * s, 0.6);
        const a = r() * TAU;
        p.push(Math.cos(a) * rad, TOP + s * 0.64, Math.sin(a) * rad);
      }],
      // panel seams
      [7, (r, p) => ring(B + 0.006, [TOP, -0.2, BOT][(r() * 3) | 0])(r, p)],
      // porthole, facing the camera at rest
      [5, (r, p) => {
        const rho = r() < 0.62 ? 0.075 : 0.045;
        const b = r() * TAU;
        const al = -TAU / 4 + (rho * Math.cos(b)) / B;
        p.push(Math.cos(al) * (B + 0.006), 0.12 + rho * Math.sin(b), Math.sin(al) * (B + 0.006));
      }],
      // three fins: half on the outline, half filling the plate
      [20, (r, p) => {
        const g = fins[(r() * 3) | 0];
        let rho: number, y: number;
        if (r() < 0.5) {
          const e = (r() * 3) | 0, u = r();
          rho = lerp(F[e][0], F[e + 1][0], u);
          y = lerp(F[e][1], F[e + 1][1], u);
        } else {
          const a = r();
          rho = lerp(B, 0.53, a);
          y = lerp(lerp(-0.42, -0.66, a), lerp(-0.04, -0.46, a), r());
        }
        p.push(Math.cos(g) * rho, y, Math.sin(g) * rho);
      }],
      // nozzle bell and its lip
      [6, (r, p) => {
        const s = r(), a = r() * TAU, rad = lerp(0.14, 0.2, s * s);
        p.push(Math.cos(a) * rad, lerp(BOT, -0.6, s), Math.sin(a) * rad);
      }],
      [3, ring(0.2, -0.6)],
    ],
    r
  );
  const h1 = randoms(K, r), h2 = randoms(K, r), h3 = randoms(K, r);
  return finish(N, K, M, (k, t, o) => {
    const L = (t * 0.85 + h1[k]) % 1;
    const sp = (0.03 + L * 0.34) * Math.sqrt(h2[k]);
    const a = h3[k] * TAU + L * 2.4;
    o[0] = Math.cos(a) * sp;
    o[1] = -0.62 - L * 0.8;
    o[2] = Math.sin(a) * sp;
    return Math.min(1, L * 14) * Math.pow(1 - L, 1.5);
  });
}

/* ── 02 Settlement: a reeded coin, payments orbiting it in two crossing rings ── */
function coin(N: number, K: number, r: R): Shape {
  const R0 = 0.66, H = 0.075;
  const side = (r: R) => (r() < 0.5 ? -1 : 1);
  const hex = (k: number) => {
    const a = (k * TAU) / 6; // flat-topped
    return [Math.cos(a) * 0.3, Math.sin(a) * 0.3];
  };
  const M = cloud(
    N - K,
    [
      // reeded edge
      [18, (r, p) => {
        const a = (((r() * 132) | 0) / 132) * TAU;
        p.push(Math.cos(a) * R0, Math.sin(a) * R0, lerp(-H, H, r()));
      }],
      // raised rim on both faces
      [22, (r, p) => {
        const a = r() * TAU, rr = Math.sqrt(lerp(0.55 * 0.55, R0 * R0, r()));
        p.push(Math.cos(a) * rr, Math.sin(a) * rr, side(r) * H);
      }],
      [7, (r, p) => {
        const a = r() * TAU;
        p.push(Math.cos(a) * 0.5, Math.sin(a) * 0.5, side(r) * H * 0.55);
      }],
      // emblem: hexagon with an X
      [16, (r, p) => {
        const z = side(r) * H * 0.85;
        if (r() < 0.6) {
          const k = (r() * 6) | 0, u = r();
          const [ax, ay] = hex(k), [bx, by] = hex(k + 1);
          p.push(lerp(ax, bx, u), lerp(ay, by, u), z);
        } else {
          const u = r() * 2 - 1, s = r() < 0.5 ? 1 : -1, j = (r() - 0.5) * 0.026;
          p.push(u * 0.13 + j, s * u * 0.15, z);
        }
      }],
      // recessed field
      [10, (r, p) => {
        const a = r() * TAU, rr = 0.48 * Math.sqrt(r());
        p.push(Math.cos(a) * rr, Math.sin(a) * rr, side(r) * H * 0.55);
      }],
    ],
    r
  );
  const P = 6, Lp = Math.max(1, Math.floor(K / P));
  return finish(N, K, M, (k, t, o) => {
    const pk = (k / Lp) | 0;
    if (pk >= P) {
      o[0] = o[1] = o[2] = 0;
      return 0;
    }
    const i = k - pk * Lp, orb = pk & 1, dir = orb ? -1 : 1;
    const a = dir * t * 0.75 + (pk >> 1) * (TAU / 3) - dir * i * 0.016;
    const x = Math.cos(a) * 0.98, tilt = orb ? 0.5 : -0.5;
    o[0] = x * Math.cos(tilt);
    o[1] = x * Math.sin(tilt);
    o[2] = Math.sin(a) * 0.98;
    return Math.pow(1 - i / Lp, 1.6);
  });
}

/* ── 03 Tokenization: an institution, token cubes minted off its roof ── */
const CUBE: [number, number, number][] = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CUBE.push([x, y, z]);
for (const [a, b] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) CUBE.push([0, a, b], [a, 0, b], [a, b, 0]);

function bank(N: number, K: number, r: R): Shape {
  const cols: [number, number][] = [];
  for (const z of [-0.26, 0.26]) for (let i = 0; i < 5; i++) cols.push([-0.44 + i * 0.22, z]);
  cols.push([-0.44, 0], [0.44, 0]);
  const PED: [number, number][] = [
    [-0.62, 0.28],
    [0.62, 0.28],
    [0, 0.58],
  ];
  const M = cloud(
    N - K,
    [
      // three steps
      [9, (r, p) => box(r, p, -0.7, 0.7, -0.78, -0.72, -0.44, 0.44, 0.55)],
      [8, (r, p) => box(r, p, -0.64, 0.64, -0.72, -0.66, -0.39, 0.39, 0.55)],
      [7, (r, p) => box(r, p, -0.58, 0.58, -0.66, -0.6, -0.34, 0.34, 0.55)],
      // columns with bases and capitals
      [30, (r, p) => {
        const [cx, cz] = cols[(r() * cols.length) | 0];
        const a = r() * TAU;
        if (r() < 0.12) {
          const y = r() < 0.5 ? lerp(0.12, 0.16, r()) : lerp(-0.6, -0.56, r());
          p.push(cx + Math.cos(a) * 0.062, y, cz + Math.sin(a) * 0.062);
        } else p.push(cx + Math.cos(a) * 0.042, lerp(-0.6, 0.14, r()), cz + Math.sin(a) * 0.042);
      }],
      // entablature
      [14, (r, p) => box(r, p, -0.6, 0.6, 0.16, 0.28, -0.36, 0.36, 0.6)],
      // pediment: gable outlines, roof slopes, ridge and eaves
      [22, (r, p) => {
        const q = r();
        if (q < 0.45) {
          const e = (r() * 3) | 0, u = r(), a = PED[e], b = PED[(e + 1) % 3];
          p.push(lerp(a[0], b[0], u), lerp(a[1], b[1], u), r() < 0.5 ? -0.37 : 0.37);
        } else if (q < 0.85) {
          const s = r() < 0.5 ? -1 : 1, u = r();
          p.push(s * 0.62 * (1 - u), 0.28 + 0.3 * u, lerp(-0.37, 0.37, r()));
        } else {
          const [x, y] = PED[(r() * 3) | 0];
          p.push(x, y, lerp(-0.37, 0.37, r()));
        }
      }],
      // a coin emblem in the gable
      [3, (r, p) => {
        const a = r() * TAU;
        p.push(Math.cos(a) * 0.07, 0.4 + Math.sin(a) * 0.07, -0.375);
      }],
    ],
    r
  );
  const PER = CUBE.length, C = Math.floor(K / PER);
  const hc = randoms(C, r), hx = randoms(C, r), hz = randoms(C, r);
  return finish(N, K, M, (k, t, o) => {
    const c = (k / PER) | 0;
    if (c >= C) {
      o[0] = 0;
      o[1] = 0.58;
      o[2] = 0;
      return 0;
    }
    const L = (t * 0.2 + hc[c]) % 1;
    const x0 = (hx[c] - 0.5) * 0.9, z0 = (hz[c] - 0.5) * 0.5, y0 = 0.62 - Math.abs(x0) * 0.48;
    const [ux, uy, uz] = CUBE[k - c * PER];
    const ang = L * 3.2 + hc[c] * 6, ca = Math.cos(ang), sa = Math.sin(ang);
    const x = ux * ca + uz * sa, z = -ux * sa + uz * ca;
    const s = 0.042;
    o[0] = x0 * (1 + L * 0.7) + Math.sin(L * 5 + hc[c] * 9) * 0.05 + x * s;
    o[1] = y0 + 0.06 + L * 0.6 + (uy * 0.878 - z * 0.479) * s;
    o[2] = z0 * (1 + L * 0.7) + (uy * 0.479 + z * 0.878) * s;
    return sstep(0, 0.12, L) * (1 - sstep(0.5, 0.92, L));
  });
}

/* ── 04 Integration: a wireframe globe, systems as nodes, packets on the arcs ── */
function globe(N: number, K: number, r: R): Shape {
  const G = 0.64;
  const nodes: number[][] = [];
  for (let i = 0; i < 14; i++) {
    const y = 1 - ((i + 0.5) / 14) * 2, rr = Math.sqrt(1 - y * y), ph = i * 2.39996 + 0.7;
    nodes.push([Math.cos(ph) * rr, y, Math.sin(ph) * rr]);
  }
  // Pick up to 9 well-spread links, each node used at most twice.
  const pairs: [number, number][] = [];
  for (let i = 0; i < 14; i++) for (let j = i + 1; j < 14; j++) pairs.push([i, j]);
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  const used = new Array(14).fill(0);
  const arcs: { a: number[]; b: number[]; om: number; so: number }[] = [];
  for (const [i, j] of pairs) {
    if (arcs.length >= 9 || used[i] > 1 || used[j] > 1) continue;
    const a = nodes[i], b = nodes[j];
    const om = Math.acos(Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    if (om < 0.8 || om > 1.9) continue;
    used[i]++;
    used[j]++;
    arcs.push({ a, b, om, so: Math.sin(om) });
  }
  const arcPt = (A: (typeof arcs)[number], s: number, o: Float32Array | number[]) => {
    const k0 = Math.sin((1 - s) * A.om) / A.so, k1 = Math.sin(s * A.om) / A.so;
    const h = G + 0.2 * Math.sin(Math.PI * s);
    o[0] = (A.a[0] * k0 + A.b[0] * k1) * h;
    o[1] = (A.a[1] * k0 + A.b[1] * k1) * h;
    o[2] = (A.a[2] * k0 + A.b[2] * k1) * h;
  };
  const LATS = [-60, -40, -20, 0, 20, 40, 60].map((d) => (d * Math.PI) / 180);
  const tmp = [0, 0, 0];
  const M = cloud(
    N - K,
    [
      // parallels, denser where they are longer
      [26, (r, p) => {
        let lat = LATS[(r() * 7) | 0];
        while (r() > Math.cos(lat)) lat = LATS[(r() * 7) | 0];
        const a = r() * TAU;
        p.push(Math.cos(lat) * Math.cos(a) * G, Math.sin(lat) * G, Math.cos(lat) * Math.sin(a) * G);
      }],
      // meridians
      [20, (r, p) => {
        const lon = (((r() * 12) | 0) * TAU) / 12, lat = (r() * 2 - 1) * (TAU / 4);
        p.push(Math.cos(lat) * Math.cos(lon) * G, Math.sin(lat) * G, Math.cos(lat) * Math.sin(lon) * G);
      }],
      // a light dusting of the surface
      [8, (r, p) => {
        const u = r() * 2 - 1, a = r() * TAU, rr = Math.sqrt(1 - u * u);
        p.push(Math.cos(a) * rr * G, u * G, Math.sin(a) * rr * G);
      }],
      // systems: tight clusters on the surface
      [10, (r, p) => {
        const n = nodes[(r() * 14) | 0];
        const u = r() * 2 - 1, a = r() * TAU, rr = Math.sqrt(1 - u * u), d = 0.028 * Math.cbrt(r());
        p.push(n[0] * G + Math.cos(a) * rr * d, n[1] * G + u * d, n[2] * G + Math.sin(a) * rr * d);
      }],
      // links arching above the surface
      [18, (r, p) => {
        arcPt(arcs[(r() * arcs.length) | 0], r(), tmp);
        p.push(tmp[0], tmp[1], tmp[2]);
      }],
    ],
    r
  );
  const PER = 8, P = Math.floor(K / PER);
  const hp = randoms(P, r);
  return finish(N, K, M, (k, t, o) => {
    const pk = (k / PER) | 0;
    if (pk >= P) {
      o[0] = o[1] = o[2] = 0;
      return 0;
    }
    const i = k - pk * PER, A = arcs[pk % arcs.length];
    const s = ((t * 0.3 * (0.8 + hp[pk] * 0.4) + hp[pk]) % 1) - i * 0.014;
    if (s <= 0) {
      arcPt(A, 0, o);
      return 0;
    }
    arcPt(A, s, o);
    return Math.pow(1 - i / PER, 1.4) * Math.min(1, Math.sin(Math.PI * s) * 3);
  });
}

/** All four figures, in AUDIENCES order. */
export function buildShapes(N: number): Shape[] {
  const K = Math.round(N * 0.13);
  const r = rng(20261002);
  return [rocket(N, K, r), coin(N, K, r), bank(N, K, r), globe(N, K, r)];
}
