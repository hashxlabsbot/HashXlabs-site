"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SectionHead from "./SectionHead";
import type { CatalogGroup } from "@/content/site";

/** Filterable, searchable grid of every service in a catalogue. */
export default function Catalog({ groups }: { groups: CatalogGroup[] }) {
  const [group, setGroup] = useState("all");
  const [q, setQ] = useState("");
  const total = groups.reduce((n, g) => n + g.items.length, 0);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return groups
      .filter((g) => group === "all" || g.id === group)
      .flatMap((g) => g.items.map((it) => ({ ...it, group: g.label })))
      .filter((it) => !needle || [it.t, it.d, ...it.tags].join(" ").toLowerCase().includes(needle));
  }, [groups, group, q]);

  const chip = (id: string, label: string, count: number) => (
    <button
      key={id}
      type="button"
      aria-pressed={group === id}
      onClick={() => setGroup(id)}
      className={`mono flex shrink-0 items-center gap-2 border px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
        group === id
          ? "border-[var(--t-hi)] bg-[var(--t-hi)] text-white"
          : "border-[var(--line-strong)] bg-[var(--bg-card)] hover:border-[var(--signal)] hover:text-[var(--signal)]"
      }`}
    >
      {label}
      <span className={group === id ? "text-white/60" : "text-[var(--t-lo)]"}>{count}</span>
    </button>
  );

  return (
    <section id="catalog" className="border-b border-[var(--line)] py-20 sm:py-28">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            eyebrow="Service catalogue"
            title={
              <>
                Every service, <span className="em">one place.</span>
              </>
            }
            lead={`${total} services across ${groups.length} practice areas. Filter by area or search for a standard, chain or asset.`}
          />
          <label className="relative w-full lg:w-80">
            <span className="sr-only">Search services</span>
            <span aria-hidden="true" className="mono absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-[var(--signal)]">
              $
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="grep ERC-4337, bridge, Solana…"
              className="mono h-12 w-full border border-[var(--line-strong)] bg-[var(--bg-card)] pl-9 pr-4 text-[12.5px] placeholder:text-[var(--t-lo)] focus:border-[var(--signal)] focus:outline-none"
            />
          </label>
        </div>

        <div className="-mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {chip("all", "All", total)}
          {groups.map((g) => chip(g.id, g.label, g.items.length))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px border border-[var(--line-strong)] bg-[var(--line-strong)] sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((it, i) => {
            const body = (
              <>
                <div className="flex items-center justify-between">
                  <span className="mono text-[10.5px] text-[var(--t-lo)]">
                    0x{(i + 1).toString(16).padStart(2, "0")} · {it.group}
                  </span>
                  <span aria-hidden="true" className="mono text-[var(--signal)] opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </div>
                <h3 className="mt-5 text-[22px] leading-tight transition-colors group-hover:text-[var(--signal)]">{it.t}</h3>
                <p className="mt-3 text-[15px] text-[var(--t-mid)]">{it.d}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {it.tags.map((t) => (
                    <span key={t} className="mono border border-[var(--line)] px-2 py-0.5 text-[10.5px] text-[var(--t-mid)]">
                      {t}
                    </span>
                  ))}
                </div>
              </>
            );
            const cls =
              "group animate-fade-in relative flex min-h-[230px] flex-col bg-[var(--bg-card)] p-6 transition-colors hover:bg-[var(--bg-card-hover)]";
            return it.href ? (
              <Link key={it.t} href={it.href} className={cls}>
                {body}
              </Link>
            ) : (
              <div key={it.t} className={cls}>
                {body}
              </div>
            );
          })}
          {shown.length === 0 && (
            <div className="bg-[var(--bg-card)] p-10 sm:col-span-2 lg:col-span-3">
              <p className="mono text-[12px] text-[var(--t-mid)]">
                no match for &quot;{q}&quot;. <Link href="/contact" className="text-[var(--signal)] underline">Ask us about it →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
