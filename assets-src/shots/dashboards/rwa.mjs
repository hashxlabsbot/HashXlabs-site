import { page, ic, avatar, tok, strip } from "./parts.mjs";

const rows = [
  ["AK", 212, "Investor 014", "0x7a3…c19e", "ok", "shieldcheck", "Verified", "12.5%"],
  ["RL", 262, "Investor 027", "0x1be…4f02", "ok", "shieldcheck", "Verified", "8.0%"],
  ["MT", 28, "Investor 031", "0x93d…a7c1", "warn", "clock", "Pending", "—"],
  ["JS", 330, "Investor 042", "0xc08…12ab", "ok", "shieldcheck", "Verified", "4.2%"],
  ["NV", 4, "Investor 056", "0x5f1…9d3e", "bad", "x", "Not verified", "—"],
];
const rules = [
  ["shieldcheck", "Verified holders only", "Claims are checked on every transfer", `<i class="tg on"></i>`],
  ["tag", "Jurisdiction allowlist", "EU · UK · SG", `<i class="tg on"></i>`],
  ["users", "Holder limit", "Maximum number of holders", `<span class="badge info">200</span>`],
  ["lock", "Lock-up period", "12 months from issue", `<i class="tg on"></i>`],
  ["key", "Role separation", "Issuer and agent cannot overlap", `<i class="tg on"></i>`],
  ["clock", "Rule changes", "Timelocked for 48 hours", `<i class="tg on"></i>`],
];

const css = `
.hd-row { display:grid; grid-template-columns: 1fr 150px 64px; margin-top:12px; padding:0 4px; font-size:14.5px; font-weight:600; color:var(--mute); letter-spacing:.02em; text-transform:uppercase; height:30px; align-items:center; }
.hd-row span:last-child { text-align:right; }
.trow { display:grid; grid-template-columns: 1fr 150px 64px; align-items:center; height:66px; padding:0 4px; border-bottom:1px solid #edf2fa; }
.trow:last-of-type { border-bottom:0; }
.who { display:flex; align-items:center; gap:14px; } .who b { display:block; font-size:18.5px; font-weight:600; } .who > div > span { display:block; font-size:15px; color:var(--mute); margin-top:2px; }
.trow .held { text-align:right; font-size:18px; font-weight:600; }
.note { text-wrap: balance; display:flex; align-items:center; gap:14px; margin-top:16px; padding:0 18px; height:70px; border-radius:14px; background:#eef4ff; border:1.5px solid #dbe7fd; color:#16367a; font-size:17px; line-height:1.35; font-weight:500; }
.note .ic { color:var(--blue); width:26px; height:26px; }
.rrow { display:flex; align-items:center; gap:16px; height:74px; border-bottom:1px solid #edf2fa; }
.rrow:last-of-type { border-bottom:0; }
.rb { display:grid; place-items:center; width:46px; height:46px; border-radius:12px; background:#eaf2fe; color:var(--blue); flex:none; } .rb .ic { width:24px; height:24px; }
.rrow .t { flex:1; } .rrow .t b { display:block; font-size:19px; font-weight:600; } .rrow .t span { display:block; font-size:15.5px; color:var(--mute); margin-top:2px; }
.donut { position:relative; width:206px; height:206px; margin:10px auto 0; } .donut svg { display:block; } .donut .mid { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
.donut .mid span { font-size:15.5px; color:var(--mute); } .donut .mid b { font-size:30px; font-weight:700; letter-spacing:-.02em; margin-top:2px; }
.kv { display:flex; align-items:center; justify-content:space-between; height:46px; font-size:17.5px; border-bottom:1px solid #edf2fa; } .kv:last-of-type { border-bottom:0; } .kv span { color:var(--mute); } .kv b { font-weight:600; }
.btns { display:flex; gap:12px; position:absolute; left:26px; right:26px; bottom:26px; } .btns .btn { flex:1; }
`;

const donut = (() => {
  const R = 84, C = 2 * Math.PI * R, segs = [[0.42, "#0a5cff"], [0.28, "#3b8dff"], [0.18, "#8cc4ff"], [0.12, "#d3e3fb"]];
  let off = 0, out = "";
  for (const [f, col] of segs) { const len = f * C - 5; out += `<circle cx="103" cy="103" r="${R}" fill="none" stroke="${col}" stroke-width="24" stroke-linecap="butt" stroke-dasharray="${len.toFixed(1)} ${(C - len).toFixed(1)}" stroke-dashoffset="${(-off).toFixed(1)}" transform="rotate(-90 103 103)"/>`; off += f * C; }
  return `<svg width="206" height="206" viewBox="0 0 206 206">${out}</svg>`;
})();

export default page({
  title: "RWA issuer console",
  nav: [["grid", "Overview"], ["building", "Assets"], ["users", "Holders"], ["shieldcheck", "Rules"], ["coins", "Payouts"], ["file", "Files"], ["clock", "Audit"]],
  active: "Holders",
  search: "Search investors, assets, or wallet address…",
  wallet: `${ic("wallet")}0x9f…E4A7`,
  css,
  body: `
  <div class="card c1"><div class="ch"><span>Investor registry</span><span class="sel">All ${ic("chev")}</span></div>
    <div class="hd-row"><span>Investor</span><span>Status</span><span>Held</span></div>
    ${rows.map(([i, h, n, w, k, icn, st, held]) => `<div class="trow"><div class="who">${avatar(i, h)}<div><b>${n}</b><span>${w}</span></div></div><span><span class="badge ${k}">${ic(icn)}${st}</span></span><span class="held">${held}</span></div>`).join("")}
    <div class="note">${ic("lock")}Transfers to unverified wallets are rejected on-chain.</div></div>

  <div class="card c2"><div class="ch"><span>Compliance rules</span>${ic("sliders")}</div>
    <div style="margin-top:8px">${rules.map(([i, t, s, ctl]) => `<div class="rrow"><span class="rb">${ic(i)}</span><div class="t"><b>${t}</b><span>${s}</span></div>${ctl}</div>`).join("")}</div></div>

  <div class="card c3"><div class="ch"><span>Distribution</span><span class="sel">Q3 ${ic("chev")}</span></div>
    <div class="donut">${donut}<div class="mid"><span>Pool</span><b>$12,000</b></div></div>
    <div style="margin-top:14px"><div class="kv"><span>Method</span><b>Pro-rata</b></div><div class="kv"><span>Rounding</span><b>Down to the cent</b></div><div class="kv"><span>Total paid out</span><span class="badge ok">${ic("check")}Within the pool</span></div></div>
    <div class="btns"><div class="btn p">Run distribution</div><div class="btn s" style="max-width:140px">Preview</div></div></div>

  ${strip({
    title: "Issuance flow", sub: "Every transfer passes the same identity and compliance checks",
    left: { icon: avatar("AK", 212, 62, 22), name: "Investor 014", meta: "0x7a3…c19e", status: "KYC claim valid" },
    right: { icon: tok("HPT", 212, 62), name: "Property token", meta: "ERC-3643 · Polygon", status: "Transfer allowed" },
    labels: ["Claims", "Compliance", "Registry"], pill: ["Checking rules", "3 / 4 checks passed"],
  })}`,
});
