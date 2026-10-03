// Builds the card images for the home hero's image corridor
// (components/ui/image-stream-hero.tsx) into public/img/stream/:
//
//   npm run stream
//
// Each card is a portrait crop (18:25, the card's shape) of an Unsplash photo
// (Unsplash License: free commercial use; IDs recorded in public/img/CREDITS.md),
// fetched once at 1080×1500 and served same-origin, so the CSP's `img-src 'self'`
// allows them. Each image gets 360w, 720w and 1080w WebPs (the near cards
// grow to ~1.8× their layout size, so retina screens want the 1080); keep the names in sync
// with STREAM in src/components/home/StreamHero.tsx.
//
// `sharp` comes with Next.js (optional dependency), as in make-shots.mjs.
import { mkdir } from "node:fs/promises";
import path from "node:path";

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error("sharp is not installed. Run `npm install` (Next.js pulls it in) and retry.");
  process.exit(1);
}

const OUT = "public/img/stream";
const W = 1080;
const H = 1500;
const WIDTHS = [360, 720, 1080];
const QUALITY = 72;

// One card per service on the home page (plus a second for blockchain and AI),
// in corridor order; light and dark alternate so neighbouring cards separate.
// No third-party brands on the cards (the Ethereum mark aside).
const PHOTOS = {
  "chain-cubes": "1666816943035-15c29931e975", // Blockchain development: glass blocks linked into a chain
  "secure-cloud": "1667372283496-893f0b1e7c16", // Smart contract security: glass cloud over a padlock
  "glass-tower": "1617761141732-d481912af1a9", // RWA tokenization: real estate
  "eth-node": "1643000296927-f4f1c8722b7d", // DeFi: the Ethereum mark on a lit node
  "ai-robots": "1666597107756-ef489e9f1f09", // AI development
  "market-candles": "1649003515353-c58a239cf662", // DeFi & exchanges: order-book candles
  "block-lattice": "1676911809746-85d90edbbe4a", // Blockchain development: protocol lattice
  "ai-head": "1737071371043-761e02b1ef95", // AI development
  "digital-dollar": "1711991833778-0e6dcc773c85", // Stablecoins & payments
};

await mkdir(OUT, { recursive: true });

for (const [name, id] of Object.entries(PHOTOS)) {
  const url = `https://images.unsplash.com/photo-${id}?w=${W}&h=${H}&fit=crop&crop=entropy&fm=jpg&q=92`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`${name}: ${res.status} from ${url}`);
    process.exitCode = 1;
    continue;
  }
  const input = Buffer.from(await res.arrayBuffer());
  for (const w of WIDTHS) {
    const out = path.join(OUT, `${name}-${w}.webp`);
    const info = await sharp(input)
      .resize({ width: w })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
