"use client";

import { useEffect, useRef, useState } from "react";
import ParticleCanvas from "./ParticleCanvas";

const pills = [
  "Software Development",
  "SaaS Platforms",
  "Mobile Apps",
  "AI Solutions",
  "Digital Marketing",
  "Enterprise Systems",
];

const stats = [
  { end: 50, suffix: "+", label: "Projects Delivered" },
  { end: 30, suffix: "+", label: "Happy Clients" },
  { end: 8,  suffix: "+", label: "Industries Served" },
  { end: 5,  suffix: "+", label: "Years Experience" },
];

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1800;
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
    <div ref={ref} className="text-3xl sm:text-4xl font-extrabold gradient-text">
      {count}{suffix}
    </div>
  );
}


export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060b1f 0%, #0b1340 50%, #0d1650 100%)" }}
      aria-label="Hero"
    >
      {/* Particle network */}
      <ParticleCanvas />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-60" aria-hidden="true" />

      {/* Radial glow — top-left */}
      <div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,82,204,0.22) 0%, transparent 65%)" }}
        aria-hidden="true"
      />
      {/* Radial glow — bottom-right */}
      <div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,170,255,0.14) 0%, transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20 w-full">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="hero-badge">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border border-[#0077ff]/35 bg-[#0077ff]/10 badge-animated">
              <span className="w-2 h-2 rounded-full bg-[#00aaff] animate-pulse" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#00aaff] tracking-wide">
                Building Future-Ready Digital Products
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="hero-headline text-3xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold text-white leading-[1.1] tracking-tight mb-6">
            Transforming Ideas Into{" "}
            <span className="gradient-text">
              Intelligent Digital&nbsp;Solutions
            </span>
          </h1>

          {/* Subtext */}
          <p className="hero-sub text-base sm:text-xl text-white/65 leading-relaxed max-w-2xl mb-10">
            We help startups, SMEs, and enterprises{" "}
            <span className="text-white font-semibold">innovate, automate, and scale</span>{" "}
            through cutting-edge digital technologies.
          </p>

          {/* CTAs */}
          <div className="hero-ctas flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-bold text-white blue-gradient hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-[#0052cc]/40 cursor-pointer"
            >
              Start Your Project
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => scrollTo("services")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white border border-white/20 hover:bg-white/10 hover:border-white/35 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              View Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Service pills */}
          <div className="hero-pills flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 text-xs font-medium text-white/55 border border-white/12 rounded-full bg-white/5"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="hero-stats mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-1.5 py-7 px-4 bg-white/3 backdrop-blur-sm"
            >
              <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              <div className="text-xs font-medium text-white/45 tracking-wide text-center">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("services")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/35 hover:text-white/65 transition-colors cursor-pointer"
        aria-label="Scroll down to services"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
