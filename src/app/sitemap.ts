import type { MetadataRoute } from "next";
import { ITEMS } from "@/content/menu";
import { SERVICES } from "@/content/site";
import { SITE_URL } from "@/lib/seo";

/* /sitemap.xml: every indexable page. Service slugs come from the same lists
   as generateStaticParams in app/services/[slug], so new pages appear here
   automatically. lastModified is the build time. */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly", images?: string[]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
    ...(images ? { images } : {}),
  });

  return [
    page("/", 1, "weekly"),
    page("/token2049", 0.9, "daily", [`${SITE_URL}/img/marina-1920.webp`]),
    page("/token2049/guide", 0.9, "daily", [`${SITE_URL}/img/marina-1280.webp`]),
    page("/services", 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}`, 0.8)),
    page("/solutions", 0.8),
    page("/case-studies", 0.8),
    page("/about", 0.7),
    page("/contact", 0.7),
    page("/lab", 0.6),
    ...ITEMS.filter(({ item }) => !item.href).map(({ item }) => page(`/services/${item.slug}`, 0.6)),
  ];
}
