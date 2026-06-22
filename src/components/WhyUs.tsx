"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const metrics = [
  { end: 50, suffix: "+", label: "Projects Delivered" },
  { end: 30, suffix: "+", label: "Happy Clients" },
  { end: 8,  suffix: "+", label: "Industries Served" },
  { end: 5,  suffix: "+", label: "Years of Expertise" },
];

const differentiators = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Fast Time-to-Market",
    description:
      "Agile sprints, rapid prototyping, and lean delivery cycles mean you go from idea to live product faster than traditional agencies.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Quality You Can Trust",
    description:
      "Rigorous code reviews, automated testing, and security-first architecture ensure every product we ship is robust and reliable.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Full-Stack Expertise",
    description:
      "One team covering design, frontend, backend, mobile, AI, and cloud — no handoff chaos, just seamless end-to-end ownership.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Domain-Aware Delivery",
    description:
      "We understand your industry's workflows and compliance requirements, so our solutions fit your business — not just your tech stack.",
  },
];

function AnimatedMetric({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1600;
        const startTime = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setCount(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}

export default function WhyUs() {
  return (
    <section id="why-us" className="py-20 lg:py-28 navy-gradient relative overflow-hidden" aria-labelledby="why-heading">
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-50" aria-hidden="true" />

      {/* Glows */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0077ff, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00aaff, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#00aaff] bg-white/8 border border-white/15 rounded-full mb-4">
            Why HashX Labs
          </span>
          <h2 id="why-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
            The{" "}
            <span className="gradient-text">HashX Difference</span>
          </h2>
          <p className="text-lg text-white/55 max-w-2xl mx-auto">
            We&apos;re not just developers — we&apos;re product partners invested in your success.
          </p>
        </Reveal>

        {/* Metrics strip */}
        <Reveal delay={80} className="mb-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/10">
            {metrics.map((m) => (
              <div key={m.label} className="flex flex-col items-center justify-center gap-1.5 py-8 px-4 bg-white/3">
                <div className="text-4xl font-extrabold gradient-text">
                  <AnimatedMetric end={m.end} suffix={m.suffix} />
                </div>
                <div className="text-xs font-medium text-white/45 tracking-wide text-center">{m.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Differentiators grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {differentiators.map((d, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="group glass-card h-full p-6 rounded-2xl hover:bg-white/8 transition-all duration-250">
                {/* Number */}
                <div className="text-5xl font-extrabold text-white/6 leading-none select-none mb-4 -ml-1">
                  0{i + 1}
                </div>
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-[#0052cc]/30 group-hover:bg-[#0052cc]/50 text-[#00aaff] flex items-center justify-center mb-4 transition-colors duration-250">
                  {d.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{d.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{d.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
