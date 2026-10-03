import type { Shot as ShotData } from "@/content/site";
import { SHOT_H, SHOT_W, shotSrc, shotSrcSet } from "@/lib/shots";

/**
 * An illustrative interface image for a case study, in a rounded frame with a
 * soft glow. On wide screens it rises into place and drifts as the page
 * scrolls (CSS scroll-driven animations: compositor only, no scroll listener);
 * browsers without them just show the still image.
 *
 * Styles: "Work screenshots" block in globals.css.
 */
export default function Shot({ shot, sizes }: { shot: ShotData; sizes: string }) {
  return (
    <figure className="shot">
      <div className="shot-glow" aria-hidden="true" />
      <div className="shot-frame">
        {/* Plain <img>: pre-sized WebP from our own origin (see PhotoVisual for why). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="shot-img"
          src={shotSrc(shot.name)}
          srcSet={shotSrcSet(shot.name)}
          sizes={sizes}
          width={SHOT_W}
          height={SHOT_H}
          alt={shot.alt}
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className="shot-cap">Illustrative interface, not a client screenshot.</figcaption>
    </figure>
  );
}
