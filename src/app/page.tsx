import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import Reveal from "@/components/Reveal";
import WorkShowcase from "@/components/work/WorkShowcase";
import ServicesRail from "@/components/home/ServicesRail";
import Audiences from "@/components/home/Audiences";
import Why from "@/components/home/Why";
import ProofHero from "@/components/home/ProofHero";
import TechBento from "@/components/home/TechBento";
import Engagements from "@/components/home/Engagements";
import Token2049Band from "@/components/home/Token2049Band";
import Accordion from "@/components/ui/Accordion";
import { ButtonLink, CTASection, Section, SectionHeader } from "@/components/ui";
import { CHAINS, FAQS, PROCESS } from "@/content/company";

export const metadata: Metadata = pageMeta({
  title: "HashX Labs — Blockchain & AI engineering",
  absoluteTitle: true,
  description:
    "HashX Labs designs, builds and secures blockchain and AI systems: smart contracts, DeFi, RWA tokenization, wallets and AI agents, tested from first commit to mainnet.",
  path: "/",
});

export default function Home() {
  return (
    <SiteShell>
      {/* ── Hero: clear offer + proof (components/home/ProofHero). The previous
             image-corridor hero is components/home/StreamHero. ── */}
      <ProofHero />

      {/* ── Chains ── */}
      <div className="relative z-10 border-y border-[var(--line)] bg-white">
        <div className="container-x flex flex-col items-start gap-5 py-8 lg:flex-row lg:items-center lg:gap-12">
          <p className="shrink-0 text-sm font-medium text-[var(--t-lo)]">Building on</p>
          <div className="marquee w-full min-w-0">
            <ul className="marquee-track">
              {[...CHAINS, ...CHAINS].map((c, i) => (
                <li
                  key={i}
                  aria-hidden={i >= CHAINS.length || undefined}
                  className="font-[family-name:var(--font-head)] text-lg font-semibold tracking-tight whitespace-nowrap text-[var(--t-mid)]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── TOKEN2049 Singapore, 7–10 Oct 2026 (temporary: remove after the event) ── */}
      <Token2049Band />

      {/* ── Services: pinned horizontal rail (components/home/ServicesRail) ── */}
      <ServicesRail />

      {/* ── Who we work with: tabs + particle figure (components/home/Audiences) ── */}
      <Audiences />

      {/* ── Why HashX: the lead sentence, demonstrated (components/home/Why) ── */}
      <Why />

      {/* ── Process ──────────────────────────────────────────── */}
      <Section soft id="process">
        <SectionHeader eyebrow="How we work" title="A clear process from idea to mainnet" lead="Five steps, the same on every project. You see working software and written decisions at each one." center />
        <Reveal className="proc">
          <div className="proc-line hidden md:block" aria-hidden="true" />
          <ol className="relative grid gap-5 md:grid-cols-5">
            {PROCESS.map((p, i) => (
              <li key={p.k} className="proc-item" style={{ "--i": i } as CSSProperties}>
                <div className="h-full rounded-xl border border-[var(--line)] bg-white p-6">
                  <span className="proc-num grid h-9 w-9 place-items-center rounded-full bg-[var(--signal)] text-sm font-semibold text-white" style={{ "--i": i } as CSSProperties}>
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{p.k}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-[var(--t-mid)]">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </Section>

      {/* ── Selected work: pinned scroll tour (components/work) ── */}
      <WorkShowcase />

      {/* ── Tech stack: group bento around a live architecture diagram (components/home/TechBento) ── */}
      <TechBento />

      {/* ── Engagement models: a path that draws in on scroll (components/home/Engagements) ── */}
      <Engagements />

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <Section soft>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow">FAQ</span>
            <h2 className="t-h2 mt-3">Questions we hear often</h2>
            <p className="t-lead mt-4">Can&apos;t find your answer? Ask us directly.</p>
            <div className="mt-7">
              <ButtonLink href="/contact" variant="secondary">
                Contact us
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Accordion items={FAQS} />
          </div>
        </div>
      </Section>

      <div className="pt-20 lg:pt-28" />
      <CTASection />
    </SiteShell>
  );
}
