import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import Icon from "@/components/icons/Icon";
import { Arrow, ButtonLink, CheckList, CTASection, PageHeader, Section, SectionHeader } from "@/components/ui";
import { PROCESS, SERVICE_AREAS, sectionAnchor } from "@/content/company";
import { MENU, itemHref } from "@/content/menu";

export const metadata: Metadata = pageMeta({
  title: "Services",
  description:
    "Blockchain development, smart contract security, RWA tokenization, DeFi and exchanges, stablecoins and payments, and AI development.",
  path: "/services",
});

const AREA_INTRO: Record<string, string> = {
  blockchain: "Contracts, chains and the infrastructure around them, on EVM networks, Solana and beyond.",
  stablecoins: "Issuance, reserves and the payment rails that move stablecoins between people and businesses.",
  rwa: "The contracts, compliance and portals needed to put real-world assets on-chain and run them.",
  solutions: "Exchanges, digital banking, wallets and DeFi protocols built for adversarial markets.",
  ai: "AI agents and retrieval systems for Web3 products and for the rest of your business.",
};

export default function ServicesPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Services"
        title="Engineering for blockchain and AI products"
        lead="Six service areas, one team. Pick a single piece, like a security review, or have us build the whole product end to end."
        crumbs={[{ href: "/services", label: "Services" }]}
      >
        <ButtonLink href="/contact">
          Discuss your project <Arrow />
        </ButtonLink>
        <ButtonLink href="#catalogue" variant="secondary">
          Browse all capabilities
        </ButtonLink>
      </PageHeader>

      <Section>
        <SectionHeader eyebrow="Service areas" title="Where we can help" />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICE_AREAS.map((a) => (
            <Link key={a.title} href={a.href} className="card group flex flex-col p-7">
              <span className="icon-badge">
                <Icon name={a.icon} className="h-[22px] w-[22px]" />
              </span>
              <h2 className="t-h3 mt-6">{a.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--t-mid)]">{a.d}</p>
              <CheckList items={a.points} className="mt-6" />
              <span className="link mt-auto pt-7 text-[14.5px]">
                Learn more <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section soft id="catalogue">
        <SectionHeader
          eyebrow="All capabilities"
          title="The full catalogue"
          lead="Every capability has its own page with scope and approach. Jump to an area:"
        />
        <nav aria-label="Service areas" className="-mt-6 mb-12 flex flex-wrap gap-2">
          {MENU.map((s) => (
            <a
              key={s.id}
              href={`#${sectionAnchor(s.id)}`}
              className="rounded-full border border-[var(--line-strong)] bg-white px-4 py-2 text-[14px] font-medium transition-colors hover:border-[var(--signal)] hover:text-[var(--signal)]"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="grid gap-6">
          {MENU.map((s) => (
            <section key={s.id} id={sectionAnchor(s.id)} aria-labelledby={`h-${s.id}`} className="card p-7 sm:p-10">
              <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-7 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 id={`h-${s.id}`} className="t-h3 text-2xl">
                    {s.label}
                  </h2>
                  <p className="mt-2 max-w-2xl text-[15px] text-[var(--t-mid)]">{AREA_INTRO[s.id]}</p>
                </div>
                {s.overview && (
                  <Link href={s.overview} className="link shrink-0 text-[14.5px]">
                    {s.label} overview <Arrow />
                  </Link>
                )}
              </div>
              <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {s.groups.map((g) => (
                  <div key={g.id}>
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--t-lo)]">{g.label}</h3>
                    <ul className="mt-4 grid gap-1">
                      {g.items.map((it) => (
                        <li key={it.slug}>
                          <Link href={itemHref(it)} className="group -mx-3 block rounded-lg px-3 py-2.5 transition-colors hover:bg-[var(--bg-soft)]">
                            <span className="block text-[15px] font-semibold text-[var(--t-hi)] group-hover:text-[var(--signal)]">{it.t}</span>
                            <span className="mt-0.5 block text-[13.5px] leading-snug text-[var(--t-mid)]">{it.d}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">How every engagement runs</span>
            <h2 className="t-h2 mt-3">Same process, whatever you build</h2>
            <p className="t-lead mt-4">You see working software and written decisions at every step, and the tests come with the code.</p>
          </div>
          <ol className="grid gap-3">
            {PROCESS.map((p, i) => (
              <li key={p.k} className="flex gap-4 rounded-xl border border-[var(--line)] p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--signal-soft)] text-sm font-semibold text-[var(--signal)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold tracking-tight">{p.k}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{p.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section soft>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-[var(--line)] bg-white p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Invariant Lab</span>
            <h2 className="t-h3 mt-3 text-2xl">See how we test a contract, in your browser</h2>
            <p className="mt-2 text-[15px] text-[var(--t-mid)]">Break a vault with a fuzzer, read the counterexample, then apply the fix and watch the properties hold.</p>
          </div>
          <ButtonLink href="/lab" variant="secondary">
            Open the Lab <Arrow />
          </ButtonLink>
        </div>
      </Section>

      <div className="pt-20 lg:pt-28" />
      <CTASection />
    </SiteShell>
  );
}
