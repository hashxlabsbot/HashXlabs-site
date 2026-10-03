import { page, ic, avatar, strip } from "./parts.mjs";

const docs = [
  ["Carrier manual v3.pdf", "Section 4.2 · page 18", "1", true, [88, 100, 62]],
  ["Email · Port delays", "Thread · 4 messages", "2", true, [92, 70, 84]],
  ["SOP · Re-booking", "Procedure · 2 pages", "", false, [76, 90, 58]],
];

const css = `
.bub { border-radius:16px; padding:14px 18px; font-size:18px; line-height:1.4; }
.bub.u { margin:14px 0 0 auto; width:330px; color:#fff; background:linear-gradient(180deg,#1a6bff,#0058f5); box-shadow:0 8px 16px -8px rgba(0,88,245,.5); border-bottom-right-radius:6px; }
.bub.a { margin-top:12px; background:#f6f9fe; border:1.5px solid #e4edf9; border-bottom-left-radius:6px; padding:16px 18px 16px; }
.cites { display:flex; gap:10px; margin-top:12px; }
.cite { display:inline-flex; align-items:center; gap:8px; height:32px; padding:0 11px; border-radius:9px; background:#e8f0fe; color:var(--blue); font-size:14.5px; font-weight:600; } .cite i { font-style:normal; display:grid; place-items:center; width:20px; height:20px; border-radius:6px; background:var(--blue); color:#fff; font-size:12.5px; }
.trace { margin-top:12px; padding:2px 18px; } .tr { display:flex; align-items:center; gap:12px; height:42px; font-size:16.5px; border-bottom:1px solid #e8eff9; } .tr:last-child { border-bottom:0; color:var(--mute); } .tr .ok { display:grid; place-items:center; width:22px; height:22px; border-radius:50%; background:#e2f6ec; color:#12a566; } .tr .ok .ic { width:14px; height:14px; stroke-width:2.6; }
.draft { display:flex; align-items:center; gap:12px; margin-top:16px; font-size:16px; color:var(--mute); } .dots { display:flex; gap:5px; } .dots i { width:8px; height:8px; border-radius:50%; background:#8fb4f5; } .dots i:nth-child(2) { background:#5b94f7; } .dots i:nth-child(3) { background:#0a5cff; }
.compose { position:absolute; left:26px; right:26px; bottom:26px; height:64px; display:flex; align-items:center; gap:12px; padding:0 8px 0 18px; font-size:17px; color:#6878a6; } .compose .send { margin-left:auto; display:grid; place-items:center; width:48px; height:48px; border-radius:12px; color:#fff; background:linear-gradient(180deg,#1a6bff,#0058f5); } .compose .send .ic { width:22px; height:22px; }
.seg { display:flex; margin-top:14px; padding:4px; height:46px; border-radius:12px; background:#eef3fb; } .seg span { flex:1; display:grid; place-items:center; border-radius:9px; font-size:16.5px; font-weight:600; color:var(--mute); } .seg span.on { background:#fff; color:var(--blue); box-shadow:0 1px 2px rgba(20,50,110,.08), 0 3px 8px rgba(40,90,190,.1); }
.doc { display:flex; gap:14px; align-items:flex-start; margin-top:12px; padding:14px 16px; height:112px; } .doc.dim { opacity:.62; }
.doc .rb { display:grid; place-items:center; width:46px; height:46px; border-radius:12px; background:#eaf2fe; color:var(--blue); flex:none; } .doc .rb .ic { width:23px; height:23px; }
.doc .t { flex:1; min-width:0; } .doc .t b { display:block; font-size:18px; font-weight:600; white-space:nowrap; } .doc .t span.m { display:block; font-size:15px; color:var(--mute); margin-top:1px; }
.ln { height:8px; border-radius:4px; background:#e3ebf8; margin-top:9px; } .ln.hl { background:#b9d4ff; }
.prop { margin-top:16px; padding:18px 20px; } .prop h4 { font-size:19.5px; font-weight:650; } .prop .by { font-size:15.5px; color:var(--mute); margin-top:3px; }
.diff { margin-top:14px; } .drow { display:flex; align-items:center; gap:10px; height:44px; font-size:17px; border-top:1px solid #e8eff9; } .drow .k { width:74px; color:var(--mute); } .drow s { color:#8a97b3; } .drow .ic { width:18px; height:18px; color:#8a97b3; } .drow b { color:var(--blue); font-weight:650; }
.note { display:flex; align-items:center; gap:14px; margin-top:16px; padding:0 18px; height:76px; border-radius:14px; background:#eef4ff; border:1.5px solid #dbe7fd; color:#16367a; font-size:16.5px; line-height:1.35; font-weight:500; } .note .ic { color:var(--blue); width:26px; height:26px; }
.btns { display:flex; gap:12px; position:absolute; left:26px; right:26px; bottom:26px; } .btns .btn { flex:1; }
`;

export default page({
  title: "Retrieval assistant",
  nav: [["chat", "Chat"], ["db", "Sources"], ["inbox", "Review"], ["flask", "Evals"], ["clock", "History"], ["layers", "Tools"], ["sliders", "Settings"]],
  active: "Chat",
  search: "Search documents, shipments, or questions…",
  wallet: `${ic("building")}Operations`,
  css,
  body: `
  <div class="card c1"><div class="ch"><span>Assistant</span>${ic("sliders")}</div>
    <div class="bub u">Why is shipment SH-1042 late at Rotterdam?</div>
    <div class="bub a">Held at customs on 12 Sep. The carrier manual requires re-booking within 48 hours.
      <div class="cites"><span class="cite"><i>1</i>Carrier manual</span><span class="cite"><i>2</i>Port delays</span></div></div>
    <div class="trace field"><div class="tr"><span class="ok">${ic("check")}</span>Searched manuals and emails</div><div class="tr"><span class="ok">${ic("check")}</span>Read 2 sources, kept the citations</div><div class="tr"><span class="dots"><i></i><i></i><i></i></span>Drafting an update for the ERP</div></div>
    <div class="compose field">Ask about manuals, emails, or shipments…<span class="send">${ic("send")}</span></div></div>

  <div class="card c2"><div class="ch"><span>Sources</span><span class="badge info">${ic("layers")}Hybrid</span></div>
    <div class="seg"><span>Vector</span><span>Keyword</span><span class="on">Hybrid</span></div>
    ${docs.map(([t, m, n, cited, w]) => `<div class="doc field ${cited ? "" : "dim"}"><span class="rb">${ic("file")}</span><div class="t"><b>${t}</b><span class="m">${m}</span>${w.map((x, i) => `<div class="ln ${cited && i === 1 ? "hl" : ""}" style="width:${x}%"></div>`).join("")}</div>${cited ? `<span class="cite"><i>${n}</i>Cited</span>` : `<span class="badge mute">Not used</span>`}</div>`).join("")}</div>

  <div class="card c3"><div class="ch"><span>Approval queue</span><span class="badge warn">${ic("clock")}1 pending</span></div>
    <div class="prop field"><h4>Update shipment SH-1042</h4><div class="by">Proposed by the assistant</div>
      <div class="diff"><div class="drow"><span class="k">ETA</span><s>14 Sep</s>${ic("arrow")}<b>16 Sep</b></div><div class="drow"><span class="k">Status</span><s>On hold</s>${ic("arrow")}<b>Re-booked</b></div><div class="drow"><span class="k">Sources</span><span class="cite"><i>1</i>Manual</span><span class="cite"><i>2</i>Email</span></div></div></div>
    <div class="note">${ic("lock")}Read-only by default. Every write to the ERP waits for a person.</div>
    <div class="btns"><div class="btn p">Approve</div><div class="btn s">Reject</div></div></div>

  ${strip({
    title: "Pipeline", sub: "From a question to an approved change, with sources at every step",
    left: { icon: `<span class="av" style="width:62px;height:62px;background:#eaf2fe;color:#0a5cff">${ic("chat")}</span>`, name: "Question", meta: "Natural language", status: "Received" },
    right: { icon: `<span class="av" style="width:62px;height:62px;background:#fff3da;color:#b06f08">${ic("shieldcheck")}</span>`, name: "Approval", meta: "A person signs off", status: "Waiting", tone: "amber" },
    labels: ["Retriever", "Agent", "Citations"], pill: ["Waiting for approval", "No write until approved"],
  })}`,
});
