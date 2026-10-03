import { DAYS, PLACES, TOPICS, WINDOWS, type DayId, type PlaceId, type WindowId } from "@/content/token2049";

/* Meeting-pass logic for the form (components/token2049/MeetingPass.tsx): the
   pass ID, barcode and wording shown in the live preview and written into the
   prepared email. */

export type MeetingRequest = {
  name: string;
  email: string;
  company: string;
  day: DayId;
  win: WindowId;
  place: PlaceId;
  topics: string[];
  note: string;
};

export const isConf = (d: DayId) => DAYS.some((x) => x.id === d && x.conference);

function fnv(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** The pass ID is a hash of the request's own fields. It identifies the pass; it is not a booking reference. */
export function passHash(r: Pick<MeetingRequest, "name" | "company" | "email" | "day" | "win" | "place" | "topics">) {
  const h = fnv([r.name.trim(), r.company.trim(), r.email.trim().toLowerCase(), r.day, r.win, r.place, r.topics.join(",")].join("|"));
  return { h, id: `HX-49-${h.toString(16).toUpperCase().padStart(8, "0").replace(/(.{4})/, "$1-")}` };
}

/** Barcode bars for a pass: [x, width] pairs across 216 units, seeded by the pass hash. */
export function bars(seed: number) {
  let s = seed || 1;
  const out: [number, number][] = [];
  let x = 0;
  while (x < 216) {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    const w = 1 + (s % 3), gap = 1 + ((s >>> 4) % 3);
    out.push([x, w]);
    x += w + gap;
  }
  return out;
}

export const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w.match(/[\p{L}\p{N}]/u)?.[0] ?? "")
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "YOU";

export const whereLabel = (p: PlaceId) => (p === "mbs" ? "Marina Bay Sands" : p === "city" ? "Singapore, your pick" : "Video call");

/** Everything the pass shows, resolved from the request's ids. */
export function describe(r: MeetingRequest) {
  const day = DAYS.find((d) => d.id === r.day)!;
  const win = WINDOWS.find((w) => w.id === r.win)!;
  const place = PLACES.find((p) => p.id === r.place)!;
  const topics = TOPICS.filter((t) => r.topics.includes(t.id));
  return { day, win, place, topics, where: whereLabel(r.place), ...passHash(r) };
}
