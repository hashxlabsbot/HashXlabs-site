import Link from "next/link";
import SiteShell from "./SiteShell";
import PageHero from "./PageHero";
import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import Tilt from "./motion/Tilt";
import ChainScroll from "./motion/ChainScroll";
import { itemHref, type MenuGroup, type MenuItem, type MenuSection } from "@/content/menu";

// Stable per-page variant so each hero gets its own block arrangement.
const variantOf = (slug: string) => [...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % 5;

export default function ItemTemplate({ item, group, section }: { item: MenuItem; group: MenuGroup; section: MenuSection }) {
  const siblings = group.items.filter((x) => x.slug !== item.slug);
  const idx = group.items.findIndex((x) => x.slug === item.slug);
  const next = group.items[(idx + 1) % group.items.length];

  return (
    <SiteShell>
      <PageHero
        eyebrow={`${section.label} · ${group.label}`}
        title={item.t}
        lead={item.lead}
        variant={variantOf(item.slug)}
        crumb={section.overview ? { href: section.overview, label: section.label } : { href: "/services", label: "All services" }}
      >
        <Link href="/contact" className="btn-primary h-12 px-6">
          Discuss your project <span aria-hidden="true">→</span>
        </Link>
        <a href="#scope" className="btn-ghost h-12 bg-[var(--bg-card)] px-6">
          What&apos;s included
        </a>
      </PageHero>

      <section id="scope" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
              <SectionHead eyebrow="Scope" title="What's included." lead={item.d + "."} />
            </div>
          </div>
          <ol className="lg:col-span-8">
            {item.points.map((p, i) => (
              <li key={p} className="border-t border-[var(--line-strong)] last:border-b">
                <Reveal className="group grid grid-cols-[3rem_1fr] items-baseline gap-4 py-8 sm:grid-cols-[5rem_1fr]">
                  <span className="font-[family-name:var(--font-head)] text-4xl font-bold leading-none text-[var(--line-strong)] transition-colors group-hover:text-[var(--signal)] sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-2xl sm:text-4xl">{p}</h3>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ChainScroll id="delivery" />

      {siblings.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <SectionHead eyebrow={group.label} title="Related services." />
            <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {siblings.map((s) => (
                <Tilt key={s.slug} className="h-full">
                  <Link
                    href={itemHref(s)}
                    className="ticks group relative flex h-full min-h-[190px] flex-col border border-[var(--line-strong)] bg-[var(--bg-card)] p-6"
                  >
                    <span className="tk-b" />
                    <span className="mono relative z-10 text-[10.5px] uppercase tracking-[0.12em] text-[var(--t-lo)]">{group.label}</span>
                    <h3 className="relative z-10 mt-4 text-2xl transition-colors group-hover:text-[var(--signal)]">{s.t}</h3>
                    <p className="relative z-10 mt-2 text-[15px] text-[var(--t-mid)]">{s.d}</p>
                    <span className="mono relative z-10 mt-auto pt-6 text-[12px] group-hover:text-[var(--signal)]">Open →</span>
                  </Link>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
      )}

      {next.slug !== item.slug && (
        <Link href={itemHref(next)} className="group block border-t border-[var(--line)] bg-[var(--bg-raise)]">
          <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-20">
            <div>
              <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--t-lo)]">Next in {group.label}</span>
              <div className="mt-4 font-[family-name:var(--font-head)] text-4xl font-bold tracking-tight transition-colors group-hover:text-[var(--signal)] sm:text-6xl [font-stretch:88%]">
                {next.t}
              </div>
            </div>
            <span className="font-[family-name:var(--font-head)] text-5xl transition-transform duration-500 group-hover:translate-x-3 sm:text-7xl">→</span>
          </div>
        </Link>
      )}
    </SiteShell>
  );
}
