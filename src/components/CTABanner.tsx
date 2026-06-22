const contactItems = [
  {
    label: "info@hashxlabs.com",
    href: "mailto:info@hashxlabs.com",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "+91-8810235570",
    href: "tel:+918810235570",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    label: "www.hashxlabs.com",
    href: "https://www.hashxlabs.com",
    icon: (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];

export default function CTABanner() {
  return (
    <section id="contact" className="py-20 lg:py-28 blue-gradient relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Circuit overlay */}
      <div className="absolute inset-0 circuit-lines opacity-15" aria-hidden="true" />

      {/* Glows */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffffff, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #0b1340, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/15 mb-8">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden="true" />
          <span className="text-sm font-medium text-white tracking-wide">
            Ready to Build Something Great?
          </span>
        </div>

        {/* Headline */}
        <h2 id="cta-heading" className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
          Let&apos;s Build Your Next
          <br />
          Digital Product
        </h2>

        {/* Sub */}
        <p className="text-lg text-white/80 mb-3">
          SOFTWARE &nbsp;|&nbsp; MOBILE APPS &nbsp;|&nbsp; WEBSITES &nbsp;|&nbsp; AI SOLUTIONS
        </p>
        <p className="text-base text-white/60 mb-12 max-w-xl mx-auto">
          Tell us about your project and we'll get back to you within 24 hours with a free consultation.
        </p>

        {/* CTA button */}
        <a
          href="mailto:info@hashxlabs.com?subject=Project Inquiry"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-[#0052cc] bg-white hover:bg-white/90 active:scale-95 transition-all duration-200 shadow-2xl shadow-[#0b1340]/30 mb-14"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Send Us a Message
        </a>

        {/* Divider */}
        <div className="border-t border-white/20 max-w-2xl mx-auto mb-10" />

        {/* Contact row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
          {contactItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              {item.icon}
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
