"use client";

const pills = [
  "Software Development",
  "SaaS Platforms",
  "Mobile Apps",
  "AI Solutions",
  "Digital Marketing",
  "Enterprise Systems",
];

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden navy-gradient"
      aria-label="Hero"
    >
      {/* Grid lines */}
      <div className="absolute inset-0 circuit-lines opacity-40" aria-hidden="true" />

      {/* Radial glows */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse-glow pointer-events-none"
        style={{ background: "radial-gradient(circle, #0077ff, transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl animate-pulse-glow pointer-events-none"
        style={{ background: "radial-gradient(circle, #00aaff, transparent)", animationDelay: "1.5s" }}
        aria-hidden="true"
      />

      {/* Decorative circuit dots - left side */}
      <div className="absolute left-0 top-0 h-full w-64 opacity-20 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 200 600" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="80" r="5" fill="#0077ff" />
          <circle cx="60" cy="120" r="3" fill="#00aaff" stroke="#00aaff" strokeWidth="1" />
          <circle cx="40" cy="200" r="5" fill="#0077ff" />
          <circle cx="80" cy="260" r="3" fill="#00aaff" stroke="#00aaff" strokeWidth="1" />
          <circle cx="20" cy="340" r="5" fill="#0077ff" />
          <circle cx="60" cy="400" r="3" fill="#00aaff" />
          <circle cx="30" cy="480" r="5" fill="#0077ff" />
          <line x1="20" y1="80" x2="20" y2="120" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="20" y1="120" x2="60" y2="120" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="60" y1="120" x2="60" y2="200" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="40" y1="200" x2="60" y2="200" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="40" y1="200" x2="40" y2="260" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="40" y1="260" x2="80" y2="260" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="20" y1="340" x2="20" y2="400" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="20" y1="400" x2="60" y2="400" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="60" y1="400" x2="60" y2="480" stroke="#0052cc" strokeWidth="1.5" />
          <line x1="30" y1="480" x2="60" y2="480" stroke="#0052cc" strokeWidth="1.5" />
        </svg>
      </div>

      {/* Decorative globe - right side */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 lg:w-[480px] lg:h-[480px] opacity-10 pointer-events-none animate-float"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="180" stroke="#0077ff" strokeWidth="1" opacity="0.6" />
          <circle cx="200" cy="200" r="140" stroke="#0077ff" strokeWidth="0.5" opacity="0.4" />
          <circle cx="200" cy="200" r="100" stroke="#00aaff" strokeWidth="0.5" opacity="0.3" />
          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((angle) => (
            <ellipse
              key={angle}
              cx="200"
              cy="200"
              rx={Math.abs(Math.cos((angle * Math.PI) / 180)) * 180}
              ry="180"
              stroke="#0052cc"
              strokeWidth="0.5"
              opacity="0.3"
              transform={`rotate(${angle}, 200, 200)`}
            />
          ))}
          {/* Latitude lines */}
          {[-120, -60, 0, 60, 120].map((y, i) => (
            <ellipse
              key={i}
              cx="200"
              cy={200 + y}
              rx={Math.sqrt(180 * 180 - y * y)}
              ry={Math.sqrt(180 * 180 - y * y) * 0.3}
              stroke="#0052cc"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}
          {/* Glowing dots */}
          <circle cx="200" cy="20" r="4" fill="#0077ff" opacity="0.8" />
          <circle cx="360" cy="140" r="3" fill="#00aaff" opacity="0.7" />
          <circle cx="320" cy="300" r="4" fill="#0077ff" opacity="0.8" />
          <circle cx="80" cy="280" r="3" fill="#00aaff" opacity="0.7" />
          {/* Connection lines */}
          <line x1="200" y1="20" x2="360" y2="140" stroke="#0077ff" strokeWidth="0.8" opacity="0.5" />
          <line x1="360" y1="140" x2="320" y2="300" stroke="#0077ff" strokeWidth="0.8" opacity="0.5" />
          <line x1="200" y1="20" x2="80" y2="280" stroke="#00aaff" strokeWidth="0.8" opacity="0.5" />
          <line x1="80" y1="280" x2="320" y2="300" stroke="#00aaff" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0077ff]/40 bg-[#0077ff]/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00aaff] animate-pulse" aria-hidden="true" />
            <span className="text-sm font-medium text-[#00aaff] tracking-wide">
              Building Future-Ready Digital Products
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
            Transforming Ideas Into{" "}
            <span className="gradient-text">
              Intelligent Digital Solutions
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mb-10">
            We help startups, SMEs, and enterprises{" "}
            <span className="text-white font-medium">innovate, automate, and scale</span>{" "}
            through cutting-edge digital technologies.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white blue-gradient hover:opacity-90 active:scale-95 transition-all duration-200 shadow-lg shadow-[#0052cc]/40 cursor-pointer"
            >
              Start Your Project
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={() => scrollTo("services")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white border border-white/20 hover:bg-white/10 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              View Services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Service pills */}
          <div className="flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="px-3 py-1.5 text-xs font-medium text-white/60 border border-white/15 rounded-full bg-white/5"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
          {[
            { value: "50+", label: "Projects Delivered" },
            { value: "30+", label: "Happy Clients" },
            { value: "8+", label: "Industries Served" },
            { value: "5+", label: "Years Experience" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo("services")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        aria-label="Scroll down to services"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
