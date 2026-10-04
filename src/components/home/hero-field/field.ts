import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  DirectionalLight,
  DoubleSide,
  Group,
  InstancedMesh,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Points,
  Quaternion,
  RingGeometry,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

/* Home hero backdrop: a globe-shaped network on the light theme.

   Transactions (blue pulses) hop node to node and converge on one node;
   when they arrive a block forms there, a confirmation wave runs out across
   the links, and an arc joins it to the previous block, so a chain grows
   over the globe. The globe sits behind the hero's code panel and fades out
   under the headline; the cursor tilts it and lights the nodes near it,
   scrolling turns it away.

   Cost: four draw calls for the network (nodes, links, pulses, blocks) plus
   a handful of small meshes; all motion is uniforms or small buffer writes.
   It only renders while the hero is on screen and the tab is visible. */

export type FieldOptions = {
  canvas: HTMLCanvasElement;
  /** The hero section: sizes the canvas and drives pointer/scroll. */
  host: HTMLElement;
  /** The element the globe centres on (the code panel). */
  anchor: HTMLElement | null;
  reduced: boolean;
  onReady?: () => void;
};

// Colours as sRGB floats: ShaderMaterial output skips colour management.
const rgb = (hex: number) => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
const INK = rgb(0x1b3566);
const LINK = rgb(0x3d5d93);
const SIGNAL = rgb(0x0a63f0);
const PULSE = rgb(0x1c7bff);

const FOV = 32;
const CAM_Z = 6;
const TRAIL = 5;
const MAX_BLOCKS = 6;
const MAX_ARCS = 4;

const easeOutBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

// Shared vertex logic: how much a point faces the camera (-1 back … 1 front),
// how close it is to the pointer, and the fades over the copy.
const COMMON = /* glsl */ `
  uniform float uTime, uPx, uR, uFade, uLeft, uTop, uAspect, uHotAmt;
  uniform vec3 uCenter;
  uniform vec2 uPointer;
  float facing(vec4 mv) { return clamp((mv.z - uCenter.z) / uR, -1.0, 1.0); }
  float copyFade(vec2 ndc) {
    return smoothstep(uLeft - 0.24, uLeft + 0.06, ndc.x) * (1.0 - smoothstep(uTop - 0.06, uTop + 0.34, ndc.y));
  }
  float hotAt(vec2 ndc) {
    vec2 d = (ndc - uPointer) * vec2(uAspect, 1.0);
    return (1.0 - smoothstep(0.0, 0.34, length(d))) * uHotAmt;
  }
  float flash(vec2 fl) {
    float t = uTime - fl.x;
    return t < 0.0 ? 0.0 : fl.y * exp(-t * 2.1) * smoothstep(0.0, 0.06, t);
  }
`;

export function createField({ canvas, host, anchor, reduced, onReady }: FieldOptions): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0x000000, 0);

  const small = host.clientWidth < 760;
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAM_Z);

  scene.add(new AmbientLight(0xffffff, 1.9));
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.position.set(2, 3, 4);
  scene.add(sun);

  // Tilted so the globe's "equator" isn't flat to the viewer.
  const globe = new Group();
  const spin = new Group();
  globe.add(spin);
  globe.rotation.set(0.38, 0, -0.16);
  scene.add(globe);

  /* ── Nodes: a jittered Fibonacci sphere ── */
  const N = small ? 200 : 340;
  const nodes: Vector3[] = [];
  const GOLD = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - ((i + 0.5) / N) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * GOLD;
    const v = new Vector3(Math.cos(th) * r, y, Math.sin(th) * r);
    v.x += (Math.random() - 0.5) * 0.09;
    v.y += (Math.random() - 0.5) * 0.09;
    v.z += (Math.random() - 0.5) * 0.09;
    nodes.push(v.normalize().multiplyScalar(1 + (Math.random() - 0.5) * 0.035));
  }

  /* ── Links: each node to its three nearest, plus a few longer hops ── */
  const adj: number[][] = nodes.map(() => []);
  const edges: [number, number][] = [];
  const seen = new Set<number>();
  const link = (a: number, b: number) => {
    const k = a < b ? a * N + b : b * N + a;
    if (a === b || seen.has(k)) return;
    seen.add(k);
    edges.push([a, b]);
    adj[a].push(b);
    adj[b].push(a);
  };
  for (let i = 0; i < N; i++) {
    const order = nodes
      .map((p, j) => [p.distanceToSquared(nodes[i]), j] as const)
      .sort((x, y) => x[0] - y[0]);
    for (let k = 1; k <= 3; k++) link(i, order[k][1]);
    if (Math.random() < 0.12) link(i, order[6 + Math.floor(Math.random() * 5)][1]);
  }
  const edgeLen = (a: number, b: number) => nodes[a].distanceTo(nodes[b]);

  const uniforms = {
    uTime: { value: 0 },
    uPx: { value: 1 },
    uR: { value: 1 },
    uFade: { value: 1 },
    uLeft: { value: -2 },
    uTop: { value: 2 },
    uAspect: { value: 1 },
    uHotAmt: { value: 0 },
    uCenter: { value: new Vector3() },
    uPointer: { value: new Vector2(9, 9) },
  };

  // Node points.
  const nodeFl = new Float32Array(N * 2);
  const nodeGeo = new BufferGeometry();
  {
    const pos = new Float32Array(N * 3);
    const size = new Float32Array(N);
    const seed = new Float32Array(N);
    nodes.forEach((p, i) => {
      p.toArray(pos, i * 3);
      size[i] = Math.random() < 0.14 ? 6.2 : 3.1 + Math.random() * 1.2;
      seed[i] = Math.random();
      nodeFl[i * 2] = -100;
    });
    nodeGeo.setAttribute("position", new BufferAttribute(pos, 3));
    nodeGeo.setAttribute("aSize", new BufferAttribute(size, 1));
    nodeGeo.setAttribute("aSeed", new BufferAttribute(seed, 1));
    nodeGeo.setAttribute("aFl", new BufferAttribute(nodeFl, 2));
  }
  const nodeMat = new ShaderMaterial({
    uniforms: { ...uniforms, uInk: { value: INK }, uHot: { value: SIGNAL } },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      ${COMMON}
      attribute float aSize, aSeed;
      attribute vec2 aFl;
      varying float vA, vHot;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float front = smoothstep(-0.85, 0.9, facing(mv));
        vec4 clip = projectionMatrix * mv;
        vec2 ndc = clip.xy / clip.w;
        float f = flash(aFl);
        float hot = max(hotAt(ndc) * front, f);
        float tw = 0.86 + 0.14 * sin(uTime * 1.4 + aSeed * 6.283);
        gl_PointSize = aSize * uPx * (0.5 + 0.5 * front) * tw * (1.0 + hot * 0.95);
        vA = mix(0.13, 0.92, front) * copyFade(ndc) * uFade;
        vHot = hot;
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uInk, uHot;
      varying float vA, vHot;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.34, r);
        gl_FragColor = vec4(mix(uInk, uHot, clamp(vHot, 0.0, 1.0)), a * vA);
      }`,
  });
  spin.add(new Points(nodeGeo, nodeMat));

  // Links.
  const linkFl = new Float32Array(edges.length * 4);
  const linkGeo = new BufferGeometry();
  {
    const pos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      nodes[a].toArray(pos, i * 6);
      nodes[b].toArray(pos, i * 6 + 3);
      linkFl[i * 4] = linkFl[i * 4 + 2] = -100;
    });
    linkGeo.setAttribute("position", new BufferAttribute(pos, 3));
    linkGeo.setAttribute("aFl", new BufferAttribute(linkFl, 2));
  }
  const linkMat = new ShaderMaterial({
    uniforms: { ...uniforms, uLine: { value: LINK }, uHot: { value: SIGNAL } },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      ${COMMON}
      attribute vec2 aFl;
      varying float vA, vF;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float front = smoothstep(-0.85, 0.9, facing(mv));
        vec4 clip = projectionMatrix * mv;
        vec2 ndc = clip.xy / clip.w;
        float f = flash(aFl) * (0.35 + 0.65 * front);
        vF = f;
        vA = (mix(0.045, 0.24, front) + f * 0.75 + hotAt(ndc) * front * 0.18) * copyFade(ndc) * uFade;
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uLine, uHot;
      varying float vA, vF;
      void main() { gl_FragColor = vec4(mix(uLine, uHot, clamp(vF * 1.6, 0.0, 1.0)), vA); }`,
  });
  spin.add(new LineSegments(linkGeo, linkMat));

  /* ── Pulses: transactions hopping along the links ── */
  type Pulse = { on: boolean; wait: number; a: number; b: number; s: number; speed: number; dist: Int16Array | null; hops: number };
  const P = small ? 46 : 76;
  const pulses: Pulse[] = [];
  const pPos = new Float32Array(P * TRAIL * 3);
  const pOn = new Float32Array(P * TRAIL);
  const pGeo = new BufferGeometry();
  {
    const k = new Float32Array(P * TRAIL);
    for (let i = 0; i < P * TRAIL; i++) k[i] = i % TRAIL;
    pGeo.setAttribute("position", new BufferAttribute(pPos, 3));
    pGeo.setAttribute("aK", new BufferAttribute(k, 1));
    pGeo.setAttribute("aOn", new BufferAttribute(pOn, 1));
  }
  const pMat = new ShaderMaterial({
    uniforms: { ...uniforms, uCol: { value: PULSE } },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      ${COMMON}
      attribute float aK, aOn;
      varying float vA;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float front = smoothstep(-0.7, 0.8, facing(mv));
        vec4 clip = projectionMatrix * mv;
        vec2 ndc = clip.xy / clip.w;
        float tail = 1.0 - aK / ${TRAIL.toFixed(1)};
        gl_PointSize = uPx * (2.4 + 6.4 * tail) * (0.45 + 0.55 * front);
        vA = aOn * tail * tail * mix(0.12, 1.0, front) * copyFade(ndc) * uFade;
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCol;
      varying float vA;
      void main() {
        float r = length(gl_PointCoord - 0.5);
        gl_FragColor = vec4(uCol, smoothstep(0.5, 0.2, r) * vA);
      }`,
  });
  const pPoints = new Points(pGeo, pMat);
  pPoints.frustumCulled = false;
  spin.add(pPoints);

  const AMBIENT = small ? 18 : 30;
  const randNode = () => Math.floor(Math.random() * N);
  const startAmbient = (p: Pulse, wait: number) => {
    const a = randNode();
    p.on = true;
    p.wait = wait;
    p.a = a;
    p.b = adj[a][Math.floor(Math.random() * adj[a].length)];
    p.s = 0;
    p.speed = 0.38 + Math.random() * 0.3;
    p.dist = null;
    p.hops = 3 + Math.floor(Math.random() * 4);
  };
  for (let i = 0; i < P; i++) {
    const p: Pulse = { on: false, wait: 0, a: 0, b: 0, s: 0, speed: 0.5, dist: null, hops: 0 };
    if (i < AMBIENT) startAmbient(p, Math.random() * 2.5);
    pulses.push(p);
  }

  /* ── Blocks, confirmation rings, chain arcs ── */
  const blockMesh = new InstancedMesh(
    new BoxGeometry(1, 1, 1),
    new MeshLambertMaterial({ color: 0x2b7bff, emissive: 0x0b3fae, emissiveIntensity: 0.35 }),
    MAX_BLOCKS,
  );
  blockMesh.frustumCulled = false;
  spin.add(blockMesh);
  type Block = { node: number; born: number; dying: number };
  const blocks: Block[] = [];

  const ringGeo = new RingGeometry(0.9, 1, 64);
  const rings = Array.from({ length: 3 }, () => {
    const m = new Mesh(ringGeo, new MeshBasicMaterial({ color: 0x0a63f0, transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }));
    m.visible = false;
    spin.add(m);
    return { mesh: m, born: -100, node: 0 };
  });
  let ringNext = 0;

  type Arc = { mesh: Mesh<TubeGeometry, MeshBasicMaterial>; curve: CatmullRomCurve3; born: number; mid: Vector3 };
  const arcs: Arc[] = [];
  const dot = new Mesh(new SphereGeometry(0.017, 12, 10), new MeshBasicMaterial({ color: 0x0a63f0, transparent: true, opacity: 0 }));
  spin.add(dot);

  // Orbit ring with two satellites, turning on its own axis.
  const orbit = new Group();
  orbit.rotation.set(0.86, 0.32, 0.5);
  const orbitMat = new ShaderMaterial({
    uniforms: { ...uniforms, uCol: { value: LINK } },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      ${COMMON}
      varying float vA;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec4 clip = projectionMatrix * mv;
        vA = mix(0.05, 0.42, smoothstep(-0.6, 0.6, facing(mv))) * copyFade(clip.xy / clip.w) * uFade;
        gl_Position = clip;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uCol;
      varying float vA;
      void main() { gl_FragColor = vec4(uCol, vA); }`,
  });
  orbit.add(new Mesh(new TorusGeometry(1.34, 0.0022, 4, 200), orbitMat));
  const sats = [0, 2.4].map((phase) => {
    const m = new Mesh(new SphereGeometry(0.014, 12, 10), new MeshBasicMaterial({ color: 0x0a63f0, transparent: true }));
    orbit.add(m);
    return { m, phase };
  });
  globe.add(orbit);

  /* ── Layout: centre on the anchor, size from the hero ── */
  let W = 1;
  let H = 1;
  let hostTop = 0;
  let occluder = { x0: 9, x1: 9, y0: 9, y1: 9 };
  const layout = () => {
    const hr = host.getBoundingClientRect();
    W = Math.max(1, Math.round(hr.width));
    H = Math.max(1, Math.round(hr.height));
    hostTop = hr.top + window.scrollY;
    const dpr = Math.min(window.devicePixelRatio || 1, W * H > 1.6e6 ? 1.5 : 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    uniforms.uPx.value = dpr;
    uniforms.uAspect.value = W / H;

    const ar = anchor?.getBoundingClientRect();
    const wide = W >= 1024;
    let cx = W * 0.7;
    let cy = H * 0.5;
    let rad = Math.min(W, H) * 0.45;
    if (ar && ar.width) {
      cx = ar.left - hr.left + ar.width * (wide ? 0.56 : 0.5);
      cy = ar.top - hr.top + ar.height * 0.5;
      rad = wide ? Math.min(Math.max(ar.width, ar.height) * 0.8, H * 0.5) : Math.min(W * 0.62, 380);
      const nx = (x: number) => (x / W) * 2 - 1;
      const ny = (y: number) => 1 - (y / H) * 2;
      occluder = { x0: nx(ar.left - hr.left), x1: nx(ar.right - hr.left), y0: ny(ar.bottom - hr.top), y1: ny(ar.top - hr.top) };
      // Fade the globe out under the copy: left of the panel on wide
      // screens, above it when the hero stacks.
      uniforms.uLeft.value = wide ? nx(ar.left - hr.left) : -3;
      uniforms.uTop.value = wide ? 3 : ny(ar.top - hr.top) + 0.12;
    }
    const upp = (2 * CAM_Z * Math.tan(((FOV / 2) * Math.PI) / 180)) / H;
    globe.position.set((cx - W / 2) * upp, -(cy - H / 2) * upp, 0);
    globe.scale.setScalar(rad * upp);
    uniforms.uR.value = rad * upp;
    // The soft glow behind the globe (.ph-field::before) follows it.
    canvas.parentElement?.style.setProperty("--gx", `${cx}px`);
    canvas.parentElement?.style.setProperty("--gy", `${cy}px`);
    canvas.parentElement?.style.setProperty("--gr", `${rad}px`);
  };

  // copyFade() from the shaders, for the few meshes faded on the CPU.
  const smooth = (a: number, b: number, x: number) => {
    const k = clamp01((x - a) / (b - a));
    return k * k * (3 - 2 * k);
  };
  const copyFadeJs = (x: number, y: number) =>
    smooth(uniforms.uLeft.value - 0.24, uniforms.uLeft.value + 0.06, x) * (1 - smooth(uniforms.uTop.value - 0.06, uniforms.uTop.value + 0.34, y));

  /* ── Pointer + scroll ── */
  const pointer = { x: 9, y: 9, tx: 0, ty: 0, in: 0, inT: 0 };
  const onMove = (e: PointerEvent) => {
    const r = host.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) {
      pointer.inT = 0;
      return;
    }
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = 1 - ((e.clientY - r.top) / r.height) * 2;
    pointer.inT = e.pointerType === "mouse" ? 1 : 0;
  };
  const onLeave = () => (pointer.inT = 0);
  window.addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);

  /* ── Block cycle: pick a visible node, send transactions to it ── */
  const tmp = new Vector3();
  const tmpN = new Vector3();
  const worldOf = (i: number, out: Vector3) => out.copy(nodes[i]).applyMatrix4(spin.matrixWorld);
  const facingOf = (i: number) => {
    worldOf(i, tmp);
    tmpN.copy(tmp).sub(globe.position).normalize();
    return tmpN.z;
  };
  const bfs = (from: number) => {
    const d = new Int16Array(N).fill(-1);
    d[from] = 0;
    const q = [from];
    for (let h = 0; h < q.length; h++) for (const v of adj[q[h]])
        if (d[v] < 0) {
          d[v] = d[q[h]] + 1;
          q.push(v);
        }
    return d;
  };
  const pickTarget = (prev: number) => {
    let best = -1;
    let bestScore = -9;
    for (let t = 0; t < 60; t++) {
      const i = randNode();
      if (i === prev) continue;
      const f = facingOf(i);
      if (f < 0.25) continue;
      tmp.project(camera);
      const hidden = tmp.x > occluder.x0 - 0.02 && tmp.x < occluder.x1 + 0.02 && tmp.y > occluder.y0 - 0.02 && tmp.y < occluder.y1 + 0.02;
      const offscreen = Math.abs(tmp.x) > 0.86 || Math.abs(tmp.y) > 0.84 || tmp.x < uniforms.uLeft.value + 0.05 || tmp.y > uniforms.uTop.value - 0.1;
      let score = f + (hidden ? -1.5 : 0) + (offscreen ? -2 : 0);
      if (prev >= 0) {
        const ang = nodes[i].angleTo(nodes[prev]);
        score += ang > 0.45 && ang < 1.5 ? 0.6 : 0;
      }
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return best < 0 ? randNode() : best;
  };

  let cycleAt = 0.7;
  let target = -1;
  let targetDist: Int16Array | null = null;
  let gathered = 0;
  let needed = 0;
  let lastBlock = -1;
  let blockDue = Infinity;

  const startCycle = (now: number) => {
    target = pickTarget(lastBlock);
    targetDist = bfs(target);
    gathered = 0;
    const from: number[] = [];
    for (let i = 0; i < N; i++) if (targetDist[i] >= 3 && targetDist[i] <= 6) from.push(i);
    const free = pulses.filter((p) => !p.on);
    needed = Math.min(small ? 7 : 10, free.length);
    for (let k = 0; k < needed; k++) {
      const p = free[k];
      const a = from[Math.floor(Math.random() * from.length)] ?? randNode();
      p.on = true;
      p.wait = k * 0.07;
      p.a = a;
      p.b = nextToward(a, targetDist);
      p.s = 0;
      p.speed = 0.62 + Math.random() * 0.22;
      p.dist = targetDist;
      p.hops = 99;
    }
    blockDue = now + 2.5;
  };
  const nextToward = (u: number, d: Int16Array) => {
    const opts = adj[u].filter((v) => d[v] >= 0 && d[v] < d[u]);
    return opts.length ? opts[Math.floor(Math.random() * opts.length)] : adj[u][0];
  };

  const formBlock = (now: number) => {
    if (target < 0 || !targetDist) return;
    const T = target;
    blocks.push({ node: T, born: now, dying: Infinity });
    const alive = blocks.filter((b) => b.dying === Infinity);
    if (alive.length > MAX_BLOCKS - 1) alive[0].dying = now;

    // Confirmation wave over nodes and links within four hops.
    const d = targetDist;
    for (let i = 0; i < N; i++) {
      if (d[i] < 0 || d[i] > 4) continue;
      nodeFl[i * 2] = now + d[i] * 0.11;
      nodeFl[i * 2 + 1] = 1 - d[i] * 0.2;
    }
    edges.forEach(([a, b], i) => {
      const h = Math.min(d[a], d[b]);
      if (h < 0 || h > 4) return;
      linkFl[i * 4] = linkFl[i * 4 + 2] = now + h * 0.11 + 0.04;
      linkFl[i * 4 + 1] = linkFl[i * 4 + 3] = 1 - h * 0.2;
    });
    nodeGeo.attributes.aFl.needsUpdate = true;
    linkGeo.attributes.aFl.needsUpdate = true;

    const ring = rings[ringNext++ % rings.length];
    ring.born = now;
    ring.node = T;

    if (lastBlock >= 0) {
      const a = nodes[lastBlock].clone().normalize();
      const b = nodes[T].clone().normalize();
      const ang = a.angleTo(b);
      const q = new Quaternion();
      const pts: Vector3[] = [];
      for (let k = 0; k <= 24; k++) {
        const t = k / 24;
        q.setFromUnitVectors(a, b);
        const dir = a.clone().applyQuaternion(new Quaternion().slerpQuaternions(new Quaternion(), q, t));
        pts.push(dir.multiplyScalar(1.02 + Math.sin(Math.PI * t) * (0.1 + ang * 0.14)));
      }
      const curve = new CatmullRomCurve3(pts);
      const mesh = new Mesh(
        new TubeGeometry(curve, 80, 0.0045, 6, false),
        new MeshBasicMaterial({ color: 0x0a63f0, transparent: true, opacity: 0.9, depthWrite: false }),
      );
      mesh.geometry.setDrawRange(0, 0);
      spin.add(mesh);
      arcs.push({ mesh, curve, born: now, mid: pts[12].clone() });
      while (arcs.length > MAX_ARCS) {
        const old = arcs.shift()!;
        spin.remove(old.mesh);
        old.mesh.geometry.dispose();
        old.mesh.material.dispose();
      }
    }
    lastBlock = T;
    target = -1;
    targetDist = null;
    blockDue = Infinity;
    cycleAt = now + 0.9;
  };

  /* ── Frame ── */
  const m4 = new Matrix4();
  const q4 = new Quaternion();
  const qs = new Quaternion();
  const up = new Vector3(0, 1, 0);
  const sc = new Vector3();
  const nrm = new Vector3();
  const pos = new Vector3();
  let t = 0;
  let spinY = 0;
  let last = performance.now();
  let raf = 0;
  let visible = true;
  let onScreen = true;
  let readySent = false;

  const step = (dt: number) => {
    t += dt;
    uniforms.uTime.value = t;

    // Pointer easing: tilt toward the cursor, light nodes near it.
    pointer.in += (pointer.inT - pointer.in) * Math.min(1, dt * 4);
    pointer.tx += ((pointer.inT ? pointer.x : 0) - pointer.tx) * Math.min(1, dt * 2.2);
    pointer.ty += ((pointer.inT ? pointer.y : 0) - pointer.ty) * Math.min(1, dt * 2.2);
    uniforms.uHotAmt.value = pointer.in;
    uniforms.uPointer.value.set(pointer.x, pointer.y);

    // Scroll: turn and fade as the hero leaves.
    const sp = clamp01((window.scrollY - hostTop) / Math.max(1, H));
    spinY += dt * (reduced ? 0 : 0.07 + sp * 0.5);
    spin.rotation.y = spinY + pointer.tx * 0.42;
    spin.rotation.x = -pointer.ty * 0.24;
    orbit.rotation.z = 0.42 + t * 0.05;
    uniforms.uFade.value = 1 - sp * 0.55;
    globe.updateMatrixWorld(true);
    uniforms.uCenter.value.setFromMatrixPosition(globe.matrixWorld).applyMatrix4(camera.matrixWorldInverse);

    // Block cycle.
    if (!reduced) {
      if (target < 0 && t >= cycleAt) startCycle(t);
      if (target >= 0 && (gathered >= needed - 1 || t >= blockDue)) formBlock(t);
    }

    // Pulses.
    for (let i = 0; i < P; i++) {
      const p = pulses[i];
      let shown = p.on && p.wait <= 0;
      if (p.on && p.wait > 0) p.wait -= dt;
      else if (p.on) {
        p.s += (dt * p.speed) / Math.max(0.05, edgeLen(p.a, p.b));
        while (p.on && p.s >= 1) {
          p.s -= 1;
          const at = p.b;
          if (p.dist) {
            if (at === target || p.dist[at] === 0) {
              gathered++;
              p.on = false;
              shown = false;
              break;
            }
            p.a = at;
            p.b = nextToward(at, p.dist);
          } else if (--p.hops <= 0) {
            startAmbient(p, 0.4 + Math.random() * 1.6);
            shown = false;
            break;
          } else {
            const opts = adj[at].filter((x) => x !== p.a);
            p.a = at;
            p.b = opts.length ? opts[Math.floor(Math.random() * opts.length)] : adj[at][0];
          }
        }
        if (!p.on && i < AMBIENT) startAmbient(p, 0.5 + Math.random());
      }
      for (let k = 0; k < TRAIL; k++) {
        const j = i * TRAIL + k;
        if (!shown) {
          pOn[j] = 0;
          continue;
        }
        const s = Math.max(0, p.s - k * 0.085);
        pos.copy(nodes[p.a]).lerp(nodes[p.b], s).multiplyScalar(1.012);
        pos.toArray(pPos, j * 3);
        pOn[j] = p.s - k * 0.085 < 0 && k > 0 ? 0 : 1;
      }
    }
    pGeo.attributes.position.needsUpdate = true;
    pGeo.attributes.aOn.needsUpdate = true;

    // Blocks: pop in, turn slowly, sink away on the far side.
    for (let i = 0; i < MAX_BLOCKS; i++) {
      const b = blocks[i];
      if (!b) {
        m4.makeScale(0, 0, 0);
        blockMesh.setMatrixAt(i, m4);
        continue;
      }
      const grow = easeOutBack(clamp01((t - b.born) / 0.6));
      const shrink = 1 - clamp01((t - b.dying) / 0.5);
      const f = facingOf(b.node);
      const s = 0.052 * grow * shrink * (0.35 + 0.65 * clamp01((f + 0.25) / 0.55));
      nrm.copy(nodes[b.node]).normalize();
      q4.setFromUnitVectors(up, nrm);
      qs.setFromAxisAngle(up, (t - b.born) * 0.6);
      q4.multiply(qs);
      pos.copy(nrm).multiplyScalar(1 + s * 0.55);
      m4.compose(pos, q4, sc.set(s, s, s));
      blockMesh.setMatrixAt(i, m4);
    }
    for (let i = blocks.length - 1; i >= 0; i--) if (t - blocks[i].dying > 0.5) blocks.splice(i, 1);
    blockMesh.instanceMatrix.needsUpdate = true;

    // Rings.
    for (const r of rings) {
      const age = t - r.born;
      if (age < 0 || age > 1.3) {
        r.mesh.visible = false;
        continue;
      }
      const k = age / 1.3;
      nrm.copy(nodes[r.node]).normalize();
      r.mesh.visible = true;
      r.mesh.position.copy(nrm).multiplyScalar(1.006);
      r.mesh.quaternion.setFromUnitVectors(new Vector3(0, 0, 1), nrm);
      r.mesh.scale.setScalar(0.03 + (1 - Math.pow(1 - k, 3)) * 0.2);
      r.mesh.material.opacity = (1 - k) * 0.55 * clamp01((facingOf(r.node) + 0.2) / 0.5);
    }

    // Arcs: draw in, then fade with age; the newest carries a dot.
    arcs.forEach((a, i) => {
      const age = t - a.born;
      const draw = clamp01(age / 0.9);
      const total = a.mesh.geometry.index ? a.mesh.geometry.index.count : 0;
      a.mesh.geometry.setDrawRange(0, Math.floor((total * draw) / 6) * 6);
      tmp.copy(a.mid).applyMatrix4(spin.matrixWorld).sub(globe.position).normalize();
      const rank = arcs.length - 1 - i;
      a.mesh.material.opacity = Math.pow(0.55, rank) * 0.85 * clamp01((tmp.z + 0.35) / 0.6) * uniforms.uFade.value;
      if (rank === 0) {
        dot.position.copy(a.curve.getPointAt(Math.min(draw, 1)));
        dot.material.opacity = draw < 1 ? a.mesh.material.opacity : Math.max(0, 1 - (age - 0.9) / 0.4) * a.mesh.material.opacity;
      }
    });

    sats.forEach(({ m, phase }) => {
      const a = t * 0.32 + phase;
      m.position.set(Math.cos(a) * 1.34, Math.sin(a) * 1.34, 0);
      m.updateMatrixWorld();
      tmp.setFromMatrixPosition(m.matrixWorld);
      tmpN.copy(tmp).sub(globe.position).normalize();
      tmp.project(camera);
      m.material.opacity = clamp01((tmpN.z + 0.4) / 0.7) * 0.85 * uniforms.uFade.value * copyFadeJs(tmp.x, tmp.y);
    });

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      onReady?.();
    }
  };

  const loop = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    step(dt);
    if (visible && onScreen && !reduced) raf = requestAnimationFrame(loop);
  };
  const wake = () => {
    if (raf || !visible || !onScreen) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };

  layout();
  // Reduced motion: one still frame with a short chain already built.
  if (reduced) {
    step(0.016);
    for (let k = 0; k < 4; k++) {
      target = pickTarget(lastBlock);
      targetDist = bfs(target);
      formBlock(t);
      t += 3;
    }
    step(0.016);
  } else wake();

  const ro = new ResizeObserver(() => {
    layout();
    if (reduced) step(0);
  });
  ro.observe(host);
  if (anchor) ro.observe(anchor);
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) wake();
  });
  io.observe(host);
  const onVis = () => {
    visible = document.visibilityState === "visible";
    if (visible) wake();
  };
  document.addEventListener("visibilitychange", onVis);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    scene.traverse((o) => {
      const m = o as Mesh;
      m.geometry?.dispose();
      const mat = m.material;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
