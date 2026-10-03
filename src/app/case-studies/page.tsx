import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import Icon from "@/components/icons/Icon";
import Shot from "@/components/Shot";
import { Arrow, ButtonLink, Chips, CTASection, PageHeader, Section } from "@/components/ui";
import { WORK } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Case studies",
  description:
    "Selected engagements: DeFi, tokenized assets, custody and applied AI. Client names withheld under NDA.",
  path: "/case-studies",
});

export default function WorkPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Work"
        title="Selected engagements"
        lead="Client names stay private under NDA. Each case below describes what was built and how it was tested, as it was delivered. We are happy to walk through architecture and test approach on a call."
        crumbs={[{ href: "/case-studies", label: "Work" }]}
      >
        <ButtonLink href="/contact">
          Discuss a similar project <Arrow />
        </ButtonLink>
      </PageHeader>

      <Section>
        <nav aria-label="Case studies" className="mb-12 flex flex-wrap gap-2">
          {WORK.map((w) => (
            <a
              key={w.id}
              href={`#${w.id}`}
              className="rounded-full border border-[var(--line-strong)] px-4 py-2 text-[14px] font-medium transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              {w.tag}
            </a>
          ))}
        </nav>

        <div className="grid gap-8">
          {WORK.map((w) => (
            <article key={w.id} id={w.id} className="card overflow-clip">
              <header className="border-b border-[var(--line)] bg-[var(--bg-soft)] p-7 sm:p-10">
                <div className={w.shot ? "grid items-center gap-10 lg:grid-cols-12" : ""}>
                  <div className={w.shot ? "lg:col-span-5" : ""}>
                    <div className="flex flex-wrap items-center gap-3 text-[13px]">
                      <span className="font-semibold text-[var(--signal)]">{w.tag}</span>
                      <span className="text-[var(--t-lo)]">·</span>
                      <span className="text-[var(--t-lo)]">Client under NDA</span>
                      <span className={`chip bg-white ${w.shot ? "" : "ml-auto"}`}>
                        {w.std} · {w.stdLabel}
                      </span>
                    </div>
                    <h2 className="t-h3 mt-4 max-w-3xl text-[1.6rem] sm:text-[1.9rem]">{w.title}</h2>
                    <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-[var(--t-mid)]">{w.summary}</p>
                  </div>
                  {w.shot && (
                    <div className="lg:col-span-7">
                      <Shot shot={w.shot} sizes="(min-width: 1024px) 640px, calc(100vw - 104px)" />
                    </div>
                  )}
                </div>
              </header>

              <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-3">
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--t-lo)]">The challenge</h3>
                  <p className="mt-3 text-[15.5px] leading-relaxed">{w.context}</p>
                  <h3 className="mt-8 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--t-lo)]">How it fits together</h3>
                  <ol className="mt-3 flex flex-wrap items-center gap-2 text-[14px]">
                    {w.flow.map((f, i) => (
                      <li key={f} className="flex items-center gap-2">
                        <span className="rounded-md border border-[var(--line-strong)] px-2.5 py-1">{f}</span>
                        {i < w.flow.length - 1 && <span className="text-[var(--t-lo)]">→</span>}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--t-lo)]">What we built</h3>
                  <ul className="mt-3 grid gap-2.5">
                    {w.built.map((b) => (
                      <li key={b} className="flex gap-3 text-[15px] leading-snug">
                        <Icon name="code" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--signal)]" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--t-lo)]">What we tested</h3>
                  <ul className="mt-3 grid gap-2.5">
                    {w.tested.map((t) => (
                      <li key={t} className="flex gap-3 text-[15px] leading-snug">
                        <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ok)]" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <footer className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] px-7 py-5 sm:px-10">
                <span className="text-[13px] font-semibold text-[var(--t-lo)]">Stack</span>
                <Chips items={w.stack} />
              </footer>
            </article>
          ))}
        </div>
      </Section>

      <CTASection title="Building something similar?" />
    </SiteShell>
  );
}
