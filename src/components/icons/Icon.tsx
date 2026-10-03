/**
 * HashX icon set.
 *
 * Hand-drawn 24x24 stroke icons on a consistent grid, replacing emoji.
 * Emoji rendered as different artwork on every OS (Apple vs Windows vs
 * Android), which broke the visual language and read as unpolished on a
 * B2B site. These inherit `currentColor`, so they theme automatically.
 *
 * Usage: <Icon name="blockchain" className="w-6 h-6" />
 */

import type { ReactNode } from "react";

export type IconName =
  | "blockchain" | "ai" | "tokenize" | "shield" | "rocket" | "mobile"
  | "link" | "bolt" | "bank" | "bridge" | "coin" | "vote" | "scroll"
  | "lock" | "chart" | "building" | "robot" | "brain" | "search"
  | "factory" | "eye" | "chat" | "gear" | "radar" | "microscope"
  | "target" | "ruler" | "cash" | "clipboard" | "refresh" | "document"
  | "trend" | "gold" | "stamp" | "check" | "sparkle" | "globe" | "users"
  | "code" | "cloud" | "database" | "layers";

const P: Record<IconName, ReactNode> = {
  blockchain: <><path d="M12 2 4 6.5v11L12 22l8-4.5v-11L12 2Z" /><path d="M12 22V12M12 12 4 7.5M12 12l8-4.5" /></>,
  ai: <><rect x="4" y="7" width="16" height="12" rx="3" /><path d="M9 12h.01M15 12h.01M9.5 16h5M12 7V3.5M9 3.5h6" /></>,
  tokenize: <><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10h5M9.5 14h5" /></>,
  shield: <><path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  rocket: <><path d="M12 3c3 2 5 5.5 5 9.5L12 17l-5-4.5C7 8.5 9 5 12 3Z" /><path d="M9 15.5 6.5 18l1 3 3-1M15 15.5 17.5 18l-1 3-3-1" /><circle cx="12" cy="10" r="1.6" /></>,
  mobile: <><rect x="7" y="2.5" width="10" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,

  link: <><path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7L11.5 6.8" /><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.3-1.3" /></>,
  bolt: <path d="M13 2 5 13h6l-1 9 8-11h-6l1-9Z" />,
  bank: <><path d="M3 9.5 12 4l9 5.5" /><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20.5h18" /></>,
  bridge: <><path d="M3 15h18M5 15V9M19 15V9" /><path d="M3 9c3.5 0 5-2 9-2s5.5 2 9 2" /><path d="M9.5 15v-3.5M14.5 15v-3.5" /></>,
  coin: <><ellipse cx="12" cy="6.5" rx="7" ry="3" /><path d="M5 6.5v11c0 1.7 3.1 3 7 3s7-1.3 7-3v-11" /><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
  vote: <><path d="M4 12.5 12 9l8 3.5-8 3.5-8-3.5Z" /><path d="M4 16.5 12 20l8-3.5" /><path d="M12 9V4M9.5 6h5" /></>,
  scroll: <><path d="M6 4h9a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2V4Z" /><path d="M9.5 8h5M9.5 12h5" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" /></>,
  chart: <><path d="M4 20V4M4 20h16" /><path d="M8 17v-5M12 17V8M16 17v-7" /></>,
  building: <><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M9 8h2M13 8h2M9 12h2M13 12h2M10.5 20.5v-4h3v4" /></>,

  robot: <><rect x="4" y="8" width="16" height="11" rx="3" /><circle cx="9.5" cy="13" r="1.2" /><circle cx="14.5" cy="13" r="1.2" /><path d="M12 8V4.5M10 4.5h4M2.5 13H4M20 13h1.5" /></>,
  brain: <><path d="M12 5.5a3 3 0 0 0-5.7 1.3A3 3 0 0 0 5 12a3 3 0 0 0 1.8 4.7A3 3 0 0 0 12 18.5Z" /><path d="M12 5.5a3 3 0 0 1 5.7 1.3A3 3 0 0 1 19 12a3 3 0 0 1-1.8 4.7A3 3 0 0 1 12 18.5Z" /><path d="M12 5.5v13" /></>,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  factory: <><path d="M3 20.5h18M4 20.5V11l5 3.5V11l5 3.5V7l6 3.5v10" /><path d="M7 17h1M12 17h1M17 17h1" /></>,
  eye: <><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.8" /></>,
  chat: <><path d="M4 5.5h16a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H9l-4.5 3.5V16.5H4A1.5 1.5 0 0 1 2.5 15V7A1.5 1.5 0 0 1 4 5.5Z" /><path d="M8 10.5h8M8 13.5h5" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" /></>,
  radar: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /><path d="M12 12 18 6" /></>,

  microscope: <><path d="M9 18h9M6.5 21h13" /><path d="M11 15.5a5.5 5.5 0 0 0 5.5-5.5V6" /><rect x="8.5" y="3" width="5" height="8" rx="2" /></>,
  target: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" /></>,
  ruler: <><rect x="3" y="9" width="18" height="6" rx="1.5" /><path d="M7 9v2.5M11 9v3.5M15 9v2.5M19 9v3.5" /></>,
  cash: <><rect x="2.5" y="6" width="19" height="12" rx="2" /><circle cx="12" cy="12" r="2.8" /><path d="M6 9.5v5M18 9.5v5" /></>,
  clipboard: <><rect x="5" y="4.5" width="14" height="16" rx="2" /><path d="M9 4.5V3.5h6v1" /><path d="M8.5 10h7M8.5 14h5" /></>,
  refresh: <><path d="M20 12a8 8 0 0 1-13.7 5.7M4 12a8 8 0 0 1 13.7-5.7" /><path d="M4 17.5V12h5.5M20 6.5V12h-5.5" /></>,
  document: <><path d="M6 3.5h7l5 5v12a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20.5v-16A1 1 0 0 1 6 3.5Z" /><path d="M13 3.5v5h5" /><path d="M9 13h6M9 16.5h4" /></>,

  trend: <><path d="M3 17.5 9 11l4 4 8-8.5" /><path d="M15.5 6.5H21v5.5" /></>,
  gold: <><path d="M6 8.5h12l2 4H4l2-4Z" /><path d="M4 12.5h16v6H4v-6Z" /><path d="M9.5 12.5v6M14.5 12.5v6" /></>,
  stamp: <><path d="M8 3.5h8v5.5c0 1.5-1 2.5-2 3.5h-4c-1-1-2-2-2-3.5V3.5Z" /><path d="M4.5 12.5h15v4h-15z" /><path d="M3.5 20.5h17" /></>,

  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  sparkle: <><path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.5l-1.8-5.9L4.5 10.8 10.2 9 12 3.5Z" /><path d="M18.5 3.5v3M17 5h3" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5Z" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3 19.5a6 6 0 0 1 12 0" /><path d="M16 5.8a3.2 3.2 0 0 1 0 5.4M17 14.2a6 6 0 0 1 4 5.3" /></>,
  code: <><path d="m8.5 8-5 4 5 4M15.5 8l5 4-5 4" /><path d="m13.5 4.5-3 15" /></>,
  cloud: <path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.4 1.6A4 4 0 0 1 17.5 18.5H7Z" />,
  database: <><ellipse cx="12" cy="6" rx="7.5" ry="3" /><path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" /><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" /></>,
  layers: <><path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8 12 3.5Z" /><path d="m3.5 12.5 8.5 4.5 8.5-4.5" /><path d="m3.5 16.5 8.5 4.5 8.5-4.5" /></>,
};

export default function Icon({
  name,
  className = "w-6 h-6",
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {P[name]}
    </svg>
  );
}
