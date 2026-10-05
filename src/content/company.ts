/* Company-level content for the redesigned site: homepage sections, About,
   Contact and shared blocks. Same rules as site.ts: our own wording, no
   client names, invented metrics, guarantees or team-size claims. */

import type { IconName } from "@/components/icons/Icon";

export const COMPANY = {
  name: "HashX Labs",
  email: "info@hashxlabs.com",
  phone: "+91-8810235570",
  phoneHref: "tel:+918810235570",
  whatsapp: "+91-8076534288",
  whatsappHref: "https://wa.me/918076534288?text=" + encodeURIComponent("Hi HashX Labs, I'd like to talk about a project."),
  tagline: "Blockchain and AI engineering, built to hold up in production.",
};

/** The six service areas on the homepage and in the Services menu.
 *  `photo` (public/img) and `word` (the large overlay on it) are used by the
 *  home services rail. */
export const SERVICE_AREAS: { icon: IconName; title: string; d: string; points: string[]; href: string; photo: string; word: string }[] = [
  {
    icon: "blockchain",
    title: "Blockchain development",
    d: "Smart contracts, dApps and protocol infrastructure on EVM chains and Solana.",
    points: ["Smart contracts & dApps", "Layer 2s & appchains", "Wallets & account abstraction"],
    href: "/services/blockchain-development",
    photo: "hero-web3.jpg",
    word: "Build.",
  },
  {
    icon: "shield",
    title: "Smart contract security",
    d: "Review, invariant fuzzing and testing, with every finding delivered as a failing test.",
    points: ["Manual code review", "Invariant & fuzz testing", "Pre-audit hardening"],
    href: "/services/smart-contract-audit",
    photo: "smart-contract.jpg",
    word: "Secure.",
  },
  {
    icon: "tokenize",
    title: "RWA tokenization",
    d: "Permissioned tokens for funds, credit and real estate, with compliance enforced on-chain.",
    points: ["ERC-3643 security tokens", "Investor onboarding & KYC", "Distributions & reporting"],
    href: "/services/rwa-tokenization",
    photo: "realestate.jpg",
    word: "Tokenize.",
  },
  {
    icon: "chart",
    title: "DeFi & exchanges",
    d: "Lending markets, vaults, DEXs and exchange infrastructure designed for adversarial markets.",
    points: ["Lending, vaults & staking", "DEX & order-book engines", "Custody & settlement"],
    href: "/services#exchanges-defi",
    photo: "defi.jpg",
    word: "Trade.",
  },
  {
    icon: "coin",
    title: "Stablecoins & payments",
    d: "Issuance, reserves and payment rails that reconcile with the systems your finance team runs.",
    points: ["Stablecoin issuance", "Payment gateways & ramps", "Treasury & payouts"],
    href: "/services#stablecoins",
    photo: "blockchain.jpg",
    word: "Settle.",
  },
  {
    icon: "ai",
    title: "AI development",
    d: "Retrieval systems and AI agents connected to your tools, with a person approving every write.",
    points: ["AI agents & automation", "RAG over your documents", "Evaluation & monitoring"],
    href: "/services/ai-development",
    photo: "ai-neural.jpg",
    word: "Automate.",
  },
];

/** Anchor id for a MENU section on /services (the "solutions" section is labelled Exchanges & DeFi). */
export const sectionAnchor = (id: string) => (id === "solutions" ? "exchanges-defi" : id);

export const CHAINS = ["Ethereum", "Solana", "Polygon", "Arbitrum", "Base", "Optimism", "Avalanche", "BNB Chain"];

/** Who we build for. `fig`, `points`, `href` and `cta` feed the interactive
 *  figure on the home page (components/home/Audiences.tsx). */
export const AUDIENCES: { icon: IconName; title: string; d: string; fig: string; points: string[]; href: string; cta: string }[] = [
  {
    icon: "rocket",
    title: "Web3 startups & protocols",
    d: "Launch DeFi protocols, tokens and dApps with security designed in from the first commit.",
    fig: "Launch",
    points: ["Protocol & token design", "Audit-ready contracts", "Mainnet launch & monitoring"],
    href: "/services/blockchain-development",
    cta: "Blockchain development",
  },
  {
    icon: "cash",
    title: "Fintech & payments",
    d: "Stablecoin rails, custody and crypto payments that reconcile with your existing books.",
    fig: "Settlement",
    points: ["Stablecoin issuance & rails", "Custody & wallets", "Reconciliation with your ledger"],
    href: "/services#stablecoins",
    cta: "Stablecoins & payments",
  },
  {
    icon: "bank",
    title: "Asset managers & issuers",
    d: "Tokenize funds, credit and property with investor eligibility enforced in the token itself.",
    fig: "Tokenization",
    points: ["ERC-3643 permissioned tokens", "Investor onboarding & KYC", "Distributions & reporting"],
    href: "/services/rwa-tokenization",
    cta: "RWA tokenization",
  },
  {
    icon: "building",
    title: "Enterprises",
    d: "Blockchain integration and AI agents connected to the systems your teams already use.",
    fig: "Integration",
    points: ["Chain integration", "AI agents with approvals", "Retrieval over your documents"],
    href: "/services/ai-development",
    cta: "AI development",
  },
];

export const REASONS: { icon: IconName; title: string; d: string }[] = [
  { icon: "users", title: "Senior engineers, start to finish", d: "The engineers who scope your project are the ones who design and build it. Nothing gets lost in a hand-off." },
  { icon: "shield", title: "Security from the first commit", d: "Written specs, invariant tests and fuzzing are part of the build, not a step bolted on before launch." },
  { icon: "clipboard", title: "Clear scope, no surprises", d: "A written scope with assumptions spelled out, milestones you can see, and a demo at every step." },
  { icon: "document", title: "You own everything", d: "Code, tests, documentation and runbooks live in your repository from day one." },
];

/* `get` = what the client receives at that step (home "How we work" chain). */
export const PROCESS: { k: string; d: string; get: string[] }[] = [
  { k: "Discover", d: "We learn the product, the users and what must never go wrong, then write it down as a specification.", get: ["Written specification", "Invariants: what must never happen", "Open questions answered"] },
  { k: "Design", d: "Architecture, threat model and a scoped plan with milestones, reviewed with you before code.", get: ["Architecture diagram", "Threat model with mitigations", "Milestone plan you approve"] },
  { k: "Build", d: "Small, readable components with tests in every pull request and a demo at each milestone.", get: ["Pull requests with tests", "A demo at every milestone", "Code your team can read"] },
  { k: "Test & review", d: "Invariant fuzzing, static analysis, fork tests and manual review. Findings arrive as tests you can run.", get: ["Fuzzing and static analysis", "Findings as runnable tests", "Fixes with regression tests"] },
  { k: "Launch & support", d: "Deployment scripts, key ceremonies, monitoring and a runbook. We stay on after launch.", get: ["Deploy scripts and key ceremony", "Monitoring and alerts", "A runbook and support after launch"] },
];

/* Client sites we built that are live in production (home "Live projects").
   Screenshots are real captures of the live sites: `npm run sites` refreshes
   them into public/img/sites/ (ids must match scripts/capture-sites.mjs).
   `desk`/`phone` are the captured image sizes, used to size the scroll pan. */
export type LiveProject = {
  id: string;
  name: string;
  url: string;
  domain: string;
  kind: string;
  title: string;
  d: string;
  built: string[];
  facts: { k: string; v: string; href?: string }[];
  stack: string[];
  accent: string;
  desk: [number, number];
  phone: [number, number];
};

export const LIVE_PROJECTS: LiveProject[] = [
  {
    id: "singhcoin",
    name: "SinghCoin",
    url: "https://singhcoin.io/",
    domain: "singhcoin.io",
    kind: "Web3 · Creator economy",
    title: "A home for a creator token and its ecosystem",
    d: "SinghCoin connects social content, digital collectibles, events and token rewards. The site explains the ecosystem, introduces its new app, SlaySpace, and puts the SINGH token's on-chain details one click from BscScan.",
    built: [
      "Kinetic hero and motion system, hand-coded without a framework",
      "Ecosystem pages for social, collectibles and events",
      "Token section with the BEP-20 contract and a BscScan link",
    ],
    facts: [
      { k: "Token", v: "SINGH" },
      { k: "Standard", v: "BEP-20" },
      { k: "Network", v: "BNB Smart Chain", href: "https://bscscan.com/token/0x867B96B33B2c13CC8cB78A9aA95420c6cD42C4c6" },
    ],
    stack: ["HTML & CSS", "Vanilla JS", "Cloudflare", "BNB Chain"],
    accent: "#e9b300",
    desk: [1200, 4333],
    phone: [390, 7000],
  },
  {
    id: "bitnautics",
    name: "BitNautics",
    url: "https://bitnautics.com/",
    domain: "bitnautics.com",
    kind: "Software consultancy · Germany",
    title: "A corporate site for a German software consultancy",
    d: "BitNautics builds custom software, websites and automotive embedded systems from Rosbach, Germany. Their site presents three service lines, the team and open roles, and turns visitors into quote requests.",
    built: [
      "Responsive company website, designed and built end to end",
      "Service pages for web, automotive and custom software",
      "Careers, blog and quote-request flows",
    ],
    facts: [
      { k: "Based in", v: "Rosbach, Germany" },
      { k: "Services", v: "Web · Automotive · Software" },
      { k: "Platform", v: "WordPress + Elementor" },
    ],
    stack: ["WordPress", "Elementor", "Responsive", "SEO"],
    accent: "#1fbf5b",
    desk: [1200, 4333],
    phone: [390, 7000],
  },
];

export const ENGAGEMENTS: { title: string; d: string; best: string; points: string[] }[] = [
  {
    title: "Discovery & specification",
    best: "You have an idea, not yet a spec",
    d: "A short engagement to turn an idea into a buildable plan.",
    points: ["Requirements & architecture", "Threat model", "Scoped estimate with assumptions"],
  },
  {
    title: "Product build",
    best: "You want the whole product built",
    d: "End-to-end delivery against an agreed scope and milestones.",
    points: ["Contracts, backend & apps", "Weekly demos", "Tests and docs in your repo"],
  },
  {
    title: "Security review",
    best: "Your contracts are already written",
    d: "Independent review of contracts you have already written.",
    points: ["Manual review & fuzzing", "Findings as failing tests", "Fix verification"],
  },
  {
    title: "Ongoing engineering",
    best: "You are live and want to keep shipping",
    d: "Continued development, upgrades and support after launch.",
    points: ["Feature development", "Upgrades & migrations", "Monitoring & incident help"],
  },
];

/** The home "Technology" orbit (components/home/TechStack.tsx). `logo` is a
 *  file in public/tech (sources in public/tech/CREDITS.md), or `erc:<number>`
 *  for a standard, which is drawn as a typographic tile. Tools without a logo
 *  of their own (practices, Echidna, pgvector, LLMs) use our blue line glyphs. */
export type StackItem = { name: string; logo: string; note: string };
export const STACK: { group: string; d: string; items: StackItem[] }[] = [
  {
    group: "Smart contracts",
    d: "Solidity or Vyper on EVM chains, Rust with Anchor on Solana. Foundry runs the tests and scripts; Hardhat where your repo already uses it.",
    items: [
      { name: "Solidity", logo: "solidity.svg", note: "Contracts for Ethereum and EVM chains" },
      { name: "Rust", logo: "rust.svg", note: "Solana programs and fast services" },
      { name: "Anchor", logo: "anchor.svg", note: "The framework for Solana programs" },
      { name: "Vyper", logo: "vyper.svg", note: "When a protocol is already written in it" },
      { name: "Foundry", logo: "foundry.png", note: "Tests, fuzzing and deploy scripts" },
      { name: "Hardhat", logo: "hardhat.svg", note: "For repos and plugins built on it" },
    ],
  },
  {
    group: "Security",
    d: "Static analysis, fuzzing, invariant suites and fork tests run first, so the line-by-line review is spent on logic rather than typos.",
    items: [
      { name: "Slither", logo: "slither.png", note: "Static analysis in CI" },
      { name: "Echidna", logo: "fuzz.svg", note: "Property-based fuzzing" },
      { name: "Foundry invariants", logo: "invariant.svg", note: "Rules that hold after any sequence of calls" },
      { name: "Fork testing", logo: "fork.svg", note: "Tests against real mainnet state" },
      { name: "Manual review", logo: "review.svg", note: "Line by line, by the engineers who build" },
    ],
  },
  {
    group: "Chains & protocols",
    d: "Ethereum, its L2s and Solana, with proven standards and infrastructure in place of home-made versions.",
    items: [
      { name: "EVM chains", logo: "ethereum.svg", note: "Ethereum, its L2s, Polygon, BNB Chain, Avalanche" },
      { name: "Solana", logo: "solana.svg", note: "High-throughput programs and payments" },
      { name: "LayerZero", logo: "layerzero.svg", note: "Cross-chain messaging" },
      { name: "Chainlink", logo: "chainlink.svg", note: "Price feeds and oracles" },
      { name: "ERC-4337", logo: "erc:4337", note: "Smart accounts and sponsored gas" },
      { name: "ERC-3643", logo: "erc:3643", note: "Permissioned tokens for regulated assets" },
    ],
  },
  {
    group: "AI",
    d: "Python services around hosted or open models, with retrieval in the Postgres you already run.",
    items: [
      { name: "Python", logo: "python.svg", note: "Models, data pipelines and agents" },
      { name: "FastAPI", logo: "fastapi.svg", note: "Typed APIs around models and tools" },
      { name: "LangChain", logo: "langchain.svg", note: "Orchestration where it helps, not by default" },
      { name: "pgvector", logo: "vector.svg", note: "Vector search inside Postgres" },
      { name: "LLM APIs & open models", logo: "llm.svg", note: "Picked on cost, quality and data rules" },
    ],
  },
  {
    group: "Apps & cloud",
    d: "TypeScript from end to end: web, mobile and APIs on one typed codebase, running on AWS.",
    items: [
      { name: "TypeScript", logo: "typescript.svg", note: "One typed language across the product" },
      { name: "Next.js", logo: "nextjs.svg", note: "Web apps and dashboards" },
      { name: "React Native", logo: "react.svg", note: "iOS and Android from one codebase" },
      { name: "Node.js", logo: "nodejs.svg", note: "APIs, indexers and workers" },
      { name: "PostgreSQL", logo: "postgresql.svg", note: "The default database" },
      { name: "AWS", logo: "aws.svg", note: "Hosting, key management and monitoring" },
    ],
  },
];

export const FAQS: [string, string][] = [
  ["What kind of projects do you take on?", "Blockchain products that hold real value (DeFi, tokenization, stablecoins, wallets, exchanges) and AI systems that connect to real business tools. We also review and harden contracts other teams have written."],
  ["Who will I be working with?", "Senior engineers throughout. The people who scope your project design and build it, so nothing is lost between the first call and the code."],
  ["Which chains do you work on?", "EVM chains (Ethereum and its L2s, Polygon, BNB Chain, Avalanche) and Solana. If your idea fits a different chain better, we will say so before you spend money."],
  ["How is pricing set?", "After a short discovery and a written scope. You get a range with the assumptions spelled out, not a number on a first call."],
  ["How long does a project take?", "It depends on scope. Discovery gives you a written plan with milestones; a focused contract system takes weeks, a full platform takes months."],
  ["Do you audit contracts?", "We review and test contracts thoroughly, ours and yours. For a launch that will hold significant value we still recommend an independent audit on top; our work makes it shorter and cheaper."],
  ["Who owns the code?", "You do. Code, tests and documentation live in your repository from the start."],
  ["Can we see previous work?", "Client names stay private under NDA. We share architectures and can walk through code structure and test approach on a call."],
];

export const PRINCIPLES: [string, string][] = [
  ["Tests are the spec.", "If a rule matters, it is a test. We write the invariants before the contract and keep them running after launch."],
  ["Senior engineers, start to finish.", "The engineers who scope your project design and build it. No hand-offs between sales and delivery."],
  ["Say no early.", "If a chain, a token or an agent is the wrong tool for your problem, we tell you before you pay for it."],
  ["Boring is a feature.", "Small contracts, explicit roles, well-known patterns. Clever code is where exploits hide."],
  ["Leave it well owned.", "Docs, runbooks and a test suite your team can run without us. Handover is part of the job."],
];

export const WONT = [
  "Promise zero exploits. Nobody honest can.",
  "Quote a project before we understand it.",
  "Ship a contract without its tests.",
  "Issue certification badges.",
  "Invent client logos or testimonials.",
];
