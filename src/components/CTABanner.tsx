import Reveal from "./Reveal";

const contactItems = [
  {
    k: "Email",
    label: "info@hashxlabs.com",
    href: "mailto:info@hashxlabs.com",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    k: "Phone",
    label: "+91-8810235570",
    href: "tel:+918810235570",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    k: "Web",
    label: "www.hashxlabs.com",
    href: "https://www.hashxlabs.com",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

export default function CTABanner() {
  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[var(--line-strong)] bg-[var(--bg-card)] backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
            </span>
            <span className="mono text-xs font-semibold text-blue-600 dark:text-cyan-300 tracking-wider uppercase">
              Now Booking Web3 & AI Engineering Projects
            </span>
          </div>

          <h2 id="cta-heading" className="display text-4xl sm:text-6xl text-[var(--t-hi)] mb-6">
            Let&apos;s Build Your Next <br />
            <span className="gradient-text">Web3 & AI Breakthrough</span>
          </h2>

          <p className="text-base sm:text-lg text-[var(--t-mid)] max-w-xl mx-auto mb-10 leading-relaxed">
            Ready to architect a high-throughput blockchain protocol, custom enterprise AI agent, or scalable SaaS platform? Speak directly with our solution architects today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <a
              href="mailto:info@hashxlabs.com"
              className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold shadow-xl cursor-pointer"
            >
              Start Your Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <a
              href="tel:+918810235570"
              className="btn-ghost inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold cursor-pointer"
            >
              Call Engineering Team
            </a>
          </div>
        </Reveal>

        {/* Contact Cards */}
        <Reveal delay={120}>
          <div className="grid sm:grid-cols-3 gap-4">
            {contactItems.map((c) => (
              <a
                key={c.k}
                href={c.href}
                className="glass-card group flex flex-col items-center gap-2 rounded-xl px-4 py-6 border border-[var(--line-strong)] hover:border-blue-500/50 transition-all duration-300"
              >
                <span className="text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  {c.icon}
                </span>
                <span className="mono text-[10px] uppercase tracking-wider text-[var(--t-lo)]">{c.k}</span>
                <span className="text-sm font-semibold text-[var(--t-hi)] group-hover:text-blue-500 dark:group-hover:text-cyan-300 transition-colors break-all">
                  {c.label}
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
