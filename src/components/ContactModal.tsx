"use client";

import { useState, useEffect } from "react";
import Icon from "./icons/Icon";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Web3 & Blockchain Protocol");
  const [budget, setBudget] = useState("$25k - $50k");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-opacity duration-300">
      <div
        className="glass-card relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-[var(--line-strong)] shadow-2xl overflow-hidden bg-[var(--bg-page)] text-[var(--t-hi)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl border border-[var(--line)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--t-hi)] transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {!submitted ? (
          <div>
            <div className="mb-6">
              <span className="eyebrow">Schedule Consultation</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--t-hi)] mt-1">
                Start Your <span className="gradient-text">Web3 & AI Project</span>
              </h2>
              <p className="text-xs sm:text-sm text-[var(--t-mid)] mt-1">
                Connect directly with HashX Labs Solution Architects. We reply within 6 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="mono text-[11px] font-bold text-[var(--t-mid)] block mb-1.5 uppercase">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Satoshi Nakamoto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mono text-[11px] font-bold text-[var(--t-mid)] block mb-1.5 uppercase">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="mono text-[11px] font-bold text-[var(--t-mid)] block mb-1.5 uppercase">
                    Primary Service Interest
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="Web3 & Blockchain Protocol">Web3 & Blockchain Protocol</option>
                    <option value="Enterprise AI Agents & LLM">Enterprise AI Agents & LLM</option>
                    <option value="Real-World Asset (RWA) Tokenization">Real-World Asset (RWA) Tokenization</option>
                    <option value="Smart Contract Audit & Security">Smart Contract Audit & Security</option>
                    <option value="High-Scale SaaS / Mobile App">High-Scale SaaS / Mobile App</option>
                  </select>
                </div>

                <div>
                  <label className="mono text-[11px] font-bold text-[var(--t-mid)] block mb-1.5 uppercase">
                    Estimated Budget Range
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                  >
                    <option value="< $25k">&lt; $25k</option>
                    <option value="$25k - $50k">$25k - $50k</option>
                    <option value="$50k - $100k">$50k - $100k</option>
                    <option value="$100k+">$100k+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mono text-[11px] font-bold text-[var(--t-mid)] block mb-1.5 uppercase">
                  Project Brief & Requirements
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your product goals, desired timeline, or smart contract auditing needs..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-xl cursor-pointer mt-2"
              >
                Book 30-Min Strategy Consultation
              </button>
            </form>
          </div>
        ) : (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-3xl">
              <Icon name="check" className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-[var(--t-hi)]">
              Consultation Scheduled!
            </h3>
            <p className="text-sm text-[var(--t-mid)] max-w-md mx-auto">
              Thank you, {name}. Our Lead Solution Architect will inspect your project parameters and send you a calendar invite and NDA via {email}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="btn-ghost px-6 py-2.5 rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
