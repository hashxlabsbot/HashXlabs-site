import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Reveal from "@/components/Reveal";
import { Arrow, ButtonLink, CTASection, PageHeader, Section, SectionHeader } from "@/components/ui";
import {
  EVENT,
  GUIDE_FACTS,
  GUIDE_FAQS,
  GUIDE_PUBLISHED,
  GUIDE_SOURCES,
  GUIDE_TIPS,
  GUIDE_UPDATED,
  GUIDE_WEEK,
} from "@/content/token2049";
import { ORG_ID, SITE_URL, jsonLd, pageMeta } from "@/lib/seo";
import { CONFERENCE, CONFERENCE_ID, GUIDE_URL, T49_URL, faqPage } from "@/lib/token2049/schema";

/* /token2049/guide: an independent, fact-checked attendee guide. It targets
   the informational searches around the event ("TOKEN2049 Singapore 2026
   dates", "venue", "side events", "MRT") that /token2049 (our meetings) does
   not, and answers each one in a sentence that search and answer engines can
   quote. Facts live in content/token2049.ts with their sources. */

const TITLE = "TOKEN2049 Singapore 2026 Guide: Dates, Venue & Side Events";
const DESCRIPTION =
  "TOKEN2049 Singapore 2026 at a glance: 7–8 October at Marina Bay Sands, hours, getting there by MRT, TOKEN2049 Week side events (5–11 Oct) and tips for builders.";

export const metadata: Metadata = pageMeta({
  title: TITLE,
  absoluteTitle: true,
  description: DESCRIPTION,
  path: "/token2049/guide",
  image: { url: "/token2049/opengraph-image", alt: "TOKEN2049 Singapore 2026 guide by HashX Labs" },
  keywords: [
    "TOKEN2049 Singapore 2026",
    "TOKEN2049 dates",
    "TOKEN2049 venue",
    "TOKEN2049 Marina Bay Sands",
    "TOKEN2049 Week side events",
    "TOKEN2049 MRT",
    "AFTER 2049",
    "TOKEN2049 Origins hackathon",
    "TOKEN2049 guide",
  ],
});

const fmt = (iso: string) => new Date(`${iso}T12:00:00+08:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Singapore" });

const STRUCTURED = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${GUIDE_URL}#article`,
      headline: "TOKEN2049 Singapore 2026: the essential guide",
      description: DESCRIPTION,
      image: [`${SITE_URL}/img/marina-og.jpg`, `${SITE_URL}/img/marina-1920.webp`],
      datePublished: GUIDE_PUBLISHED,
      dateModified: GUIDE_UPDATED,
      author: { "@id": ORG_ID },
      publisher: { "@id": ORG_ID },
      mainEntityOfPage: GUIDE_URL,
      about: { "@id": CONFERENCE_ID },
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${GUIDE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "TOKEN2049 Singapore 2026", item: T49_URL },
        { "@type": "ListItem", position: 3, name: "Guide", item: GUIDE_URL },
      ],
    },
    CONFERENCE,
    faqPage(`${GUIDE_URL}#faq`, GUIDE_FAQS),
  ],
};

export default function Token2049GuidePage() {
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(STRUCTURED)} />

      <PageHeader
        eyebrow={`Independent guide · Updated ${fmt(GUIDE_UPDATED)}`}
        title="TOKEN2049 Singapore 2026: the essential guide"
        lead={
          <>
            TOKEN2049 Singapore 2026 takes place on <b>Wednesday 7 and Thursday 8 October 2026</b> at <b>Marina Bay Sands</b>, 10 Bayfront Avenue,
            Singapore, from 07:30 to 18:00 each day. TOKEN2049 Week, with more than 1,000 side events across the city, runs from 5 to 11 October.
          </>
        }
        crumbs={[
          { href: "/token2049", label: "TOKEN2049" },
          { href: "/token2049/guide", label: "Guide" },
        ]}
      >
        <ButtonLink href="#week">
          The week, day by day <Arrow />
        </ButtonLink>
        <ButtonLink href="/token2049#meet" variant="secondary">
          Meet HashX Labs in Singapore
        </ButtonLink>
      </PageHeader>

      {/* ── At a glance ── */}
      <Section id="facts">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <span className="eyebrow">At a glance</span>
            <h2 className="t-h2 mt-3">TOKEN2049 Singapore 2026 key facts</h2>
            <dl className="t49g-facts">
              {GUIDE_FACTS.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>
                    {k === "Side-event directory" ? (
                      <a href="https://week.token2049.com/" rel="noopener" target="_blank" className="link">
                        {v}
                      </a>
                    ) : (
                      v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <figure className="t49g-photo lg:col-span-5">
            {/* Plain <img>: pre-sized WebP from our own origin (scripts/make-marina.mjs). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/marina-1280.webp"
              srcSet="/img/marina-1280.webp 1280w, /img/marina-1920.webp 1920w"
              sizes="(min-width: 1024px) 460px, 100vw"
              width={1280}
              height={987}
              alt="Aerial view of Marina Bay Sands, Singapore, the venue of TOKEN2049 Singapore 2026"
              loading="lazy"
              decoding="async"
            />
            <figcaption>
              Marina Bay Sands. Take the Circle or Downtown line to Bayfront (CE1/DT16); Exit E leads straight into the Sands Expo and Convention
              Centre.
            </figcaption>
          </figure>
        </div>
      </Section>

      {/* ── The week ── */}
      <Section soft id="week">
        <SectionHeader
          eyebrow="5 – 11 October 2026"
          title="TOKEN2049 Week, day by day"
          lead="The conference is two days, but the week around it is where much of the networking happens. These are the fixed points."
        />
        <ol className="t49g-week">
          {GUIDE_WEEK.map((w, i) => (
            <li key={w.what} style={{ "--i": i } as CSSProperties}>
              <span className="t49g-when">{w.when}</span>
              <div>
                <h3>{w.what}</h3>
                <p>{w.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="t49g-note">
          Looking for side events? Browse and filter the official directory at{" "}
          <a href="https://week.token2049.com/" rel="noopener" target="_blank" className="link">
            week.token2049.com
          </a>
          .
        </p>
      </Section>

      {/* ── Builder tips (our opinion) ── */}
      <Section id="tips">
        <SectionHeader
          eyebrow="Our advice"
          title="Making TOKEN2049 count as a founder or engineer"
          lead="From a blockchain engineering team that spends the week in technical meetings. Opinion, not official guidance."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GUIDE_TIPS.map((t, i) => (
            <Reveal key={t.t} delay={(i % 3) * 60} className="h-full">
              <div className="card h-full p-6">
                <span className="t49-mono text-[var(--signal)]">0{i + 1}</span>
                <h3 className="mt-3 text-[17px] font-semibold tracking-tight">{t.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--t-mid)]">{t.d}</p>
              </div>
            </Reveal>
          ))}
          <div className="t49g-cta">
            <p>HashX Labs is in Singapore {EVENT.ourDates.replace(" 2026", "")}. Book 30 minutes with an engineer.</p>
            <ButtonLink href="/token2049#meet" variant="ink">
              Book a meeting <Arrow />
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* ── FAQ: answers stay visible so they can be read and quoted ── */}
      <Section soft id="faq">
        <SectionHeader eyebrow="FAQ" title="TOKEN2049 Singapore 2026: questions and answers" />
        <div className="t49g-faq">
          {GUIDE_FAQS.map(([q, a]) => (
            <div key={q}>
              <h3>{q}</h3>
              <p>
                {q === "Can I meet HashX Labs at TOKEN2049?" ? (
                  <>
                    Yes. HashX Labs engineers are in Singapore from 7 to 10 October 2026, at Marina Bay Sands on the conference days and around the city
                    afterwards. <Link href="/token2049#meet" className="link">Book a slot</Link>.
                  </>
                ) : (
                  a
                )}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Sources ── */}
      <Section>
        <div className="t49g-sources">
          <h2 className="text-[17px] font-semibold tracking-tight">Sources</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--t-mid)]">
            Facts on this page were checked on {fmt(GUIDE_UPDATED)} against the sources below. Event details can change, so confirm with TOKEN2049
            before you travel. This is an independent guide: HashX Labs is attending TOKEN2049 and is not affiliated with its organisers.
          </p>
          <ul className="mt-4 grid gap-2">
            {GUIDE_SOURCES.map((src) => (
              <li key={src.href}>
                <a href={src.href} rel="noopener" target="_blank" className="link text-[14.5px]">
                  {src.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CTASection title="Meet HashX Labs during TOKEN2049 Week" lead="We are in Singapore from 7 to 10 October. Bring the contract you are worried about, or the system you are about to build." />
    </SiteShell>
  );
}
