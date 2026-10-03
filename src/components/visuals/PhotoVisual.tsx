"use client";

import { useState } from "react";
import GeneratedVisual from "./GeneratedVisual";

/**
 * Renders a locally-hosted photograph, falling back to the generated SVG
 * artwork if the file is missing or fails to decode.
 *
 * Images live in `public/img/` and are served from our own origin, which is
 * what keeps them inside the site's `img-src 'self'` CSP. Hotlinking a remote
 * CDN here would be blocked and render as broken alt text — see
 * next.config.ts and the earlier Unsplash regression.
 */
export default function PhotoVisual({
  src,
  alt,
  seed,
  className = "",
  priority = false,
}: {
  /** Path under /img, e.g. "hero-web3.jpg". */
  src: string;
  alt: string;
  /** Seed for the fallback artwork if the photo can't load. */
  seed: string;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <GeneratedVisual seed={seed} label={alt} className={className} />;
  }

  return (
    // Plain <img>: these are decorative, fixed-size, already-optimised assets,
    // and next/image's optimiser adds no value for them here.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/img/${src}`}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
