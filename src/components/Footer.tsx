import Link from "next/link";
import HashXLogo from "./HashXLogo";

const COLS = [
  {
    title: "Services",
    links: [
      { href: "/services/blockchain-development", label: "Blockchain development" },
      { href: "/services/smart-contract-audit", label: "Smart contract audit" },
      { href: "/services/rwa-tokenization", label: "RWA tokenization" },
      { href: "/services/ai-development", label: "Applied AI" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/case-studies", label: "Work" },
      { href: "/lab", label: "Lab" },
      { href: "/solutions", label: "Solutions" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-12 py-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link href="/" className="text-[var(--t-hi)] text-[15px]">
              <HashXLogo className="h-8 w-auto" />
            </Link>
            <p className="mt-6 max-w-md font-[family-name:var(--font-head)] text-3xl font-bold leading-[1.05] tracking-tight [font-stretch:88%] sm:text-4xl">
              Have a contract that needs to <span className="em">hold up</span>?
            </p>
            <a
              href="mailto:info@hashxlabs.com"
              className="btn-primary mt-8 h-11 px-5"
            >
              info@hashxlabs.com <span aria-hidden="true">→</span>
            </a>
          </div>

          {COLS.map((c) => (
            <div key={c.title} className="md:col-span-3">
              <h3 className="mono mb-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--t-lo)]">
                {c.title}
              </h3>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-[var(--t-mid)] transition-colors hover:text-[var(--signal)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mono flex flex-col gap-2 border-t border-[var(--line)] py-6 text-[11px] text-[var(--t-lo)] sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} HashX Labs</span>
          <span>Specified. Tested. Shipped.</span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="select-none overflow-hidden whitespace-nowrap text-center font-[family-name:var(--font-head)] text-[19vw] font-bold leading-[0.78] tracking-[-0.06em] text-[var(--t-hi)] [font-stretch:85%]"
        style={{ opacity: 0.06 }}
      >
        HASHX LABS
      </div>
    </footer>
  );
}
