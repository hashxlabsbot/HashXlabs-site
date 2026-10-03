import Link from "next/link";
import Reveal from "@/components/Reveal";
import Icon from "@/components/icons/Icon";
import MiniCountdown from "@/components/token2049/MiniCountdown";
import { EVENT } from "@/content/token2049";

/* Home page feature for the TOKEN2049 week: the Marina Bay photo behind a
   short pitch, a live status line and links into /token2049. Temporary:
   remove it from app/page.tsx (and the hero badge link in StreamHero) once
   the event is over. Styles: "TOKEN2049 home band" in globals.css. */
export default function Token2049Band() {
  return (
    <section className="t49-band-wrap" aria-labelledby="t49-band-title">
      <div className="container-x">
        <Reveal>
          <div className="t49-band">
            {/* Plain <img>: pre-sized WebP from our own origin (scripts/make-marina.mjs). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="t49-band-img"
              src="/img/marina-1280.webp"
              srcSet="/img/marina-1280.webp 1280w, /img/marina-1920.webp 1920w"
              sizes="(min-width: 1200px) 1140px, 100vw"
              width={1280}
              height={987}
              alt="Marina Bay Sands, Singapore, where TOKEN2049 takes place"
              loading="lazy"
              decoding="async"
            />
            <div className="t49-band-scrim" aria-hidden="true" />
            <div className="t49-band-body">
              <p className="t49-badge">
                <span className="t49-badge-k">TOKEN2049</span>
                <span>Singapore · {EVENT.conference.replace(" 2026", "")} · {EVENT.venue}</span>
              </p>
              <h2 id="t49-band-title" className="t49-band-title">
                Meet us in Singapore, <span>7–10 October</span>
              </h2>
              <p className="t49-band-lead">
                We are at TOKEN2049 and around the city all week. Book 30 minutes with an engineer: bring your contracts, your token design or
                the agent you want to trust.
              </p>
              <div className="t49-band-ctas">
                <Link href="/token2049#meet" className="btn btn-primary t49-btn-glow">
                  Book a meeting <span className="arr" aria-hidden="true">→</span>
                </Link>
                <Link href="/token2049" className="btn btn-outline-light">
                  See our TOKEN2049 week
                </Link>
              </div>
              <div className="t49-band-meta">
                <MiniCountdown />
                <span className="t49-band-fact">
                  <Icon name="chat" className="h-4 w-4" />
                  Video calls if you are not in town
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
