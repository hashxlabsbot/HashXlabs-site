"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ITEMS, itemHref } from "@/content/menu";
import { SERVICES } from "@/content/site";

/* Site search (⌘K / Ctrl+K, or the header button). Searches pages, the core
   services and every capability page. Opens via the "hx:palette" event. */

type Entry = { title: string; sub: string; href: string };

const PAGES: Entry[] = [
  { title: "Home", sub: "Page", href: "/" },
  { title: "Services", sub: "Page", href: "/services" },
  { title: "Solutions", sub: "Page", href: "/solutions" },
  { title: "Work", sub: "Selected engagements", href: "/case-studies" },
  { title: "About", sub: "Page", href: "/about" },
  { title: "Invariant Lab", sub: "Interactive demo", href: "/lab" },
  { title: "Contact", sub: "Start a project", href: "/contact" },
];

const ENTRIES: Entry[] = [
  ...PAGES,
  ...SERVICES.map((s) => ({ title: s.title, sub: "Core service", href: `/services/${s.slug}` })),
  ...ITEMS.filter(({ item }) => !item.href).map(({ item, section }) => ({ title: item.t, sub: section.label, href: itemHref(item) })),
];

export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("hx:palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hx:palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      requestAnimationFrame(() => input.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return ENTRIES.slice(0, 11);
    return ENTRIES.filter((e) => (e.title + " " + e.sub).toLowerCase().includes(t)).slice(0, 12);
  }, [q]);

  if (!open) return null;

  const go = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-[#0b1220]/40 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search the site"
    >
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-2xl animate-fade-in">
        <div className="flex items-center gap-3 border-b border-[var(--line)] px-4">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 text-[var(--t-lo)]" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="7" cy="7" r="4.5" />
            <path d="m10.5 10.5 3 3" strokeLinecap="round" />
          </svg>
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSel(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(s + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(s - 1, 0));
              } else if (e.key === "Enter" && results[sel]) go(results[sel].href);
            }}
            placeholder="Search services and pages…"
            className="h-14 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--t-lo)]"
          />
          <kbd className="rounded border border-[var(--line)] px-1.5 py-0.5 text-[11px] text-[var(--t-lo)]">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-[var(--t-lo)]">No matches. Try “wallet”, “audit” or “AI”.</li>}
          {results.map((r, i) => (
            <li key={r.href}>
              <button
                type="button"
                onMouseEnter={() => setSel(i)}
                onClick={() => go(r.href)}
                className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left ${
                  i === sel ? "bg-[var(--signal-soft)]" : ""
                }`}
              >
                <span className="text-[15px] font-medium text-[var(--t-hi)]">{r.title}</span>
                <span className="text-xs text-[var(--t-lo)]">{r.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
