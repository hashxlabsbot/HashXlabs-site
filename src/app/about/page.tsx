import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import Icon from "@/components/icons/Icon";
import { Arrow, ButtonLink, CTASection, PageHeader, Section, SectionHeader } from "@/components/ui";
import { PRINCIPLES, PROCESS, REASONS, WONT } from "@/content/company";

export const metadata: Metadata = {
  title: "About",
  description: "HashX Labs is a blockchain and AI engineering company. Every engagement is led by senior engineers and built on a written specification.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="About"
        title="An engineering company for products that hold value"
        lead="HashX Labs designs, builds and secures blockchain and AI systems for Web3 founders, fintechs, asset issuers and enterprises. Every engagement is led by senior engineers and starts from a written specification."
        crumbs={[{ href: "/about", label: "About" }]}
      >
        <ButtonLink href="/contact">
          Work with us <Arrow />
        </ButtonLink>
        <ButtonLink href="/case-studies" variant="secondary">
          See our work
        </ButtonLink>
      </PageHeader>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="eyebrow">Who we are</span>
            <h2 className="t-h2 mt-3">Why we exist</h2>
          </div>
          <div className="space-y-5 text-[17px] leading-relaxed text-[var(--t-mid)] lg:col-span-7">
            <p>
              On a blockchain, a bug is not a support ticket. Money moves in a single transaction, and anyone can call your code in any
              order. Most exploits are not exotic: a line in the wrong order, a rounding direction, a key with too much power.
            </p>
            <p>
              We started HashX Labs to build these systems the way they deserve: specify what must always be true, write it as tests,
              and break the code ourselves before anyone else can. We bring the same discipline to AI agents that act on real systems.
            </p>
            <p>
              The result is software your team can understand, run and own, with the documentation and tests to prove what it does.
            </p>
          </div>
        </div>
      </Section>

      <Section soft>
        <SectionHeader eyebrow="Principles" title="Five rules we work by" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(([t, d], i) => (
            <div key={t} className="card p-7">
              <span className="text-sm font-semibold text-[var(--signal)]">0{i + 1}</span>
              <h3 className="mt-3 text-[19px] font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--t-mid)]">{d}</p>
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-[var(--radius)] bg-[var(--signal)] p-7 text-white">
            <p className="text-[19px] font-semibold leading-snug">Want to see how these rules show up in real code?</p>
            <ButtonLink href="/lab" variant="ink" className="mt-6 self-start">
              Open the Invariant Lab <Arrow />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">What you can expect</span>
            <h2 className="t-h2 mt-3">Working with us</h2>
            <div className="mt-8 grid gap-7">
              {REASONS.map((r) => (
                <div key={r.title} className="flex gap-4">
                  <span className="icon-badge h-10 w-10 shrink-0">
                    <Icon name={r.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[16.5px] font-semibold tracking-tight">{r.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-[var(--t-mid)]">{r.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className="eyebrow">What we won&apos;t do</span>
            <h2 className="t-h2 mt-3">Promises we refuse to make</h2>
            <ul className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {WONT.map((w) => (
                <li key={w} className="flex items-center gap-4 py-4 text-[16px]">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#fdecec] text-[13px] font-semibold text-[var(--bad)]" aria-hidden="true">
                    ✕
                  </span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section soft>
        <SectionHeader eyebrow="How we work" title="The same five steps on every project" center />
        <ol className="grid gap-5 md:grid-cols-5">
          {PROCESS.map((p, i) => (
            <li key={p.k} className="rounded-xl border border-[var(--line)] bg-white p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--signal)] text-sm font-semibold text-white">{i + 1}</span>
              <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{p.k}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--t-mid)]">{p.d}</p>
            </li>
          ))}
        </ol>
      </Section>

      <div className="pt-20 lg:pt-28" />
      <CTASection />
    </SiteShell>
  );
}
