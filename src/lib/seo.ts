import type { Metadata } from "next";
import { COMPANY } from "@/content/company";

/* Search metadata shared by every page.

   The live site serves from www.hashxlabs.com (the bare domain 308s there), so
   that is the canonical origin. Next merges metadata shallowly: a page that
   sets `openGraph` replaces the layout's whole `openGraph` object, so pages
   build theirs with pageMeta() rather than relying on inheritance. Canonical
   URLs are set per page on purpose; one set in the layout would be inherited
   by every page that forgot its own and point them all at the home page. */

export const SITE_URL = "https://www.hashxlabs.com";
export const SITE_NAME = COMPANY.name;

export function pageMeta({
  title,
  description,
  path,
  absoluteTitle,
  ogTitle,
  keywords,
  image: pageImage,
}: {
  /** Page title; the layout's template adds " — HashX Labs" unless absoluteTitle is set. */
  title: string;
  description: string;
  /** Route path, e.g. "/about". Used for the canonical and og:url. */
  path: string;
  absoluteTitle?: boolean;
  /** Title for link previews when it should differ from the <title>. */
  ogTitle?: string;
  keywords?: string[];
  /** Share image for this page; defaults to the site card (app/opengraph-image). */
  image?: { url: string; alt: string };
}): Metadata {
  const shareTitle = ogTitle ?? (absoluteTitle ? title : `${title} — ${SITE_NAME}`);
  // The root app/opengraph-image only covers "/", so every page points at it.
  // Config images also win over a route's own opengraph-image file, so a page
  // with its own card (TOKEN2049) must pass it here.
  const image = { width: 1200, height: 630, ...(pageImage ?? { url: "/opengraph-image", alt: `${SITE_NAME} — blockchain and AI engineering` }) };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title: shareTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: { card: "summary_large_image", title: shareTitle, description, images: [image.url] },
  };
}

/** A JSON-LD <script> payload, with "<" escaped so a string can never close the tag (Next's JSON-LD guide). */
export const jsonLd = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, "\\u003c") });

export const ORG_ID = `${SITE_URL}/#organization`;

/** Organization + WebSite, rendered once in the root layout. */
export const SITE_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon/logo.png`, width: 1024, height: 1024 },
      email: COMPANY.email,
      telephone: COMPANY.phone,
      description:
        "HashX Labs designs, builds and secures blockchain and AI systems: smart contracts, DeFi, tokenization, wallets, cross-chain infrastructure and AI agents.",
      contactPoint: { "@type": "ContactPoint", contactType: "sales", email: COMPANY.email, telephone: COMPANY.phone, availableLanguage: ["English"] },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};
