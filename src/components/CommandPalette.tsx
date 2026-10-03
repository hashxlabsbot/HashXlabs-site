"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

interface CommandItem {
  id: string;
  category: "Navigation" | "Blockchain Engine" | "Tools & Actions";
  label: string;
  sub: string;
  action: () => void;
  badge?: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd + K or Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    // The navbar's search button opens it too (no floating button over the content).
    const openFromNav = () => setIsOpen(true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("hx:palette", openFromNav);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("hx:palette", openFromNav);
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    setQuery("");
  };

  const commands: CommandItem[] = [
    {
      id: "invariant-lab",
      category: "Blockchain Engine",
      label: "Interactive Invariant Lab",
      sub: "Simulate exploit vectors and break smart contracts live",
      badge: "Sim",
      action: () => {
        router.push("/lab");
        close();
      },
    },
    {
      id: "blockchain-services",
      category: "Blockchain Engine",
      label: "Smart Contract & Protocol Engineering",
      sub: "DeFi, ERC-4626 vaults, RWA tokenization & audit readiness",
      badge: "Core",
      action: () => {
        router.push("/services/blockchain-development");
        close();
      },
    },
    {
      id: "ai-agents",
      category: "Blockchain Engine",
      label: "On-Chain AI Agents & Autonomous Execution",
      sub: "Smart contract execution agents, LLMs & verification pipelines",
      badge: "AI/Web3",
      action: () => {
        router.push("/services/ai-development");
        close();
      },
    },
    {
      id: "method",
      category: "Navigation",
      label: "How We Work (5 Blocks)",
      sub: "Jump to 3D architectural pipeline & proof-of-work",
      action: () => {
        const el = document.getElementById("method");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        close();
      },
    },
    {
      id: "work",
      category: "Navigation",
      label: "Case Studies & Engagements",
      sub: "View anonymized architecture for institutional protocols",
      action: () => {
        router.push("/case-studies");
        close();
      },
    },
    {
      id: "brief",
      category: "Tools & Actions",
      label: "Launch Project Estimator / Brief Builder",
      sub: "Calculate technical scope, timeline, and audit requirements",
      badge: "Tool",
      action: () => {
        const el = document.getElementById("brief");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        close();
      },
    },
    {
      id: "theme",
      category: "Tools & Actions",
      label: `Toggle Theme (Current: ${theme})`,
      sub: "Switch between high-contrast dark and paper light modes",
      action: () => {
        toggleTheme();
        close();
      },
    },
    {
      id: "contact",
      category: "Tools & Actions",
      label: "Schedule Architecture Review / Contact",
      sub: "Direct line to our senior protocol engineers",
      action: () => {
        router.push("/contact");
        close();
      },
    },
  ];

  const filtered = commands.filter((c) => {
    const q = query.toLowerCase();
    return c.label.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q) || c.category.toLowerCase().includes(q);
  });

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === "Enter" && filtered[selectedIdx]) {
      e.preventDefault();
      filtered[selectedIdx].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        className="w-full max-w-2xl border border-[var(--line-strong)] bg-[#0b1220] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyNav}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-white/10 px-4 py-3 bg-[#070d18]">
          <span className="font-mono text-[var(--signal)] mr-3 text-sm">❯</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            placeholder="Search protocols, invariant lab, architecture docs, or actions..."
            className="w-full bg-transparent font-mono text-[13px] text-white placeholder-white/40 focus:outline-none"
          />
          <kbd className="font-mono text-[10px] text-white/40 px-1.5 py-0.5 border border-white/10 rounded">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center font-mono text-xs text-white/40">
              No matching commands or architecture documents found.
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setSelectedIdx(idx)}
                className={`w-full text-left p-3 rounded flex items-center justify-between font-mono transition-colors cursor-pointer ${
                  selectedIdx === idx ? "bg-[var(--signal)]/20 border border-[var(--signal)]/50" : "hover:bg-white/5 border border-transparent"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-semibold">{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/70 uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">{item.sub}</div>
                </div>
                <span className="text-[10px] text-white/40 shrink-0 ml-4 uppercase">{item.category}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#070d18] px-4 py-2 text-[10px] font-mono text-white/40">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>HashX Labs Kernel</span>
        </div>
      </div>
    </div>
  );
}
