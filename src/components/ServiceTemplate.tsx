import Link from "next/link";
import SiteShell from "./SiteShell";
import PageHero from "./PageHero";
import SectionHead from "./SectionHead";
import HScroll from "./motion/HScroll";
import Tilt from "./motion/Tilt";
import Reveal from "./Reveal";
import Catalog from "./Catalog";
import { SERVICES, type Service } from "@/content/site";
import { CATALOG } from "@/content/menu";

export default function ServiceTemplate({ s }: { s: Service }) {
  const idx = SERVICES.findIndex((x) => x.slug === s.slug);
  const next = SERVICES[(idx + 1) % SERVICES.length];

  return (
    <SiteShell>
      <PageHero eyebrow={`Service ${s.n}`} title={s.title} lead={s.lead} variant={idx + 1} crumb={{ href: "/services", label: "All services" }}>
        <Link href="/contact" className="btn-primary h-12 px-6">
          Start a brief <span aria-hidden="true">→</span>
        </Link>
        <a href={s.catalog ? "#catalog" : "#deliverables"} className="btn-ghost h-12 bg-[var(--bg-card)] px-6">
          {s.catalog ? "Browse all services" : "What you get"}
        </a>
      </PageHero>

      {s.catalog && <Catalog groups={CATALOG} />}

      {/* Deliverables: sticky title, scrolling list */}
      <section id="deliverables" className="py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+48px)]">
              <SectionHead eyebrow="Deliverables" title="What you get." lead="Things you can open, run and keep. Not a slide deck." />
            </div>
          </div>
          <ol className="lg:col-span-8">
            {s.deliverables.map((d, i) => (
              <li key={d.t} className="border-t border-[var(--line-strong)]">
                <Reveal className="group grid grid-cols-[3rem_1fr] gap-4 py-8 sm:grid-cols-[5rem_1fr]">
                  <span className="font-[family-name:var(--font-head)] text-4xl font-bold leading-none text-[var(--line-strong)] transition-colors group-hover:text-[var(--signal)] sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-2xl sm:text-3xl">{d.t}</h3>
                    <p className="mt-2 max-w-xl text-[var(--t-mid)]">{d.d}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Process: pinned horizontal scroll */}
      <section className="section-alt border-y border-[var(--line)]">
        <HScroll head={<SectionHead eyebrow="Process" title="How it runs, step by step." />}>
          {s.steps.map((st, i) => (
            <Tilt key={st.k} className="shrink-0">
              <div className="ticks relative flex h-[340px] w-[78vw] max-w-[400px] snap-start flex-col border border-[var(--line-strong)] bg-[var(--bg-card)] p-8">
                <span className="tk-b" />
                <span className="font-[family-name:var(--font-head)] text-[6rem] font-bold leading-[0.8] tracking-[-0.05em] text-[var(--signal)] [font-stretch:85%]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-auto text-3xl">{st.k}</h3>
                <p className="mt-3 text-[var(--t-mid)]">{st.d}</p>
              </div>
            </Tilt>
          ))}
        </HScroll>
      </section>

      {/* What we test for */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <SectionHead eyebrow="What we try to break" title="The failures we test for first." />
          <div className="mt-12 grid gap-px border border-[var(--line-strong)] bg-[var(--line-strong)] sm:grid-cols-2 lg:grid-cols-3">
            {s.risks.map((r, i) => (
              <div key={r} className="group relative bg-[var(--bg-card)] p-7 transition-colors hover:bg-[var(--t-hi)] hover:text-white">
                <span className="mono text-[11px] text-[var(--signal)]">test_{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 font-[family-name:var(--font-head)] text-2xl font-bold leading-tight tracking-tight [font-stretch:90%]">{r}</p>
                <span className="mono mt-6 block text-[11px] text-[var(--t-lo)] group-hover:text-white/60">expect: revert / hold</span>
              </div>
            ))}
          </div>
          {s.note && (
            <p className="mt-10 max-w-3xl border-l-2 border-[var(--signal)] pl-5 text-[var(--t-mid)]">{s.note}</p>
          )}
          <div className="mt-12 flex flex-wrap gap-2">
            {s.stack.map((t) => (
              <span key={t} className="mono border border-[var(--line-strong)] bg-[var(--bg-card)] px-3 py-1.5 text-[11.5px]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[var(--line)] py-20 sm:py-28">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="Questions" title="Before you ask." />
          </div>
          <div className="border-t border-[var(--line-strong)] lg:col-span-8">
            {s.faqs.map(([q, a]) => (
              <details key={q} className="group border-b border-[var(--line-strong)]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="font-[family-name:var(--font-head)] text-xl font-bold tracking-tight group-open:text-[var(--signal)] sm:text-2xl">{q}</span>
                  <span aria-hidden="true" className="mono text-lg transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-2xl pb-6 text-[var(--t-mid)]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Next service */}
      <Link href={`/services/${next.slug}`} className="group block border-t border-[var(--line)] bg-[var(--bg-raise)]">
        <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-6 px-5 py-16 sm:px-8 sm:py-20">
          <div>
            <span className="mono text-[11px] uppercase tracking-[0.14em] text-[var(--t-lo)]">Next service</span>
            <div className="mt-4 font-[family-name:var(--font-head)] text-4xl font-bold tracking-tight transition-colors group-hover:text-[var(--signal)] sm:text-6xl [font-stretch:88%]">
              {next.title}
            </div>
          </div>
          <span className="font-[family-name:var(--font-head)] text-5xl transition-transform duration-500 group-hover:translate-x-3 sm:text-7xl">→</span>
        </div>
      </Link>
    </SiteShell>
  );
}
