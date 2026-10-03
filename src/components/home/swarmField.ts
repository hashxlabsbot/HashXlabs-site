import { canvasOf, coreSprite, glowSprite, readFonts, tileSprite, type Fonts } from "./techSprites";

/* The scroll-driven logo swarm behind "Technology" (components/home/TechSwarm.tsx).

   Every tool is a tile in 3D. Scrolling through the pinned section moves them
   through four formations: a deep swarm, the HashX "X" around the core, a
   spinning sphere, and finally five labelled columns (one per group). Each
   tile flies its own curved, staggered path between formations, flipping and
   rolling on the way and leaving a light streak when it moves fast, so the
   change reads as a flock rather than a slide. Scroll position is read once a
   frame (one rect read, no DOM writes besides the progress bar) and eased, so
   wheel steps still glide; scrolling back plays it in reverse.

   One 2D canvas, one rAF loop that only runs while the section is near the
   viewport. Tiles, labels and the core are pre-rendered sprites. */

export type SwarmGroup = { group: string; items: { name: string; logo: string }[] };
export type TechSwarm = { destroy(): void };
type Opts = {
  reduce: boolean;
  /** 0 swarm, 1 X, 2 sphere, 3 columns. */
  onPhase?: (phase: number) => void;
  /** Pointer over a tile in the final columns (global index), or null. */
  onHover?: (i: number | null) => void;
  /** Scaled 0..1 along x with the pinned progress. */
  bar?: HTMLElement | null;
};

const TAU = Math.PI * 2;
const CAM = 1500; // camera distance, CSS px
/** Pinned progress windows of the three morphs: swarm→X, X→sphere, sphere→columns. */
const SEG: [number, number][] = [
  [0.03, 0.25],
  [0.39, 0.57],
  [0.69, 0.87],
];
const STARS = 240;

const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  const k = clamp01(x);
  return k * k * k * (k * (k * 6 - 15) + 10);
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** White name text for the dark stage. */
function nameSprite(text: string, px: number, weight: number, color: string, family: string, dpr: number) {
  const fs = px * dpr;
  const m = canvasOf(1, 1).getContext("2d");
  if (m) m.font = `${weight} ${fs}px ${family}`;
  const w = m ? m.measureText(text).width : text.length * fs * 0.55;
  const c = canvasOf(w + 4 * dpr, fs * 1.5);
  const g = c.getContext("2d");
  if (!g) return c;
  g.font = `${weight} ${fs}px ${family}`;
  g.fillStyle = color;
  g.textBaseline = "middle";
  g.fillText(text, 2 * dpr, c.height / 2);
  return c;
}

function headSprite(n: string, text: string, f: Fonts, dpr: number) {
  const a = nameSprite(n, 11, 500, "#5b9bff", f.mono, dpr);
  const b = nameSprite(text, 15.5, 600, "#ffffff", f.display, dpr);
  const c = canvasOf(a.width + b.width + 8 * dpr, Math.max(a.height, b.height));
  const g = c.getContext("2d");
  if (g) {
    g.drawImage(a, 0, (c.height - a.height) / 2);
    g.drawImage(b, a.width + 8 * dpr, (c.height - b.height) / 2);
  }
  return c;
}

export function createTechSwarm(canvas: HTMLCanvasElement, track: HTMLElement, groups: SwarmGroup[], opts: Opts): TechSwarm {
  const ctx0 = canvas.getContext("2d");
  if (!ctx0) return { destroy() {} };
  const ctx: CanvasRenderingContext2D = ctx0;
  const { reduce } = opts;

  const tiles: { k: number; j: number; name: string; logo: string }[] = [];
  groups.forEach((G, k) => G.items.forEach((it, j) => tiles.push({ k, j, name: it.name, logo: it.logo })));
  const N = tiles.length;

  // Per-tile randomness: flight stagger and curve per morph, flip/roll, swarm drift.
  const r = rng(11);
  const delay = Array.from({ length: SEG.length }, () => Float32Array.from({ length: N }, () => r()));
  const swirl = Array.from({ length: SEG.length }, () => Float32Array.from({ length: N * 3 }, () => r() * 2 - 1));
  const flip = Float32Array.from({ length: N }, () => (r() < 0.55 ? (r() < 0.5 ? 1 : -1) : 0));
  const roll = Float32Array.from({ length: N }, () => (r() * 2 - 1) * 1.1);
  const ph = Float32Array.from({ length: N }, () => r() * TAU);
  const sw = Float32Array.from({ length: N * 3 }, () => r()); // swarm base, 0..1
  // Sphere directions (Fibonacci), shuffled so each group spreads around the globe.
  const sd = new Float32Array(N * 3);
  const perm = Array.from({ length: N }, (_, i) => i).sort(() => r() - 0.5);
  for (let q = 0; q < N; q++) {
    const i = perm[q], y = 1 - ((q + 0.5) / N) * 2, rad = Math.sqrt(1 - y * y), a = q * Math.PI * (3 - Math.sqrt(5));
    sd[i * 3] = Math.cos(a) * rad;
    sd[i * 3 + 1] = y;
    sd[i * 3 + 2] = Math.sin(a) * rad;
  }
  // Stars: x, y in 0..1, depth 0.15..1.
  const st = Float32Array.from({ length: STARS * 3 }, (_, q) => (q % 3 === 2 ? 0.15 + r() * 0.85 : r()));

  // Formations, in CSS px around the stage centre (recomputed on resize).
  const FX = new Float32Array(N * 4), FG = new Float32Array(N * 4); // x, y, z, size
  const labX = new Float32Array(N), labY = new Float32Array(N);
  const headX = new Float32Array(groups.length), headY = new Float32Array(groups.length);
  const bars: number[][] = [[], []]; // tiles of each X bar, end to end
  let T = 48, Rs = 280, oxX = 0, portrait = false, showNames = true;

  // Screen state.
  const SX = new Float32Array(N), SY = new Float32Array(N), SZ = new Float32Array(N), SS = new Float32Array(N), SA = new Float32Array(N);
  const PX = new Float32Array(N), PY = new Float32Array(N), FL = new Float32Array(N), RO = new Float32Array(N);
  const hov = new Float32Array(N);
  const order = new Int32Array(N).map((_, i) => i);

  // Sprites.
  const imgs = new Map<string, HTMLImageElement | null>();
  let spr: HTMLCanvasElement[] = [], names: HTMLCanvasElement[] = [], heads: HTMLCanvasElement[] = [];
  let core: HTMLCanvasElement | null = null;
  const glow = glowSprite();
  let loaded = false, loading = false, builtFor = "", ready = false;

  let W = 0, H = 0, dpr = 1, cw = 0, ch = 0;
  let t = 0, p = reduce ? 1 : 0, pv = 0, phase = -1, born = 0;
  let pIn = false, mx = 0, my = 0, nx = 0, ny = 0, ex = 0, ey = 0, hit = -1, lastHit = -1, cursor = "";
  let last = 0, raf = 0, running = false, barP = -1;

  function layout() {
    portrait = cw / ch < 1.05 || cw < 820;
    const m = Math.min(cw, ch);
    T = Math.round(Math.max(24, Math.min(60, m * 0.062)));
    oxX = !portrait && cw > 1100 ? cw * 0.1 : 0;
    // The X: two bars of 14, a gap at the centre for the core.
    bars[0] = [];
    bars[1] = [];
    for (let i = 0; i < N; i++) {
      const bar = i % 2, side = (i >> 1) % 2 ? 1 : -1, j = i >> 2;
      const d = T * 1.45 + j * T * 1.22, k = Math.SQRT1_2;
      FX[i * 4] = oxX + side * d * k;
      FX[i * 4 + 1] = side * d * k * (bar ? -1 : 1);
      FX[i * 4 + 2] = 0;
      FX[i * 4 + 3] = T;
      bars[bar].push(i);
    }
    bars.forEach((b) => b.sort((a, c) => FX[a * 4] - FX[c * 4]));
    Rs = m * 0.34;
    // Columns (landscape) or rows (portrait), one per group.
    if (!portrait) {
      const colW = Math.min(232, (cw * 0.86) / groups.length);
      const tg = Math.max(30, Math.min(44, colW * 0.2));
      const rowH = tg * 1.42, rows = Math.max(...groups.map((g) => g.items.length));
      const top = -(rows * rowH + 56) / 2 - ch * 0.04;
      showNames = true;
      groups.forEach((G, k) => {
        // Names sit right of each tile, so start a little right of the column edge to centre the block.
        const left = (k - groups.length / 2) * colW + colW * 0.16;
        headX[k] = left;
        headY[k] = top + 10;
        G.items.forEach((_, j) => {
          const i = tiles.findIndex((x) => x.k === k && x.j === j);
          FG[i * 4] = left + tg / 2;
          FG[i * 4 + 1] = top + 56 + j * rowH + tg / 2;
          FG[i * 4 + 2] = 0;
          FG[i * 4 + 3] = tg;
          labX[i] = left + tg + 12;
          labY[i] = FG[i * 4 + 1];
        });
      });
    } else {
      const rowW = Math.min(cw * 0.88, 520), cols = Math.max(...groups.map((g) => g.items.length));
      const gap = 10, tg = Math.min(46, (rowW - gap * (cols - 1)) / cols), rowH = tg + 44;
      const top = -(groups.length * rowH) / 2 - ch * 0.05;
      showNames = false;
      groups.forEach((G, k) => {
        headX[k] = -rowW / 2;
        headY[k] = top + k * rowH + 10;
        G.items.forEach((_, j) => {
          const i = tiles.findIndex((x) => x.k === k && x.j === j);
          FG[i * 4] = -rowW / 2 + j * (tg + gap) + tg / 2;
          FG[i * 4 + 1] = top + k * rowH + 28 + tg / 2;
          FG[i * 4 + 2] = 0;
          FG[i * 4 + 3] = tg;
        });
      });
    }
  }

  /** Where tile i sits in formation f this frame (into o). */
  function form(f: number, i: number, o: number[]) {
    if (f === 0) {
      const bx = sw[i * 3], by = sw[i * 3 + 1], bz = sw[i * 3 + 2];
      // Right of centre on wide screens, clear of the heading on the left.
      o[0] = (portrait ? (bx * 2 - 1) * 0.6 : -0.08 + bx * 0.6) * cw + Math.sin(t * 0.31 + ph[i]) * 26;
      o[1] = (by * 2 - 1) * ch * 0.55 + Math.cos(t * 0.27 + ph[i] * 1.3) * 22;
      o[2] = -1700 + bz * 2000 + Math.sin(t * 0.2 + ph[i]) * 120;
      o[3] = T * 1.1;
    } else if (f === 1) {
      o[0] = FX[i * 4];
      o[1] = FX[i * 4 + 1] + Math.sin(t * 1.1 + i * 0.45) * 3;
      o[2] = FX[i * 4 + 2];
      o[3] = FX[i * 4 + 3];
    } else if (f === 2) {
      const a = t * 0.22 + p * 7, ca = Math.cos(a), sa = Math.sin(a);
      const x = sd[i * 3], y = sd[i * 3 + 1], z = sd[i * 3 + 2];
      const x1 = x * ca + z * sa, z1 = z * ca - x * sa;
      const tl = 0.32, y2 = y * Math.cos(tl) - z1 * Math.sin(tl), z2 = y * Math.sin(tl) + z1 * Math.cos(tl);
      o[0] = oxX + x1 * Rs;
      o[1] = y2 * Rs;
      o[2] = z2 * Rs;
      o[3] = T * 1.05;
    } else {
      o[0] = FG[i * 4];
      o[1] = FG[i * 4 + 1];
      o[2] = FG[i * 4 + 2];
      o[3] = FG[i * 4 + 3];
    }
  }

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
    const S = Math.round(Math.min(220, T * 1.9 * dpr));
    spr = tiles.map((x) => tileSprite(x.logo, imgs.get(x.logo) ?? null, x.name, S, false, f));
    names = tiles.map((x) => nameSprite(x.name, 14, 500, "rgba(226,234,248,.92)", f.body, dpr));
    heads = groups.map((g, k) => headSprite(String(k + 1).padStart(2, "0"), g.group, f, dpr));
    core = coreSprite(Math.round(T * 2 * dpr));
    // Draw every sprite once, invisibly, so its GPU upload happens now rather
    // than as a dropped frame the first time a formation shows it.
    ctx.globalAlpha = 0.003;
    for (const c of [...spr, ...names, ...heads, core, glow]) ctx.drawImage(c, 0, 0, 2, 2);
    ctx.globalAlpha = 1;
    if (!ready) born = t;
    ready = true;
    kick();
  }

  const o = [0, 0, 0, 0], o2 = [0, 0, 0, 0];

  function draw(dt: number) {
    if (!W || !H) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, W, H);

    const vel = dt > 0 ? (p - pv) / dt : 0;
    pv = p;
    const cx = W / 2, cy = H / 2;

    // Stars: drift up with scroll, stretch into streaks while the scroll moves fast.
    ctx.globalCompositeOperation = "lighter";
    const sv = Math.max(-1, Math.min(1, vel * 0.9));
    for (let b = 0; b < 2; b++) {
      ctx.strokeStyle = b ? "rgba(150,190,255,.55)" : "rgba(120,150,210,.28)";
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = (b ? 1.4 : 1) * dpr;
      ctx.beginPath();
      for (let q = 0; q < STARS; q++) {
        const k = st[q * 3 + 2];
        if ((k > 0.6 ? 1 : 0) !== b) continue;
        const x = st[q * 3] * W + ex * 30 * k * dpr;
        let y = (st[q * 3 + 1] - p * 1.4 * k + t * 0.004 * k) % 1;
        if (y < 0) y += 1;
        y = y * H + ey * 20 * k * dpr;
        const len = Math.abs(sv) * 70 * k * dpr;
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + (sv > 0 ? len : -len) + 0.6 * dpr);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    if (!ready) return;

    // Which morph, and how far along.
    let a = 0, b = 0, q = 0, s = 0;
    if (p <= SEG[0][0]) a = b = 0;
    else {
      a = b = SEG.length;
      for (s = 0; s < SEG.length; s++) {
        const [s0, s1] = SEG[s];
        if (p < s0) {
          a = b = s;
          break;
        }
        if (p <= s1) {
          a = s;
          b = s + 1;
          q = (p - s0) / (s1 - s0);
          break;
        }
      }
    }
    const qe = smooth(q);
    // The core shows from the X through the sphere.
    const xW = a === 0 ? (b === 1 ? qe : 0) : a === 1 ? 1 : a === 2 ? (b === 3 ? 1 - qe : 1) : 0;
    const gW = a === 2 && b === 3 ? qe : a === 3 ? 1 : 0; // columns weight
    const xBar = a === 1 && b === 1 ? 1 : a === 0 && b === 1 ? smooth((q - 0.55) / 0.45) : a === 1 && b === 2 ? 1 - smooth(q / 0.3) : 0;
    const ph2 = p < 0.2 ? 0 : p < 0.48 ? 1 : p < 0.78 ? 2 : 3;
    if (ph2 !== phase) {
      phase = ph2;
      opts.onPhase?.(ph2);
    }

    // Camera: the X turns into view as it forms; the columns settle square-on.
    const enterYaw = a === 0 ? (b === 1 ? 0.9 * (1 - qe) : 0.9) : 0;
    const hold = a === 1 && b === 1 ? Math.sin(t * 0.55) * 0.16 : 0;
    const look = 1 - gW * 0.85;
    const yaw = enterYaw + hold + ex * 0.28 * look, pitch = (a === 0 ? -0.25 * (1 - qe) : 0) + ey * 0.16 * look;
    const cyw = Math.cos(yaw), syw = Math.sin(yaw), cpt = Math.cos(pitch), spt = Math.sin(pitch);
    const born01 = smooth((t - born) / 1.2);

    for (let i = 0; i < N; i++) {
      form(a, i, o);
      let x = o[0], y = o[1], z = o[2], size = o[3], flipK = 0, rollK = 0;
      if (a !== b) {
        form(b, i, o2);
        const e = smooth((q - delay[a][i] * 0.38) / 0.62), bump = Math.sin(Math.PI * e);
        const R = Math.min(cw, ch) * 0.42, sv3 = swirl[a];
        x += (o2[0] - x) * e + sv3[i * 3] * R * bump;
        y += (o2[1] - y) * e + sv3[i * 3 + 1] * R * 0.7 * bump;
        z += (o2[2] - z) * e + (sv3[i * 3 + 2] * 0.6 + 0.5) * R * 1.6 * bump;
        size += (o2[3] - size) * e;
        flipK = e;
        rollK = bump;
      }
      // Camera rotation about the formation's own centre.
      const pcx = gW > 0.5 ? 0 : oxX;
      const lx = x - pcx;
      const x1 = lx * cyw + z * syw, z1 = z * cyw - lx * syw;
      const y2 = y * cpt - z1 * spt, z2 = Math.min(CAM * 0.7, y * spt + z1 * cpt);
      const k = CAM / (CAM - z2);
      SX[i] = cx + (pcx + x1 * k) * dpr;
      SY[i] = cy + y2 * k * dpr;
      SZ[i] = z2;
      hov[i] += ((i === hit ? 1 : 0) - hov[i]) * ease(12, dt || 0.016);
      SS[i] = size * k * dpr * (1 + 0.1 * hov[i]);
      const fog = clamp01(1 + z2 / 2600);
      SA[i] = (0.25 + 0.75 * fog * fog) * born01;
      // While the heading shows (before the X forms), tiles passing behind it fade so it stays readable.
      if (a === 0 && !portrait) {
        const hx = clamp01((SX[i] / dpr - cw * 0.36) / (cw * 0.08)), hy = clamp01((SY[i] / dpr - ch * 0.5) / (ch * 0.08));
        SA[i] *= 0.12 + 0.88 * Math.max(hx, hy, b === 1 ? qe : 0);
      }
      FL[i] = flip[i] ? Math.cos(Math.PI * flipK) : 1;
      RO[i] = roll[i] * rollK;
    }
    order.sort((m, n) => SZ[m] - SZ[n]);

    // Hover: only once the columns have settled.
    if (pIn && gW > 0.97 && !reduce) {
      let h = -1;
      for (let qq = N - 1; qq >= 0; qq--) {
        const i = order[qq], hs = SS[i] / 2;
        const lw = showNames ? names[i].width + 16 * dpr : 0;
        if (mx > SX[i] - hs && mx < SX[i] + hs + lw && Math.abs(my - SY[i]) < hs + 4 * dpr) {
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
    const cur = hit >= 0 ? "pointer" : "";
    if (cur !== cursor) canvas.style.cursor = cursor = cur;

    // Light streaks behind fast tiles.
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgb(70,145,255)";
    for (let i = 0; i < N; i++) {
      const dx = SX[i] - PX[i], dy = SY[i] - PY[i], v = Math.hypot(dx, dy);
      if (v > 3 * dpr && v < W * 0.5 && PX[i]) {
        // Two overlapping strokes fake a tapered streak without a gradient object per tile.
        const al = Math.min(0.5, (v / (40 * dpr)) * 0.45) * SA[i];
        ctx.globalAlpha = al * 0.45;
        ctx.lineWidth = SS[i] * 0.3;
        ctx.beginPath();
        ctx.moveTo(PX[i] - dx * 2.4, PY[i] - dy * 2.4);
        ctx.lineTo(SX[i], SY[i]);
        ctx.stroke();
        ctx.globalAlpha = al;
        ctx.lineWidth = SS[i] * 0.16;
        ctx.beginPath();
        ctx.moveTo(PX[i] - dx, PY[i] - dy);
        ctx.lineTo(SX[i], SY[i]);
        ctx.stroke();
      }
      PX[i] = SX[i];
      PY[i] = SY[i];
    }
    ctx.globalAlpha = 1;

    // The X's beams: a light line through each bar while it holds.
    if (xBar > 0.01) {
      for (const bar of bars) {
        const f0 = bar[0], f1 = bar[bar.length - 1];
        const g = ctx.createLinearGradient(SX[f0], SY[f0], SX[f1], SY[f1]);
        g.addColorStop(0, "rgba(0,110,255,0)");
        g.addColorStop(0.5, `rgba(60,150,255,${(0.5 * xBar).toFixed(3)})`);
        g.addColorStop(1, "rgba(0,110,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = T * 0.9 * dpr;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(SX[f0], SY[f0]);
        ctx.lineTo(SX[f1], SY[f1]);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.2 * dpr;
        ctx.beginPath();
        ctx.moveTo(SX[f0], SY[f0]);
        ctx.lineTo(SX[f1], SY[f1]);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.lineCap = "butt";

    const drawTile = (i: number) => {
      const al = SA[i];
      if (al < 0.02) return;
      const d = SS[i] * 1.64, c = Math.cos(RO[i]), s2 = Math.sin(RO[i]), f = Math.max(0.06, Math.abs(FL[i]));
      ctx.globalAlpha = al;
      ctx.setTransform(c * f, s2 * f, -s2, c, SX[i], SY[i]);
      ctx.drawImage(spr[i], -d / 2, -d / 2, d, d);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      if (hov[i] > 0.02) {
        const gs = SS[i] * 2.4;
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.35 * hov[i];
        ctx.drawImage(glow, SX[i] - gs / 2, SY[i] - gs / 2, gs, gs);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    // Far tiles, the core, near tiles.
    let qq = 0;
    for (; qq < N && SZ[order[qq]] < 0; qq++) drawTile(order[qq]);
    if (core && xW > 0.01) {
      const ccx = cx + oxX * dpr * (1 - gW), cs = (core.width / 2) * (0.6 + 0.4 * xW) * (1 + 0.03 * Math.sin(t * 1.8));
      const ph = (t * 0.32) % 1;
      ctx.globalAlpha = xW * (1 - ph) * (1 - ph) * 0.5;
      ctx.strokeStyle = "rgba(80,150,255,1)";
      ctx.lineWidth = dpr;
      ctx.beginPath();
      ctx.arc(ccx, cy, T * dpr * (0.9 + ph * 4), 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = xW;
      ctx.drawImage(core, ccx - cs, cy - cs, cs * 2, cs * 2);
      ctx.globalAlpha = 1;
    }
    for (; qq < N; qq++) drawTile(order[qq]);

    // Column heads and names fade in as the columns settle.
    const la = smooth((gW - 0.6) / 0.4);
    if (la > 0.01) {
      groups.forEach((_, k) => {
        const h = heads[k];
        ctx.globalAlpha = la;
        ctx.drawImage(h, cx + headX[k] * dpr, cy + headY[k] * dpr - h.height / 2 + (1 - la) * 10 * dpr);
      });
      if (showNames)
        for (let i = 0; i < N; i++) {
          const n = names[i];
          ctx.globalAlpha = la * (0.75 + 0.25 * hov[i]);
          ctx.drawImage(n, cx + labX[i] * dpr + hov[i] * 4 * dpr, cy + labY[i] * dpr - n.height / 2);
        }
      ctx.globalAlpha = 1;
    }
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    t += dt;
    // One rect read a frame: the pinned progress.
    const rc = track.getBoundingClientRect();
    const span = Math.max(1, rc.height - window.innerHeight);
    const target = clamp01(-rc.top / span);
    p += (target - p) * ease(7, dt);
    if (Math.abs(target - p) < 0.0002) p = target;
    if (opts.bar && Math.abs(p - barP) > 0.001) {
      barP = p;
      opts.bar.style.transform = `scaleX(${p.toFixed(4)})`;
    }
    ex += (nx - ex) * ease(2.5, dt);
    ey += (ny - ey) * ease(2.5, dt);
    draw(dt);
    if (running) raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (reduce) {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          t = 9;
          born = 0;
          draw(0);
        });
    } else if (!running) draw(0);
  }

  function size() {
    const rect = canvas.getBoundingClientRect();
    // A full-viewport canvas: 1.5x keeps logos crisp at ~half the pixels of 2x.
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    cw = rect.width;
    ch = rect.height;
    const w = Math.max(1, Math.round(cw * dpr)), h = Math.max(1, Math.round(ch * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    W = w;
    H = h;
    layout();
    PX.fill(0);
    build();
    kick();
  }

  const onMove = (e: PointerEvent) => {
    const rc = canvas.getBoundingClientRect();
    mx = (e.clientX - rc.left) * dpr;
    my = (e.clientY - rc.top) * dpr;
    pIn = e.pointerType !== "touch";
    if (pIn) {
      nx = Math.max(-1, Math.min(1, ((e.clientX - rc.left) / rc.width) * 2 - 1));
      ny = Math.max(-1, Math.min(1, ((e.clientY - rc.top) / rc.height) * 2 - 1));
    }
  };
  const onLeave = () => {
    pIn = false;
    nx = ny = 0;
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);

  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  const pre = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        load();
        pre.disconnect();
      }
    },
    { rootMargin: "150% 0px" }
  );
  pre.observe(track);
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
    { rootMargin: "100px 0px" }
  );
  io.observe(track);
  if (reduce) opts.onPhase?.(3);

  return {
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      pre.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    },
  };
}
