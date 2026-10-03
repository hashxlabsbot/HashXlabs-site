/** Case-study interface images: widths produced by scripts/make-shots.mjs,
 *  served from public/img/shots/<name>-<width>.webp (same origin, so the CSP's
 *  `img-src 'self'` allows them). Natural size of every source is 1584x993. */
export const SHOT_WIDTHS = [640, 1024, 1584] as const;
export const SHOT_W = 1584;
export const SHOT_H = 993;

export const shotSrc = (name: string, w: (typeof SHOT_WIDTHS)[number] = 1024) => `/img/shots/${name}-${w}.webp`;
export const shotSrcSet = (name: string) => SHOT_WIDTHS.map((w) => `${shotSrc(name, w)} ${w}w`).join(", ");
