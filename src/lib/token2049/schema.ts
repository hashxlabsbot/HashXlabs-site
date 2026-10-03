import { EVENT } from "@/content/token2049";
import { SITE_URL } from "@/lib/seo";

/* Structured data shared by /token2049 and /token2049/guide. The conference
   is described as what it is: an event organised by TOKEN2049, at its own
   URL. Both pages point at the same @id so search engines treat it as one
   entity. Nothing here claims sponsorship, a booth or affiliation. */

export const T49_URL = `${SITE_URL}/token2049`;
export const GUIDE_URL = `${SITE_URL}/token2049/guide`;
export const CONFERENCE_ID = `${T49_URL}#token2049`;

export const VENUE = {
  "@type": "Place",
  name: EVENT.venue,
  address: {
    "@type": "PostalAddress",
    streetAddress: EVENT.address.street,
    postalCode: EVENT.address.postcode,
    addressLocality: EVENT.address.city,
    addressCountry: EVENT.address.country,
  },
  geo: { "@type": "GeoCoordinates", latitude: 1.2834, longitude: 103.8607 },
};

export const CONFERENCE = {
  "@type": "Event",
  "@id": CONFERENCE_ID,
  name: "TOKEN2049 Singapore 2026",
  description: `Crypto and Web3 conference at ${EVENT.venue}, Singapore, on ${EVENT.conference}, with TOKEN2049 Week side events across the city from ${EVENT.week}.`,
  image: [`${SITE_URL}/img/marina-og.jpg`],
  startDate: EVENT.opens,
  endDate: EVENT.closes,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: VENUE,
  url: EVENT.officialUrl,
  organizer: { "@type": "Organization", name: "TOKEN2049", url: "https://token2049.com" },
};

export const faqPage = (id: string, faqs: [string, string][]) => ({
  "@type": "FAQPage",
  "@id": id,
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});
