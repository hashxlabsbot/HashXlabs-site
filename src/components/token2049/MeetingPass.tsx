"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent } from "react";
import HashXLogo from "@/components/HashXLogo";
import { COMPANY } from "@/content/company";
import { DAYS, PLACES, TOPICS, WINDOWS, type DayId, type PlaceId, type WindowId } from "@/content/token2049";
import { bars, describe, initials, isConf } from "@/lib/token2049/pass";
import { PICK_EVENT, type Pick } from "./pick";

/* "Request a meeting": a form beside a pass that fills in as you type.
   There is no backend, so sending prepares the request as an email to
   COMPANY.email and redirects to the visitor's own mail app (mailto:), with
   copy-to-clipboard as a fallback for visitors without a mail app, exactly
   like the contact form. The pass ID and barcode are a hash of the request
   itself, not a booking reference (lib/token2049/pass.ts). */

export default function MeetingPass() {
  const [day, setDay] = useState<DayId>("07");
  const [win, setWin] = useState<WindowId>("pm");
  const [place, setPlace] = useState<PlaceId>("mbs");
  const [topics, setTopics] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // the prepared email text, once sent
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(0);
  const ticket = useRef<HTMLDivElement>(null);

  const chooseDay = (d: DayId) => {
    setDay(d);
    if (!isConf(d)) setPlace((p) => (p === "mbs" ? "city" : p));
  };

  // Day and topic cards elsewhere on the page preselect the pass.
  useEffect(() => {
    const on = (e: Event) => {
      const p = (e as CustomEvent<Pick>).detail;
      if (p.day) {
        setDay(p.day);
        if (!isConf(p.day)) setPlace((v) => (v === "mbs" ? "city" : v));
      }
      if (p.topic) setTopics((v) => (v.includes(p.topic!) ? v : [...v, p.topic!]));
      setFlash((f) => f + 1);
    };
    window.addEventListener(PICK_EVENT, on);
    return () => window.removeEventListener(PICK_EVENT, on);
  }, []);

  const { day: dayInfo, win: winInfo, place: placeInfo, topics: topicLabels, where, h, id } = describe({ name, email, company, day, win, place, topics, note });
  const passId = { h, id };
  const code = useMemo(() => bars(h), [h]);

  // Editing after sending starts a fresh request.
  useEffect(() => {
    setMessage(null);
  }, [name, email, company, day, win, place, topics, note]);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const nameOk = name.trim().length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (!nameOk || !emailOk) return;
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      company.trim() ? `Company / project: ${company.trim()}` : null,
      "",
      `Day: ${dayInfo.dow} ${dayInfo.date} 2026${dayInfo.conference ? " (TOKEN2049 conference day)" : ""}`,
      `Time: ${winInfo.label}, ${winInfo.time} SGT`,
      `Where: ${placeInfo.label} (${placeInfo.detail})`,
      `Topics: ${topicLabels.length ? topicLabels.map((t) => t.title).join(", ") : "Open agenda"}`,
      "",
      note.trim() || null,
      note.trim() ? "" : null,
      `Pass: ${passId.id}`,
    ]
      .filter((l) => l !== null)
      .join("\n");
    setMessage(body);
    setCopied(false);
    const subject = `TOKEN2049 meeting: ${name.trim()}${company.trim() ? ` (${company.trim()})` : ""}, ${dayInfo.dow} ${dayInfo.date}`;
    window.location.href = `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Gentle 3D tilt of the pass under a mouse.
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ticket.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    ticket.current.style.setProperty("--rx", `${(-y * 8).toFixed(2)}deg`);
    ticket.current.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
    ticket.current.style.setProperty("--gx", `${((x + 0.5) * r.width).toFixed(0)}px`);
  };
  const untilt = () => {
    ticket.current?.style.setProperty("--rx", "0deg");
    ticket.current?.style.setProperty("--ry", "0deg");
  };

  const chip = (on: boolean) => `t49-opt ${on ? "is-on" : ""}`;

  return (
    <div className="t49-meet-grid">
      {/* ── Form ── */}
      <form onSubmit={submit} noValidate className="t49-form" aria-describedby="t49-form-note">
        <fieldset className="t49-step">
          <legend>
            <span className="t49-step-n">01</span> Pick a day
          </legend>
          <div className="t49-days">
            {DAYS.map((d) => (
              <button key={d.id} type="button" aria-pressed={day === d.id} onClick={() => chooseDay(d.id)} className={`${chip(day === d.id)} t49-day`}>
                <span className="t49-mono">{d.dow}</span>
                <b>{d.id}</b>
                <span className="t49-day-tag">{d.conference ? "TOKEN2049" : "City"}</span>
              </button>
            ))}
          </div>
          <div className="t49-row3 mt-3">
            {WINDOWS.map((w) => (
              <button key={w.id} type="button" aria-pressed={win === w.id} onClick={() => setWin(w.id)} className={chip(win === w.id)}>
                <b>{w.label}</b>
                <span className="t49-mono">{w.time}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="t49-step">
          <legend>
            <span className="t49-step-n">02</span> Where
          </legend>
          <div className="t49-row3">
            {PLACES.map((p) => {
              const off = p.id === "mbs" && !isConf(day);
              return (
                <button
                  key={p.id}
                  type="button"
                  disabled={off}
                  aria-pressed={place === p.id}
                  title={off ? "The venue is open on the conference days, 7 and 8 October" : undefined}
                  onClick={() => setPlace(p.id)}
                  className={chip(place === p.id)}
                >
                  <b>{p.label}</b>
                  <span className="t49-mono">{off ? "7–8 Oct only" : p.detail}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="t49-step">
          <legend>
            <span className="t49-step-n">03</span> What should we dig into?
          </legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = topics.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setTopics((v) => (on ? v.filter((x) => x !== t.id) : [...v, t.id]))}
                  className={`t49-pill ${on ? "is-on" : ""}`}
                >
                  {t.title}
                </button>
              );
            })}
          </div>
          <label className="mt-3 grid gap-1.5">
            <span className="sr-only">Anything we should read first?</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="t49-field resize-y"
              placeholder="Anything we should know or read first? A repo, a spec, a worry."
            />
          </label>
        </fieldset>

        <fieldset className="t49-step">
          <legend>
            <span className="t49-step-n">04</span> You
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="t49-label">
                Name <span aria-hidden="true">*</span>
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                aria-invalid={tried && !nameOk}
                className="t49-field"
                placeholder="Jane Doe"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="t49-label">
                Email <span aria-hidden="true">*</span>
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                autoComplete="email"
                required
                aria-invalid={tried && !emailOk}
                className="t49-field"
                placeholder="jane@protocol.xyz"
              />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="t49-label">Company or project</span>
              <input value={company} onChange={(e) => setCompany(e.target.value)} autoComplete="organization" className="t49-field" placeholder="Optional" />
            </label>
          </div>
        </fieldset>

        {tried && (!nameOk || !emailOk) && (
          <p role="alert" className="t49-error">
            {!nameOk && !emailOk ? "Add your name and a valid email so we can reply." : !nameOk ? "Add your name so we know who to look for." : "That email doesn't look right."}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="btn btn-primary t49-send">
            Send meeting request <span className="arr" aria-hidden="true">→</span>
          </button>
          <p id="t49-form-note" className="t49-form-note">
            Opens your email app with the request written out. We reply to confirm a time and place.
          </p>
        </div>

        {message && (
          <div className="t49-sent" role="status">
            <b>Your email app should now be open.</b> Your request is ready to send to {COMPANY.email}. If nothing opened, copy it and email us directly.
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-ink btn-sm"
                onClick={() => navigator.clipboard?.writeText(message).then(() => setCopied(true), () => setCopied(false))}
              >
                {copied ? "Copied" : "Copy request"}
              </button>
              <a className="btn btn-outline-light btn-sm" href={`mailto:${COMPANY.email}`}>
                {COMPANY.email}
              </a>
            </div>
          </div>
        )}
      </form>

      {/* ── Live pass ── */}
      <div className="t49-pass-wrap" onPointerMove={tilt} onPointerLeave={untilt}>
        <div ref={ticket} key={flash} className={`t49-pass ${flash ? "is-flash" : ""}`} aria-label="Preview of your meeting request">
          <div className="t49-pass-sheen" aria-hidden="true" />
          <div className="t49-pass-main">
            <div className="t49-pass-top">
              <HashXLogo className="h-5 w-auto" />
              <span className="t49-mono">Meeting pass</span>
            </div>
            <div className="t49-pass-body">
              <p className="t49-mono t49-pass-ev">TOKEN2049 Singapore · 2026</p>
              <div className="t49-route">
                <div>
                  <b>{initials(name)}</b>
                  <span>{name.trim() || "Your name"}</span>
                </div>
                <div className="t49-route-line" aria-hidden="true">
                  <i />
                </div>
                <div className="text-right">
                  <b>HXL</b>
                  <span>HashX Labs</span>
                </div>
              </div>
              <dl className="t49-pass-grid">
                <div>
                  <dt>Date</dt>
                  <dd key={day} className="t49-pop">
                    {dayInfo.dow} {dayInfo.date}
                  </dd>
                </div>
                <div>
                  <dt>Window · SGT</dt>
                  <dd key={win} className="t49-pop">
                    {winInfo.time}
                  </dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd key={place} className="t49-pop">
                    {where}
                  </dd>
                </div>
                <div>
                  <dt>Company</dt>
                  <dd className="truncate">{company.trim() || "—"}</dd>
                </div>
                <div className="col-span-2">
                  <dt>Agenda</dt>
                  <dd key={topics.join()} className="t49-pop">
                    {topicLabels.length ? topicLabels.map((t) => t.short).join(" · ") : "Open agenda"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="t49-pass-stub">
            <svg viewBox="0 0 216 40" className="t49-code" aria-hidden="true" preserveAspectRatio="none">
              {code.map(([x, w]) => (
                <rect key={x} x={x} y={0} width={w} height={40} />
              ))}
            </svg>
            <div className="t49-stub-meta">
              <span className="t49-mono">{passId.id}</span>
              <span>Request, confirmed by email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
