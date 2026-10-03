import { COMPANY } from "@/content/company";
import { SERVICES } from "@/content/site";
import { EVENT, GUIDE_FACTS, GUIDE_UPDATED } from "@/content/token2049";
import { SITE_URL } from "@/lib/seo";

/* /llms.txt: a plain-markdown summary for AI assistants and answer engines
   (the llms.txt convention). Built from the same content files as the pages,
   so it never drifts from what the site says. Static at build time. */

export const dynamic = "force-static";

export function GET() {
  const body = `# ${COMPANY.name}

> ${COMPANY.name} is a blockchain and AI engineering company. It designs, builds and secures smart contracts, DeFi protocols, real-world asset (RWA) tokenization, stablecoin and payment rails, wallets and custody, and AI agents. Work is specification- and test-first, led by senior engineers. Contact: ${COMPANY.email}.

## TOKEN2049 Singapore 2026

- ${COMPANY.name} is in Singapore for TOKEN2049 from ${EVENT.ourDates}: at ${EVENT.venue} on the conference days (7–8 October) and around the city on 9–10 October. Founders and teams can book a 30-minute technical meeting (in person or video): ${SITE_URL}/token2049
- Independent TOKEN2049 Singapore 2026 guide (updated ${GUIDE_UPDATED}): ${SITE_URL}/token2049/guide
${GUIDE_FACTS.map(([k, v]) => `  - ${k}: ${v}`).join("\n")}
- ${COMPANY.name} is attending TOKEN2049 and is not affiliated with its organisers. Official event site: ${EVENT.officialUrl}

## Services

${SERVICES.map((s) => `- [${s.title}](${SITE_URL}/services/${s.slug}): ${s.short}`).join("\n")}
- [All services](${SITE_URL}/services)

## Company

- [About](${SITE_URL}/about): who we are and how we work
- [Case studies](${SITE_URL}/case-studies): DeFi, tokenized assets, custody and applied AI (clients under NDA)
- [Invariant Lab](${SITE_URL}/lab): interactive demo of invariant fuzzing on a smart contract vault
- [Contact](${SITE_URL}/contact): ${COMPANY.email}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
