/* TOKEN2049 Singapore 2026 event page (/token2049).

   Event facts are TOKEN2049's own published schedule: main conference
   7–8 October 2026 at Marina Bay Sands, doors 07:30–18:00 SGT, TOKEN2049
   Week side events 5–11 October. HashX Labs is in Singapore 7–10 October.
   We are attending, not organising or sponsoring: no booth number, logo or
   partnership claims until those exist. */

import type { IconName } from "@/components/icons/Icon";

export const EVENT = {
  name: "TOKEN2049 Singapore",
  venue: "Marina Bay Sands",
  conference: "7–8 October 2026",
  ourDates: "7–10 October 2026",
  /** Doors open on conference day 1 (SGT is UTC+8, no daylight saving). */
  opens: "2026-10-07T07:30:00+08:00",
  /** Conference day 2 closes. */
  closes: "2026-10-08T18:00:00+08:00",
  /** Our last day in Singapore ends. */
  leaves: "2026-10-10T23:59:00+08:00",
  /** We land; the start of the week bar. */
  arrives: "2026-10-07T00:00:00+08:00",
  coords: "1.2834° N, 103.8607° E",
};

export type DayId = "07" | "08" | "09" | "10";

export const DAYS: {
  id: DayId;
  dow: string;
  date: string;
  title: string;
  d: string;
  where: string;
  conference?: boolean;
  /** Start and end of the day in SGT, for the "today" marker. */
  from: string;
  to: string;
}[] = [
  {
    id: "07",
    dow: "Wed",
    date: "7 Oct",
    title: "Conference day 1",
    d: "Doors open at 07:30. We are on the floor all day and meet between sessions.",
    where: "Marina Bay Sands",
    conference: true,
    from: "2026-10-07T00:00:00+08:00",
    to: "2026-10-07T23:59:59+08:00",
  },
  {
    id: "08",
    dow: "Thu",
    date: "8 Oct",
    title: "Conference day 2",
    d: "Second day on the floor. Short meetings near the venue, longer ones after 18:00.",
    where: "Marina Bay Sands",
    conference: true,
    from: "2026-10-08T00:00:00+08:00",
    to: "2026-10-08T23:59:59+08:00",
  },
  {
    id: "09",
    dow: "Fri",
    date: "9 Oct",
    title: "Deep-dive day",
    d: "Time for longer working sessions. Bring a repo or a spec and we open the laptop together.",
    where: "Anywhere in Singapore",
    from: "2026-10-09T00:00:00+08:00",
    to: "2026-10-09T23:59:59+08:00",
  },
  {
    id: "10",
    dow: "Sat",
    date: "10 Oct",
    title: "Final meetings",
    d: "Last slots of the week, for anyone who could not fit us in before.",
    where: "Anywhere in Singapore",
    from: "2026-10-10T00:00:00+08:00",
    to: "2026-10-10T23:59:59+08:00",
  },
];

export const WINDOWS = [
  { id: "am", label: "Morning", time: "09:00–12:00" },
  { id: "pm", label: "Afternoon", time: "12:00–17:00" },
  { id: "eve", label: "Evening", time: "17:00–21:00" },
] as const;
export type WindowId = (typeof WINDOWS)[number]["id"];

export const PLACES = [
  { id: "mbs", label: "At the venue", detail: "Marina Bay Sands" },
  { id: "city", label: "Elsewhere in Singapore", detail: "We come to you" },
  { id: "video", label: "Video call", detail: "Not in town" },
] as const;
export type PlaceId = (typeof PLACES)[number]["id"];

/** What a 30-minute conversation can cover. `short` labels the meeting pass. */
export const TOPICS: { id: string; icon: IconName; title: string; short: string; d: string; points: string[] }[] = [
  {
    id: "audit",
    icon: "shield",
    title: "Pre-audit hardening",
    short: "Security",
    d: "Booked an audit, or about to? We talk through the invariants your contracts must hold and where we would fuzz first.",
    points: ["Invariant & fuzz plan", "Access-control review", "Upgrade & key risks"],
  },
  {
    id: "protocol",
    icon: "blockchain",
    title: "Protocol & token design",
    short: "Protocol",
    d: "Vaults, AMMs, lending, staking or a token launch. We sketch the architecture and the ways it could be attacked.",
    points: ["ERC-4626 vaults & AMMs", "Tokenomics in code", "Cross-chain messaging"],
  },
  {
    id: "rwa",
    icon: "tokenize",
    title: "RWA tokenization",
    short: "RWA",
    d: "Funds, credit or property on-chain, with investor eligibility enforced by the token itself.",
    points: ["ERC-3643 permissioned tokens", "KYC & claims registry", "Distributions that reconcile"],
  },
  {
    id: "payments",
    icon: "coin",
    title: "Stablecoins & payments",
    short: "Payments",
    d: "Issuance, reserves and payment rails that reconcile with the systems your finance team already runs.",
    points: ["Issuance & redemption", "Ramps & gateways", "Treasury & payouts"],
  },
  {
    id: "wallets",
    icon: "lock",
    title: "Wallets & custody",
    short: "Custody",
    d: "Shared custody where no single person or device can move funds, with policies you can read.",
    points: ["Threshold & multisig signing", "Account abstraction", "Policy engines"],
  },
  {
    id: "ai",
    icon: "ai",
    title: "AI agents on real systems",
    short: "AI agents",
    d: "Agents that read chains, documents and tools, with a person approving every action that writes.",
    points: ["Retrieval over your docs", "Tool-calling with approvals", "Evaluation & monitoring"],
  },
];

/** The Web3 case studies we can walk through in person (ids in WORK, site.ts). */
export const WORK_IDS = ["amm", "rwa", "custody"];

export const T49_FAQS: [string, string][] = [
  [
    "Do I need a TOKEN2049 pass to meet you?",
    "No. On the conference days we can meet inside Marina Bay Sands if you have a pass, or anywhere nearby if you don't. On the other days we come to you.",
  ],
  [
    "Who will I be talking to?",
    "An engineer who would actually work on your project. It is a technical conversation, not a sales pitch, and there is no cost or obligation.",
  ],
  [
    "Can I bring code?",
    "Please do. A repository, a spec or a whiteboard sketch all work. If anything is confidential, say so in the request and we can put an NDA in place before we meet.",
  ],
  [
    "I'm not in Singapore. Can we still talk?",
    "Yes. Choose \"Video call\" on the meeting pass, or email us any time. The conversation is the same.",
  ],
  [
    "Are you affiliated with TOKEN2049?",
    "No. TOKEN2049 is an independent event. HashX Labs is attending, and this page is ours.",
  ],
];
