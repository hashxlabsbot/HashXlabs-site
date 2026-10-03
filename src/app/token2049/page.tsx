import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Reveal from "@/components/Reveal";
import Shot from "@/components/Shot";
import Icon from "@/components/icons/Icon";
import Words from "@/components/fx/Words";
import Accordion from "@/components/ui/Accordion";
import { Arrow, ButtonLink, CTASection, Section, SectionHeader } from "@/components/ui";
import Countdown from "@/components/token2049/Countdown";
import MeetingPass from "@/components/token2049/MeetingPass";
import PickButton from "@/components/token2049/PickButton";
import DayState from "@/components/token2049/DayState";
import { WORK } from "@/content/site";
import { DAYS, EVENT, T49_FAQS, TOPICS, WORK_IDS } from "@/content/token2049";
import { ORG_ID, SITE_URL, jsonLd, pageMeta } from "@/lib/seo";

const DESCRIPTION =
  "Meet HashX Labs at TOKEN2049 Singapore 2026, 7–10 October. Book 30 minutes with a blockchain engineer at Marina Bay Sands, around Singapore or on video.";

export const metadata: Metadata = pageMeta({
  title: "TOKEN2049 Singapore 2026: Meet HashX Labs, 7–10 October",
  absoluteTitle: true,
  ogTitle: "Meet HashX Labs at TOKEN2049 Singapore (7–10 Oct 2026)",
  description: DESCRIPTION,
  path: "/token2049",
  image: { url: "/token2049/opengraph-image", alt: "HashX Labs at TOKEN2049 Singapore, 7–10 October 2026" },
  keywords: [
    "TOKEN2049",
    "TOKEN2049 Singapore",
    "TOKEN2049 Singapore 2026",
    "TOKEN2049 Week",
    "TOKEN2049 side events",
    "Marina Bay Sands crypto conference",
    "blockchain development company Singapore",
    "smart contract audit TOKEN2049",
    "meet blockchain developers Singapore",
    "HashX Labs",
  ],
});

/* Structured data. The TOKEN2049 conference is described as what it is (an
   event organised by TOKEN2049, at its own URL); what HashX Labs offers is a
   separate event: meetings during the week, with the conference as its
   superEvent. Nothing here claims sponsorship, a booth or affiliation. */
const PAGE_URL = `${SITE_URL}/token2049`;
const venue = {
  "@type": "Place",
  name: EVENT.venue,
  address: {
    "@type": "PostalAddress",
    streetAddress: EVENT.address.street,
    postalCode: EVENT.address.postcode,
    addressLocality: EVENT.address.city,
    addressCountry: EVENT.address.country,
  },
};
const conference = {
  "@type": "Event",
  "@id": `${PAGE_URL}#token2049`,
  name: "TOKEN2049 Singapore 2026",
  description: `Crypto and Web3 conference at ${EVENT.venue}, Singapore, on ${EVENT.conference}, with TOKEN2049 Week side events across the city from ${EVENT.week}.`,
  image: [`${SITE_URL}/img/marina-og.jpg`],
  startDate: EVENT.opens,
  endDate: EVENT.closes,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: venue,
  url: EVENT.officialUrl,
  organizer: { "@type": "Organization", name: "TOKEN2049", url: "https://token2049.com" },
};
const STRUCTURED = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": PAGE_URL,
      url: PAGE_URL,
      name: "TOKEN2049 Singapore 2026: Meet HashX Labs, 7–10 October",
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${PAGE_URL}#token2049` },
      primaryImageOfPage: `${SITE_URL}/img/marina-1920.webp`,
      breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
      inLanguage: "en",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "TOKEN2049 Singapore 2026", item: PAGE_URL },
      ],
    },
    conference,
    {
      "@type": "BusinessEvent",
      "@id": `${PAGE_URL}#meetings`,
      name: "Meet HashX Labs at TOKEN2049 Singapore 2026",
      description: DESCRIPTION,
      startDate: DAYS[0].from,
      endDate: EVENT.leaves,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
      location: [venue, { "@type": "VirtualLocation", url: `${PAGE_URL}#meet` }],
      image: [`${SITE_URL}/img/marina-og.jpg`, `${SITE_URL}/img/marina-1920.webp`],
      organizer: { "@id": ORG_ID },
      superEvent: { "@id": `${PAGE_URL}#token2049` },
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${PAGE_URL}#meet`,
      },
      url: PAGE_URL,
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: T49_FAQS.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ],
};

const MARQUEE = ["TOKEN2049 Singapore", "07 → 10.10.2026", "Marina Bay Sands", EVENT.coords, "Smart contracts", "RWA", "Security", "AI agents"];

export default function Token2049Page() {
  const work = WORK.filter((w) => WORK_IDS.includes(w.id));

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(STRUCTURED)} />
      {/* ── Hero: copy over the Marina Bay photo, countdown bar along the bottom ── */}
      <section className="t49-hero" aria-labelledby="t49-title">
        <div className="t49-hero-media" aria-hidden="true">
          {/* Plain <img>: pre-sized WebP from our own origin (scripts/make-marina.mjs). */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="t49-hero-img"
            src="/img/marina-1920.webp"
            srcSet="/img/marina-1280.webp 1280w, /img/marina-1920.webp 1920w, /img/marina-2560.webp 2560w"
            sizes="(min-width: 1024px) 80vw, 100vw"
            width={1920}
            height={1481}
            alt="Aerial view of Marina Bay Sands, Singapore, the venue of TOKEN2049 Singapore 2026, at sunset"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="t49-hero-glow" aria-hidden="true" />

        <div className="container-x t49-hero-top">
          <div className="t49-hero-copy">
            <p className="t49-badge hx-a" style={{ "--dl": ".15s" } as CSSProperties}>
              <span className="t49-badge-k">Singapore 2026</span>
              <span>
                {EVENT.conference.replace(" 2026", "")} · {EVENT.venue}
              </span>
            </p>
            <h1 id="t49-title" className="t49-title">
              <Words text="See you at" load />{" "}
              <span className="t49-grad">
                <Words text="TOKEN2049." start={3} load />
              </span>
            </h1>
            <p className="t49-lead hx-a" style={{ "--dl": ".55s" } as CSSProperties}>
              HashX Labs is in Singapore for TOKEN2049 from 7 to 10 October. If you are launching a protocol, issuing an asset or wiring AI
              into something that holds value, come and talk to the engineers who would build it.
            </p>
            <div className="t49-ctas hx-a" style={{ "--dl": ".7s" } as CSSProperties}>
              <a href="#meet" className="btn btn-primary t49-btn-glow">
                Book a meeting <Arrow />
              </a>
              <a href="#topics" className="btn btn-outline-light">
                What to bring
              </a>
            </div>
            <ul className="t49-facts hx-a" style={{ "--dl": ".85s" } as CSSProperties}>
              <li>
                <Icon name="globe" className="h-4 w-4" />
                In Singapore {EVENT.ourDates.replace(" 2026", "")}
              </li>
              <li>
                <Icon name="users" className="h-4 w-4" />
                Engineers, not sales
              </li>
              <li>
                <Icon name="chat" className="h-4 w-4" />
                Video if you are not in town
              </li>
            </ul>
          </div>
        </div>

        <div className="container-x t49-hero-bottom hx-a" style={{ "--dl": ".95s" } as CSSProperties}>
          <Countdown />
        </div>
      </section>

      {/* ── Ticker ── */}
      <div className="t49-ticker" aria-hidden="true">
        <div className="marquee">
          <ul className="marquee-track t49-ticker-track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <li key={i}>
                <i />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── The week: four days as four chained blocks ── */}
      <Section id="week">
        <SectionHeader
          eyebrow="The week"
          title="Four days, four blocks"
          lead="We are in Singapore from 7 to 10 October: two days on the conference floor at Marina Bay Sands, then two across the city. Pick the day that suits you."
        />
        <Reveal>
          <ol className="t49-chain">
            {DAYS.map((d, i) => (
              <li key={d.id} className={`t49-block ${d.conference ? "is-conf" : ""}`} style={{ "--i": i } as CSSProperties}>
                <div className="t49-block-head">
                  <span className="t49-mono">Block {d.id}</span>
                  <DayState from={d.from} to={d.to} />
                  {d.conference && <span className="t49-block-tag t49-mono">TOKEN2049</span>}
                </div>
                <p className="t49-block-date">
                  <span>{d.dow}</span> {d.date}
                </p>
                <h3 className="t49-block-title">{d.title}</h3>
                <p className="t49-block-d">{d.d}</p>
                <p className="t49-block-where">
                  <Icon name="target" className="h-4 w-4" />
                  {d.where}
                </p>
                <PickButton day={d.id} className="t49-block-btn">
                  Request this day <Arrow />
                </PickButton>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ── Topics ── */}
      <Section soft id="topics">
        <SectionHeader
          eyebrow="What to bring"
          title="Bring us the problem that keeps you up"
          lead="Thirty minutes with an engineer who would build it. Not a pitch: a whiteboard, your architecture and the ways it could break."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 70} className="h-full">
              <article className="card spotlight t49-topic">
                <div className="flex items-start justify-between gap-4">
                  <span className="icon-badge">
                    <Icon name={t.icon} className="h-5 w-5" />
                  </span>
                  <span className="t49-mono text-[var(--t-lo)]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-[19px] font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--t-mid)]">{t.d}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {t.points.map((p) => (
                    <li key={p} className="chip">
                      {p}
                    </li>
                  ))}
                </ul>
                <PickButton topic={t.id} className="link t49-topic-btn">
                  Talk about this <Arrow />
                </PickButton>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="t49-format">
          {[
            ["Send a request", "Pick a day, a time window and what you want to cover. It takes a minute."],
            ["We confirm", "An engineer replies by email with a time and a place that works for both of us."],
            ["Meet", "At Marina Bay Sands on the conference days, anywhere in the city on the others, or on video."],
          ].map(([t, d], i) => (
            <div key={t} className="t49-format-step">
              <span className="t49-format-n">{i + 1}</span>
              <div>
                <h3 className="text-[16px] font-semibold tracking-tight">{t}</h3>
                <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{d}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* ── Work we can walk through ── */}
      <Section id="work">
        <SectionHeader
          eyebrow="On the laptop"
          title="Work we can walk you through"
          lead="Client names stay private under NDA. The architecture and the tests do not: ask us to open them up when we meet."
          action={
            <ButtonLink href="/case-studies" variant="secondary">
              All case studies <Arrow />
            </ButtonLink>
          }
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {work.map((w, i) => (
            <Reveal key={w.id} delay={i * 80} className="h-full">
              <article className="card t49-work">
                {w.shot && (
                  <div className="t49-work-shot">
                    <Shot shot={w.shot} sizes="(min-width: 1024px) 360px, calc(100vw - 72px)" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2 text-[13px]">
                    <span className="font-semibold text-[var(--signal)]">{w.tag}</span>
                    <span className="text-[var(--t-lo)]">· Client under NDA</span>
                  </div>
                  <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-tight">{w.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{w.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="chip">
                      {w.std} · {w.stdLabel}
                    </span>
                  </div>
                  <Link href={`/case-studies#${w.id}`} className="link mt-auto pt-6 text-[15px]">
                    Read the case study <Arrow />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-[var(--t-mid)]">
          Want to see how we test before we meet?{" "}
          <Link href="/lab" className="link">
            Try the Invariant Lab <Arrow />
          </Link>
        </p>
      </Section>

      {/* ── Meeting pass ── */}
      <section id="meet" className="t49-meet" aria-labelledby="t49-meet-title">
        <div className="t49-meet-grid-bg" aria-hidden="true" />
        <div className="container-x relative">
          <Reveal className="mb-12 max-w-2xl lg:mb-16">
            <span className="eyebrow t49-eyebrow-light">Request a meeting</span>
            <h2 id="t49-meet-title" className="t-h2 mt-3 text-white">
              <Words text="Get your meeting pass" />
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              Fill it in and watch the pass come together. Sending it opens your email app with everything written out; an engineer replies to
              confirm a time and place.
            </p>
          </Reveal>
          <MeetingPass />
        </div>
      </section>

      {/* ── FAQ ── */}
      <Section soft>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">Good to know</span>
            <h2 className="t-h2 mt-3">Before we meet</h2>
            <p className="t-lead mt-4">Anything else, just ask in your request.</p>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={T49_FAQS} />
          </div>
        </div>
      </Section>

      <div className="pt-20 lg:pt-28" />
      <CTASection title="Not in Singapore this week?" lead="The conversation works just as well on video. Tell us what you are building and what must not go wrong." />
    </SiteShell>
  );
}
