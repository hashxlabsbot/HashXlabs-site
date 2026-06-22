import Reveal from "./Reveal";

const items = [
  {
    title: "Custom Software Development",
    description: "Fully bespoke business and enterprise software built around your exact needs.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: "Web Applications & SaaS Platforms",
    description: "Customer portals, dashboards, internal tools, and scalable SaaS solutions.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Mobile Applications (Android & iOS)",
    description: "Native and cross-platform mobile apps that deliver seamless user experiences.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Enterprise Solutions & Workflow Automation",
    description: "ERP-style systems, workflow automation, and multi-user enterprise platforms.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Domain-Specific Products",
    description: "Purpose-built software for construction, healthcare, logistics, retail, and more.",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];

export default function WhatWeBuild() {
  return (
    <section id="what-we-build" className="py-20 lg:py-28 bg-[#f0f6ff]" aria-labelledby="wwb-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: content */}
          <Reveal variant="left">
            <span className="inline-block px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-[#0052cc] bg-white rounded-full mb-5 shadow-sm border border-[#e2e8f0]">
              What We Build
            </span>
            <h2 id="wwb-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1340] mb-6 leading-tight">
              Products Engineered
              <br />
              <span className="gradient-text">for Real Impact</span>
            </h2>
            <p className="text-lg text-[#64748b] leading-relaxed mb-8">
              From ideation to deployment, we craft digital products that solve real business
              challenges — fast, scalable, and built to last.
            </p>

            {/* Highlights row */}
            <div className="flex gap-6 mb-10">
              {["Agile Process", "Cloud-Native", "Scalable Architecture"].map((label) => (
                <div key={label} className="flex items-center gap-1.5 text-sm font-medium text-[#0052cc]">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {label}
                </div>
              ))}
            </div>

            <a
              href="mailto:info@hashxlabs.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white blue-gradient hover:opacity-90 transition-opacity shadow-lg shadow-[#0052cc]/30"
            >
              Discuss Your Project
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </Reveal>

          {/* Right: feature list */}
          <div className="space-y-3">
            {items.map((item, i) => (
              <Reveal key={i} variant="right" delay={i * 80}>
                <div className="group flex gap-4 p-5 rounded-2xl bg-white border border-[#e2e8f0] hover:border-[#0052cc]/30 hover:shadow-lg hover:shadow-[#0052cc]/8 transition-all duration-250">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f6ff] group-hover:bg-[#0052cc] text-[#0052cc] group-hover:text-white flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-250">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0b1340] mb-1">{item.title}</h3>
                    <p className="text-sm text-[#64748b] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
