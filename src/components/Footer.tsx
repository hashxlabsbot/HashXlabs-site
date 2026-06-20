"use client";

import HashXLogo from "./HashXLogo";

const serviceLinks = [
  "Custom Software Development",
  "Web Applications & SaaS",
  "Mobile Applications",
  "Enterprise Solutions",
  "Digital Marketing",
  "AI Products & Automation",
];

const buildLinks = [
  "Custom Software",
  "Web Applications",
  "Mobile Applications",
  "Enterprise Solutions",
  "Domain-Specific Products",
];

export default function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="navy-gradient border-t border-white/10" role="contentinfo">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <HashXLogo className="h-8 w-auto mb-5" />
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              Building future-ready digital products for startups, SMEs, and enterprises worldwide.
            </p>
            {/* Social / contact icons */}
            <div className="flex gap-3">
              <a
                href="mailto:info@hashxlabs.com"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#0052cc] text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Email HashX Labs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a
                href="tel:+918810235570"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#0052cc] text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="Call HashX Labs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a
                href="https://www.hashxlabs.com"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#0052cc] text-white/60 hover:text-white flex items-center justify-center transition-all duration-200"
                aria-label="HashX Labs Website"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase">Services</h3>
            <ul className="space-y-3" role="list">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo("services")}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* What We Build */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase">What We Build</h3>
            <ul className="space-y-3" role="list">
              {buildLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo("what-we-build")}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200 text-left cursor-pointer"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-5 tracking-wider uppercase">Contact Us</h3>
            <ul className="space-y-4" role="list">
              <li>
                <a
                  href="mailto:info@hashxlabs.com"
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200 group"
                >
                  <svg className="w-4 h-4 mt-0.5 text-[#0077ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@hashxlabs.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+918810235570"
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mt-0.5 text-[#0077ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91-8810235570
                </a>
              </li>
              <li>
                <a
                  href="https://www.hashxlabs.com"
                  className="flex items-start gap-3 text-sm text-white/50 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mt-0.5 text-[#0077ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  www.hashxlabs.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} HashX Labs. All rights reserved.
          </p>
          <p className="text-xs text-white/30 tracking-widest uppercase">
            Building Future-Ready Digital Products
          </p>
        </div>
      </div>
    </footer>
  );
}
