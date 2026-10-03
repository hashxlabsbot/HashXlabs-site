// Builds the TOKEN2049 page's hero photo (public/img/marina.jpg, an aerial of
// Marina Bay Sands at sunset) into web sizes, and the share-card crop:
//
//   node scripts/make-marina.mjs
//
// Writes public/img/marina-{1280,1920,2560}.webp (the hero's srcset, see
// src/app/token2049/page.tsx) and public/img/marina-og.jpg (1200x630, used by
// src/app/token2049/opengraph-image.tsx). The 4042px original is not served
// anywhere. `sharp` comes with Next.js, as in make-stream.mjs.
import path from "node:path";

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error("sharp is not installed. Run `npm install` (Next.js pulls it in) and retry.");
  process.exit(1);
}

const SRC = "public/img/marina.jpg";
const WIDTHS = [1280, 1920, 2560];

for (const w of WIDTHS) {
  const out = path.join("public/img", `marina-${w}.webp`);
  const info = await sharp(SRC).resize({ width: w }).webp({ quality: 74, effort: 6, smartSubsample: true }).toFile(out);
  console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}

// Share card: full width, cropped from just above the SkyPark so the towers
// and the ArtScience lotus both stay in frame.
const meta = await sharp(SRC).metadata();
const cropH = Math.round((meta.width * 630) / 1200);
const top = Math.round(meta.height * 0.1);
const og = await sharp(SRC)
  .extract({ left: 0, top, width: meta.width, height: Math.min(cropH, meta.height - top) })
  .resize({ width: 1200, height: 630 })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/img/marina-og.jpg");
console.log(`public/img/marina-og.jpg  ${og.width}x${og.height}  ${(og.size / 1024).toFixed(0)} KB`);
