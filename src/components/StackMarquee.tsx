const ROW_A = ["Solidity", "Rust", "Foundry", "Slither", "Echidna", "ERC-4626", "ERC-3643", "LayerZero"];
const ROW_B = ["Chainlink", "TypeScript", "Next.js", "Node", "Python", "PostgreSQL", "AWS KMS", "React Native"];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track" style={{ animationDirection: reverse ? "reverse" : "normal" }}>
        {loop.map((t, i) => (
          <span
            key={i}
            className="flex items-center font-[family-name:var(--font-head)] text-[clamp(2.4rem,6vw,5rem)] font-bold leading-[1.15] tracking-[-0.03em] [font-stretch:88%]"
          >
            <span
              style={
                i % 2
                  ? { color: "transparent", WebkitTextStroke: "1.2px var(--t-hi)" }
                  : { color: "var(--t-hi)" }
              }
            >
              {t}
            </span>
            <span aria-hidden="true" className="mx-8 inline-block h-3 w-3 bg-[var(--signal)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function StackMarquee() {
  return (
    <section aria-label="Tools we work with" className="border-y border-[var(--line)] bg-[var(--bg-raise)] py-8 sm:py-10">
      <Row items={ROW_A} />
      <Row items={ROW_B} reverse />
    </section>
  );
}
