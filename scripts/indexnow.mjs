// Tells IndexNow-enabled search engines (Bing, Yandex, Seznam, Naver; Bing's
// index also feeds ChatGPT search and Copilot) that pages changed, so they
// recrawl within minutes instead of days.
//
//   npm run indexnow                       # every URL in the live sitemap
//   npm run indexnow -- /token2049 /token2049/guide   # just these paths
//
// Run it AFTER a deploy is live: IndexNow checks the key file at
// https://www.hashxlabs.com/<KEY>.txt (public/<KEY>.txt). The key is public
// by design; it only proves we control the site.
const HOST = "www.hashxlabs.com";
const KEY = "ef82a04971b5ee0fb613e12dae37f17d";
const ORIGIN = `https://${HOST}`;

const args = process.argv.slice(2);
let urls;
if (args.length) {
  urls = args.map((p) => (p.startsWith("http") ? p : ORIGIN + (p.startsWith("/") ? p : "/" + p)));
} else {
  const xml = await (await fetch(`${ORIGIN}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const keyRes = await fetch(`${ORIGIN}/${KEY}.txt`);
if (!keyRes.ok || (await keyRes.text()).trim() !== KEY) {
  console.error(`The key file ${ORIGIN}/${KEY}.txt is not live yet. Deploy first, then run this again.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted (key validation pending)
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urls.length} URL(s)`);
if (res.status >= 300) {
  console.error(await res.text());
  process.exit(1);
}
