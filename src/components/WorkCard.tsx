import Link from "next/link";
import Tilt from "./motion/Tilt";
import type { Work } from "@/content/site";

export default function WorkCard({ w, i }: { w: Work; i: number }) {
  return (
    <Tilt className="h-full shrink-0">
      <Link
        href={`/case-studies#${w.id}`}
        className="ticks spotlight group relative flex h-full w-[82vw] max-w-[520px] snap-start flex-col border border-[var(--line-strong)] bg-[var(--bg-card)] p-7 sm:p-9 hover:border-[var(--signal)] transition-colors duration-300"
      >
        <span className="tk-b" />
        <div className="relative z-10 flex items-center justify-between">
          <span className="mono text-[11px] text-[var(--signal)]">0{i + 1}</span>
          <span className="mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--t-lo)]">{w.tag} · NDA</span>
        </div>
        <div className="relative z-10 mt-10 font-[family-name:var(--font-head)] text-6xl font-bold leading-none tracking-tight text-[var(--signal)] [font-stretch:88%]">
          {w.std}
        </div>
        <div className="mono relative z-10 mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--t-lo)]">{w.stdLabel}</div>
        <h3 className="relative z-10 mt-8 text-2xl sm:text-3xl">{w.title}</h3>
        <p className="relative z-10 mt-4 text-[var(--t-mid)]">{w.summary}</p>
        <div className="mono relative z-10 mt-auto flex flex-wrap items-center gap-y-2 pt-8 text-[11px]">
          {w.flow.map((f, n) => (
            <span key={f} className="flex items-center">
              <span className="border border-[var(--line-strong)] bg-[var(--bg-page)] px-2.5 py-1">{f}</span>
              {n < w.flow.length - 1 && <span className="px-1.5 text-[var(--signal)]">→</span>}
            </span>
          ))}
        </div>
        <span className="mono relative z-10 mt-6 text-[12px] text-[var(--t-hi)] transition-colors group-hover:text-[var(--signal)]">
          Read the breakdown →
        </span>
      </Link>
    </Tilt>
  );
}
