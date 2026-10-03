import { COMPANY } from "@/content/company";
import { EVENT } from "@/content/token2049";
import { bars, describe, initials, type MeetingRequest } from "./pass";

/* Email for the TOKEN2049 meeting form (app/api/token2049/meeting/route.ts).

   Two messages per request:
   - the visitor gets their meeting pass, the same pass the form previews;
   - the team gets the request, with Reply-To set to the visitor.

   Sent through Resend's HTTP API (no SDK, no dependency). Configure with:
     RESEND_API_KEY        API key from resend.com
     MAIL_FROM             sender on a domain verified in Resend, e.g. "HashX Labs <events@hashxlabs.com>"
     MEETING_NOTIFY_TO     optional, comma-separated; defaults to COMPANY.email
     RESEND_API_URL        optional override (tests, proxies)
   Without the first two the route reports "not configured" and the form
   falls back to opening the visitor's mail app.

   The HTML is table layout with inline styles on purpose: mail clients ignore
   the site's CSS, drop SVG and web fonts, and some drop border-radius, so the
   pass degrades to square corners rather than breaking. */

export type MailConfig = { key: string; from: string; notifyTo: string[]; url: string };

export function mailConfig(): MailConfig | null {
  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.MAIL_FROM?.trim();
  if (!key || !from) return null;
  const notifyTo = (process.env.MEETING_NOTIFY_TO || COMPANY.email)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return { key, from, notifyTo, url: process.env.RESEND_API_URL || "https://api.resend.com/emails" };
}

type Mail = { to: string[]; subject: string; html: string; text: string; replyTo?: string };

export async function sendMail(cfg: MailConfig, m: Mail) {
  const res = await fetch(cfg.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${cfg.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: cfg.from,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: m.text,
      ...(m.replyTo ? { reply_to: m.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`mail provider answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
const multiline = (s: string) => esc(s).replace(/\r?\n/g, "<br>");

const C = { ink: "#0b1220", mid: "#4a5568", lo: "#7b8494", line: "#e6e8ec", line2: "#d3d7de", blue: "#0057d9", cyan: "#8cf4ff", page: "#eef2f9" };
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";
const SITE = "https://www.hashxlabs.com";

const wordmark = (color: string, size: number, x: string = C.blue) =>
  `<span style="font-family:${FONT};font-weight:800;font-size:${size}px;letter-spacing:-.5px;color:${color}">HASH<span style="color:${x}">X</span>LABS</span>`;

const shell = (title: string, preheader: string, body: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px">${esc(preheader)}${"&zwnj;&nbsp;".repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${C.page}" style="background:${C.page}"><tr><td align="center" style="padding:28px 14px 40px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">${body}</table>
</td></tr></table></body></html>`;

/* ── The pass ─────────────────────────────────────────────────────── */

function passHtml(r: MeetingRequest) {
  const d = describe(r);
  const code = bars(d.h);
  const barcode = code
    .map(([x, w], i) => {
      const next = code[i + 1];
      const gap = next ? next[0] - (x + w) : 0;
      return (
        `<td width="${w}" bgcolor="${C.ink}" style="width:${w}px;height:34px;font-size:0;line-height:0;background:${C.ink}">&nbsp;</td>` +
        (gap ? `<td width="${gap}" style="width:${gap}px;font-size:0;line-height:0">&nbsp;</td>` : "")
      );
    })
    .join("");
  const label = (t: string) => `<div style="font-family:${MONO};font-size:9.5px;letter-spacing:1.4px;text-transform:uppercase;color:${C.lo}">${t}</div>`;
  const value = (t: string) => `<div style="margin-top:4px;font-family:${FONT};font-size:15px;font-weight:600;letter-spacing:-.1px;color:${C.ink}">${t}</div>`;
  const cell = (l: string, v: string, span = 1) => `<td valign="top" width="${span === 2 ? "100%" : "50%"}" colspan="${span}" style="padding:0 0 14px">${label(l)}${value(v)}</td>`;

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;margin:0 auto;border-collapse:separate;border-radius:20px;background:#ffffff;box-shadow:0 12px 40px rgba(0,60,170,.18)">
<tr><td bgcolor="${C.blue}" style="padding:16px 22px;border-radius:20px 20px 0 0;background:${C.blue};background-image:linear-gradient(120deg,#0047b3,#0057d9 45%,#49c6ff)">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td>${wordmark("#ffffff", 18, C.cyan)}</td>
<td align="right" style="font-family:${MONO};font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;color:#ffffff">Meeting pass</td>
</tr></table></td></tr>
<tr><td style="padding:20px 22px 6px">
<div style="font-family:${MONO};font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:${C.lo}">TOKEN2049 Singapore &middot; 2026</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr>
<td valign="middle" style="font-family:${FONT}"><div style="font-size:32px;font-weight:800;line-height:1;letter-spacing:-1px;color:${C.ink}">${esc(initials(r.name))}</div><div style="margin-top:4px;font-size:12px;color:${C.mid}">${esc(oneLine(r.name))}</div></td>
<td valign="middle" style="padding:0 14px"><div style="border-top:2px dashed ${C.line2};height:0;font-size:0;line-height:0">&nbsp;</div></td>
<td valign="middle" align="right" style="font-family:${FONT}"><div style="font-size:32px;font-weight:800;line-height:1;letter-spacing:-1px;color:${C.ink}">HXL</div><div style="margin-top:4px;font-size:12px;color:${C.mid}">HashX Labs</div></td>
</tr></table>
<div style="margin:18px 0 16px;border-top:1px dashed ${C.line2};height:0;font-size:0;line-height:0">&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>${cell("Date", `${d.day.dow} ${d.day.date}`)}${cell("Window &middot; SGT", d.win.time)}</tr>
<tr>${cell("Where", esc(d.where))}${cell("Company", esc(oneLine(r.company)) || "&mdash;")}</tr>
<tr>${cell("Agenda", d.topics.length ? d.topics.map((t) => esc(t.short)).join(" &middot; ") : "Open agenda", 2)}</tr>
</table></td></tr>
<tr><td style="padding:0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="12" style="width:12px;height:24px;background:${C.page};border-radius:0 12px 12px 0;font-size:0;line-height:0">&nbsp;</td>
<td valign="middle" style="padding:0 8px"><div style="border-top:2px dashed ${C.line2};height:0;font-size:0;line-height:0">&nbsp;</div></td>
<td width="12" style="width:12px;height:24px;background:${C.page};border-radius:12px 0 0 12px;font-size:0;line-height:0">&nbsp;</td>
</tr></table></td></tr>
<tr><td style="padding:12px 22px 20px;border-radius:0 0 20px 20px">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle"><table role="presentation" cellpadding="0" cellspacing="0"><tr>${barcode}</tr></table></td>
<td valign="middle" style="padding-left:14px"><div style="font-family:${MONO};font-size:11px;letter-spacing:1px;color:${C.ink}">${d.id}</div><div style="margin-top:4px;font-family:${FONT};font-size:12px;color:${C.lo}">Request, confirmed by email</div></td>
</tr></table></td></tr></table>`;
}

const firstName = (name: string) => oneLine(name).split(" ")[0];

export function passEmail(r: MeetingRequest) {
  const d = describe(r);
  const subject = `Your TOKEN2049 meeting pass: ${d.day.dow} ${d.day.date}, ${d.win.time} SGT`;
  const next = [
    ["We confirm", "An engineer replies to this email with a time and a place that work for both of us."],
    ["We meet", r.place === "mbs" ? "At Marina Bay Sands on the conference day." : r.place === "city" ? "Somewhere in Singapore that suits you." : "On a video call."],
  ];
  const html = shell(
    subject,
    "Your request is in. An engineer will reply to confirm a time and place.",
    `<tr><td style="padding:0 4px 22px">${wordmark(C.ink, 20)}</td></tr>
<tr><td style="padding:0 4px 22px;font-family:${FONT}">
<h1 style="margin:0;font-size:26px;line-height:1.15;letter-spacing:-.8px;color:${C.ink}">Your meeting pass is ready</h1>
<p style="margin:14px 0 0;font-size:15.5px;line-height:1.6;color:${C.mid}">Hi ${esc(firstName(r.name))}, thanks for your request. We are in Singapore for TOKEN2049 from ${esc(EVENT.ourDates.replace(" 2026", ""))}, and your pass is below. An engineer will reply to confirm the time and place.</p>
</td></tr>
<tr><td style="padding:0 0 26px">${passHtml(r)}</td></tr>
<tr><td style="padding:0 4px 8px;font-family:${FONT}">
<div style="font-size:15px;font-weight:600;color:${C.ink}">What happens next</div>
${next.map(([t, x], i) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px"><tr><td valign="top" width="28" style="width:28px"><div style="width:22px;height:22px;border-radius:50%;background:${C.blue};color:#fff;font-size:12px;font-weight:600;line-height:22px;text-align:center">${i + 1}</div></td><td style="font-size:14.5px;line-height:1.55;color:${C.mid}"><b style="color:${C.ink}">${t}.</b> ${x}</td></tr></table>`).join("")}
<p style="margin:18px 0 0;font-size:14.5px;line-height:1.55;color:${C.mid}">Need to change something? Reply to this email and we will update it.</p>
</td></tr>
<tr><td style="padding:26px 4px 0;font-family:${FONT};font-size:12.5px;line-height:1.6;color:${C.lo}">
<div style="border-top:1px solid ${C.line2};padding-top:16px">HashX Labs &middot; blockchain and AI engineering<br><a href="mailto:${COMPANY.email}" style="color:${C.lo}">${COMPANY.email}</a> &middot; <a href="${SITE}/token2049" style="color:${C.lo}">hashxlabs.com/token2049</a></div>
<p style="margin:12px 0 0">You are receiving this because this address was used on hashxlabs.com/token2049 to request a meeting. If that was not you, ignore this email: nothing else will be sent.</p>
</td></tr>`
  );
  const text = [
    "Your TOKEN2049 meeting pass",
    "",
    `Hi ${firstName(r.name)}, thanks for your request. An engineer will reply to confirm the time and place.`,
    "",
    `PASS ${d.id}`,
    `Date:     ${d.day.dow} ${d.day.date} 2026`,
    `Window:   ${d.win.time} SGT`,
    `Where:    ${d.where}`,
    `Company:  ${oneLine(r.company) || "-"}`,
    `Agenda:   ${d.topics.length ? d.topics.map((t) => t.short).join(", ") : "Open agenda"}`,
    "",
    "What happens next",
    ...next.map(([t, x], i) => `${i + 1}. ${t}. ${x}`),
    "",
    "Need to change something? Reply to this email.",
    "",
    `HashX Labs, ${COMPANY.email}, ${SITE}/token2049`,
    "You are receiving this because this address was used on hashxlabs.com/token2049 to request a meeting. If that was not you, ignore this email.",
  ].join("\n");
  return { subject, html, text };
}

/* ── The team's copy ──────────────────────────────────────────────── */

export function teamEmail(r: MeetingRequest) {
  const d = describe(r);
  const who = oneLine(r.name) + (oneLine(r.company) ? ` (${oneLine(r.company)})` : "");
  const subject = `TOKEN2049 meeting request: ${who}, ${d.day.dow} ${d.day.date}`;
  const received = `${new Date().toLocaleString("en-GB", { timeZone: "Asia/Singapore", dateStyle: "medium", timeStyle: "short" })} SGT`;
  const rows: [string, string, string][] = [
    ["Name", esc(oneLine(r.name)), oneLine(r.name)],
    ["Email", `<a href="mailto:${esc(r.email)}" style="color:${C.blue}">${esc(r.email)}</a>`, r.email],
    ["Company", esc(oneLine(r.company)) || "&mdash;", oneLine(r.company) || "-"],
    ["Day", `${d.day.dow} ${d.day.date} 2026${d.day.conference ? " (TOKEN2049 conference day)" : ""}`, `${d.day.dow} ${d.day.date} 2026${d.day.conference ? " (TOKEN2049 conference day)" : ""}`],
    ["Window", `${d.win.label}, ${d.win.time} SGT`, `${d.win.label}, ${d.win.time} SGT`],
    ["Where", `${esc(d.place.label)} (${esc(d.place.detail)})`, `${d.place.label} (${d.place.detail})`],
    ["Topics", d.topics.length ? d.topics.map((t) => esc(t.title)).join(", ") : "Open agenda", d.topics.length ? d.topics.map((t) => t.title).join(", ") : "Open agenda"],
    ["Note", r.note.trim() ? multiline(r.note.trim()) : "&mdash;", r.note.trim() || "-"],
    ["Pass", `<span style="font-family:${MONO}">${d.id}</span>`, d.id],
  ];
  const html = shell(
    subject,
    `${who} wants to meet on ${d.day.dow} ${d.day.date}.`,
    `<tr><td style="padding:0 4px 18px">${wordmark(C.ink, 18)}</td></tr>
<tr><td style="padding:24px;border-radius:14px;background:#ffffff;font-family:${FONT}">
<div style="font-family:${MONO};font-size:10.5px;letter-spacing:1.4px;text-transform:uppercase;color:${C.blue}">New meeting request &middot; TOKEN2049</div>
<h1 style="margin:10px 0 0;font-size:22px;line-height:1.2;letter-spacing:-.5px;color:${C.ink}">${esc(who)}</h1>
<p style="margin:6px 0 0;font-size:14px;color:${C.mid}">${d.day.dow} ${d.day.date}, ${d.win.time} SGT &middot; ${esc(d.place.label)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid ${C.line}">
${rows.map(([k, v]) => `<tr><td valign="top" width="96" style="padding:10px 12px 10px 0;border-bottom:1px solid ${C.line};font-family:${MONO};font-size:10.5px;letter-spacing:1.2px;text-transform:uppercase;color:${C.lo}">${k}</td><td valign="top" style="padding:10px 0;border-bottom:1px solid ${C.line};font-size:14.5px;line-height:1.5;color:${C.ink}">${v}</td></tr>`).join("")}
</table>
<p style="margin:18px 0 0;font-size:14px;line-height:1.55;color:${C.mid}">Reply to this email to answer ${esc(firstName(r.name))} directly: the reply goes to ${esc(r.email)}. The pass was emailed to them as a receipt.</p>
<p style="margin:10px 0 0;font-size:12.5px;color:${C.lo}">Received ${esc(received)}</p>
</td></tr>`
  );
  const text = [
    "New TOKEN2049 meeting request",
    "",
    ...rows.map(([k, , t]) => `${k}: ${t}`),
    "",
    `Reply to this email to answer ${firstName(r.name)} directly (goes to ${r.email}).`,
    `Received ${received}`,
  ].join("\n");
  return { subject, html, text };
}
