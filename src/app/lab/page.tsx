import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import InvariantLab from "@/components/InvariantLab";
import { CTASection, PageHeader, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Invariant Lab",
  description: "Break a vault, then fix it: an interactive simulation of how we fuzz smart contracts.",
};

const TAKEAWAYS = [
  ["Invariants, not examples", "A test that says \"this input works\" proves little. A property that must hold for every call sequence is what catches the bug."],
  ["Counterexamples you can run", "When a property fails, the fuzzer shrinks the attack to its shortest call sequence. That sequence becomes a regression test."],
  ["The fix is checked, too", "Apply the fix and the same properties run again. If they hold across the whole campaign, that class of bug is covered."],
];

export default function LabPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Invariant Lab"
        title="Break a vault. Then fix it."
        lead="An interactive simulation of how we test contracts. Pick a variant, run the fuzzer and read the counterexample. The output is scripted for illustration, not taken from a client project."
        crumbs={[{ href: "/lab", label: "Invariant Lab" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <InvariantLab />
          </div>
          <div className="lg:col-span-5">
            <h2 className="t-h3 text-2xl">What this shows</h2>
            <ol className="mt-6 grid gap-4">
              {TAKEAWAYS.map(([t, d], i) => (
                <li key={t} className="card p-6">
                  <span className="text-sm font-semibold text-[var(--signal)]">0{i + 1}</span>
                  <h3 className="mt-2 text-[17px] font-semibold tracking-tight">{t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--t-mid)]">{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <CTASection title="Want this level of testing on your contracts?" />
    </SiteShell>
  );
}
