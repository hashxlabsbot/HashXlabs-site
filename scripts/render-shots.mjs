// Renders the illustrative dashboards in assets-src/shots/dashboards/ to PNG
// (assets-src/shots/work-<id>.png). Run `npm run shots` afterwards to produce
// the responsive WebP files the site serves.
//
//   node scripts/render-shots.mjs            # all dashboards
//   node scripts/render-shots.mjs rwa rag    # only these
//
// Needs Chrome (set CHROME_PATH if it is not in a standard location) and sharp.
import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIR = "assets-src/shots/dashboards";
const W = 1584, H = 993;
const IDS = ["rwa", "custody", "rag"];
const ids = process.argv.slice(2).length ? process.argv.slice(2) : IDS;

const CHROME = [process.env.CHROME_PATH, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) => p && existsSync(p));
if (!CHROME) { console.error("Chrome not found. Set CHROME_PATH."); process.exit(1); }
const { default: sharp } = await import("sharp");

const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(path.join(tmpdir(), "shots-"))}`, "--hide-scrollbars", "--no-first-run", "about:blank"], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 80 && !target; i++) {
    try { target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === "page"); } catch { /* not up yet */ }
    if (!target) await new Promise((r) => setTimeout(r, 250));
  }
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let n = 0; const waiting = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); waiting.get(d.id)?.(d); };
  const send = (method, params = {}) => new Promise((res, rej) => { const id = ++n; waiting.set(id, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id, method, params })); });
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 2, mobile: false });

  for (const id of ids) {
    const mod = await import(pathToFileURL(path.resolve(DIR, `${id}.mjs`)).href);
    const htmlFile = path.resolve(DIR, `${id}.html`);
    writeFileSync(htmlFile, mod.default);
    await send("Page.navigate", { url: pathToFileURL(htmlFile).href });
    await new Promise((r) => setTimeout(r, 1200));
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    const out = `assets-src/shots/work-${id}.png`;
    await sharp(Buffer.from(data, "base64")).resize({ width: W, kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(out);
    console.log("rendered", out);
  }
} finally { chrome.kill(); }
