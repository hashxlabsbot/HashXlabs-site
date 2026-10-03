import type { Metadata } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Martian_Mono } from "next/font/google";
import "./globals.css";

/* Type system.
   Bricolage Grotesque (display): variable with optical-size and width
   axes; run condensed it has a drafted, slightly odd character that
   sets the site apart from the usual Inter/Sora/Space Grotesk stack.
   Instrument Sans (body): quiet, readable, narrow-ish.
   Martian Mono (labels, code, buttons): wide, distinctive mono. */
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
});

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = Martian_Mono({
  variable: "--font-mono-brand",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});
import ClientReady from "@/components/ClientReady";
import { SITE_GRAPH, SITE_NAME, SITE_URL, jsonLd } from "@/lib/seo";
import Intro from "@/components/intro/Intro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "HashX Labs — Blockchain & AI engineering",
    template: "%s — HashX Labs",
  },
  description:
    "HashX Labs designs, builds and secures blockchain and AI systems: smart contracts, DeFi, tokenization, wallets, cross-chain infrastructure and AI agents. Specification and tests first, from first commit to mainnet.",
  applicationName: SITE_NAME,
  keywords: [
    "Web3 Development Company",
    "Blockchain Engineering Services",
    "RWA Tokenization Platform",
    "Smart Contract Security Audit",
    "Enterprise AI Agents",
    "DeFi Protocol Development",
    "HashX Labs",
  ],
  // Pages set their own canonical and openGraph via pageMeta() (lib/seo.ts).
  openGraph: {
    title: "HashX Labs — Blockchain & AI engineering",
    description: "Smart contracts, Web3 platforms and AI systems, built and tested by senior engineers.",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  // Search Console / Bing Webmaster ownership tags, set in the hosting
  // dashboard (read at build time). Not needed if you verify by DNS instead.
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { "msvalidate.01": process.env.BING_SITE_VERIFICATION } } : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior: Next 16 no longer resets smooth scrolling on route
    // changes by itself; this keeps page navigations instant (docs: upgrading/version-16).
    // suppressHydrationWarning: the intro's inline script adds state classes to
    // <html> before React hydrates (components/intro/Intro.tsx).
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(SITE_GRAPH)} />
        <Intro />
        <ClientReady />
        {children}
      </body>
    </html>
  );
}
