"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";

const GROUPS = [
  { key: "need", label: "What do you need?", opts: ["New contracts", "Review of existing code", "RWA / tokenization", "AI agent or retrieval", "Full product"] },
  { key: "stage", label: "Where are you?", opts: ["Idea", "Spec written", "On testnet", "Pre-mainnet"] },
  { key: "chain", label: "Which chain?", opts: ["EVM", "Solana", "Not decided"] },
] as const;

export default function BriefBuilder() {
  const [sel, setSel] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);

  const brief = useMemo(() => {
    const parts = GROUPS.map((g) => `${g.label} ${sel[g.key] ?? "—"}`);
    return `Hi HashX Labs,\n\n${parts.join("\n")}\n\n${note.trim() || "(add a few lines about what you are building)"}\n`;
  }, [sel, note]);

  const mailto = `mailto:info@hashxlabs.com?subject=${encodeURIComponent("Project brief")}&body=${encodeURIComponent(brief)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable; the mail link still works */
    }
  };

  return (
    <section id="brief" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-5 sm:px-8 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <span className="eyebrow">Start a brief</span>
          <h2 className="mt-5 text-4xl sm:text-6xl">
            Tell us what you are <span className="em">building</span>.
          </h2>
          <p className="mt-5 max-w-md text-[var(--t-mid)]">
            Three taps and a few lines. It writes the email for you, so the first
            message already has what an engineer needs to reply usefully.
          </p>
        </Reveal>

        <div className="space-y-8 lg:col-span-7">
          {GROUPS.map((g) => (
            <fieldset key={g.key}>
              <legend className="mono mb-3 text-[11px] uppercase tracking-[0.12em] text-[var(--t-lo)]">
                {g.label}
              </legend>
              <div className="flex flex-wrap gap-2">
                {g.opts.map((o) => {
                  const on = sel[g.key] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setSel((s) => ({ ...s, [g.key]: on ? "" : o }))}
                      className={`mono border px-3.5 py-2 text-[12px] transition-colors cursor-pointer ${
                        on
                          ? "border-[var(--signal)] bg-[var(--signal)] text-[var(--signal-ink)]"
                          : "border-[var(--line-strong)] bg-[var(--bg-card)] text-[var(--t-hi)] hover:border-[var(--signal)]"
                      }`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <label className="block">
            <span className="mono mb-3 block text-[11px] uppercase tracking-[0.12em] text-[var(--t-lo)]">
              A few lines about the project
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="What it does, who it is for, and what worries you most."
              className="w-full resize-y border border-[var(--line-strong)] bg-[var(--bg-input)] px-4 py-3 text-[15px] text-[var(--t-hi)] placeholder:text-[var(--t-lo)] focus:border-[var(--signal)] focus:outline-none"
            />
          </label>

          <div className="ticks border border-[var(--line-strong)] bg-[var(--bg-card)]">
            <span className="tk-b" />
            <pre className="mono max-h-44 overflow-auto whitespace-pre-wrap px-4 py-4 text-[11.5px] leading-[1.7] text-[var(--t-mid)]">
              {brief}
            </pre>
            <div className="flex flex-wrap gap-3 border-t border-[var(--line)] p-3">
              <a href={mailto} className="btn-primary h-10 px-5">
                Open in email <span aria-hidden="true">→</span>
              </a>
              <button type="button" onClick={copy} className="btn-ghost h-10 px-5">
                {copied ? "copied" : "copy text"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
