import type { DayId } from "@/content/token2049";

/* Day cards and topic cards preselect the meeting pass (MeetingPass.tsx)
   through one window event, so they can live in different sections. */
export type Pick = { day?: DayId; topic?: string };
export const PICK_EVENT = "t49:pick";

export function pick(p: Pick) {
  window.dispatchEvent(new CustomEvent<Pick>(PICK_EVENT, { detail: p }));
  document.getElementById("meet")?.scrollIntoView({ block: "start" });
}
