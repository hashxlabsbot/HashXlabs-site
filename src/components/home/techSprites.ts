/* Sprites shared by the Technology figures (techOrbit.ts, swarmField.ts):
   logo tiles with their shadow baked in, name labels, the HashX core and a
   glow dot. Each is drawn once to an offscreen canvas and then only copied
   with drawImage per frame. */

export type Fonts = { body: string; display: string; mono: string };

export function canvasOf(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

export function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

/** The logo drawn to its own canvas, optionally turned to a light grey. */
export function logoLayer(img: HTMLImageElement, w: number, h: number, grey: boolean) {
  const c = canvasOf(w, h);
  const g = c.getContext("2d");
  if (!g) return c;
  g.drawImage(img, 0, 0, c.width, c.height);
  if (!grey) return c;
  try {
    const d = g.getImageData(0, 0, c.width, c.height), p = d.data;
    for (let i = 0; i < p.length; i += 4) {
      const l = 0.2126 * p[i] + 0.7152 * p[i + 1] + 0.0722 * p[i + 2];
      const v = 128 + l * 0.42;
      p[i] = v;
      p[i + 1] = v + 3;
      p[i + 2] = v + 10;
    }
    g.putImageData(d, 0, 0);
  } catch {
    // A tainted canvas can't be read back: fall back to a flat grey silhouette.
    g.globalCompositeOperation = "source-in";
    g.fillStyle = "#a9b1be";
    g.fillRect(0, 0, c.width, c.height);
  }
  return c;
}

/* Optical sizing: how much of the tile each logo may fill (default .52). Wide
   marks get more width, dense square ones a little less. */
const FIT: Record<string, number> = {
  "aws.svg": 0.66,
  "slither.png": 0.68,
  "typescript.svg": 0.46,
  "nextjs.svg": 0.5,
  "foundry.png": 0.58,
  "layerzero.svg": 0.5,
  "hardhat.svg": 0.6,
};

/** A white tile with its drop shadow, the logo centred. Returns the sprite and
 *  the share of the sprite the tile itself occupies. */
export function tileSprite(logo: string, img: HTMLImageElement | null, name: string, S: number, grey: boolean, f: Fonts) {
  const pad = Math.round(S * 0.32);
  const c = canvasOf(S + pad * 2, S + pad * 2);
  const g = c.getContext("2d");
  if (!g) return c;
  g.save();
  g.shadowColor = grey ? "rgba(11,18,32,.08)" : "rgba(11,18,32,.16)";
  g.shadowBlur = S * 0.24;
  g.shadowOffsetY = S * 0.1;
  roundRect(g, pad, pad, S, S, S * 0.27);
  g.fillStyle = "#fff";
  g.fill();
  g.restore();
  g.lineWidth = Math.max(1, S / 70);
  g.strokeStyle = "rgba(11,18,32,.075)";
  roundRect(g, pad + g.lineWidth / 2, pad + g.lineWidth / 2, S - g.lineWidth, S - g.lineWidth, S * 0.27);
  g.stroke();

  const cx = pad + S / 2, cy = pad + S / 2;
  if (logo.startsWith("erc:")) {
    g.textAlign = "center";
    g.textBaseline = "alphabetic";
    g.fillStyle = grey ? "#aab2be" : "#7b8494";
    g.font = `500 ${S * 0.135}px ${f.mono}`;
    g.fillText("ERC", cx, cy - S * 0.08);
    g.fillStyle = grey ? "#9aa3b1" : "#0057d9";
    g.font = `700 ${S * 0.27}px ${f.display}`;
    g.fillText(logo.slice(4), cx, cy + S * 0.2);
  } else if (img && img.naturalWidth) {
    const box = S * (FIT[logo] ?? 0.52);
    const ar = img.naturalWidth / img.naturalHeight;
    const w = ar >= 1 ? box : box * ar, h = ar >= 1 ? box / ar : box;
    g.drawImage(logoLayer(img, w, h, grey), cx - w / 2, cy - h / 2, w, h);
  } else {
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = grey ? "#aab2be" : "#0b1220";
    g.font = `700 ${S * 0.3}px ${f.display}`;
    g.fillText(name.slice(0, 2), cx, cy);
  }
  return c;
}

export function labelSprite(text: string, dpr: number, f: Fonts) {
  const fs = 12.5 * dpr, h = 26 * dpr, px = 11 * dpr, pad = 6 * dpr;
  const m = canvasOf(1, 1).getContext("2d");
  if (m) m.font = `600 ${fs}px ${f.body}`;
  const tw = m ? m.measureText(text).width : text.length * fs * 0.55;
  const c = canvasOf(tw + px * 2 + pad * 2, h + pad * 2);
  const g = c.getContext("2d");
  if (!g) return c;
  g.save();
  g.shadowColor = "rgba(11,18,32,.12)";
  g.shadowBlur = 8 * dpr;
  g.shadowOffsetY = 2 * dpr;
  roundRect(g, pad, pad, tw + px * 2, h, h / 2);
  g.fillStyle = "rgba(255,255,255,.96)";
  g.fill();
  g.restore();
  g.lineWidth = dpr;
  g.strokeStyle = "rgba(11,18,32,.08)";
  roundRect(g, pad + 0.5 * dpr, pad + 0.5 * dpr, tw + px * 2 - dpr, h - dpr, h / 2);
  g.stroke();
  g.fillStyle = "#0b1220";
  g.font = `600 ${fs}px ${f.body}`;
  g.textBaseline = "middle";
  g.fillText(text, pad + px, pad + h / 2 + 0.5 * dpr);
  return c;
}

/** The HashX block at the centre: a navy app-icon square with the blue X, over a soft glow. */
export function coreSprite(C: number) {
  const pad = C * 1.1;
  const c = canvasOf(C + pad * 2, C + pad * 2);
  const g = c.getContext("2d");
  if (!g) return c;
  const m = c.width / 2;
  const glow = g.createRadialGradient(m, m, 0, m, m, m);
  glow.addColorStop(0, "rgba(0,110,255,.30)");
  glow.addColorStop(0.35, "rgba(0,110,255,.12)");
  glow.addColorStop(1, "rgba(0,110,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, c.width, c.height);
  g.save();
  g.shadowColor = "rgba(0,50,140,.4)";
  g.shadowBlur = C * 0.3;
  g.shadowOffsetY = C * 0.12;
  roundRect(g, pad, pad, C, C, C * 0.28);
  const bg = g.createLinearGradient(pad, pad, pad + C, pad + C);
  bg.addColorStop(0, "#14233f");
  bg.addColorStop(1, "#070d1a");
  g.fillStyle = bg;
  g.fill();
  g.restore();
  g.lineWidth = Math.max(1, C / 60);
  g.strokeStyle = "rgba(120,170,255,.28)";
  roundRect(g, pad + g.lineWidth / 2, pad + g.lineWidth / 2, C - g.lineWidth, C - g.lineWidth, C * 0.28);
  g.stroke();
  const x = g.createLinearGradient(m - C * 0.3, m - C * 0.3, m + C * 0.3, m + C * 0.3);
  x.addColorStop(0, "#1f6dff");
  x.addColorStop(1, "#38c0ff");
  g.fillStyle = x;
  g.shadowColor = "rgba(40,140,255,.9)";
  g.shadowBlur = C * 0.16;
  const k = C * 0.34, b = C * 0.12, hh = C * 0.3;
  g.beginPath();
  g.moveTo(m - k, m - hh);
  g.lineTo(m - k + b * 1.35, m - hh);
  g.lineTo(m + k, m + hh);
  g.lineTo(m + k - b * 1.35, m + hh);
  g.closePath();
  g.moveTo(m + k, m - hh);
  g.lineTo(m + k - b, m - hh);
  g.lineTo(m - k, m + hh);
  g.lineTo(m - k + b, m + hh);
  g.closePath();
  g.fill();
  return c;
}

export function glowSprite() {
  const c = canvasOf(48, 48);
  const g = c.getContext("2d");
  if (g) {
    const r = g.createRadialGradient(24, 24, 0, 24, 24, 24);
    r.addColorStop(0, "rgba(90,160,255,1)");
    r.addColorStop(0.25, "rgba(30,110,255,.7)");
    r.addColorStop(1, "rgba(0,87,217,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, 48, 48);
  }
  return c;
}

export function readFonts(): Fonts {
  const cs = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return { body, display: v("--font-display") || body, mono: v("--font-mono-brand") || "ui-monospace, monospace" };
}

