const techs = [
  "React", "Next.js", "TypeScript", "Node.js", "Python",
  "Flutter", "React Native", "PostgreSQL", "MongoDB", "Redis",
  "AWS", "Google Cloud", "Docker", "Kubernetes", "OpenAI API",
  "TailwindCSS", "GraphQL", "REST APIs", "Microservices", "CI/CD",
];

export default function TechMarquee() {
  return (
    <div className="py-8 bg-white border-y border-[#e8edf5] overflow-hidden" aria-label="Technologies we work with">
      <p className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-[#94a3b8] mb-5 px-4">
        Technologies We Work With
      </p>
      <div className="marquee-track">
        {[...techs, ...techs].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#475569] whitespace-nowrap px-4 py-2 rounded-full border border-[#e2e8f0] bg-[#f8faff]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0077ff] flex-shrink-0" aria-hidden="true" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
