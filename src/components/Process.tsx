import Reveal from "./Reveal";
import CodeWindow from "./visuals/CodeWindow";

const steps = [
  {
    n: "01",
    title: "Discover & Architecture Blueprint",
    body: "We define smart contract specs, AI agent workflows, security boundaries, and data architecture before writing any code. You receive a fixed roadmap, clear milestones, and complete design documentation.",
    meta: "Week 1",
  },
  {
    n: "02",
    title: "Prototype & Security Auditing",
    body: "We build working prototypes early and run automated static analysis (Slither, Mythril, Pytest) to catch vulnerabilities and logical bottlenecks while iterations are still fast.",
    meta: "Week 2–3",
  },
  {
    n: "03",
    title: "High-Velocity Agile Sprints",
    body: "Two-week development sprints with live progress demos and continuous integration. You see real-time updates on testnets or staging environments with 100% transparency.",
    meta: "Weekly Sprints",
  },
  {
    n: "04",
    title: "Mainnet Launch & 24/7 Monitoring",
    body: "Automated CI/CD deployments, formal audit certifications, zero-downtime database migrations, and protocol monitoring and incident response.",
    meta: "Production Launch",
  },
];

export default function Process() {
  return (
    <section
      id="work"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
      aria-labelledby="process-heading"
    >
      <div className="absolute inset-0 grid-plane opacity-40 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-blue-500" />
            <span className="eyebrow">Agile Methodology</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-blue-500" />
          </div>
          <h2 id="process-heading" className="display text-3xl sm:text-5xl text-[var(--t-hi)] mb-5">
            Engineering Execution, <span className="gradient-text">Zero Compromises</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)]">
            A battle-tested 4-step framework engineered for web3 protocols, AI platforms, and enterprise software that cannot afford downtime or vulnerabilities.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Vertical Timeline */}
          <div className="relative">
            <div
              className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-blue-500 via-cyan-400 to-transparent"
              aria-hidden="true"
            />

            <ol className="space-y-10" role="list">
              {steps.map((s, i) => (
                <Reveal key={s.n} variant="left" delay={i * 90}>
                  <li className="relative pl-14 group">
                    <span
                      className="absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--line-strong)] bg-[var(--bg-card)] group-hover:border-blue-500 transition-all duration-300 shadow-md"
                      aria-hidden="true"
                    >
                      <span className="mono text-xs font-bold text-blue-600 dark:text-cyan-300">{s.n}</span>
                    </span>

                    <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-[var(--t-hi)]">{s.title}</h3>
                      <span className="mono text-[10px] uppercase tracking-wider text-blue-600 dark:text-cyan-400 font-semibold">
                        {s.meta}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--t-mid)] leading-relaxed max-w-md">{s.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>

          {/* Interactive Code Window */}
          <Reveal variant="right" delay={120} className="lg:sticky lg:top-28">
            <CodeWindow />

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "Avg. First Demo", v: "10 Days" },
                { k: "Audit SLA", v: "100% Pass" },
                { k: "Support SLA", v: "24/7/365" },
              ].map((m) => (
                <div
                  key={m.k}
                  className="rounded-xl border border-[var(--line-strong)] bg-[var(--bg-card)] px-3 py-4 text-center shadow-md"
                >
                  <div className="text-sm font-bold text-[var(--t-hi)] mb-1">{m.v}</div>
                  <div className="mono text-[9px] uppercase tracking-wider text-[var(--t-lo)]">
                    {m.k}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
