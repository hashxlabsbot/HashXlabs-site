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
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-white" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#0052cc] bg-[#f0f6ff] rounded-full mb-4">
            What We Do
          </span>
          <h2 id="services-heading" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1340] mb-5">
            Our Complete IT Solutions
          </h2>
          <p className="text-lg text-[#64748b] max-w-2xl mx-auto leading-relaxed">
            End-to-end technology services that help businesses innovate faster,
            operate smarter, and scale with confidence.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <article
              key={i}
              className="card-hover group relative flex flex-col p-7 rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden"
            >
              {/* Blue left accent bar on hover */}
              <div
                className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#0077ff] to-[#00aaff] rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              />

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-[#f0f6ff] group-hover:bg-[#e8efff] text-[#0052cc] flex items-center justify-center mb-5 transition-colors duration-300 flex-shrink-0">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-[#0b1340] mb-3 leading-snug">
                {service.title}
              </h3>
              <p className="text-sm text-[#64748b] leading-relaxed flex-1 mb-4">
                {service.description}
              </p>

              {/* Tech tag */}
              <span className="inline-block text-xs font-medium text-[#0052cc] bg-[#f0f6ff] px-3 py-1 rounded-full self-start">
                {service.tag}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
