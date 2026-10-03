import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Icon from "@/components/icons/Icon";
import Accordion from "@/components/ui/Accordion";
import { Arrow, ButtonLink, Chips, CTASection, PageHeader, Section, SectionHeader } from "@/components/ui";
import { SERVICE_AREAS } from "@/content/company";
import { MENU, itemHref } from "@/content/menu";
import { WORK, type Service } from "@/content/site";

/* Page for the four core services in site.ts (SERVICES). */

// Which catalogue area and which case studies relate to each core service.
const RELATED: Record<string, { area: string; work: string[] }> = {
  "blockchain-development": { area: "blockchain", work: ["amm", "custody"] },
  "smart-contract-audit": { area: "blockchain", work: ["amm", "rwa"] },
  "rwa-tokenization": { area: "rwa", work: ["rwa"] },
  "ai-development": { area: "ai", work: ["rag"] },
};

export default function CoreServicePage({ s }: { s: Service }) {
  const rel = RELATED[s.slug];
  const section = MENU.find((m) => m.id === rel?.area);
  const capabilities = section ? section.groups.flatMap((g) => g.items).filter((i) => !i.href).slice(0, 6) : [];
  const work = WORK.filter((w) => rel?.work.includes(w.id));
  const icon = SERVICE_AREAS.find((a) => a.href === `/services/${s.slug}`)?.icon ?? "blockchain";

  return (
    <SiteShell>
      <PageHeader eyebrow="Service" title={s.title} lead={s.lead} crumbs={[{ href: "/services", label: "Services" }, { href: `/services/${s.slug}`, label: s.title }]}>
        <ButtonLink href="/contact">
          Discuss your project <Arrow />
        </ButtonLink>
        <ButtonLink href="#deliverables" variant="secondary">
          What you get
        </ButtonLink>
      </PageHeader>

      <Section id="deliverables">
        <SectionHeader eyebrow="What you get" title="Deliverables" lead={s.short} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {s.deliverables.map((d) => (
            <div key={d.t} className="card p-7">
              <span className="icon-badge h-10 w-10">
                <Icon name={icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{d.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--t-mid)]">{d.d}</p>
            </div>
          ))}
        </div>
        {s.note && (
          <div className="mt-8 flex gap-4 rounded-xl border border-[var(--line)] bg-[var(--bg-tint)] p-5 sm:p-6">
            <Icon name="eye" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--signal)]" />
            <p className="text-[15px] leading-relaxed text-[var(--t-hi)]">{s.note}</p>
          </div>
        )}
      </Section>

      <Section soft>
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">Approach</span>
            <h2 className="t-h2 mt-3">How we work on this</h2>
            <p className="t-lead mt-4">Each step produces something you can read or run, so progress is never a matter of trust.</p>
          </div>
          <ol className="grid gap-3 lg:col-span-7">
            {s.steps.map((st, i) => (
              <li key={st.k} className="flex gap-4 rounded-xl border border-[var(--line)] bg-white p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--signal)] text-sm font-semibold text-white">{i + 1}</span>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-tight">{st.k}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{st.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">Risk focus</span>
            <h2 className="t-h3 mt-3 text-2xl">What we test hardest</h2>
            <ul className="mt-6 grid gap-3">
              {s.risks.map((r) => (
                <li key={r} className="flex items-center gap-3 rounded-lg border border-[var(--line)] px-4 py-3 text-[15px]">
                  <Icon name="shield" className="h-[18px] w-[18px] shrink-0 text-[var(--signal)]" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Technology</span>
            <h2 className="t-h3 mt-3 text-2xl">Tools we use</h2>
            <div className="mt-6">
              <Chips items={s.stack} />
            </div>
            {work.length > 0 && (
              <div className="mt-10">
                <h3 className="text-[15px] font-semibold">Related work</h3>
                <ul className="mt-3 grid gap-3">
                  {work.map((w) => (
                    <li key={w.id}>
                      <Link href={`/case-studies#${w.id}`} className="card group block p-5">
                        <span className="text-[12.5px] font-semibold text-[var(--signal)]">{w.tag} · Under NDA</span>
                        <span className="mt-1 block text-[15.5px] font-semibold text-[var(--t-hi)]">{w.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Section>

      {capabilities.length > 0 && section && (
        <Section soft>
          <SectionHeader
            eyebrow="Related capabilities"
            title={`More in ${section.label}`}
            action={
              <Link href="/services#catalogue" className="link">
                Full catalogue <Arrow />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <Link key={c.slug} href={itemHref(c)} className="card group block p-6">
                <span className="block text-[16px] font-semibold text-[var(--t-hi)] group-hover:text-[var(--signal)]">{c.t}</span>
                <span className="mt-1.5 block text-[14px] leading-snug text-[var(--t-mid)]">{c.d}</span>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="t-h2 mt-3">Common questions</h2>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={s.faqs} />
          </div>
        </div>
      </Section>

      <CTASection />
    </SiteShell>
  );
}
