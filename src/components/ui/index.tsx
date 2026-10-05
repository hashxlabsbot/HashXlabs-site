import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import BlockGrid from "@/components/fx/BlockGrid";
import Magnetic from "@/components/fx/Magnetic";
import { COMPANY } from "@/content/company";

/* Shared building blocks for every page. Server components; the only
   interactive piece (Accordion) lives in ./Accordion. */

export function Section({
  children,
  soft,
  id,
  className = "",
}: {
  children: ReactNode;
  soft?: boolean;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={`section ${soft ? "section-soft" : ""} ${className}`}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  center,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  action?: ReactNode;
}) {
  return (
    <Reveal
      className={`mb-12 flex flex-col gap-6 lg:mb-16 ${
        center ? "items-center text-center" : "lg:flex-row lg:items-end lg:justify-between"
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="t-h2 mt-3">{typeof title === "string" ? <Words text={title} /> : title}</h2>
        {lead && <p className="t-lead mt-4">{lead}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

export function Arrow() {
  return (
    <span className="arr" aria-hidden="true">
      →
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ink" | "outline-light";
  size?: "sm";
  className?: string;
}) {
  const cls = `btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`;
  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http")) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* Editorial list: hairline rows with a mono index. No check marks anywhere
   on the site (user decision 2026-10-05: they read as cheap). */
export function IndexList({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`ilist ${className}`}>
      {items.map((t, i) => (
        <li key={t}>
          <span className="ilist-n mono" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  );
}

/** Inner-page header: breadcrumb, title, lead and actions on a soft band. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--bg-soft)] pt-[calc(var(--header-h)+48px)] pb-14 lg:pt-[calc(var(--header-h)+72px)] lg:pb-20">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <BlockGrid className="[mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_75%)]" />
      <div className="container-x relative">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[var(--t-lo)]">
            <Link href="/" className="hover:text-[var(--t-hi)]">
              Home
            </Link>
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <Link href={c.href} className="hover:text-[var(--t-hi)]">
                  {c.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="max-w-3xl">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="t-h1 mt-3">{typeof title === "string" ? <Words text={title} load /> : title}</h1>
          {lead && <p className="t-lead mt-5 max-w-2xl">{lead}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}

/** Closing call to action used at the bottom of every page. */
export function CTASection({
  title = "Have a project in mind?",
  lead = "Tell us what you are building and what must not go wrong. An engineer who would work on it will reply.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-2xl bg-[var(--bg-ink)] px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="cta-grid" />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-[var(--signal)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Reveal>
                <h2 className="t-h2 text-white">
                  <Words text={title} />
                </h2>
              </Reveal>
              <p className="mt-4 text-lg leading-relaxed text-white/70">{lead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <ButtonLink href="/contact" variant="ink">
                  Start a project <Arrow />
                </ButtonLink>
              </Magnetic>
              <ButtonLink href={`mailto:${COMPANY.email}`} variant="outline-light">
                {COMPANY.email}
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
