import Link from "next/link";
import HScroll from "./motion/HScroll";
import SectionHead from "./SectionHead";
import WorkCard from "./WorkCard";
import { WORK } from "@/content/site";

export default function WorkScroll() {
  return (
    <section id="work" className="section-alt border-y border-[var(--line)]">
      <HScroll
        head={
          <SectionHead
            eyebrow="Engagements"
            title="What we have built, described honestly."
            lead="Client names stay private under NDA, so what we can show is the architecture. Keep scrolling."
          />
        }
      >
        {WORK.map((w, i) => (
          <WorkCard key={w.id} w={w} i={i} />
        ))}
        <Link
          href="#brief"
          className="group flex w-[82vw] max-w-[420px] shrink-0 snap-start flex-col justify-between bg-[var(--t-hi)] p-9 text-white"
        >
          <span className="mono text-[11px] text-white/60">05</span>
          <span className="font-[family-name:var(--font-head)] text-5xl font-bold leading-[0.95] tracking-tight [font-stretch:88%]">
            Yours
            <br />
            next<span className="text-[var(--signal)]">.</span>
          </span>
          <span className="mono text-[12px] transition-colors group-hover:text-[#8ab4ff]">Start a brief →</span>
        </Link>
      </HScroll>
    </section>
  );
}
