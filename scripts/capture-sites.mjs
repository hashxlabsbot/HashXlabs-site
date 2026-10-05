// Captures full-page desktop and mobile screenshots of the live client sites
// shown in the home "Live projects" section, and writes the WebP files the site
// serves from public/img/sites/ (same-origin, so the CSP's `img-src 'self'`
// allows them). Re-run when a client site changes:
//
//   npm run sites                 # all sites
//   npm run sites -- singhcoin    # only these
//
// Needs Chrome (set CHROME_PATH if it is not in a standard location) and sharp.
import { spawn } from "node:child_process";
import { mkdtempSync, existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

// Keep ids in sync with LIVE_PROJECTS in src/content/company.ts.
const SITES = {
  singhcoin: "https://singhcoin.io/",
  bitnautics: "https://bitnautics.com/",
};
// Long pages are cut here: the frame on the site pans through the top of the
// page, and anything past this is never seen.
const MAX_H = { desktop: 5200, mobile: 7000 };
const VIEW = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, mobile: true },
};
const OUT_W = { desktop: [720, 1200], mobile: [390] }; // keep in sync with src/components/home/LiveProjects.tsx
const SRC = "assets-src/sites";
const OUT = "public/img/sites";
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SITES);
const CHROME = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) => p && existsSync(p));
if (!CHROME) { console.error("Chrome not found. Set CHROME_PATH."); process.exit(1); }
const { default: sharp } = await import("sharp");
await mkdir(SRC, { recursive: true });
await mkdir(OUT, { recursive: true });

const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(path.join(tmpdir(), "sites-"))}`, "--hide-scrollbars", "--no-first-run", "--force-prefers-reduced-motion", "about:blank"], { stdio: "ignore" });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let target;
  for (let i = 0; i < 80 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* not up yet */ }
    if (!target) await wait(250);
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let n = 0; const waiting = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); waiting.get(d.id)?.(d); };
  const send = (method, params = {}) => new Promise((res, rej) => { const id = ++n; waiting.set(id, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
  await send("Page.enable");
  await send("Runtime.enable");

  for (const id of ids) {
    for (const kind of ["desktop", "mobile"]) {
      const v = VIEW[kind];
      await send("Emulation.setDeviceMetricsOverride", v);
      await send("Emulation.setUserAgentOverride", { userAgent: kind === "mobile" ? MOBILE_UA : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36" });
      await send("Page.navigate", { url: SITES[id] });
      await wait(5000);
      // Walk the page so lazy images load and on-scroll reveals fire, then return to the top.
      await evaluate(`(async () => {
        const step = innerHeight * 0.6;
        for (let y = 0; y < Math.min(document.documentElement.scrollHeight, ${MAX_H[kind]} + innerHeight); y += step) {
          scrollTo({ top: y, behavior: "instant" });
          await new Promise((r) => setTimeout(r, 180));
        }
        scrollTo({ top: 0, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 1200));
      })()`);
      // Hide cookie/consent banners and chat widgets: they are not part of the work.
      await evaluate(`document.querySelectorAll('[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],iframe[title*="chat" i]').forEach((e) => e.style.setProperty("display", "none", "important"))`);
      const full = await evaluate("Math.ceil(document.documentElement.scrollHeight)");
      const h = Math.min(full, MAX_H[kind]);
      const { data } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: v.width, height: h, scale: 1 } });
      const src = path.join(SRC, `${id}-${kind}.png`);
      await sharp(Buffer.from(data, "base64")).png({ compressionLevel: 9 }).toFile(src);
      for (const w of OUT_W[kind]) {
        const out = path.join(OUT, `${id}-${kind}-${w}.webp`);
        const info = await sharp(src).resize({ width: w, kernel: "lanczos3" }).webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(out);
        console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB  (page ${full}px)`);
      }
    }
  }
} finally { chrome.kill(); }
