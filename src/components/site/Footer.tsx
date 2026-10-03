import Link from "next/link";
import HashXLogo from "@/components/HashXLogo";
import { COMPANY, SERVICE_AREAS } from "@/content/company";

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/case-studies", label: "Work" },
  { href: "/solutions", label: "Solutions" },
  { href: "/lab", label: "Invariant Lab" },
  { href: "/token2049", label: "TOKEN2049 Singapore" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-soft)]">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="HashX Labs home" className="inline-block text-[var(--t-hi)]">
            <HashXLogo className="h-7 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-[var(--t-mid)]">{COMPANY.tagline}</p>
          <Link href="/contact" className="btn btn-primary btn-sm mt-6">
            Start a project
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <h2 className="text-sm font-semibold tracking-normal text-[var(--t-hi)]">Services</h2>
            <ul className="mt-4 grid gap-2.5">
              {SERVICE_AREAS.map((a) => (
                <li key={a.title}>
                  <Link href={a.href} className="text-[14.5px] text-[var(--t-mid)] transition-colors hover:text-[var(--t-hi)]">
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-normal text-[var(--t-hi)]">Company</h2>
            <ul className="mt-4 grid gap-2.5">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14.5px] text-[var(--t-mid)] transition-colors hover:text-[var(--t-hi)]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h2 className="text-sm font-semibold tracking-normal text-[var(--t-hi)]">Get in touch</h2>
            <ul className="mt-4 grid gap-2.5 text-[14.5px]">
              <li>
                <a href={`mailto:${COMPANY.email}`} className="text-[var(--t-mid)] transition-colors hover:text-[var(--t-hi)]">
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a href={COMPANY.phoneHref} className="text-[var(--t-mid)] transition-colors hover:text-[var(--t-hi)]">
                  {COMPANY.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--line)]">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-[var(--t-lo)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} HashX Labs. All rights reserved.</span>
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
