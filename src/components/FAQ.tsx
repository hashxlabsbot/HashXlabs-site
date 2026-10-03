import Reveal from "./Reveal";

const QA = [
  ["Who will I be working with?", "Senior engineers throughout. The people who scope your project design and build it, so nothing is lost between the first call and the code."],
  ["Do you audit contracts?", "We review and test our own work heavily and can review yours. For a launch that will hold significant value we would still recommend an independent audit on top."],
  ["Which chains do you work on?", "EVM chains and Solana. If your idea fits a different chain better, we will say so before you spend money."],
  ["Can we see previous work?", "Client names stay private under NDA, so we share architectures and can walk through code structure and test approach on a call."],
  ["How is pricing set?", "After the brief and a short spec. You get a scoped range with the assumptions written out, not a number on a first call."],
];

export default function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <span className="eyebrow">Questions</span>
          <h2 className="mt-5 text-4xl sm:text-5xl">Straight answers.</h2>
        </Reveal>
        <div className="lg:col-span-8 border-t border-[var(--line-strong)]">
          {QA.map(([q, a]) => (
            <details key={q} className="group border-b border-[var(--line-strong)]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-[family-name:var(--font-head)] text-xl font-bold tracking-tight [font-stretch:88%] group-open:text-[var(--signal)] sm:text-2xl">
                  {q}
                </span>
                <span aria-hidden="true" className="mono text-lg transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-2xl pb-6 text-[var(--t-mid)]">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
