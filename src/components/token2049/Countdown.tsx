"use client";

import { useEffect, useState } from "react";
import { DAYS, EVENT } from "@/content/token2049";

/* Hero panel: a countdown to doors opening, which turns into "on now" during
   the conference and a thank-you after we leave; the week as four blocks with
   a marker for now; and the time in Singapore. All from the visitor's clock.
   The server render shows dashes, so the static HTML never states a time. */

const OPENS = Date.parse(EVENT.opens);
const CLOSES = Date.parse(EVENT.closes);
const ARRIVES = Date.parse(EVENT.arrives);
const LEAVES = Date.parse(EVENT.leaves);
const CONF = DAYS.filter((d) => d.conference); // the two conference days, in order
const DAY2 = Date.parse(CONF[1].from);

const sgt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
const pad = (n: number) => String(Math.max(0, n)).padStart(2, "0");

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
}

/** Each digit re-mounts when it changes, so it plays a short roll-in. */
function Digits({ value }: { value: string }) {
  return (
    <span className="t49-digits">
      {value.split("").map((ch, i) => (
        <span key={`${i}-${ch}`} className="t49-digit">
          {ch}
        </span>
      ))}
    </span>
  );
}

function offsetLabel(now: number) {
  const mine = -new Date(now).getTimezoneOffset(); // minutes east of UTC
  const diff = 8 * 60 - mine;
  if (diff === 0) return "You are on Singapore time";
  const h = Math.floor(Math.abs(diff) / 60), m = Math.abs(diff) % 60;
  const amount = `${h ? `${h}h` : ""}${h && m ? " " : ""}${m ? `${m}m` : ""}`;
  return diff > 0 ? `${amount} ahead of you` : `${amount} behind you`;
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  let label = "TOKEN2049 opens in";
  let target = OPENS;
  let note = "Doors 07:30 SGT · Wed 7 Oct";
  if (now !== null && now >= OPENS && now < CLOSES) {
    const day = now >= DAY2 ? 2 : 1;
    const start = Date.parse(CONF[day - 1].from);
    const open = start + 7.5 * 3600_000, shut = start + 18 * 3600_000; // 07:30–18:00 SGT
    if (now < open) {
      label = `Day ${day} opens in`;
      target = open;
    } else if (now < shut) {
      label = `Day ${day} of 2 · doors close in`;
      target = shut;
    } else {
      label = "Day 2 opens in";
      target = DAY2 + 7.5 * 3600_000;
    }
    note = "Find us at Marina Bay Sands";
  } else if (now !== null && now >= CLOSES && now < LEAVES) {
    label = "Still in Singapore for";
    target = LEAVES;
    note = "Meetings across the city until Sat 10 Oct";
  } else if (now !== null && now >= LEAVES) {
    label = "That's a wrap";
    target = now;
    note = "Thank you, Singapore. The conversation continues online.";
  }

  const parts = now === null ? null : split(target - now);
  const cells: [string, string][] = [
    ["Days", parts ? pad(parts[0]) : "--"],
    ["Hours", parts ? pad(parts[1]) : "--"],
    ["Min", parts ? pad(parts[2]) : "--"],
    ["Sec", parts ? pad(parts[3]) : "--"],
  ];
  const progress = now === null ? 0 : Math.min(1, Math.max(0, (now - ARRIVES) / (LEAVES - ARRIVES)));

  return (
    <div className="t49-count" role="group" aria-label="Countdown to TOKEN2049 Singapore">
      <div className="t49-count-a">
        <div className="t49-count-head">
          <span className="t49-mono">{label}</span>
          <span className="t49-count-chip t49-mono">SGT</span>
        </div>
        <p className="t49-count-note">{note}</p>
      </div>

      <div className="t49-count-grid t49-count-b" aria-live="off">
        {cells.map(([k, v]) => (
          <div key={k} className="t49-count-cell">
            <Digits value={v} />
            <span className="t49-mono t49-count-unit">{k}</span>
          </div>
        ))}
      </div>

      <div className="t49-count-c">
        <div className="t49-week" aria-label="Our week in Singapore">
          <div className="t49-week-track">
            {DAYS.map((d) => (
              <span key={d.id} className={`t49-week-seg ${d.conference ? "is-conf" : ""}`} />
            ))}
            <span className="t49-week-fill" style={{ transform: `scaleX(${progress})` }} />
            {now !== null && progress > 0 && progress < 1 && <span className="t49-week-now" style={{ left: `${progress * 100}%` }} />}
          </div>
          <div className="t49-week-labels t49-mono">
            {DAYS.map((d) => (
              <span key={d.id} className={d.conference ? "is-conf" : ""}>
                {d.id}
              </span>
            ))}
          </div>
        </div>

        <div className="t49-count-foot">
          <div>
            <span className="t49-mono t49-count-unit">Singapore now</span>
            <span className="t49-clock">{now === null ? "--:--:--" : sgt.format(now)}</span>
          </div>
          <span className="t49-count-off">{now === null ? "\u00a0" : offsetLabel(now)}</span>
        </div>
      </div>
    </div>
  );
}
