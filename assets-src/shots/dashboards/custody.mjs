import { page, ic, avatar, tok, strip } from "./parts.mjs";

const assets = [["ETH", 232, "Ethereum", "12.40", "$30,380.00"], ["USDC", 212, "USD Coin", "8,200.00", "$8,200.00"], ["DAI", 38, "Dai", "9,630.40", "$9,630.40"]];
const signers = [["OL", 205, "Ops lead", "Hardware key", "ok", "check", "Approved"], ["FN", 262, "Finance", "Mobile app", "ok", "check", "Approved"], ["CT", 28, "CTO", "Cold storage", "warn", "clock", "Waiting"]];
const rules = [["coins", "Daily limit", "$10,000"], ["list", "Allowlisted addresses", "12"], ["users", "Two approvals above", "$1,000"], ["clock", "New address cool-down", "24 h"], ["key", "Hardware key required", `<i class="tg on"></i>`]];

const css = `
.hrow { display:flex; align-items:center; gap:14px; } .hb { display:grid; place-items:center; width:42px; height:42px; border-radius:12px; background:#eaf2fe; color:var(--blue); } .hb .ic { width:24px; height:24px; }
.bal { margin-top:18px; padding:18px 22px; height:118px; } .bal .big { font-size:40px; font-weight:700; letter-spacing:-.025em; margin:4px 0 2px; }
.arow { display:flex; align-items:center; gap:16px; height:72px; border-bottom:1px solid #edf2fa; } .arow:last-of-type { border-bottom:0; }
.arow .t { flex:1; } .arow .t b { display:block; font-size:19px; font-weight:600; } .arow .t span { display:block; font-size:15.5px; color:var(--mute); margin-top:2px; }
.arow .v { text-align:right; } .arow .v b { display:block; font-size:19px; font-weight:600; } .arow .v span { display:block; font-size:15.5px; color:var(--mute); margin-top:2px; }
.btns { display:flex; gap:12px; position:absolute; left:26px; right:26px; bottom:26px; } .btns .btn { flex:1; }
.tx { margin-top:14px; padding:16px 22px; height:132px; } .tx .amt { font-size:36px; font-weight:700; letter-spacing:-.025em; margin-top:2px; } .tx .amt small { font-size:19px; font-weight:500; color:var(--mute); margin-left:8px; letter-spacing:0; }
.tx .to { display:flex; align-items:center; justify-content:space-between; margin-top:8px; font-size:17px; } .tx .to b { font-weight:600; }
.prog { display:flex; align-items:center; gap:12px; margin-top:14px; height:30px; } .prog .segs { display:flex; gap:8px; flex:1; } .prog .segs i { flex:1; height:10px; border-radius:6px; background:#dce6f6; } .prog .segs i.f { background:linear-gradient(90deg,#1a6bff,#0058f5); } .prog b { font-size:16.5px; font-weight:600; }
.srow { display:flex; align-items:center; gap:14px; height:58px; } .srow .t { flex:1; } .srow .t b { display:block; font-size:18px; font-weight:600; } .srow .t span { display:block; font-size:15px; color:var(--mute); }
.prow { display:flex; align-items:center; gap:14px; height:68px; border-bottom:1px solid #edf2fa; } .prow:last-of-type { border-bottom:0; }
.rb { display:grid; place-items:center; width:44px; height:44px; border-radius:12px; background:#eaf2fe; color:var(--blue); flex:none; } .rb .ic { width:23px; height:23px; }
.prow .t { flex:1; font-size:18.5px; font-weight:600; } .prow .v { display:flex; align-items:center; font-size:18px; font-weight:650; color:var(--blue); }
.okbox { display:flex; align-items:center; gap:14px; margin-top:16px; padding:0 18px; height:78px; border-radius:14px; background:#e9f8f0; border:1.5px solid #c9ecd9; color:#0b6f47; font-size:17px; line-height:1.35; font-weight:500; } .okbox .ic { color:#12a566; width:28px; height:28px; stroke-width:2; }
`;

export default page({
  title: "Custody console",
  nav: [["lock", "Vaults"], ["inbox", "Requests"], ["shield", "Policies"], ["users", "Signers"], ["phone", "Devices"], ["clock", "Activity"], ["sliders", "Settings"]],
  active: "Requests",
  search: "Search vaults, transactions, or signers…",
  wallet: `${ic("shield")}Treasury`,
  css,
  body: `
  <div class="card c1"><div class="ch"><span class="hrow"><span class="hb">${ic("lock")}</span>Treasury vault</span><span class="badge info">${ic("key")}2-of-3</span></div>
    <div class="bal field"><div class="lbl">Total balance</div><div class="big">$48,210.40</div><div class="lbl">3 assets · 3 signers</div></div>
    <div style="margin-top:12px">${assets.map(([s, h, n, a, u]) => `<div class="arow">${tok(s, h, 44)}<div class="t"><b>${s}</b><span>${n}</span></div><div class="v"><b>${a}</b><span>${u}</span></div></div>`).join("")}</div>
    <div class="btns"><div class="btn p">${ic("up")}Send</div><div class="btn s">${ic("down")}Receive</div></div></div>

  <div class="card c2"><div class="ch"><span>Pending approval</span><span class="badge warn">${ic("clock")}Open</span></div>
    <div class="tx field"><div class="lbl">Send</div><div class="amt">2.50 ETH<small>≈ $6,125.00</small></div><div class="to"><span class="mute">To <b style="color:var(--ink)">0x7f2…a9c1</b></span><span class="badge ok">${ic("check")}Allowlisted</span></div></div>
    <div class="prog"><div class="segs"><i class="f"></i><i class="f"></i><i></i></div><b>2 of 3 approvals</b></div>
    <div style="margin-top:8px">${signers.map(([i, h, r, m, k, icn, st]) => `<div class="srow">${avatar(i, h, 42, 15)}<div class="t"><b>${r}</b><span>${m}</span></div><span class="badge ${k}">${ic(icn)}${st}</span></div>`).join("")}</div>
    <div class="btns"><div class="btn p">Approve</div><div class="btn s">Reject</div></div></div>

  <div class="card c3"><div class="ch"><span>Policy engine</span>${ic("info")}</div>
    <div style="margin-top:6px">${rules.map(([i, t, v]) => `<div class="prow"><span class="rb">${ic(i)}</span><span class="t">${t}</span><span class="v">${v}</span></div>`).join("")}</div>
    <div class="okbox">${ic("shieldcheck")}This request passes every policy and needs one more approval.</div></div>

  ${strip({
    title: "Signing path", sub: "No single device or person can move funds",
    left: { icon: `<span class="hb" style="width:62px;height:62px;border-radius:50%">${ic("laptop")}</span>`, name: "Client", meta: "Web and mobile", status: "Request sent" },
    right: { icon: `<span class="hb" style="width:62px;height:62px;border-radius:50%;background:#0f2a66;color:#fff">${ic("key")}</span>`, name: "Key service", meta: "Hardware keys", status: "Ready to sign" },
    labels: ["Policy", "Signer", "Audit log"], pill: ["Awaiting approval", "2 / 3 signatures"],
  })}`,
});
