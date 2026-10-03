"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Taking on new smart contract and protocol engagements — ",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    // Rotate messages every 5 seconds
    const interval = setInterval(() => {
      setMsgIdx((prev) => (prev + 1) % MESSAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Check dismissal in mount safely
  useEffect(() => {
    const isDismissed = sessionStorage.getItem("announcement_dismissed");
    if (!isDismissed) {
      const timer = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("announcement_dismissed", "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div
      className="relative flex items-center justify-center gap-3 px-4 py-2 text-xs font-medium w-full"
      style={{
        background: "var(--t-hi)",
        color: "var(--bg-page)",
      }}
    >

      {/* Rotating message */}
      <span className="text-center leading-tight">
        {MESSAGES[msgIdx]}
        <a
          href="/contact"
          className="underline underline-offset-2 font-bold hover:no-underline transition-all"
        >
          Learn More →
        </a>
      </span>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-colors text-base leading-none cursor-pointer"
      >
        &times;
      </button>
    </div>
  );
}
