import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientReady from "@/components/ClientReady";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HashX Labs — Intelligent Digital Solutions",
  description:
    "We help startups, SMEs, and enterprises innovate, automate, and scale through cutting-edge digital technologies. Custom software, web apps, mobile apps, SaaS platforms, AI automation, and digital marketing.",
  keywords:
    "software development, web applications, mobile apps, SaaS, AI solutions, digital marketing, enterprise software, HashX Labs",
  openGraph: {
    title: "HashX Labs — Intelligent Digital Solutions",
    description:
      "Building future-ready digital products: software, mobile apps, websites, AI solutions.",
    siteName: "HashX Labs",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen antialiased">
        <ClientReady />
        {children}
      </body>
    </html>
  );
}
