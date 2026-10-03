"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import Icon, { type IconName } from "./icons/Icon";

const serviceTypes: { id: string; name: string; estWeeks: string; icon: IconName }[] = [
  { id: "web3", name: "Web3 & Blockchain", estWeeks: "4-8 Weeks", icon: "bolt" },
  { id: "ai", name: "Enterprise AI & GenAI", estWeeks: "3-6 Weeks", icon: "brain" },
  { id: "rwa", name: "RWA Tokenization", estWeeks: "4-7 Weeks", icon: "bank" },
  { id: "audit", name: "Smart Contract Audit", estWeeks: "1-2 Weeks", icon: "shield" },
  { id: "saas", name: "SaaS & Custom Web App", estWeeks: "6-12 Weeks", icon: "rocket" },
  { id: "mobile", name: "Mobile App (iOS/Android)", estWeeks: "6-10 Weeks", icon: "mobile" },
];

const projectStages = [
  { id: "mvp", title: "New Product / MVP", desc: "Build from scratch based on design specs" },
  { id: "scale", title: "Scale Existing System", desc: "Refactor codebase, optimize throughput" },
  { id: "audit_security", title: "Security & Audit Focus", desc: "Penetration testing & code verification" },
];

export default function ProjectEstimator() {
  const [selectedService, setSelectedService] = useState<string>("web3");
  const [selectedStage, setSelectedStage] = useState<string>("mvp");
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");

  const currentServiceObj = serviceTypes.find((s) => s.id === selectedService) || serviceTypes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="estimator"
      className="relative py-24 sm:py-32 bg-[var(--bg-page)] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal className="mb-14 text-center max-w-3xl mx-auto">
          <span className="eyebrow">Interactive Scope Calculator</span>
          <h2 className="display text-3xl sm:text-5xl text-[var(--t-hi)] mt-3 mb-5">
            Estimate Your <span className="gradient-text">Project Scope</span>
          </h2>
          <p className="text-base sm:text-lg text-[var(--t-mid)]">
            Select your requirements to generate an instant timeline estimate and get a tailored technical proposal from our engineering team.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left Calculator Controls */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Select Service */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border border-[var(--line-strong)]">
              <label className="mono text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest block mb-4">
                Step 1: Select Primary Capability
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {serviceTypes.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedService(st.id)}
                    className={`p-4 rounded-xl text-left border transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 ${
                      selectedService === st.id
                        ? "bg-blue-600/15 border-blue-500 text-[var(--t-hi)] shadow-md"
                        : "bg-[var(--bg-card)] border-[var(--line)] text-[var(--t-mid)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    <Icon name={st.icon} className="w-7 h-7 text-blue-600 dark:text-cyan-300" />
                    <span className="text-xs sm:text-sm font-bold text-[var(--t-hi)] leading-tight">
                      {st.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Stage */}
            <div className="glass-card p-6 sm:p-7 rounded-2xl border border-[var(--line-strong)]">
              <label className="mono text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest block mb-4">
                Step 2: Project Phase & Maturity
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {projectStages.map((stg) => (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => setSelectedStage(stg.id)}
                    className={`p-4 rounded-xl text-left border transition-all duration-300 cursor-pointer ${
                      selectedStage === stg.id
                        ? "bg-blue-600/15 border-blue-500 text-[var(--t-hi)] shadow-md"
                        : "bg-[var(--bg-card)] border-[var(--line)] text-[var(--t-mid)] hover:bg-[var(--bg-card-hover)]"
                    }`}
                  >
                    <div className="text-xs font-bold text-[var(--t-hi)] mb-1">
                      {stg.title}
                    </div>
                    <div className="text-[11px] text-[var(--t-lo)] leading-tight">
                      {stg.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Estimate Summary & Contact Card */}
          <div className="lg:col-span-5">
            <div className="glass-card spotlight p-7 rounded-2xl border border-[var(--line-strong)] shadow-2xl relative overflow-hidden">
              <div className="mb-6 pb-6 border-b border-[var(--line)]">
                <div className="mono text-xs text-[var(--t-lo)] uppercase tracking-wider mb-2">
                  Estimated Delivery Window
                </div>
                <div className="text-3xl sm:text-4xl font-black gradient-text">
                  {currentServiceObj.estWeeks}
                </div>
                <p className="text-xs text-[var(--t-mid)] mt-2">
                  Includes Architecture Blueprinting, Development, Testing & Final Audit.
                </p>
              </div>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="mono text-xs font-bold text-[var(--t-hi)] uppercase tracking-wider mb-2">
                    Request Formal Project Proposal
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Work Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your product goals..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--line)] text-sm text-[var(--t-hi)] focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full py-4 rounded-xl text-sm font-bold shadow-xl cursor-pointer"
                  >
                    Submit for Instant Engineering Review
                  </button>
                </form>
              ) : (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="check" className="w-7 h-7" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--t-hi)]">
                    Proposal Request Received!
                  </h3>
                  <p className="text-sm text-[var(--t-mid)]">
                    Our Lead Solution Architect will review your specifications and email you back within 6 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-ghost text-xs px-4 py-2 rounded-lg"
                  >
                    Calculate Another Estimate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
