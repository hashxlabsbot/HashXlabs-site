/* The logo orbit behind "Technology" (components/home/TechStack.tsx).

   Every tool is a tile on one of five tilted rings, one ring per group, around
   the HashX block. One 2D canvas and one rAF loop that runs only while the
   section is near the viewport. Each frame the rings turn, the camera drifts
   (or turns to face the ring in focus), and everything is projected with
   perspective and drawn back to front: far ring arcs, far tiles, the core,
   near arcs and comets, near tiles. Tiles and labels are pre-rendered sprites
   (with their shadows baked in), so a frame is ~30 drawImage calls and a few
   dozen short strokes. No DOM is written per frame. */

export type OrbitGroup = { items: { name: string; logo: string }[] };
export type TechOrbit = {
  /** Group to turn towards, or -1 for the whole stack. */
  setFocus(k: number): void;
  /** Lift a tile from outside (the cards under the figure), or null. */
  setHover(i: number | null): void;
  destroy(): void;
};
type Opts = {
  reduce: boolean;
  /** The figure is (or stops being) properly in view. */
  onVisible?: (visible: boolean) => void;
  /** The pointer is over a tile (global index), or left it. */
  onHover?: (i: number | null) => void;
  /** A tile was clicked: its group. */
  onPick?: (group: number) => void;
};

import { coreSprite, glowSprite, labelSprite, readFonts, tileSprite } from "./techSprites";

const TAU = Math.PI * 2;
const CAM = 3.6; // camera distance, in ring units
const DRIFT = 0.11; // idle turn of the whole figure, rad/s
const FACE = 0.36; // a faced ring is seen from this far above, so it keeps some depth
const SEG = 96; // points per ring
const CHUNK = 8; // ring points per stroke (each stroke gets one depth-based alpha)
const RING_ACT = [0, 87, 217]; // brand blue
const RING_IDLE = [52, 78, 128];

/* Five rings, inner to outer: radius, tilt of the ring's axis from vertical,
   which way that axis leans, and turn speed (rad/s, alternating). */
const RINGS = [
  { r: 0.48, inc: 70, node: 12, w: 0.2 },
  { r: 0.63, inc: 56, node: 84, w: -0.16 },
  { r: 0.77, inc: 78, node: 148, w: 0.13 },
  { r: 0.9, inc: 62, node: 220, w: -0.11 },
  { r: 1, inc: 72, node: 296, w: 0.09 },
];

const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  const k = clamp01(x);
  return k * k * (3 - 2 * k);
};
const outBack = (x: number) => {
  const k = clamp01(x) - 1;
  return 1 + k * k * (2.4 * k + 1.4);
};

/* ── Quaternions [x, y, z, w] ─────────────────────────────────────────── */
type Q = [number, number, number, number];
const qAxis = (x: number, y: number, z: number, a: number): Q => {
  const s = Math.sin(a / 2);
  return [x * s, y * s, z * s, Math.cos(a / 2)];
};
const qMul = (a: Q, b: Q): Q => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const qNorm = (q: Q): Q => {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
};
function qSlerp(a: Q, b: Q, t: number): Q {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  let c = b;
  if (d < 0) {
    d = -d;
    c = [-b[0], -b[1], -b[2], -b[3]];
  }
  if (d > 0.9995) return qNorm([a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t, a[3] + (c[3] - a[3]) * t]);
  const th = Math.acos(d), s = Math.sin(th), ka = Math.sin((1 - t) * th) / s, kb = Math.sin(t * th) / s;
  return [a[0] * ka + c[0] * kb, a[1] * ka + c[1] * kb, a[2] * ka + c[2] * kb, a[3] * ka + c[3] * kb];
}
/** Shortest rotation taking unit vector u onto unit vector v. */
function qFromTo(u: number[], v: number[]): Q {
  const d = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  if (d < -0.99999) return qAxis(1, 0, 0, Math.PI);
  return qNorm([u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0], 1 + d]);
}
function qRot(q: Q, v: number[]) {
  const [x, y, z, w] = q;
  const ix = w * v[0] + y * v[2] - z * v[1], iy = w * v[1] + z * v[0] - x * v[2], iz = w * v[2] + x * v[1] - y * v[0], iw = -x * v[0] - y * v[1] - z * v[2];
  return [ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x];
}

/* ── Engine ───────────────────────────────────────────────────────────── */
export function createTechOrbit(canvas: HTMLCanvasElement, watch: HTMLElement, groups: OrbitGroup[], opts: Opts): TechOrbit {
  const ctx0 = canvas.getContext("2d");
  if (!ctx0) return { setFocus() {}, setHover() {}, destroy() {} };
  const ctx: CanvasRenderingContext2D = ctx0;
  const { reduce } = opts;

  // Rings: axis, an in-plane basis and the ring's points in world space.
  const NR = Math.min(groups.length, RINGS.length);
  const ring = RINGS.slice(0, NR).map((R) => {
    const i = (R.inc * Math.PI) / 180, o = (R.node * Math.PI) / 180;
    const n = [Math.sin(i) * Math.cos(o), Math.cos(i), Math.sin(i) * Math.sin(o)];
    const a = Math.abs(n[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    let u = [n[1] * a[2] - n[2] * a[1], n[2] * a[0] - n[0] * a[2], n[0] * a[1] - n[1] * a[0]];
    const ul = Math.hypot(u[0], u[1], u[2]);
    u = u.map((x) => x / ul);
    const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
    const pts = new Float32Array(SEG * 3);
    for (let s = 0; s < SEG; s++) {
      const t = (s / SEG) * TAU, c = Math.cos(t) * R.r, si = Math.sin(t) * R.r;
      pts[s * 3] = u[0] * c + v[0] * si;
      pts[s * 3 + 1] = u[1] * c + v[1] * si;
      pts[s * 3 + 2] = u[2] * c + v[2] * si;
    }
    return { ...R, n, u, v, pts, ph: Math.random() * TAU, comet: Math.random() * TAU };
  });

  // Tiles, flattened across groups (the global index the React side uses).
  const tiles: { k: number; j: number; m: number; name: string; logo: string }[] = [];
  groups.slice(0, NR).forEach((G, k) => G.items.forEach((it, j) => tiles.push({ k, j, m: G.items.length, name: it.name, logo: it.logo })));
  const NT = tiles.length;
  const TX = new Float32Array(NT), TY = new Float32Array(NT), TZ = new Float32Array(NT), TS = new Float32Array(NT), TA = new Float32Array(NT);
  const hov = new Float32Array(NT); // eased hover lift
  const order = new Int32Array(NT).map((_, i) => i);
  const PX = new Float32Array(SEG), PY = new Float32Array(SEG), PZ = new Float32Array(SEG);

  // Per-ring eased weights: act = in focus, dim = another ring is in focus.
  const act = new Float32Array(NR), dim = new Float32Array(NR), spd = new Float32Array(NR).fill(1);

  // Sprites (built once images and fonts are ready, rebuilt if the tile size changes).
  const imgs = new Map<string, HTMLImageElement | null>();
  let spr: HTMLCanvasElement[] = [], sprG: HTMLCanvasElement[] = [], lab: HTMLCanvasElement[] = [];
  let core: HTMLCanvasElement | null = null;
  const glow = glowSprite();
  let ready = false, loading = false, loaded = false, builtFor = "";

  // Camera.
  let qBase: Q = qMul(qAxis(1, 0, 0, 0.42), qAxis(0, 1, 0, -0.5));
  let qT: Q | null = null;
  let vel = [0, 0, 0]; // drag inertia: rotation vector in view space, rad/s
  let zoom = 1, zoomTo = 1;
  let focus = -1;

  // Pointer.
  let pIn = false, pX = 0, pY = 0, nx = 0, ny = 0, ex = 0, ey = 0;
  let drag = false, dMoved = 0, dLX = 0, dLY = 0, dLT = 0;
  let hit = -1, extHover: number | null = null, lastHit = -1, cursor = "";

  // Frame state.
  let W = 0, H = 0, dpr = 1, T = 56, U = 200;
  let t = 0, intro = reduce ? 99 : -1; // seconds since the intro started; -1 = not yet
  let want = false, visible = false;
  let last = 0, raf = 0, running = false;

  async function load() {
    if (loading) return;
    loading = true;
    const uniq = [...new Set(tiles.map((x) => x.logo).filter((l) => !l.startsWith("erc:")))];
    await Promise.all(
      uniq.map(async (l) => {
        const im = new Image();
        im.decoding = "async";
        im.src = `/tech/${l}`;
        try {
          await im.decode();
          imgs.set(l, im);
        } catch {
          imgs.set(l, null);
        }
      })
    );
    try {
      await document.fonts?.ready;
    } catch {}
    loaded = true;
    build();
  }

  function build() {
    if (!loaded || !W) return;
    const key = `${T}@${dpr}`;
    if (key === builtFor) return;
    builtFor = key;
    const f = readFonts();
    const S = Math.round(Math.min(230, T * 1.7 * dpr));
    spr = tiles.map((x) => tileSprite(x.logo, imgs.get(x.logo) ?? null, x.name, S, false, f));
    sprG = tiles.map((x) => tileSprite(x.logo, imgs.get(x.logo) ?? null, x.name, Math.round(S * 0.6), true, f));
    lab = tiles.map((x) => labelSprite(x.name, dpr, f));
    core = coreSprite(Math.round(T * 1.12 * dpr * 1.4));
    ready = true;
    if (intro < 0 && want && !reduce) intro = 0;
    kick();
  }

  /* ── One frame ── */
  function draw(dt: number) {
    if (!W || !H) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    if (!ready || intro < 0) return;

    // Camera: drag inertia, then either turn to the faced ring or drift.
    const vl = Math.hypot(vel[0], vel[1], vel[2]);
    if (!drag && vl > 0.005) {
      qBase = qNorm(qMul(qAxis(vel[0] / vl, vel[1] / vl, vel[2] / vl, vl * dt), qBase));
      const k = Math.exp(-2.6 * dt);
      vel = [vel[0] * k, vel[1] * k, vel[2] * k];
    }
    if (!drag && !reduce) {
      if (qT && vl < 0.6) qBase = qSlerp(qBase, qT, ease(2.4, dt));
      else if (!qT) qBase = qNorm(qMul(qAxis(0, 1, 0, DRIFT * dt), qBase));
    }
    const qPar = qMul(qAxis(0, 1, 0, ex * 0.16), qAxis(1, 0, 0, ey * 0.1));
    const [x, y, z, w] = qMul(qPar, qBase);
    const m00 = 1 - 2 * (y * y + z * z), m01 = 2 * (x * y - z * w), m02 = 2 * (x * z + y * w);
    const m10 = 2 * (x * y + z * w), m11 = 1 - 2 * (x * x + z * z), m12 = 2 * (y * z - x * w);
    const m20 = 2 * (x * z - y * w), m21 = 2 * (y * z + x * w), m22 = 1 - 2 * (x * x + y * y);

    zoom += (zoomTo - zoom) * (reduce ? 1 : ease(2.6, dt));
    const kW = reduce ? 1 : ease(4, dt);
    for (let k = 0; k < NR; k++) {
      act[k] += ((focus === k ? 1 : 0) - act[k]) * kW;
      dim[k] += ((focus >= 0 && focus !== k ? 1 : 0) - dim[k]) * kW;
      spd[k] += ((focus === k ? 0.22 : 1) - spd[k]) * ease(2, dt);
      if (!reduce) {
        ring[k].ph += ring[k].w * spd[k] * dt;
        ring[k].comet += (ring[k].w > 0 ? 1 : -1) * 0.62 * dt;
      }
    }
    const it = intro;
    const cx = W / 2, cy = H / 2, UZ = U * zoom;
    const edge = T * dpr * 0.9;
    const proj = (wx: number, wy: number, wz: number, o: Float32Array, j: number, oy: Float32Array, oz: Float32Array) => {
      const vx = m00 * wx + m01 * wy + m02 * wz, vy = m10 * wx + m11 * wy + m12 * wz, vz = m20 * wx + m21 * wy + m22 * wz;
      const s = CAM / (CAM - vz);
      o[j] = cx + vx * s * UZ;
      oy[j] = cy - vy * s * UZ;
      oz[j] = vz;
      return s;
    };

    // Tiles: place, size, fade.
    const hv = hit >= 0 ? hit : extHover ?? -1;
    for (let i = 0; i < NT; i++) {
      const tl = tiles[i], R = ring[tl.k];
      const e = smooth((it - 0.35 - tl.k * 0.12 - tl.j * 0.06) / 0.8);
      const a = R.ph + (tl.j / tl.m) * TAU;
      const rr = R.r * (0.1 + 0.9 * outBack(e)); // tiles fly out of the core
      const c = Math.cos(a) * rr, s = Math.sin(a) * rr;
      const sc = proj(R.u[0] * c + R.v[0] * s, R.u[1] * c + R.v[1] * s, R.u[2] * c + R.v[2] * s, TX, i, TY, TZ);
      hov[i] += ((i === hv ? 1 : 0) - hov[i]) * (reduce ? 1 : ease(10, dt));
      const dn = clamp01((TZ[i] + 1) / 2);
      const near = 0.62 + 0.38 * dn;
      const base = near + (1 - near) * act[tl.k];
      const D = dim[tl.k] * (1 - hov[i]); // a hovered tile of a dimmed ring lights up again
      // Fade out near the canvas edges, so a zoomed-in figure never shows a cut tile.
      const ef = clamp01(Math.min(TY[i], H - TY[i]) / edge) * clamp01(Math.min(TX[i], W - TX[i]) / edge);
      TA[i] = e * ef * (base * (1 - D) + 0.34 * near * D);
      TS[i] = T * dpr * sc * Math.sqrt(zoom) * (0.86 + 0.16 * act[tl.k] + 0.14 * hov[i]) * (0.5 + 0.5 * e);
    }
    order.sort((p, q) => TZ[p] - TZ[q]);

    // Hover hit-test, nearest first.
    if (pIn && !drag) {
      let h = -1;
      for (let q = NT - 1; q >= 0; q--) {
        const i = order[q], r = TS[i] * 0.46;
        if (TA[i] > 0.15 && Math.abs(pX - TX[i]) < r && Math.abs(pY - TY[i]) < r) {
          h = i;
          break;
        }
      }
      hit = h;
    } else hit = -1;
    if (hit !== lastHit) {
      lastHit = hit;
      opts.onHover?.(hit >= 0 ? hit : null);
    }
    const cur = drag && dMoved > 4 ? "grabbing" : hit >= 0 ? "pointer" : "grab";
    if (cur !== cursor) canvas.style.cursor = cursor = cur;

    // Ring arcs, split into far and near halves.
    const ringPass = (near: boolean) => {
      for (let k = 0; k < NR; k++) {
        const R = ring[k];
        const drawn = Math.floor(SEG * smooth((it - k * 0.12) / 1));
        if (drawn < 2) continue;
        for (let s = 0; s < SEG; s++) proj(R.pts[s * 3], R.pts[s * 3 + 1], R.pts[s * 3 + 2], PX, s, PY, PZ);
        const A = act[k], D = dim[k];
        const base = (0.17 * (1 - D) + 0.05 * D) * (1 - A) + 0.62 * A;
        const col = RING_IDLE.map((c, i) => Math.round(c + (RING_ACT[i] - c) * Math.max(A, 0.15))).join(",");
        ctx.lineWidth = (1 + 0.5 * A) * dpr;
        for (let s0 = 0; s0 < drawn; s0 += CHUNK) {
          const s1 = Math.min(drawn, s0 + CHUNK);
          const zm = (PZ[s0 % SEG] + PZ[s1 % SEG]) / 2;
          if (zm >= 0 !== near) continue;
          const dn = clamp01((zm / R.r + 1) / 2);
          ctx.strokeStyle = `rgba(${col},${(base * (0.3 + 0.7 * dn)).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(PX[s0], PY[s0]);
          for (let s = s0 + 1; s <= s1; s++) ctx.lineTo(PX[s % SEG], PY[s % SEG]);
          ctx.stroke();
        }
      }
    };

    const tilePass = (near: boolean) => {
      for (let q = 0; q < NT; q++) {
        const i = order[q];
        const k = tiles[i].k, D = dim[k] * (1 - hov[i]);
        // Greyed tiles always go behind the core, so the faced ring reads cleanly.
        if ((TZ[i] >= 0 && D < 0.5) !== near) continue;
        const a = TA[i];
        if (a < 0.01) continue;
        // The sprite carries a shadow margin of 32% of the tile on each side.
        const sz = TS[i], d = sz * 1.64;
        if (D < 0.99) {
          ctx.globalAlpha = a * (1 - D);
          ctx.drawImage(spr[i], TX[i] - d / 2, TY[i] - d / 2, d, d);
        }
        if (D > 0.01) {
          ctx.globalAlpha = a * D;
          ctx.drawImage(sprG[i], TX[i] - d / 2, TY[i] - d / 2, d, d);
        }
        const la = Math.max(act[k] * (1 - dim[k]), hov[i]) * a;
        if (la > 0.02) {
          const L = lab[i], lw = L.width, lh = L.height;
          ctx.globalAlpha = la;
          ctx.drawImage(L, TX[i] - lw / 2, TY[i] + sz * 0.5 + 2 * dpr + (1 - la) * 6 * dpr, lw, lh);
        }
      }
      ctx.globalAlpha = 1;
    };

    ringPass(false);
    tilePass(false);

    // Core: a ripple every few seconds, the glow and the block.
    if (core) {
      const ce = outBack(it / 0.7);
      if (!reduce && it > 1) {
        const ph = ((t * 0.26) % 1 + 1) % 1;
        ctx.strokeStyle = `rgba(0,87,217,${(0.2 * (1 - ph) * (1 - ph) * (1 - (focus >= 0 ? 0.5 : 0))).toFixed(3)})`;
        ctx.lineWidth = dpr;
        ctx.beginPath();
        ctx.arc(cx, cy, T * dpr * 0.7 + ph * ring[0].r * UZ * 0.95, 0, TAU);
        ctx.stroke();
      }
      const cs = (core.width * ce * (1 + (reduce ? 0 : 0.025 * Math.sin(t * 1.7)))) / 1.4;
      ctx.drawImage(core, cx - cs / 2, cy - cs / 2, cs, cs);
    }

    ringPass(true);

    // Comets: a short bright streak running round each ring.
    if (!reduce) {
      ctx.lineCap = "round";
      for (let k = 0; k < NR; k++) {
        const R = ring[k];
        const ca = (0.5 * (1 - dim[k]) + 0.5 * act[k]) * smooth((it - 1.1 - k * 0.12) / 0.6);
        if (ca < 0.02) continue;
        const dir = R.w > 0 ? 1 : -1, n = 14, len = 0.95;
        let lx = 0, ly = 0;
        for (let s = 0; s <= n; s++) {
          const a = R.comet - dir * len * (1 - s / n);
          const c = Math.cos(a) * R.r, si = Math.sin(a) * R.r;
          proj(R.u[0] * c + R.v[0] * si, R.u[1] * c + R.v[1] * si, R.u[2] * c + R.v[2] * si, PX, 0, PY, PZ);
          if (s > 0) {
            const f = s / n;
            ctx.strokeStyle = `rgba(0,96,235,${(ca * f * f * (0.45 + 0.55 * clamp01((PZ[0] / R.r + 1) / 2))).toFixed(3)})`;
            ctx.lineWidth = (0.8 + 1.6 * f) * dpr;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(PX[0], PY[0]);
            ctx.stroke();
          }
          lx = PX[0];
          ly = PY[0];
        }
        const g = 16 * dpr;
        ctx.globalAlpha = ca;
        ctx.drawImage(glow, lx - g / 2, ly - g / 2, g, g);
        ctx.globalAlpha = 1;
      }
      ctx.lineCap = "butt";
    }

    tilePass(true);
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    t += dt;
    if (intro >= 0) intro += dt;
    ex += (nx - ex) * ease(2.4, dt);
    ey += (ny - ey) * ease(2.4, dt);
    draw(dt);
    if (running) raf = requestAnimationFrame(frame);
  }

  /** Reduced motion has no loop: redraw once whenever something changes. */
  function kick() {
    if (reduce) {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw(1);
        });
    } else if (!running) draw(0);
  }

  function size() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    W = w;
    H = h;
    T = rect.width < 640 ? 42 : 56;
    U = Math.max(40, Math.min(W / 2 - T * 0.75 * dpr, H / 2 - T * 0.7 * dpr) / 1.08);
    if (focus >= 0) zoomTo = zoomFor(focus);
    build();
    kick();
  }

  function zoomFor(k: number) {
    const lim = Math.min(W / 2 - T * 1.3 * dpr, H / 2 - (T * 0.95 + 30) * dpr);
    return Math.max(0.8, Math.min(1.65, lim / (ring[k].r * 1.08 * U)));
  }

  /* ── Pointer ── */
  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left) * dpr, (e.clientY - r.top) * dpr, r] as const;
  };
  const onMove = (e: PointerEvent) => {
    const [lx, ly, r] = local(e);
    pX = lx;
    pY = ly;
    pIn = e.pointerType !== "touch" || drag;
    if (e.pointerType !== "touch") {
      nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    }
    if (!drag) return;
    const dx = e.clientX - dLX, dy = e.clientY - dLY, now = performance.now();
    dLX = e.clientX;
    dLY = e.clientY;
    dMoved += Math.abs(dx) + Math.abs(dy);
    if (dMoved < 4 || reduce) return;
    const len = Math.hypot(dx, dy);
    if (!len) return;
    const ang = len * 0.0065, ax = dy / len, ay = dx / len;
    qBase = qNorm(qMul(qAxis(ax, ay, 0, ang), qBase));
    const ddt = Math.max(0.008, (now - dLT) / 1000);
    dLT = now;
    const sp = Math.min(6, ang / ddt);
    vel = [vel[0] * 0.5 + ax * sp * 0.5, vel[1] * 0.5 + ay * sp * 0.5, 0];
    kick();
  };
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag = true;
    dMoved = 0;
    dLX = e.clientX;
    dLY = e.clientY;
    dLT = performance.now();
    vel = [0, 0, 0];
    onMove(e);
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
  };
  const onUp = (e: PointerEvent) => {
    if (!drag) return;
    drag = false;
    if (performance.now() - dLT > 90) vel = [0, 0, 0]; // held still before letting go: no fling
    if (dMoved < 6) {
      const [lx, ly] = local(e);
      // Fresh hit-test at the release point (touch has no hover).
      let h = -1;
      for (let q = NT - 1; q >= 0; q--) {
        const i = order[q], r = TS[i] * 0.5;
        if (TA[i] > 0.15 && Math.abs(lx - TX[i]) < r && Math.abs(ly - TY[i]) < r) {
          h = i;
          break;
        }
      }
      if (h >= 0) opts.onPick?.(tiles[h].k);
    }
    if (e.pointerType === "touch") pIn = false;
    kick();
  };
  const onLeave = (e: PointerEvent) => {
    if (drag && e.type !== "pointercancel") return;
    if (e.type === "pointercancel") drag = false;
    pIn = false;
    nx = ny = 0;
    kick();
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onLeave);
  canvas.addEventListener("pointerleave", onLeave);

  /* ── Lifecycle ── */
  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  // Fetch the logos once the section is within a screen or so.
  const pre = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        load();
        pre.disconnect();
      }
    },
    { rootMargin: "100% 0px" }
  );
  pre.observe(watch);
  // Run the loop while near the viewport.
  const io = new IntersectionObserver(
    ([e]) => {
      if (reduce) return;
      if (e.isIntersecting && !running) {
        running = true;
        last = 0;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    { rootMargin: "120px 0px" }
  );
  io.observe(watch);
  // Start the intro (and tell the page) once the figure is properly in view.
  const seen = new IntersectionObserver(
    ([e]) => {
      const v = e.intersectionRatio >= 0.3;
      if (v) {
        want = true;
        if (ready && intro < 0) intro = reduce ? 99 : 0;
        kick();
      }
      if (v !== visible) {
        visible = v;
        opts.onVisible?.(v);
      }
    },
    { threshold: [0, 0.3, 0.6] }
  );
  seen.observe(canvas);

  return {
    setFocus(k) {
      k = k >= 0 && k < NR ? k : -1;
      if (k === focus) return;
      focus = k;
      if (k < 0) {
        qT = null;
        zoomTo = 1;
      } else {
        // Turn the shortest way until this ring faces the viewer from a little above.
        const n = qRot(qBase, ring[k].n);
        const to = [0, Math.sin(FACE), Math.cos(FACE)];
        const s = n[0] * to[0] + n[1] * to[1] + n[2] * to[2] < 0 ? -1 : 1;
        qT = qMul(qFromTo([n[0] * s, n[1] * s, n[2] * s], to), qBase);
        zoomTo = zoomFor(k);
        if (reduce) {
          qBase = qT;
          zoom = zoomTo;
        }
      }
      if (reduce && k < 0) zoom = 1;
      kick();
    },
    setHover(i) {
      extHover = i;
      kick();
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      pre.disconnect();
      io.disconnect();
      seen.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onLeave);
      canvas.removeEventListener("pointerleave", onLeave);
    },
  };
}
