"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HashXLogo from "@/components/HashXLogo";
import Icon from "@/components/icons/Icon";
import { SERVICE_AREAS, sectionAnchor } from "@/content/company";
import { MENU } from "@/content/menu";

const NAV = [
  { href: "/solutions", label: "Solutions" },
  { href: "/case-studies", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/token2049", label: "TOKEN2049" },
];

function openSearch() {
  window.dispatchEvent(new Event("hx:palette"));
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progress = useRef<HTMLDivElement>(null);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const closeT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Scroll: border + progress bar, and hide while scrolling down / show on the way up.
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160);
        lastY = y;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max).toFixed(4) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close menus on navigation.
  useEffect(() => {
    setMega(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  const show = () => {
    clearTimeout(closeT.current);
    setMega(true);
  };
  const hide = () => {
    clearTimeout(closeT.current);
    closeT.current = setTimeout(() => setMega(false), 140);
  };

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b bg-white/90 backdrop-blur-md transition-[transform,border-color] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
        scrolled || mega || mobile ? "border-[var(--line)]" : "border-transparent"
      }`}
      style={{ height: "var(--nav-h)", transform: hidden && !mega && !mobile ? "translateY(-100%)" : "none" }}
      onMouseLeave={hide}
    >
      <div className="container-x flex h-full items-center justify-between gap-6">
        <Link href="/" aria-label="HashX Labs home" className="hx-brand shrink-0 text-[var(--t-hi)]">
          <HashXLogo className="h-7 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            aria-expanded={mega}
            aria-haspopup="true"
            onMouseEnter={show}
            onFocus={show}
            onClick={() => setMega((v) => !v)}
            className={`flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-[15px] font-medium transition-colors hover:bg-[var(--bg-soft)] ${
              active("/services") || mega ? "text-[var(--t-hi)]" : "text-[var(--t-mid)]"
            }`}
          >
            Services
            <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 transition-transform ${mega ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="m3 4.5 3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={hide}
              aria-current={active(l.href) ? "page" : undefined}
              className={`nav-u flex h-10 items-center rounded-lg px-3.5 text-[15px] font-medium transition-colors hover:bg-[var(--bg-soft)] hover:text-[var(--t-hi)] ${
                active(l.href) ? "text-[var(--t-hi)]" : "text-[var(--t-mid)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search (⌘K)"
            title="Search (⌘K)"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[var(--t-mid)] transition-colors hover:bg-[var(--bg-soft)] hover:text-[var(--t-hi)]"
          >
            <Icon name="search" className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <Link href="/contact" className="btn btn-primary btn-sm">
            Contact us
          </Link>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button type="button" onClick={openSearch} aria-label="Search" className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[var(--t-mid)]">
            <Icon name="search" className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            aria-expanded={mobile}
            aria-label={mobile ? "Close menu" : "Open menu"}
            onClick={() => setMobile((v) => !v)}
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-lg text-[var(--t-hi)]"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {mobile ? <path d="m5 5 10 10M15 5 5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </div>
      </div>

      <div ref={progress} className="scroll-progress" aria-hidden="true" />

      {/* Desktop services menu */}
      {mega && (
        <div className="absolute inset-x-0 top-full hidden border-b border-[var(--line)] bg-white shadow-[0_24px_48px_-24px_rgba(11,18,32,.18)] lg:block" onMouseEnter={show}>
          <div className="container-x grid grid-cols-12 gap-10 py-8">
            <div className="col-span-8">
              <p className="eyebrow mb-4">What we do</p>
              <div className="grid grid-cols-2 gap-1">
                {SERVICE_AREAS.map((a) => (
                  <Link key={a.title} href={a.href} className="group flex gap-4 rounded-xl p-3 transition-colors hover:bg-[var(--bg-soft)]">
                    <span className="icon-badge h-10 w-10 shrink-0">
                      <Icon name={a.icon} className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-semibold text-[var(--t-hi)] group-hover:text-[var(--signal)]">{a.title}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-[var(--t-mid)]">{a.d}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-4 border-l border-[var(--line)] pl-10">
              <p className="eyebrow mb-4">Browse all capabilities</p>
              <ul className="grid gap-1">
                {MENU.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/services#${sectionAnchor(s.id)}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[15px] text-[var(--t-hi)] transition-colors hover:bg-[var(--bg-soft)]"
                    >
                      {s.label}
                      <span className="text-xs text-[var(--t-lo)]">{s.groups.reduce((n, g) => n + g.items.length, 0)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/services" className="link mt-5 px-3 text-[14px]">
                View all services <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

    </header>

    {/* Mobile menu: outside <header>, whose backdrop-filter would trap this fixed panel inside the 72px bar. */}
    {mobile && (
      <div className="fixed inset-x-0 bottom-0 top-[var(--nav-h)] z-50 overflow-y-auto border-t border-[var(--line)] bg-white lg:hidden">
        <nav aria-label="Mobile" className="container-x flex flex-col py-4">
          <button
            type="button"
            aria-expanded={mobileServices}
            onClick={() => setMobileServices((v) => !v)}
            className="flex cursor-pointer items-center justify-between border-b border-[var(--line)] py-4 text-left text-lg font-semibold"
          >
            Services
            <span aria-hidden="true" className={`text-xl transition-transform ${mobileServices ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          {mobileServices && (
            <ul className="grid gap-1 border-b border-[var(--line)] py-3">
              {SERVICE_AREAS.map((a) => (
                <li key={a.title}>
                  <Link href={a.href} className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-[15px]">
                    <Icon name={a.icon} className="h-5 w-5 text-[var(--signal)]" />
                    {a.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/services" className="link px-2 py-2.5 text-[15px]">
                  All services <span className="arr">→</span>
                </Link>
              </li>
            </ul>
          )}
          {[...NAV, { href: "/lab", label: "Invariant Lab" }].map((l) => (
            <Link key={l.href} href={l.href} className="border-b border-[var(--line)] py-4 text-lg font-semibold">
              {l.label}
            </Link>
          ))}
          <Link href="/contact" className="btn btn-primary mt-6 w-full">
            Contact us
          </Link>
        </nav>
      </div>
    )}
    </>
  );
}
