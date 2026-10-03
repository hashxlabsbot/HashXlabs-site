const rowA = [
  "Solidity", "Rust", "Ethereum", "Solana", "EVM", "Polygon",
  "Python", "PyTorch", "LangChain", "OpenAI", "Pinecone", "FastAPI"
];

const rowB = [
  "Next.js 16", "React 19", "TypeScript", "Node.js", "Go", "PostgreSQL",
  "Docker", "Kubernetes", "AWS", "Hardhat", "Foundry", "Slither"
];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  return (
    <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
      {[...items, ...items].map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="mono inline-flex items-center gap-2 text-xs font-semibold text-[var(--t-mid)] whitespace-nowrap px-4 py-2 rounded-xl border border-[var(--line-strong)] bg-[var(--bg-card)] hover:border-blue-500 hover:text-[var(--t-hi)] transition-colors duration-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" aria-hidden="true" />
          {t}
        </span>
      ))}
    </div>
  );
}

export default function TechMarquee() {
  return (
    <div
      className="relative py-10 border-y border-[var(--line)] bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
      aria-label="Technologies we work with"
    >
      <p className="mono text-center text-[10px] tracking-[0.2em] uppercase text-blue-600 dark:text-cyan-400 font-bold mb-6 px-4">
        Battle-Tested Engineering Ecosystem
      </p>

      <div className="marquee-wrap space-y-3">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </div>
  );
}
