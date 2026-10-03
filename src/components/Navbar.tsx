"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HashXLogo from "./HashXLogo";
import LiveChainBar from "./LiveChainBar";
import { MENU, itemHref, type MenuSection } from "@/content/menu";

const LINKS = [
  { href: "/case-studies", label: "Work" },
  { href: "/about", label: "About" },
];

function MegaPanel({ section, onClose }: { section: MenuSection; onClose: () => void }) {
  const [g, setG] = useState(0);
  const group = section.groups[g] ?? section.groups[0];
  const total = section.groups.reduce((n, x) => n + x.items.length, 0);

  return (
    <div className="absolute inset-x-0 top-full border-b border-[var(--line-strong)] bg-[var(--bg-card)] shadow-[0_30px_60px_-30px_rgba(11,18,32,0.35)]">
      <div key={section.id} className="animate-fade-in mx-auto grid max-w-[1280px] grid-cols-12 gap-8 px-8 py-8">
        {/* groups */}
        <div className="col-span-3 border-r border-[var(--line)] pr-6">
          <div className="mono mb-4 text-[10.5px] uppercase tracking-[0.14em] text-[var(--t-lo)]">
            {section.label} · {total} services
          </div>
          <ul className="space-y-1" role="tablist" aria-label={`${section.label} groups`}>
            {section.groups.map((x, i) => (
              <li key={x.id}>
                <button
                  role="tab"
                  aria-selected={i === g}
                  onMouseEnter={() => setG(i)}
                  onFocus={() => setG(i)}
                  onClick={() => setG(i)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-[15px] transition-colors cursor-pointer ${
                    i === g ? "bg-[var(--t-hi)] text-white" : "text-[var(--t-hi)] hover:bg-[var(--bg-card-hover)]"
                  }`}
                >
                  <span>{x.label}</span>
                  <span className={`mono text-[10.5px] ${i === g ? "text-white/60" : "text-[var(--t-lo)]"}`}>
                    {String(x.items.length).padStart(2, "0")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* items */}
        <div className="col-span-9 flex flex-col">
          <ul key={group.id} className="animate-fade-in grid grid-cols-3 gap-x-6 gap-y-1">
            {group.items.map((it) => (
              <li key={it.slug}>
                <Link
                  href={itemHref(it)}
                  onClick={onClose}
                  className="group block border-l-2 border-transparent px-4 py-3 transition-colors hover:border-[var(--signal)] hover:bg-[var(--bg-page)]"
                >
                  <span className="block text-[15px] font-medium text-[var(--t-hi)] group-hover:text-[var(--signal)]">{it.t}</span>
                  <span className="mt-0.5 block text-[13px] text-[var(--t-mid)]">{it.d}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mono mt-auto flex items-center gap-6 border-t border-[var(--line)] pt-4 text-[11.5px]">
            {section.overview && (
              <Link href={section.overview} onClick={onClose} className="hover:text-[var(--signal)]">
                {section.label} overview →
              </Link>
            )}
            <Link href="/services/blockchain-development#catalog" onClick={onClose} className="text-[var(--t-mid)] hover:text-[var(--signal)]">
              Full catalogue →
            </Link>
            <Link href="/contact" onClick={onClose} className="ml-auto text-[var(--signal)]">
              Not listed? Ask us →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ ctaHref = "/contact", darkHero = false }: { ctaHref?: string; darkHero?: boolean }) {
  const [open, setOpen] = useState(false); // mobile
  const [mega, setMega] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 8);
      setPastHero(y > window.innerHeight - 140);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMega(null);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMega(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hoverOpen = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(id);
  };
  const hoverClose = () => {
    closeTimer.current = setTimeout(() => setMega(null), 160);
  };

  const solid = scrolled || open || mega !== null;
  // Over the dark home hero: white-on-dark glass until the hero scrolls away.
  const dark = darkHero && !pastHero && !open && mega === null;
  const section = MENU.find((s) => s.id === mega);

  return (
    <>
    <LiveChainBar />
    <header
      className="fixed inset-x-0 z-40 border-b transition-colors duration-300"
      style={{
        top: "var(--bar-h)",
        height: "var(--nav-h)",
        background: dark
          ? scrolled
            ? "rgba(2,2,4,.6)"
            : "transparent"
          : solid
            ? mega
              ? "var(--bg-card)"
              : "var(--bg-glass)"
            : "transparent",
        backdropFilter: solid ? (dark ? "blur(16px) saturate(140%)" : "blur(10px)") : "none",
        borderColor: dark ? (scrolled ? "rgba(255,255,255,.08)" : "transparent") : solid ? "var(--line)" : "transparent",
      }}
      onMouseLeave={hoverClose}
      onMouseEnter={() => closeTimer.current && clearTimeout(closeTimer.current)}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className={`text-[15px] transition-colors ${dark ? "text-white" : "text-[var(--t-hi)]"}`}>
          <HashXLogo className="h-8 w-auto" />
        </Link>

        <nav className="hidden h-full items-center gap-1 lg:flex" aria-label="Primary">
          {MENU.map((s) => (
            <button
              key={s.id}
              aria-expanded={mega === s.id}
              aria-haspopup="true"
              onMouseEnter={() => hoverOpen(s.id)}
              onClick={() => setMega((m) => (m === s.id ? null : s.id))}
              className={`mono relative flex h-full items-center gap-1.5 whitespace-nowrap px-2 text-[12px] xl:px-3 tracking-wide transition-colors cursor-pointer ${
                mega === s.id
                  ? "text-[var(--signal)]"
                  : dark
                    ? "text-white/75 hover:text-white"
                    : "text-[var(--t-mid)] hover:text-[var(--t-hi)]"
              }`}
            >
              {s.label}
              <span aria-hidden="true" className={`text-[9px] transition-transform ${mega === s.id ? "rotate-180" : ""}`}>
                ▾
              </span>
              <span
                aria-hidden="true"
                className="absolute inset-x-3 bottom-0 h-[2px] origin-left bg-[var(--signal)] transition-transform duration-300"
                style={{ transform: `scaleX(${mega === s.id ? 1 : 0})` }}
              />
            </button>
          ))}
          <span className={`mx-2 h-4 w-px ${dark ? "bg-white/20" : "bg-[var(--line-strong)]"}`} />
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => setMega(null)}
              className={`mono whitespace-nowrap px-2 text-[12px] tracking-wide xl:px-3 transition-colors ${
                dark ? "text-white/75 hover:text-white" : "text-[var(--t-mid)] hover:text-[var(--t-hi)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("hx:palette"))}
            aria-label="Search the site (⌘K)"
            title="Search (⌘K)"
            className={`mono flex h-9 items-center gap-2 border px-2.5 text-[11px] transition-colors cursor-pointer ${
              dark ? "border-white/25 text-white/75 hover:text-white" : "border-[var(--line-strong)] text-[var(--t-mid)] hover:border-[var(--t-hi)] hover:text-[var(--t-hi)]"
            }`}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="7" cy="7" r="4.5" />
              <path d="m10.5 10.5 3 3" strokeLinecap="round" />
            </svg>
            <kbd className="font-[inherit] opacity-70">⌘K</kbd>
          </button>
          {dark ? (
            <Link href={ctaHref} className="hx-btn hx-navbtn">
              <span>Contact us</span>
            </Link>
          ) : (
            <Link href={ctaHref} className="btn-primary h-9 whitespace-nowrap px-4">
              Contact us <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        <button
          className={`mono flex h-9 items-center border px-3 text-[11px] uppercase tracking-wider lg:hidden cursor-pointer ${
            dark ? "border-white/25 text-white" : "border-[var(--line-strong)]"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {section && (
        <div className="hidden lg:block">
          <MegaPanel key={section.id} section={section} onClose={() => setMega(null)} />
        </div>
      )}

      <div
        aria-hidden="true"
        className="scroll-progress absolute bottom-[-1px] left-0 h-[2px] w-full"
        style={{ transform: `scaleX(${progress})` }}
      />

    </header>

    {/* Outside <header>: its backdrop-filter would otherwise trap this fixed overlay inside the 64px bar. */}
      {open && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-[var(--line)] px-5 pb-10 lg:hidden"
          style={{ top: "var(--header-h)", background: "var(--bg-page)" }}
        >
          {MENU.map((s) => (
            <details key={s.id} className="group border-b border-[var(--line)]">
              <summary className="flex cursor-pointer list-none items-center justify-between py-5 font-[family-name:var(--font-head)] text-2xl font-bold tracking-tight [&::-webkit-details-marker]:hidden">
                {s.label}
                <span aria-hidden="true" className="mono text-base transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="space-y-6 pb-6">
                {s.groups.map((g) => (
                  <div key={g.id}>
                    <div className="mono mb-2 text-[10.5px] uppercase tracking-[0.12em] text-[var(--signal)]">{g.label}</div>
                    <ul>
                      {g.items.map((it) => (
                        <li key={it.slug}>
                          <Link href={itemHref(it)} className="block py-2 text-[15px]">
                            {it.t}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                {s.overview && (
                  <Link href={s.overview} className="mono block text-[12px] text-[var(--signal)]">
                    {s.label} overview →
                  </Link>
                )}
              </div>
            </details>
          ))}
          {[...LINKS, { href: "/lab", label: "Lab" }].map((l) => (
            <Link key={l.href} href={l.href} className="block border-b border-[var(--line)] py-5 font-[family-name:var(--font-head)] text-2xl font-bold tracking-tight">
              {l.label}
            </Link>
          ))}
          <Link href={ctaHref} className="btn-primary mt-8 h-12 w-full px-4">
            Contact us →
          </Link>
        </div>
      )}
    </>
  );
}
