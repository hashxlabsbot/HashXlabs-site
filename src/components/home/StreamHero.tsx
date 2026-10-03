import { ImageStreamHero, type StreamImage } from "@/components/ui/image-stream-hero";

// Home hero: the copy sits over an image corridor (components/ui/image-stream-hero).
// Cards picture the six services (blockchain, security, RWA, DeFi & exchanges,
// stablecoins & payments, AI): portrait crops of Unsplash photos built into
// public/img/stream/ by `npm run stream` (scripts/make-stream.mjs maps each to its service);
// served same-origin because the CSP only allows `img-src 'self'`. The corridor
// shows the first `cards` (9) images, so keep this list at nine.
// The previous ring hero (components/Hero.tsx) is still in the repo.

const card = (name: string): StreamImage => ({
  src: `/img/stream/${name}-720.webp`,
  srcSet: [360, 720, 1080].map((w) => `/img/stream/${name}-${w}.webp ${w}w`).join(", "),
  // Layout width is 18cqw, but the near cards grow ~1.8× (and phones zoom the
  // corridor, see .hxs-stream in globals.css), so ask for more than 18vw.
  sizes: "(max-width: 700px) 32vw, 34vw",
});

const STREAM = [
  "chain-cubes",
  "secure-cloud",
  "glass-tower",
  "eth-node",
  "ai-robots",
  "market-candles",
  "block-lattice",
  "ai-head",
  "digital-dollar",
].map(card);

export default function StreamHero() {
  return (
    <section className="hxs" aria-labelledby="hx-title">
      <ImageStreamHero images={STREAM} axis={56} className="hxs-stream">
        <div className="hxs-copy">
          <div className="hxs-top">
            <p className="hxs-badge hx-a">
              <i aria-hidden="true">
                <svg viewBox="5 1 14 22" preserveAspectRatio="none">
                  <path
                    d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z"
                    fill="#fff"
                    stroke="rgba(255,255,255,.85)"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </i>
              Blockchain engineering, security-first
            </p>
            <h1 id="hx-title" className="hxs-h1">
              <span className="hx-a hx-wipe">Smart contracts that</span>{" "}
              <span className="hx-a hx-wipe">hold up.</span>
            </h1>
          </div>

          <div className="hxs-foot">
            <p className="hxs-sub hx-a">
              <b>
                DeFi / RWA / Custody / <span className="whitespace-nowrap">Cross-chain</span>
              </b>{" "}
              engineered with formal specs, invariant fuzzing and a clean path to mainnet.
            </p>
            <a href="/contact" className="hx-btn hx-cta2 hx-a">
              <span>Start a project</span>
            </a>
          </div>
        </div>
      </ImageStreamHero>
    </section>
  );
}
