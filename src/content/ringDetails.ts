/* Hover detail for each hero ring card, in the same order as CREATIVES in
   components/hero/RingCards.tsx (card i shows RING_DETAILS[i % length]).
   Same rules as the cards: our own wording, no invented metrics, clients or
   guarantees — describe the engineering. */

export type RingDetail = {
  eyebrow: string;
  title: string;
  tone: string; // accent, matches the card's palette
  concept: string; // the hard part, and why it matters
  what: string[]; // what we deliver
  how: [string, string][]; // three steps: label, detail
  stack: string[];
  href: string;
  cta: string;
};

export const RING_DETAILS: RingDetail[] = [
  {
    eyebrow: "DeFi protocols",
    title: "Yield engines",
    tone: "#0057d9",
    concept:
      "A vault is an accounting system that strangers can call in any order. Share price, rounding direction and oracle freshness decide whether deposits stay solvent when markets move fast, so we treat them as invariants, not implementation details.",
    what: [
      "ERC-4626 vaults with pluggable strategy modules",
      "AMM and lending markets with interest-rate models",
      "Oracle design with staleness and deviation checks",
      "Liquidation paths that still clear under stress",
    ],
    how: [
      ["Model", "Write the accounting rules down before any Solidity"],
      ["Build", "Gas-tuned hot paths, rounding always in the protocol's favour"],
      ["Prove", "Invariant suites on share price and solvency in CI"],
    ],
    stack: ["Solidity", "Foundry", "ERC-4626", "Chainlink"],
    href: "/services/yield-vaults",
    cta: "Yield vault development",
  },
  {
    eyebrow: "Real-world assets",
    title: "Tokenize real assets",
    tone: "#b8892c",
    concept:
      "Putting an asset on-chain is the easy part. The token has to know who may hold it, in which jurisdiction, and how NAV, distributions and redemptions reconcile with the off-chain books, on every single transfer.",
    what: [
      "ERC-3643 permissioned tokens with identity registries",
      "KYC-gated transfers and per-region eligibility rules",
      "NAV updates, distributions and redemption flows",
      "Issuer, agent and investor consoles",
    ],
    how: [
      ["Map", "Turn the legal structure and rules into transfer logic"],
      ["Build", "Compliance checks enforced in the token, not the UI"],
      ["Reconcile", "On-chain state matched against the register"],
    ],
    stack: ["ERC-3643", "ERC-1400", "Polygon", "Node.js"],
    href: "/services/rwa-tokenization",
    cta: "RWA tokenization",
  },
  {
    eyebrow: "Digital custody",
    title: "Keys, secured",
    tone: "#38bdf8",
    concept:
      "Every custody failure comes back to one key, one person or one server that could move funds alone. Threshold signing removes that single point, and a policy engine decides who can approve what before any signature is produced.",
    what: [
      "2-of-3 and m-of-n MPC or multisig signing",
      "Policy engine with approval chains and limits",
      "Hot, warm and cold tiers with sweep rules",
      "Tamper-evident audit trail of every action",
    ],
    how: [
      ["Threat-model", "Who can steal, collude or lose a share"],
      ["Build", "Signing behind policies, keys in hardware where possible"],
      ["Drill", "Key-loss and recovery rehearsed before go-live"],
    ],
    stack: ["MPC / TSS", "Safe", "AWS KMS", "TypeScript"],
    href: "/services/mpc-custody-wallets",
    cta: "MPC & custody wallets",
  },
  {
    eyebrow: "Cross-chain",
    title: "Bridge safely",
    tone: "#7c3aed",
    concept:
      "Bridges hold the most value with the widest attack surface: two chains, a messaging layer and the code between them. We design assuming messages will be forged, replayed or delayed, and cap the damage if one gets through.",
    what: [
      "LayerZero, CCIP and Wormhole integrations",
      "Replay protection and finality-aware messaging",
      "Per-route rate limits and circuit breakers",
      "Kill switches with clear operational runbooks",
    ],
    how: [
      ["Assume breach", "Map what a forged message could do"],
      ["Limit", "Rate limits and pauses sized to that blast radius"],
      ["Test", "Fork tests across both chains, adversarial cases first"],
    ],
    stack: ["LayerZero", "CCIP", "Wormhole", "Foundry"],
    href: "/services/cross-chain-bridges",
    cta: "Bridges & interoperability",
  },
  {
    eyebrow: "Token launch",
    title: "Launch your token",
    tone: "#f97316",
    concept:
      "A launch is a one-shot event: supply, vesting and distribution are public the moment they deploy and very hard to fix afterwards. We test the whole schedule, every cliff and every claim, before TGE day.",
    what: [
      "Token contracts with caps, permits and roles",
      "Vesting and cliff schedules for team and investors",
      "Merkle airdrops and allow-listed sales",
      "Liquidity bootstrapping and launch-day runbook",
    ],
    how: [
      ["Model", "Tokenomics turned into an emissions table you can check"],
      ["Build", "Contracts that implement exactly that table"],
      ["Rehearse", "Full TGE dry-run on a fork, then launch"],
    ],
    stack: ["ERC-20", "SPL", "Merkle proofs", "Foundry"],
    href: "/services/token-launchpad",
    cta: "Token launchpad",
  },
  {
    eyebrow: "Security review",
    title: "Audit ready",
    tone: "#0057d9",
    concept:
      "Auditors are expensive per hour, so arriving with an unclear spec and no tests wastes the engagement. We get the code to the point where the audit finds subtle issues, not the obvious ones.",
    what: [
      "Threat model and written invariants",
      "Reentrancy, access-control and upgrade review",
      "Oracle, rounding and MEV exposure review",
      "Fixes plus regression tests for every finding",
    ],
    how: [
      ["Read", "Line-by-line review against the spec"],
      ["Attack", "Static analysis, fuzzing and manual exploit attempts"],
      ["Hand over", "Findings, fixes and a clean scope for your auditor"],
    ],
    stack: ["Slither", "Echidna", "Foundry", "Manual review"],
    href: "/services/smart-contract-audit",
    cta: "Security review & testing",
  },
  {
    eyebrow: "Spec first",
    title: "Break it first",
    tone: "#22c55e",
    concept:
      "Unit tests check the cases you thought of. Invariant fuzzing checks the rules that must never break, like solvency and supply conservation, against millions of call sequences you did not think of.",
    what: [
      "Protocol invariants written as executable properties",
      "Foundry invariant suites and Echidna campaigns",
      "Fork tests against live mainnet state",
      "Fuzzing wired into CI on every pull request",
    ],
    how: [
      ["Specify", "List what must always be true"],
      ["Fuzz", "Random call sequences hunt for a counterexample"],
      ["Guard", "Every counterexample becomes a permanent test"],
    ],
    stack: ["Foundry", "Echidna", "Slither", "GitHub Actions"],
    href: "/lab",
    cta: "Try the Invariant Lab",
  },
  {
    eyebrow: "Solana programs",
    title: "Rust. Anchor.",
    tone: "#9945ff",
    concept:
      "On Solana the program does not own its data; accounts are passed in by the caller. Most exploits are an account that was not validated, so we treat account checks, PDAs and CPIs as the core of the design.",
    what: [
      "Rust and Anchor programs with explicit account validation",
      "PDAs and CPIs designed and documented up front",
      "SPL and Token-2022 extensions",
      "Compute-unit profiling and client SDKs",
    ],
    how: [
      ["Design", "Account layout and authority model first"],
      ["Build", "Anchor constraints for every account"],
      ["Profile", "Compute budget measured, not guessed"],
    ],
    stack: ["Rust", "Anchor", "Token-2022", "TypeScript"],
    href: "/services/solana-development",
    cta: "Solana development",
  },
  {
    eyebrow: "Wallet UX",
    title: "Gasless. Seedless.",
    tone: "#6366f1",
    concept:
      "Seed phrases and gas are why most people never finish onboarding. Smart accounts let users sign in with a passkey, have gas sponsored and batch steps into one tap, while keeping self-custody.",
    what: [
      "ERC-4337 smart accounts and bundler integration",
      "Paymasters for sponsored or token-paid gas",
      "Passkey sign-in and social recovery",
      "Session keys and batched transactions",
    ],
    how: [
      ["Map", "The user journey, every signature counted"],
      ["Build", "Accounts, paymaster policy and recovery"],
      ["Harden", "Spend limits so sponsorship cannot be drained"],
    ],
    stack: ["ERC-4337", "Passkeys", "Paymasters", "React Native"],
    href: "/services/account-abstraction",
    cta: "Account abstraction",
  },
  {
    eyebrow: "DAOs + treasuries",
    title: "Govern on-chain",
    tone: "#10b981",
    concept:
      "Governance is an attack surface: a borrowed vote, a rushed proposal or an unchecked treasury call can move everything. Timelocks, snapshots and scoped execution give holders time to see a bad proposal and react.",
    what: [
      "OpenZeppelin Governor with voting tokens",
      "Timelocked execution through Safe",
      "Delegation and snapshot-based voting power",
      "Treasury modules with spending scopes",
    ],
    how: [
      ["Design", "Who can propose, vote and execute, and when"],
      ["Build", "Snapshots so voting power cannot be flash-borrowed"],
      ["Simulate", "Proposals executed on a fork before the vote"],
    ],
    stack: ["OZ Governor", "Safe", "Timelock", "Foundry"],
    href: "/services/dao-development",
    cta: "DAO & governance",
  },
  {
    eyebrow: "On-chain AI",
    title: "Agents that sign",
    tone: "#38bdf8",
    concept:
      "An agent that can sign can lose money at machine speed. The guardrails belong on-chain, in spend caps, allow-lists and expiring session keys, so a wrong model output cannot exceed what you authorised.",
    what: [
      "Agents with tool access scoped to approved actions",
      "On-chain spend caps and contract allow-lists",
      "ERC-4337 session keys that expire",
      "A full decision log behind every transaction",
    ],
    how: [
      ["Bound", "Define what the agent may never do"],
      ["Enforce", "Limits in the account, not in the prompt"],
      ["Audit", "Every action traceable to its reasoning"],
    ],
    stack: ["Python", "ERC-4337", "LangChain", "pgvector"],
    href: "/services/ai-trading-agents",
    cta: "Trading & execution agents",
  },
  {
    eyebrow: "Stablecoins",
    title: "Issue your stablecoin",
    tone: "#0ea5e9",
    concept:
      "A stablecoin is only as good as the link between tokens in circulation and reserves in the bank. Mint, burn and redemption have to reconcile daily, and compliance controls have to work without breaking the token.",
    what: [
      "Mint and burn with role-separated controls",
      "Proof-of-reserve feeds and attestation publishing",
      "Freeze and blocklist controls for compliance",
      "Multi-chain supply kept in sync",
    ],
    how: [
      ["Separate", "No single role can mint and approve"],
      ["Reconcile", "Supply checked against reserves every day"],
      ["Expose", "Reserve data holders can verify themselves"],
    ],
    stack: ["Solidity", "Chainlink PoR", "CCIP", "PostgreSQL"],
    href: "/services/stablecoin-development",
    cta: "Stablecoin development",
  },
  {
    eyebrow: "Exchanges",
    title: "Build an exchange",
    tone: "#facc15",
    concept:
      "An exchange is a matching engine, a ledger and a custody system that must always agree. Speed matters, but correctness under load, with no double spends and balances that reconcile to the wallet, is what keeps it open.",
    what: [
      "Order-book matching or AMM engines",
      "Off-chain matching with on-chain settlement",
      "Hot and cold wallet custody infrastructure",
      "Ledger reconciliation and proof of solvency",
    ],
    how: [
      ["Ledger", "Double-entry books as the source of truth"],
      ["Engine", "Matching built and load-tested for bursts"],
      ["Settle", "Withdrawals reconciled against custody"],
    ],
    stack: ["TypeScript", "PostgreSQL", "MPC custody", "Solidity"],
    href: "/services/centralized-exchange-development",
    cta: "Exchange development",
  },
];
