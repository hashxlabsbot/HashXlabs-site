import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Icon, { type IconName } from "@/components/icons/Icon";
import { Arrow, ButtonLink, CTASection, PageHeader, Section, SectionHeader } from "@/components/ui";
import { AUDIENCES } from "@/content/company";
import { SOLUTIONS } from "@/content/site";

export const metadata: Metadata = {
  title: "Solutions",
  description: "DeFi protocols, tokenized assets, custody and wallets, tokens and governance, and AI on real systems.",
};

const ICONS: IconName[] = ["chart", "tokenize", "lock", "vote", "ai"];

export default function SolutionsPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Solutions"
        title="Solutions for systems that move real value"
        lead="Each kind of system fails in its own way. We start every project by writing that failure down, then build and test against it."
        crumbs={[{ href: "/solutions", label: "Solutions" }]}
      >
        <ButtonLink href="/contact">
          Talk to an engineer <Arrow />
        </ButtonLink>
        <ButtonLink href="#use-cases" variant="secondary">
          See use cases
        </ButtonLink>
      </PageHeader>

      <Section>
        <SectionHeader eyebrow="Industries" title="Who we build for" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="card p-6">
              <Icon name={a.icon} className="h-7 w-7 text-[var(--signal)]" />
              <h2 className="mt-5 text-[17px] font-semibold tracking-tight">{a.title}</h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{a.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section soft id="use-cases">
        <SectionHeader eyebrow="Use cases" title="The problem, what we build, what we test" lead="Five kinds of system we build most often." />
        <div className="grid gap-6">
          {SOLUTIONS.map((x, i) => (
            <article key={x.n} className="card grid overflow-hidden lg:grid-cols-12">
              <div className="flex flex-col justify-between gap-8 border-b border-[var(--line)] p-7 sm:p-9 lg:col-span-4 lg:border-b-0 lg:border-r">
                <span className="icon-badge">
                  <Icon name={ICONS[i] ?? "blockchain"} className="h-[22px] w-[22px]" />
                </span>
                <div>
                  <h2 className="t-h3 text-2xl">{x.title}</h2>
                  <Link href={x.href} className="link mt-3 text-[14.5px]">
                    Related service <Arrow />
                  </Link>
                </div>
              </div>
              <dl className="divide-y divide-[var(--line)] lg:col-span-8">
                {[
                  ["The problem", x.problem],
                  ["What we build", x.build],
                  ["What we test hardest", x.test],
                ].map(([k, v]) => (
                  <div key={k} className="grid gap-1.5 p-6 sm:grid-cols-[12rem_1fr] sm:gap-6 sm:p-8">
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--t-lo)]">{k}</dt>
                    <dd className="text-[16px] leading-relaxed text-[var(--t-hi)]">{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </Section>

      <div className="pt-20 lg:pt-28" />
      <CTASection title="Not sure which of these you need?" lead="Describe the product and the risk you are worried about. We will tell you what we would build, and what we would not." />
    </SiteShell>
  );
}
