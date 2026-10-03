// Turns the original case-study images in assets-src/shots/ into the responsive
// WebP set the site serves from public/img/shots/ (same-origin, so the CSP's
// `img-src 'self'` allows them). Run after adding or replacing an original:
//
//   npm run shots
//
// `sharp` is installed with Next.js (optional dependency); it is not listed in
// package.json on purpose, so this script adds no lockfile churn.
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";

let sharp;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.error("sharp is not installed. Run `npm install` (Next.js pulls it in) and retry.");
  process.exit(1);
}

const SRC = "assets-src/shots";
const OUT = "public/img/shots";
const WIDTHS = [640, 1024, 1584]; // keep in sync with SHOT_WIDTHS in src/lib/shots.ts
const QUALITY = 86;

await mkdir(OUT, { recursive: true });
const files = (await readdir(SRC)).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
if (!files.length) console.log(`No images found in ${SRC}.`);

for (const file of files) {
  const name = path.parse(file).name;
  const input = path.join(SRC, file);
  const { width } = await sharp(input).metadata();
  for (const w of WIDTHS) {
    const target = Math.min(w, width); // never upscale; the file still exists for every srcset entry
    const out = path.join(OUT, `${name}-${w}.webp`);
    const info = await sharp(input)
      .resize({ width: target })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(out);
    console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
