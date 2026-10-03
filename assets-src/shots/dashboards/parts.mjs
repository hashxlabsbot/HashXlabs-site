// Building blocks shared by the illustrative dashboards.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
export const CSS = readFileSync(path.join(here, "shell.css"), "utf8");

const ICONS = {
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  bell: '<path d="M6 16v-5a6 6 0 1112 0v5l1.5 2h-15L6 16z"/><path d="M10 20.5a2 2 0 004 0"/>',
  wallet: '<rect x="3" y="6" width="18" height="14" rx="3"/><path d="M3 10h18M7 6V5a2 2 0 012-2h7"/><circle cx="16.5" cy="14.5" r="1.1"/>',
  chev: '<path d="M6 9l6 6 6-6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  building: '<path d="M4 21V8l8-4.5L20 8v13"/><path d="M9 21v-5h6v5M9 11h.01M12 11h.01M15 11h.01M9 14h.01M15 14h.01"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17.2" cy="9" r="2.7"/><path d="M17.6 14.2c2.6.3 4.4 2.3 4.4 5"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z"/>',
  shieldcheck: '<path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6L12 3z"/><path d="M8.6 12l2.4 2.4 4.4-4.8"/>',
  coins: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  file: '<path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3M14 9l2 2"/>',
  up: '<path d="M7 17L17 7M9 7h8v8"/>',
  down: '<path d="M17 7L7 17M15 17H7V9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  laptop: '<rect x="4" y="5" width="16" height="11" rx="2"/><path d="M2 19.5h20"/>',
  chat: '<path d="M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z"/>',
  db: '<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/>',
  inbox: '<path d="M4 13l2.5-7.5A2 2 0 018.4 4h7.2a2 2 0 011.9 1.5L20 13v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"/><path d="M4 13h4l1 2h6l1-2h4"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M8 15h8"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8v.01"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4 18-7z"/>',
  list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  token: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};
export const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

export const avatar = (txt, hue, size = 44, fs = 16) =>
  `<span class="av" style="width:${size}px;height:${size}px;font-size:${fs}px;background:linear-gradient(135deg,hsl(${hue} 85% 63%),hsl(${hue + 28} 85% 50%))">${txt}</span>`;
export const tok = (txt, hue, size = 44) =>
  `<span class="tok" style="width:${size}px;height:${size}px;font-size:${txt.length > 3 ? 11.5 : 13}px;background:linear-gradient(135deg,hsl(${hue} 80% 60%),hsl(${hue + 20} 80% 46%))">${txt}</span>`;

/** Whole page: window chrome + sidebar + top bar + body markup. */
export function page({ title, nav, active, search, wallet, body, css = "" }) {
  const navHtml = nav.map(([i, label]) => `<a class="${label === active ? "on" : ""}">${ic(i)}${label}</a>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>${CSS}${css}</style></head><body><div class="win">
  <div class="titlebar"><i class="tl r"></i><i class="tl y"></i><i class="tl g"></i></div>
  <div class="sidebar"><nav class="nav">${navHtml}</nav></div>
  <div class="pill search">${ic("search")}${search}</div>
  <div class="bell">${ic("bell")}<i></i></div><div class="wicon">${ic("wallet")}</div>
  <div class="pill wallet">${wallet}${ic("chev")}</div><div class="avatar-top"><svg width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="#d6e5fc"/><circle cx="24" cy="19" r="8.5" fill="#4f93ff"/><path d="M6 46c2-9 9-13.5 18-13.5S40 37 42 46z" fill="#4f93ff"/></svg></div>
  ${body}
  </div></body></html>`;
}

/** Isometric cube like the one on the bridge strip. */
const cube = (x, y, id) => `<g transform="translate(${x - 22} ${y - 25})" filter="url(#sh)">
  <polygon points="22,1 43,12.5 22,24 1,12.5" fill="url(#ct${id})"/><polygon points="1,12.5 22,24 22,49 1,37" fill="url(#cl)"/><polygon points="43,12.5 22,24 22,49 43,37" fill="url(#cr)"/>
  <path d="M1 12.5L22 24l21-11.5" stroke="rgba(255,255,255,.55)" stroke-width="1" fill="none"/></g>`;

/** Glowing wave with cubes and dots, between two node cards. */
export function wave(labels) {
  const W = 730, H = 180, y = (x) => 78 + 26 * Math.sin((2 * Math.PI * x) / 345 + 0.55);
  let d = ""; for (let x = 0; x <= W; x += 6) d += `${x ? "L" : "M"}${x} ${y(x).toFixed(1)}`;
  const cx = [135, 365, 590], dx = [45, 250, 480, 670];
  return `<div class="wavebox"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
   <defs><linearGradient id="ctA" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8cc4ff"/><stop offset="1" stop-color="#3b8dff"/></linearGradient>
   <linearGradient id="ctB" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8cc4ff"/><stop offset="1" stop-color="#3b8dff"/></linearGradient>
   <linearGradient id="ctC" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#8cc4ff"/><stop offset="1" stop-color="#3b8dff"/></linearGradient>
   <linearGradient id="cl" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2a7bff"/><stop offset="1" stop-color="#0a4fe0"/></linearGradient>
   <linearGradient id="cr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0a5cff"/><stop offset="1" stop-color="#0838b8"/></linearGradient>
   <linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="#9fd0ff" stop-opacity="0"/><stop offset=".12" stop-color="#9fd0ff" stop-opacity=".75"/><stop offset=".88" stop-color="#9fd0ff" stop-opacity=".75"/><stop offset="1" stop-color="#9fd0ff" stop-opacity="0"/></linearGradient>
   <filter id="bl" x="-5%" y="-60%" width="110%" height="220%"><feGaussianBlur stdDeviation="9"/></filter>
   <filter id="sh" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="#0a5cff" flood-opacity=".32"/></filter></defs>
   <path d="${d}" stroke="url(#gl)" stroke-width="30" fill="none" filter="url(#bl)"/>
   <path d="${d}" stroke="url(#gl)" stroke-width="9" fill="none" opacity=".7"/>
   <path d="${d}" stroke="#fff" stroke-width="2.4" fill="none" opacity=".95"/>
   ${dx.map((x) => `<circle cx="${x}" cy="${y(x).toFixed(1)}" r="8" fill="#0a5cff" stroke="#fff" stroke-width="2.5"/>`).join("")}
   ${cx.map((x, i) => cube(x, y(x), "ABC"[i])).join("")}
  </svg>${cx.map((x, i) => `<span class="wavelbl" style="left:${x}px;top:${Math.round(y(x)) + 36}px">${labels[i]}</span>`).join("")}</div>`;
}

const spinner = `<svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="14" fill="none" stroke="#d3e3fb" stroke-width="4"/><path d="M21 7a14 14 0 0112.1 7" fill="none" stroke="#0a5cff" stroke-width="4" stroke-linecap="round"/><circle cx="33.5" cy="13.5" r="3.6" fill="#0a5cff"/></svg>`;

/** Bottom strip: two node cards joined by the wave. */
export function strip({ title, sub, left, right, labels, pill }) {
  const node = (n, x, w, y) => `<div class="node" style="left:${x}px;top:${y}px;width:${w}px">${n.icon}<div class="n-t"><b>${n.name}</b><span>${n.meta}</span><em class="${n.tone ?? ""}"><i></i>${n.status}</em></div>${ic("chev")}</div>`;
  return `<div class="card strip"><div class="st">${title}</div><div class="ss">${sub}</div>
   <div class="spin">${spinner}<div><b>${pill[0]}</b><span>${pill[1]}</span></div></div>
   ${wave(labels)}${node(left, 25, 317, 92)}${node(right, 1040, 327, 88)}</div>`;
}
