"use client";

import { useState } from "react";

export default function FloatingContactBar() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Expandable options */}
      {expanded && (
        <div className="flex flex-col items-end gap-2 animate-fade-in">
          {/* WhatsApp */}
          <a
            href="https://wa.me/919999999999?text=Hi%2C%20I%27m%20interested%20in%20HashX%20Labs%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ background: "#25D366" }}
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.554 4.122 1.524 5.854L.057 23.885a.5.5 0 0 0 .614.614l5.996-1.468A11.955 11.955 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.973 9.973 0 0 1-5.127-1.416l-.369-.219-3.784.926.95-3.682-.239-.384A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            WhatsApp
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/hashxlabs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ background: "#2CA5E0" }}
            aria-label="Chat on Telegram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Telegram
          </a>

          {/* Email */}
          <a
            href="mailto:hello@hashxlabs.com"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-xs font-semibold shadow-lg transition-transform hover:scale-105"
            style={{ background: "var(--accent)" }}
            aria-label="Send email"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            Email Us
          </a>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="Toggle contact options"
        className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110"
        style={{
          background: expanded
            ? "linear-gradient(135deg, #ef4444, #f97316)"
            : "linear-gradient(135deg, #6c3de8, #4f8ef7)",
        }}
      >
        {expanded ? (
          /* X icon */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-6 h-6">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          /* Chat bubble icon */
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37A9.95 9.95 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14H7v-2h6v2zm2-4H7v-2h8v2zm0-4H7V6h8v2z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
