import { DAYS, PLACES, TOPICS, WINDOWS } from "@/content/token2049";
import { mailConfig, passEmail, sendMail, teamEmail } from "@/lib/token2049/mail";
import { describe, isConf, type MeetingRequest } from "@/lib/token2049/pass";

/* POST /api/token2049/meeting: the meeting form's endpoint.

   Sends the team a notification first (so a request is never lost), then
   emails the visitor their pass as a receipt. The response says whether the
   pass went out. Anything that stops the team email (no mail config, provider
   error) answers with an error status, and the form falls back to opening the
   visitor's mail app.

   Abuse guards, since this sends mail to an address the visitor typed:
   same-origin check, a honeypot field, strict validation against the page's
   own lists, and small in-memory rate limits per IP and per recipient. The
   limits are per server instance (they reset on a cold start); they stop
   casual abuse, not a determined one. */

const json = (body: Record<string, unknown>, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const EMAIL_RE = /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[^\s@<>"',;]+$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "");

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 2000) for (const [k, v] of hits) if (now - v[v.length - 1] > 3_600_000) hits.delete(k);
  return false;
}

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser client: the limits below still apply
  try {
    const host = new URL(origin).host;
    return host === req.headers.get("host") || host === req.headers.get("x-forwarded-host");
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ error: "forbidden" }, 403);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid" }, 400);
  }

  // Honeypot: real visitors never see this field. Answer as if it worked.
  if (clean(body.website, 200)) return json({ ok: true, passSent: true });

  const r: MeetingRequest = {
    name: clean(body.name, 80),
    email: clean(body.email, 120).toLowerCase(),
    company: clean(body.company, 100),
    day: clean(body.day, 4) as MeetingRequest["day"],
    win: clean(body.win, 4) as MeetingRequest["win"],
    place: clean(body.place, 6) as MeetingRequest["place"],
    topics: Array.isArray(body.topics) ? body.topics.filter((t): t is string => typeof t === "string" && TOPICS.some((x) => x.id === t)).slice(0, TOPICS.length) : [],
    note: clean(body.note, 1500),
  };
  const valid =
    r.name.length > 0 &&
    EMAIL_RE.test(r.email) &&
    DAYS.some((d) => d.id === r.day) &&
    WINDOWS.some((w) => w.id === r.win) &&
    PLACES.some((p) => p.id === r.place) &&
    !(r.place === "mbs" && !isConf(r.day)); // the venue is only open on the conference days
  if (!valid) return json({ error: "invalid" }, 400);
  r.topics = [...new Set(r.topics)];

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (limited(`ip:${ip}`, 6, 10 * 60_000) || limited(`to:${r.email}`, 3, 60 * 60_000)) return json({ error: "rate-limited" }, 429);

  const cfg = mailConfig();
  if (!cfg) {
    console.warn("[token2049] RESEND_API_KEY / MAIL_FROM are not set; the form falls back to mailto.");
    return json({ error: "not-configured" }, 503);
  }

  const { id } = describe(r);

  try {
    const team = teamEmail(r);
    await sendMail(cfg, { to: cfg.notifyTo, subject: team.subject, html: team.html, text: team.text, replyTo: r.email });
  } catch (e) {
    console.error(`[token2049] team notification failed for ${id}:`, e instanceof Error ? e.message : e);
    return json({ error: "mail-failed" }, 502);
  }

  let passSent = true;
  try {
    const pass = passEmail(r);
    await sendMail(cfg, { to: [r.email], subject: pass.subject, html: pass.html, text: pass.text });
  } catch (e) {
    passSent = false;
    console.error(`[token2049] pass email failed for ${id}:`, e instanceof Error ? e.message : e);
  }

  return json({ ok: true, passSent, id });
}
