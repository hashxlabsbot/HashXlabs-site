"use client";

import { useState, type FormEvent } from "react";
import { COMPANY } from "@/content/company";

/* Project enquiry form. There is no backend yet, so submitting composes an
   email to COMPANY.email in the visitor's mail app (and offers copy-to-
   clipboard as a fallback). The form says this plainly. */

const NEEDS = ["Smart contracts", "Security review", "RWA / tokenization", "DeFi / exchange", "Stablecoin / payments", "Wallet", "AI agent or RAG", "Not sure yet"];
const STAGES = ["Just an idea", "Spec written", "Building", "On testnet", "Live on mainnet"];

const field =
  "w-full rounded-lg border border-[var(--line-strong)] bg-white px-3.5 py-2.5 text-[15px] text-[var(--t-hi)] outline-none transition-colors placeholder:text-[var(--t-lo)] focus:border-[var(--signal)] focus:ring-2 focus:ring-[var(--signal-soft)]";

export default function ContactForm() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (n: string) => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]));

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const message = String(f.get("message") || "").trim();
    if (!name || !email || !message) {
      setError("Please fill in your name, email and a few lines about the project.");
      return;
    }
    setError(null);
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      f.get("company") ? `Company: ${f.get("company")}` : null,
      needs.length ? `Looking for: ${needs.join(", ")}` : null,
      f.get("stage") ? `Stage: ${f.get("stage")}` : null,
      "",
      message,
    ]
      .filter((l) => l !== null)
      .join("\n");
    setSent(body);
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(`Project enquiry from ${name}`)}&body=${encodeURIComponent(body)}`;
  };

  if (sent) {
    return (
      <div className="card p-8">
        <span className="icon-badge">✓</span>
        <h2 className="t-h3 mt-5 text-2xl">Your email app should now be open</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-[var(--t-mid)]">
          Your message is ready to send to {COMPANY.email}. If nothing opened, copy it and email us directly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              navigator.clipboard?.writeText(sent).then(() => setCopied(true), () => setCopied(false));
            }}
          >
            {copied ? "Copied" : "Copy message"}
          </button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSent(null)}>
            Edit message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="card grid gap-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[14px] font-medium">
            Name <span className="text-[var(--bad)]">*</span>
          </span>
          <input name="name" autoComplete="name" required className={field} placeholder="Jane Doe" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[14px] font-medium">
            Work email <span className="text-[var(--bad)]">*</span>
          </span>
          <input name="email" type="email" autoComplete="email" required className={field} placeholder="jane@company.com" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-[14px] font-medium">Company</span>
          <input name="company" autoComplete="organization" className={field} placeholder="Optional" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[14px] font-medium">Project stage</span>
          <select name="stage" defaultValue="" className={field}>
            <option value="">Select…</option>
            {STAGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="text-[14px] font-medium">What do you need?</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {NEEDS.map((n) => {
            const on = needs.includes(n);
            return (
              <button
                key={n}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(n)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
                  on ? "border-[var(--signal)] bg-[var(--signal-soft)] text-[var(--signal)]" : "border-[var(--line-strong)] text-[var(--t-mid)] hover:border-[var(--t-hi)]"
                }`}
              >
                {n}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="grid gap-1.5">
        <span className="text-[14px] font-medium">
          About the project <span className="text-[var(--bad)]">*</span>
        </span>
        <textarea
          name="message"
          required
          rows={5}
          className={`${field} resize-y`}
          placeholder="What are you building, who is it for, and what worries you most?"
        />
      </label>
      {error && (
        <p role="alert" className="rounded-lg bg-[#fdecec] px-3.5 py-2.5 text-[14px] text-[var(--bad)]">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-[var(--t-lo)]">Sending opens your email app with this message ready to go.</p>
        <button type="submit" className="btn btn-primary">
          Send enquiry <span className="arr">→</span>
        </button>
      </div>
    </form>
  );
}
