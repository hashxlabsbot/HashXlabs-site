import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Icon from "@/components/icons/Icon";
import { Arrow, ButtonLink, CTASection, PageHeader, Section, SectionHeader } from "@/components/ui";
import { PROCESS, REASONS, sectionAnchor } from "@/content/company";
import { itemHref, type MenuGroup, type MenuItem, type MenuSection } from "@/content/menu";

/* One page per catalogue item in menu.ts (~60 pages). Content per item is
   short (lead, one-liner, three scope points), so the page pairs it with the
   shared approach and related capabilities instead of padding it out. */

export default function CapabilityPage({ item, group, section }: { item: MenuItem; group: MenuGroup; section: MenuSection }) {
  const siblings = group.items.filter((x) => x.slug !== item.slug);
  const areaHref = `/services#${sectionAnchor(section.id)}`;

  return (
    <SiteShell>
      <PageHeader
        eyebrow={`${section.label} · ${group.label}`}
        title={item.t}
        lead={item.lead}
        crumbs={[
          { href: "/services", label: "Services" },
          { href: areaHref, label: section.label },
          { href: itemHref(item), label: item.t },
        ]}
      >
        <ButtonLink href="/contact">
          Discuss your project <Arrow />
        </ButtonLink>
        {section.overview && (
          <ButtonLink href={section.overview} variant="secondary">
            {section.label} overview
          </ButtonLink>
        )}
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">Scope</span>
            <h2 className="t-h2 mt-3">What&apos;s included</h2>
            <p className="t-lead mt-4">{item.d}.</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-3 lg:col-span-8">
            {item.points.map((p) => (
              <li key={p} className="card p-6">
                <span className="icon-badge h-9 w-9">
                  <Icon name="check" className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
                <p className="mt-4 text-[16px] font-semibold leading-snug tracking-tight">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section soft>
        <SectionHeader eyebrow="How we deliver" title="From specification to production" lead="The same five steps on every engagement, so you always know what comes next." />
        <ol className="grid gap-4 md:grid-cols-5">
          {PROCESS.map((p, i) => (
            <li key={p.k} className="rounded-xl border border-[var(--line)] bg-white p-5">
              <span className="text-sm font-semibold text-[var(--signal)]">Step {i + 1}</span>
              <h3 className="mt-2 text-[16px] font-semibold tracking-tight">{p.k}</h3>
              <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--t-mid)]">{p.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <div key={r.title}>
              <Icon name={r.icon} className="h-6 w-6 text-[var(--signal)]" />
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight">{r.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{r.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {siblings.length > 0 && (
        <Section soft>
          <SectionHeader
            eyebrow={group.label}
            title="Related capabilities"
            action={
              <Link href={areaHref} className="link">
                All of {section.label} <Arrow />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((c) => (
              <Link key={c.slug} href={itemHref(c)} className="card group block p-6">
                <span className="block text-[16px] font-semibold text-[var(--t-hi)] group-hover:text-[var(--signal)]">{c.t}</span>
                <span className="mt-1.5 block text-[14px] leading-snug text-[var(--t-mid)]">{c.d}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <div className="pt-20 lg:pt-28" />
      <CTASection />
    </SiteShell>
  );
}
