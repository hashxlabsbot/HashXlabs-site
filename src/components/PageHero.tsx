import type { ReactNode } from "react";
import Link from "next/link";
import BlockCluster from "./motion/BlockCluster";
import Scramble from "./motion/Scramble";

export default function PageHero({
  eyebrow,
  title,
  lead,
  variant = 0,
  crumb,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  variant?: number;
  crumb?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] pt-[calc(var(--header-h)+48px)] pb-16 sm:pb-20">
      <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent_85%)]" />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7">
          {crumb && (
            <Link href={crumb.href} className="mono mb-6 inline-block text-[11px] text-[var(--t-lo)] hover:text-[var(--signal)]">
              ← {crumb.label}
            </Link>
          )}
          <div className="eyebrow">
            <Scramble text={eyebrow} />
          </div>
          <h1 className="mt-6 text-[clamp(2.6rem,6vw,5.2rem)]">{title}</h1>
          <p className="mt-7 max-w-[36rem] text-[18px] leading-relaxed text-[var(--t-mid)]">{lead}</p>
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
        <div className="mx-auto w-full max-w-[440px] lg:col-span-5">
          <BlockCluster variant={variant} />
        </div>
      </div>
    </section>
  );
}
