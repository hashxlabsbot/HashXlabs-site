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
  address: { street: "10 Bayfront Avenue", postcode: "018956", city: "Singapore", country: "SG" },
  /** TOKEN2049 Week side events across the city. */
  week: "5–11 October 2026",
  /** The organiser's own page for the event. */
  officialUrl: "https://token2049.com/singapore/",
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
    "When and where is TOKEN2049 Singapore 2026?",
    "The conference runs on Wednesday 7 and Thursday 8 October 2026 at Marina Bay Sands, 10 Bayfront Avenue, Singapore, from 07:30 to 18:00 each day. TOKEN2049 Week side events run across the city from 5 to 11 October. HashX Labs is in Singapore from 7 to 10 October.",
  ],
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

/* ── Guide (/token2049/guide) ─────────────────────────────────────────
   An independent attendee guide. Every fact below was checked on
   2026-10-04 against TOKEN2049's own FAQ (token2049.com/singapore/faqs),
   the side-event directory (week.token2049.com) and, for the MRT, public
   transport references. Opinions (the builder tips) are ours and say so.
   Update GUIDE_UPDATED whenever a fact changes. */

export const GUIDE_PUBLISHED = "2026-10-04";
export const GUIDE_UPDATED = "2026-10-04";

export const GUIDE_FACTS: [string, string][] = [
  ["Dates", "Wednesday 7 and Thursday 8 October 2026"],
  ["Hours", "07:30 to 18:00 (SGT) on both days"],
  ["Venue", "Marina Bay Sands, all five floors"],
  ["Address", "10 Bayfront Avenue, Singapore 018956"],
  ["Nearest MRT", "Bayfront (CE1/DT16), Circle and Downtown lines. Exit E leads directly into the Sands Expo and Convention Centre."],
  ["TOKEN2049 Week", "5 to 11 October 2026, with more than 1,000 side events across the city"],
  ["Side-event directory", "week.token2049.com"],
  ["Tickets", "Delivered by email. All purchases are non-refundable."],
  ["Official app", "iOS and Android, with attendee matchmaking and floor plans"],
];

/** The week, day by day (5 October 2026 is a Monday). */
export const GUIDE_WEEK: { when: string; what: string; d: string }[] = [
  { when: "Mon 5 Oct", what: "TOKEN2049 Week begins", d: "Side events start across the city: conferences, workshops, investor gatherings, meetups and parties." },
  { when: "Tue 6 – Thu 8 Oct", what: "TOKEN2049 Origins hackathon", d: "A 36-hour hackathon with a US$150,000 prize pool." },
  {
    when: "Wed 7 – Thu 8 Oct",
    what: "The conference at Marina Bay Sands",
    d: "Doors 07:30 to 18:00 on both days. The ten NEXUS startup-competition finalists pitch for a US$250,000 prize pool.",
  },
  { when: "Fri 9 Oct", what: "AFTER 2049", d: "The official closing party, on the Marina Bay Sands SkyPark, 57 floors up." },
  { when: "Sun 11 Oct", what: "TOKEN2049 Week ends", d: "The last side events of the week." },
];

/** Our own advice for founders and engineers (opinion, not event facts). */
export const GUIDE_TIPS: { t: string; d: string }[] = [
  {
    t: "Book meetings before you land",
    d: "The two conference days fill up fast. Use the official app's matchmaking and the side-event directory to plan, and keep a few slots open for people you meet on the floor.",
  },
  {
    t: "Bring a one-page spec",
    d: "What the system does, which chains it runs on, and the few things that must never happen. It turns a 30-minute chat into a useful technical conversation.",
  },
  {
    t: "For a security conversation, bring the repo",
    d: "A link to the code, the list of privileged roles and external calls, and your launch or audit date. That is enough for an engineer to tell you where the risk is.",
  },
  {
    t: "Ask auditors how findings arrive",
    d: "As a PDF, or as failing tests you can run? What do they fuzz, and what is out of scope? The answers tell you more than a logo wall.",
  },
  {
    t: "Use Friday and Saturday for deep dives",
    d: "Once the conference floor closes, the city is quieter and there is time to open a laptop and go through architecture properly.",
  },
];

export const GUIDE_FAQS: [string, string][] = [
  ["When is TOKEN2049 Singapore 2026?", "TOKEN2049 Singapore 2026 is on Wednesday 7 and Thursday 8 October 2026. TOKEN2049 Week, the wider programme of side events, runs from 5 to 11 October."],
  ["Where is TOKEN2049 Singapore 2026 held?", "At Marina Bay Sands, 10 Bayfront Avenue, Singapore 018956. The conference uses all five floors of the venue."],
  ["What time does TOKEN2049 open?", "Doors are open from 07:30 to 18:00 Singapore time on both conference days, 7 and 8 October 2026."],
  ["How do I get to TOKEN2049 by MRT?", "Take the Circle or Downtown line to Bayfront station (CE1/DT16). Exit E leads directly into the Sands Expo and Convention Centre at Marina Bay Sands."],
  ["Where can I find TOKEN2049 side events?", "The official, searchable side-event directory is at week.token2049.com. More than 1,000 side events run across Singapore from 5 to 11 October 2026."],
  ["When and where is AFTER 2049?", "AFTER 2049, the official closing party, is on Friday 9 October 2026 at the Marina Bay Sands SkyPark."],
  ["When is the TOKEN2049 Origins hackathon?", "TOKEN2049 Origins runs from 6 to 8 October 2026. It is a 36-hour hackathon with a US$150,000 prize pool."],
  ["Are TOKEN2049 tickets refundable?", "No. TOKEN2049 states that all ticket purchases are non-refundable. Tickets are delivered electronically by email."],
  ["Do I need a visa for TOKEN2049 Singapore?", "Attendees arrange their own entry requirements for Singapore. TOKEN2049 does not refund tickets if a visa is refused, so check entry rules for your passport early."],
  ["Can I meet HashX Labs at TOKEN2049?", "Yes. HashX Labs engineers are in Singapore from 7 to 10 October 2026, at Marina Bay Sands on the conference days and around the city afterwards. Book a slot on hashxlabs.com/token2049."],
];

export const GUIDE_SOURCES: { label: string; href: string }[] = [
  { label: "TOKEN2049 Singapore FAQ (official)", href: "https://token2049.com/singapore/faqs" },
  { label: "TOKEN2049 Week side-event directory (official)", href: "https://week.token2049.com/" },
  { label: "Bayfront MRT station", href: "https://en.wikipedia.org/wiki/Bayfront_MRT_station" },
];
