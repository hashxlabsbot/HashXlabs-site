"use client";

import { useEffect, useState } from "react";

/** "Today" / "Done" tag for a day card, from the visitor's clock (the server
 *  render shows nothing, so the static page never claims a stale state). */
export default function DayState({ from, to }: { from: string; to: string }) {
  const [state, setState] = useState<"today" | "done" | null>(null);

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      setState(now > Date.parse(to) ? "done" : now >= Date.parse(from) ? "today" : null);
    };
    const id = setInterval(tick, 60_000);
    const raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [from, to]);

  if (!state) return null;
  return <span className={`t49-daystate t49-daystate-${state}`}>{state === "today" ? "Today" : "Done"}</span>;
}
