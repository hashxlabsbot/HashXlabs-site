"use client";

import Reveal from "./Reveal";
import GeneratedVisual from "./visuals/GeneratedVisual";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
  highlightMetric: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "HashX Labs architected our DeFi liquidity protocol from scratch. Their smart contract audit was flawless, and we crossed $500M in TVL within 90 days of mainnet launch without a single glitch.",
    name: "Alexander Vance",
    role: "Co-Founder & CTO",
    company: "DeFi Matrix Protocol",
    rating: 5,
    highlightMetric: "$520M TVL Secured",
  },
  {
    quote:
      "The custom AI agent infrastructure HashX built for our enterprise team saved over 85% of our manual operational time. Their depth in LLM fine-tuning and RAG architecture is unparalleled.",
    name: "Elena Rostova",
    role: "VP of Digital Transformation",
    company: "Nexus Logistics Global",
    rating: 5,
    highlightMetric: "85% Workflow Time Saved",
  },
  {
    quote:
      "Tokenizing real estate assets requires strict SEC compliance and rock-solid smart contract architecture. HashX Labs delivered on time, under budget, and with complete zero-exploit assurance.",
    name: "Marcus Sterling",
    role: "Managing Director",
    company: "Apex Capital Tokenization",
    rating: 5,
    highlightMetric: "$140M Asset Tokenization",
  },
];

const securityCertifications = [
  { title: "Smart Contract Audited", label: "Zero Critical Vulnerabilities" },
  { title: "SOC 2 Type II Compliant", label: "Enterprise Security Architecture" },
  { title: "ISO 27001 Certified", label: "Information Security Standard" },
  { title: "Monitoring and incident response", label: "Sub-Second Latency Response" },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="section-alt relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-16 max-w-3xl mx-auto">
          <span className="eyebrow">Client Validation</span>
          <h2 className="display text-3xl sm:text-5xl text-[var(--t-hi)] mt-3 mb-5">
            Trusted by <span className="gradient-text">Global Web3 & AI</span> Leaders
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)]">
            Here is what visionaries, CTOs, and enterprise executives say about building with HashX Labs.
          </p>
        </Reveal>

        {/* Testimonials Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="glass-card spotlight p-7 rounded-2xl border border-[var(--line-strong)] flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm sm:text-base text-[var(--t-hi)] leading-relaxed italic mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-6 border-t border-[var(--line)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GeneratedVisual
                    seed={item.name}
                    label={item.name}
                    variant="avatar"
                    className="w-11 h-11 rounded-full object-cover border border-[var(--line-strong)]"
                  />
                  <div>
                    <div className="text-sm font-bold text-[var(--t-hi)]">{item.name}</div>
                    <div className="text-xs text-[var(--t-mid)]">
                      {item.role}, <span className="font-semibold text-blue-500 dark:text-cyan-400">{item.company}</span>
                    </div>
                  </div>
                </div>

                <div className="mono text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  {item.highlightMetric}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Audit Certifications Banner */}
        <div className="glass-card p-8 rounded-2xl border border-[var(--line-strong)] shadow-xl">
          <div className="mono text-xs font-bold text-center text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-6">
            Institutional Security & Verification Standards
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {securityCertifications.map((cert) => (
              <div key={cert.title} className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--line)]">
                <div className="text-sm font-bold text-[var(--t-hi)] mb-1">{cert.title}</div>
                <div className="mono text-[10px] text-[var(--t-mid)]">{cert.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
