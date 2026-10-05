import Link from "next/link";
import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Icon from "@/components/icons/Icon";
import { Arrow, IndexList, SectionHeader } from "@/components/ui";
import { AUDIENCES } from "@/content/company";

/** /solutions "Who we build for": the four audiences as spotlight cards. */
export default function Industries() {
  return (
    <section className="section">
      <div className="container-x">
        <SectionHeader eyebrow="Industries" title="Who we build for" lead="Four kinds of team, each with its own definition of what must not go wrong." />
        <div className="ind-grid">
          {AUDIENCES.map((a, i) => (
            <Reveal key={a.title} delay={i * 80} className="h-full">
              <Link href={a.href} className="ind spotlight" style={{ "--i": i } as CSSProperties}>
                <span className="ind-word" aria-hidden="true">
                  {a.fig}
                </span>
                <span className="icon-badge">
                  <Icon name={a.icon} className="h-[22px] w-[22px]" />
                </span>
                <h3 className="ind-title">{a.title}</h3>
                <p className="ind-d">{a.d}</p>
                <IndexList items={a.points} className="ind-list" />
                <span className="link ind-cta">
                  {a.cta} <Arrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
