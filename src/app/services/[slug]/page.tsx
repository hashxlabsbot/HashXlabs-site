import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import CoreServicePage from "@/components/pages/CoreServicePage";
import CapabilityPage from "@/components/pages/CapabilityPage";
import { SERVICES } from "@/content/site";
import { ITEMS } from "@/content/menu";

// Menu items that link elsewhere (href) do not get their own page.
const PAGE_ITEMS = ITEMS.filter(({ item }) => !item.href);

export function generateStaticParams() {
  return [...SERVICES.map((s) => ({ slug: s.slug })), ...PAGE_ITEMS.map(({ item }) => ({ slug: item.slug }))];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (s) return pageMeta({ title: s.title, description: s.short, path: `/services/${slug}` });
  const m = PAGE_ITEMS.find(({ item }) => item.slug === slug);
  return m ? pageMeta({ title: m.item.t, description: m.item.lead, path: `/services/${slug}` }) : {};
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  if (s) return <CoreServicePage s={s} />;
  const m = PAGE_ITEMS.find(({ item }) => item.slug === slug);
  if (!m) notFound();
  return <CapabilityPage item={m.item} group={m.group} section={m.section} />;
}
