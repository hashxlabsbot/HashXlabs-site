import { buildShapes, rng } from "./audienceShapes";

/* The particle figure behind "Who we work with" (components/home/Audiences.tsx).

   One 2D canvas, one rAF loop that only runs while the section is near the
   viewport. Each frame: every particle eases toward its point on the current
   shape (with a spiral flight while morphing), the whole cloud is rotated and
   projected with perspective, nearer points are drawn larger and brighter, and
   everything is drawn additively from three pre-rendered glow sprites, batched
   by colour and brightness. The cloud gathers out of a scattered swarm as the
   figure scrolls into view; the cursor turns the camera and pushes points
   aside. No DOM is written per frame. */

export type AudienceField = {
  setShape(i: number): void;
  setPointer(clientX: number | null, clientY?: number): void;
  destroy(): void;
};

const TAU = Math.PI * 2;
const CAM = 4.2; // camera distance, model units
const SPIN = 0.28; // idle turn, rad/s
const TILT = -0.32; // camera a little above the figure
const MORPH = 1.2; // seconds each particle spends in flight
const SPREAD = 0.45; // seconds between the first and the last particle leaving
const UNIT = 0.32; // one model unit, as a share of the canvas's shorter side
const MID_Y = -0.14; // model y drawn at the canvas centre
const LEVELS = 8; // brightness buckets per colour
const COLORS = ["61,134,255", "80,220,255", "120,150,210"]; // shape, live/sparkle, dust

const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);
const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function sprite(rgb: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 48;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(24, 24, 0, 24, 24, 24);
    grd.addColorStop(0, `rgba(${rgb},1)`);
    grd.addColorStop(0.2, `rgba(${rgb},.9)`);
    grd.addColorStop(0.5, `rgba(${rgb},.24)`);
    grd.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grd;
    g.fillRect(0, 0, 48, 48);
  }
  return c;
}

export function createAudienceField(
  canvas: HTMLCanvasElement,
  watch: HTMLElement,
  opts: { reduce: boolean; onVisible?: (visible: boolean) => void }
): AudienceField {
  const ctx0 = canvas.getContext("2d");
  if (!ctx0) return { setShape() {}, setPointer() {}, destroy() {} };
  const ctx: CanvasRenderingContext2D = ctx0;
  const { reduce } = opts;
  const small = window.matchMedia("(max-width: 700px)").matches;

  const N = small ? 1600 : 3200;
  const shapes = buildShapes(N);
  const K = shapes[0].K;
  const M = N - K;
  const r = rng(7);

  // Ambient points: a dotted floor ring (solid outer, dashed inner) and slow dust.
  const PED = small ? 150 : 240;
  const DUST = small ? 70 : 140;
  const A = PED + DUST;
  const T = N + A;
  const amb = new Float32Array(A * 3);
  const outer = Math.round(PED * 0.6);
  for (let q = 0; q < PED; q++) {
    let a: number, rad: number;
    if (q < outer) {
      a = (q / outer) * TAU;
      rad = 1.02;
    } else {
      const k = q - outer, per = Math.ceil((PED - outer) / 12);
      a = Math.floor(k / per) * (TAU / 12) + ((k % per) / per) * (TAU / 12) * 0.55;
      rad = 0.8;
    }
    amb[q * 3] = Math.cos(a) * rad;
    amb[q * 3 + 1] = -1.02;
    amb[q * 3 + 2] = Math.sin(a) * rad;
  }
  const dustV = new Float32Array(DUST);
  for (let q = PED; q < A; q++) {
    amb[q * 3] = (r() * 2 - 1) * 2.2;
    amb[q * 3 + 1] = (r() * 2 - 1) * 1.6;
    amb[q * 3 + 2] = (r() * 2 - 1) * 1.6;
    dustV[q - PED] = 0.02 + r() * 0.05;
  }

  // Per-particle attributes.
  const sz = new Float32Array(T); // size factor
  const ph = new Float32Array(N); // shimmer phase
  const acc = new Uint8Array(N); // 1 = sparkle (accent colour)
  const st = new Float32Array(N); // assembly stagger
  const scx = new Float32Array(N), scy = new Float32Array(N), scz = new Float32Array(N); // scattered swarm
  for (let i = 0; i < T; i++) sz[i] = 0.65 + r() * 0.55;
  for (let i = 0; i < N; i++) {
    ph[i] = r() * TAU;
    st[i] = r();
    if (r() < 0.045) {
      acc[i] = 1;
      sz[i] = 1.4 + r() * 0.5;
    }
    const u = r() * 2 - 1, a = r() * TAU, rr = Math.sqrt(1 - u * u), d = 1.5 + r() * 1.5;
    scx[i] = Math.cos(a) * rr * d * 1.25;
    scy[i] = u * d * 0.75;
    scz[i] = Math.sin(a) * rr * d;
  }

  // Motion state.
  const cur = new Float32Array(N * 3); // where each point is on its way (before shimmer/assembly)
  const curA = new Float32Array(N);
  const from = new Float32Array(N * 3);
  const fromA = new Float32Array(N);
  const swirl = new Float32Array(N * 3);
  const delay = new Float32Array(N);
  cur.set(shapes[0].pos);
  curA.fill(1);
  const offX = new Float32Array(T), offY = new Float32Array(T); // eased cursor push, canvas px

  // Draw lists.
  const PX = new Float32Array(T), PY = new Float32Array(T), PS = new Float32Array(T);
  const lists = Array.from({ length: COLORS.length * LEVELS }, () => new Int32Array(T));
  const counts = new Int32Array(COLORS.length * LEVELS);
  const sprites = COLORS.map(sprite);
  const o3 = new Float32Array(3);

  let to = 0;
  let mT0 = -99; // morph start (seconds of figure time)
  let t = reduce ? 1.3 : 0;
  let spin = reduce ? -0.45 : 0.6; // the still figure gets a three-quarter view
  let asm = reduce ? 1 : 0;
  let asmTo = asm; // where the gather is heading, from the scroll position
  let last = 0, raf = 0, running = false;
  let pOn = false, pX = 0, pY = 0, nx = 0, ny = 0, ex = 0, ey = 0;
  let W = 0, H = 0, dpr = 1;
  // Per-frame camera, shared with put().
  let U = 0, X0 = 0, Y0 = 0, ct = 1, sn = 0, cp = 1, sp = 0, kP = 1, pr = 70, push = 30, base = 3.4;

  function put(i: number, x: number, y: number, z: number, a: number, c: number) {
    const x1 = x * ct + z * sn, z1 = z * ct - x * sn;
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const s = CAM / (CAM + z2);
    let X = X0 + x1 * s * U, Y = Y0 - y2 * s * U;
    let gx = 0, gy = 0;
    if (pOn) {
      const dx = X - pX, dy = Y - pY, d2 = dx * dx + dy * dy;
      if (d2 < pr * pr && d2 > 0.01) {
        const d = Math.sqrt(d2), f = ((1 - d / pr) * (1 - d / pr) * push) / d;
        gx = dx * f;
        gy = dy * f;
      }
    }
    offX[i] += (gx - offX[i]) * kP;
    offY[i] += (gy - offY[i]) * kP;
    X += offX[i];
    Y += offY[i];
    const n = clamp01(0.5 - z2 * 0.45);
    const al = a * (0.16 + 0.84 * n);
    if (al < 0.03 || X < -24 || Y < -24 || X > W + 24 || Y > H + 24) return;
    const b = c * LEVELS + Math.min(LEVELS - 1, (al * LEVELS) | 0);
    lists[b][counts[b]++] = i;
    PX[i] = X;
    PY[i] = Y;
    PS[i] = base * s * sz[i] * (0.7 + 0.6 * n);
  }

  function draw(dt: number) {
    if (!W || !H) return;
    U = Math.min(W, H) * UNIT;
    X0 = W / 2;
    Y0 = H / 2 + MID_Y * U;
    const th = spin + ex * 0.65, tl = TILT + ey * 0.22;
    ct = Math.cos(th);
    sn = Math.sin(th);
    cp = Math.cos(tl);
    sp = Math.sin(tl);
    kP = reduce ? 1 : ease(9, dt);
    counts.fill(0);

    const S = shapes[to], pos = S.pos;
    const tm = t - mT0;
    const morphing = tm < MORPH + SPREAD + 0.1;
    for (let i = 0; i < N; i++) {
      const j = i * 3, live = i >= M;
      let x: number, y: number, z: number, a: number;
      if (live) {
        a = S.live(i - M, t, o3);
        x = o3[0];
        y = o3[1];
        z = o3[2];
      } else {
        x = pos[j];
        y = pos[j + 1];
        z = pos[j + 2];
        a = 1;
      }
      if (morphing) {
        let e = (tm - delay[i]) / MORPH;
        if (e < 1) {
          e = e <= 0 ? 0 : e < 0.5 ? 4 * e * e * e : 1 - Math.pow(2 - 2 * e, 3) / 2;
          const b = Math.sin(Math.PI * e);
          x = from[j] + (x - from[j]) * e + swirl[j] * b;
          y = from[j + 1] + (y - from[j + 1]) * e + swirl[j + 1] * b;
          z = from[j + 2] + (z - from[j + 2]) * e + swirl[j + 2] * b;
          a = fromA[i] + (a - fromA[i]) * e + b * 0.35;
        }
      }
      cur[j] = x;
      cur[j + 1] = y;
      cur[j + 2] = z;
      curA[i] = a;
      if (!live && !reduce) {
        x += Math.sin(t * 1.3 + ph[i]) * 0.004;
        y += Math.cos(t * 1.1 + ph[i] * 1.7) * 0.004;
      }
      if (asm < 1) {
        let k = (asm - st[i] * 0.4) / 0.6;
        if (k < 1) {
          k = k <= 0 ? 0 : k * k * (3 - 2 * k);
          const q = (1 - k) * 2.4, c = Math.cos(q), s = Math.sin(q);
          const qx = scx[i] * c - scz[i] * s, qz = scx[i] * s + scz[i] * c;
          x = qx + (x - qx) * k;
          y = scy[i] + (y - scy[i]) * k;
          z = qz + (z - qz) * k;
          a *= 0.35 + 0.65 * k;
        }
      }
      put(i, x, y, z, a, live ? 1 : acc[i]);
    }

    const ga = 0.25 + 0.75 * asm;
    for (let q = 0; q < PED; q++) put(N + q, amb[q * 3], amb[q * 3 + 1], amb[q * 3 + 2], 0.42 * ga, 0);
    for (let q = PED; q < A; q++) {
      let y = amb[q * 3 + 1] + dt * dustV[q - PED];
      if (y > 1.6) y -= 3.2;
      amb[q * 3 + 1] = y;
      put(N + q, amb[q * 3], y, amb[q * 3 + 2], 0.55 * ga, 2);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (let c = 0; c < COLORS.length; c++) {
      const spr = sprites[c];
      for (let l = 0; l < LEVELS; l++) {
        const b = c * LEVELS + l, n = counts[b];
        if (!n) continue;
        ctx.globalAlpha = ((l + 0.5) / LEVELS) * 0.95;
        const L = lists[b];
        for (let q = 0; q < n; q++) {
          const i = L[q], s = PS[i];
          ctx.drawImage(spr, PX[i] - s / 2, PY[i] - s / 2, s, s);
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function frame(now: number) {
    raf = 0;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;
    t += dt;
    spin += SPIN * dt;
    asm += (asmTo - asm) * ease(3.2, dt);
    if (Math.abs(asmTo - asm) < 0.0005) asm = asmTo;
    ex += (nx - ex) * ease(2.4, dt);
    ey += (ny - ey) * ease(2.4, dt);
    draw(dt);
    if (running) raf = requestAnimationFrame(frame);
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
    pr = 72 * dpr;
    push = 30 * dpr;
    base = (small ? 3.4 : 3.9) * dpr;
    if (!running) draw(0);
  }

  const ro = new ResizeObserver(size);
  ro.observe(canvas);
  const io = new IntersectionObserver(
    ([e]) => {
      opts.onVisible?.(e.isIntersecting);
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
  // Gather the swarm as the figure comes up the viewport. The observer reports
  // its position while it crosses in, without a layout read every frame.
  const gather = new IntersectionObserver(
    ([e]) => {
      if (reduce) return;
      const vh = e.rootBounds?.height || window.innerHeight, rc = e.boundingClientRect;
      asmTo = clamp01((vh - rc.top) / Math.max(1, Math.min(rc.height * 0.85, vh * 0.75)));
    },
    { threshold: Array.from({ length: 51 }, (_, i) => i / 50) }
  );
  gather.observe(canvas);

  return {
    setShape(i) {
      if (i === to || !shapes[i]) return;
      const S = shapes[i];
      to = i;
      if (reduce) {
        draw(0);
        return;
      }
      from.set(cur);
      fromA.set(curA);
      mT0 = t;
      for (let k = 0; k < N; k++) {
        const j = k * 3;
        // Bottom of the new shape leaves first, so it builds upward.
        delay[k] = clamp01((S.pos[j + 1] + 1.1) / 2.2) * SPREAD * 0.75 + Math.random() * SPREAD * 0.25;
        const hx = from[j], hz = from[j + 2], hl = Math.hypot(hx, hz) || 1;
        // Mostly tangential, a little outward: the cloud spins up into a vortex between shapes.
        const ux = hx / hl, uz = hz / hl, amp = 0.42 + Math.random() * 0.45;
        swirl[j] = (ux * 0.45 - uz * 0.95) * amp;
        swirl[j + 1] = (Math.random() - 0.5) * 0.35 * amp;
        swirl[j + 2] = (uz * 0.45 + ux * 0.95) * amp;
      }
      if (!running) draw(0);
    },
    setPointer(clientX, clientY) {
      if (clientX === null || clientY === undefined) {
        pOn = false;
        nx = ny = 0;
        return;
      }
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const fx = (clientX - rect.left) / rect.width, fy = (clientY - rect.top) / rect.height;
      pOn = !reduce;
      pX = fx * W;
      pY = fy * H;
      nx = Math.max(-1, Math.min(1, fx * 2 - 1));
      ny = Math.max(-1, Math.min(1, fy * 2 - 1));
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gather.disconnect();
    },
  };
}
