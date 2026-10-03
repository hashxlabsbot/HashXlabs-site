"use client";

import { useEffect, useState } from "react";
import { EVENT } from "@/content/token2049";

/* One-line event status for the home page band: counts down to doors
   opening, then says where we are, then thanks Singapore. From the visitor's
   clock; the server render shows the plain dates. */

const OPENS = Date.parse(EVENT.opens);
const CLOSES = Date.parse(EVENT.closes);
const LEAVES = Date.parse(EVENT.leaves);

function left(ms: number) {
  const m = Math.max(0, Math.floor(ms / 60000));
  const d = Math.floor(m / 1440), h = Math.floor(m / 60) % 24, mm = m % 60;
  return d ? `${d}d ${h}h ${mm}m` : `${h}h ${mm}m`;
}

export default function MiniCountdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 30_000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  let text = `TOKEN2049 · ${EVENT.conference}`;
  let live = false;
  if (now !== null) {
    if (now < OPENS) text = `Doors open in ${left(OPENS - now)}`;
    else if (now < CLOSES) {
      text = "On now · find us at Marina Bay Sands";
      live = true;
    } else if (now < LEAVES) text = "In Singapore until Sat 10 Oct";
    else text = "Thank you, Singapore";
  }

  return (
    <span className="t49-mini">
      <i className={live ? "is-live" : ""} aria-hidden="true" />
      {text}
    </span>
  );
}
