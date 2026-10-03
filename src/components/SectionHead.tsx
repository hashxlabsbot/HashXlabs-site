import type { ReactNode } from "react";
import Reveal from "./Reveal";
import Scramble from "./motion/Scramble";

export default function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: ReactNode; lead?: string }) {
  return (
    <Reveal className="max-w-2xl">
      <div className="eyebrow">
        <Scramble text={eyebrow} />
      </div>
      <h2 className="mt-5 text-4xl sm:text-5xl">{title}</h2>
      {lead && <p className="mt-5 text-[var(--t-mid)]">{lead}</p>}
    </Reveal>
  );
}
