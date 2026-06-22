"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const services = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Custom Software Development",
    description:
      "Fully bespoke business and enterprise software built around your exact needs and workflows.",
    tag: "Backend · API · Cloud",
    accent: "from-[#0052cc] to-[#0077ff]",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Web Applications & SaaS Platforms",
    description:
      "Customer portals, dashboards, internal tools, and scalable SaaS solutions built for growth.",
    tag: "React · Next.js · Node",
    accent: "from-[#0077ff] to-[#00aaff]",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Mobile Applications",
    description:
      "Native and cross-platform Android & iOS apps that deliver seamless, high-performance user experiences.",
    tag: "React Native · Flutter",
    accent: "from-[#006ee6] to-[#00aaff]",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: "Enterprise Solutions & Workflow Automation",
    description:
      "ERP-style systems, workflow automation, and multi-user enterprise platforms that eliminate bottlenecks.",
    tag: "ERP · Automation · Integration",
    accent: "from-[#0052cc] to-[#006ee6]",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    title: "Digital Marketing Solutions",
    description:
      "Boost your brand, generate qualified leads, and grow your business with data-driven marketing strategies.",
    tag: "SEO · Ads · Social",
    accent: "from-[#0077ff] to-[#00c6ff]",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "AI Products & Business Automation",
    description:
      "Intelligent AI solutions and automation tools to optimise operations, cut costs, and drive measurable growth.",
    tag: "LLMs · ML · Chatbots",
    accent: "from-[#00aaff] to-[#0077ff]",
  },
];

function ServiceCard({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 7, ry: px * 7 });
  }

  function onMouseLeave() {
    setTilt({ rx: 0, ry: 0 });
  }

  return (
    <article
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="glass-card group relative flex flex-col p-7 rounded-2xl overflow-hidden cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(0)`
          : "perspective(900px) translateY(44px)",
        transition:
          "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.25s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        transitionDelay: visible ? `${index * 70}ms, 0ms, 0ms, 0ms` : "0ms",
      }}
    >
      {/* Top gradient line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${service.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className="icon-glow w-14 h-14 rounded-xl flex items-center justify-center mb-5 flex-shrink-0 text-[#00aaff]"
        style={{ background: "rgba(0, 119, 255, 0.15)" }}
      >
        {service.icon}
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-white mb-3 leading-snug">
        {service.title}
      </h3>
      <p className="text-sm text-white/50 leading-relaxed flex-1 mb-4">
        {service.description}
      </p>

      {/* Tag */}
      <span className="inline-block text-[11px] font-semibold text-[#00aaff]/80 bg-[#0077ff]/10 border border-[#0077ff]/20 px-3 py-1 rounded-full self-start tracking-wide">
        {service.tag}
      </span>

      {/* Arrow — appears on hover */}
      <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <svg className="w-4 h-4 text-[#00aaff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </article>
  );
}

export default function Services() {
  return (
    <section
      id="services"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: "#060b1f" }}
      aria-labelledby="services-heading"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-70" aria-hidden="true" />

      {/* Glows */}
      <div
        className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0052cc, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #00aaff, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <Reveal className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#00aaff] bg-[#0077ff]/10 border border-[#0077ff]/20 rounded-full mb-5">
            What We Do
          </span>
          <h2 id="services-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
            Our Complete{" "}
            <span className="gradient-text">IT Solutions</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            End-to-end technology services that help businesses innovate faster,
            operate smarter, and scale with confidence.
          </p>
        </Reveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
