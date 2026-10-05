/* Site content. Every claim here should be something we can show on a
   call: no client names (NDA), no invented metrics, no guarantees. */

export const METHOD = [
  { k: "Spec", d: "We write down what the system must always do and must never do. Those invariants become the acceptance test for everything after.", out: "SPEC.md" },
  { k: "Threat model", d: "Who can call what, with what money, in what order. Each risk gets an owner: a guard, a test, or an explicit decision to accept it.", out: "THREATS.md" },
  { k: "Build", d: "Small contracts, explicit access control, no cleverness we cannot test. Every pull request carries its own tests.", out: "src/ + test/" },
  { k: "Break", d: "Invariant fuzzing, static analysis, fork tests and manual review. Findings arrive as failing tests you can run yourself.", out: "forge test" },
  { k: "Ship", d: "Deployment scripts, key ceremonies, monitoring and a runbook. We stay on for the first weeks on mainnet.", out: "RUNBOOK.md" },
];

export type Service = {
  catalog?: boolean;
  slug: string;
  n: string;
  title: string;
  short: string;
  lead: string;
  deliverables: { t: string; d: string }[];
  steps: { k: string; d: string }[];
  risks: string[];
  stack: string[];
  note?: string;
  faqs: [string, string][];
};

export const SERVICES: Service[] = [
  {
    slug: "blockchain-development",
    catalog: true,
    n: "01",
    title: "Blockchain development",
    short: "Smart contracts, DeFi, tokens, wallets, bridges, chains and dApps, built against a written spec.",
    lead: "End-to-end blockchain engineering on EVM chains and Solana: smart contracts, DeFi protocols, tokens, wallets, cross-chain infrastructure and the applications around them. Every build starts from a written specification and ships with its tests.",
    deliverables: [
      { t: "Spec & invariants", d: "A written description of what must always hold, reviewed with you before code." },
      { t: "Contracts with tests", d: "Unit, fuzz, invariant and fork tests. CI runs all of them on every pull request." },
      { t: "Deployment & upgrades", d: "Scripted deploys, an upgrade or immutability decision written out, multisig and timelock setup." },
      { t: "Integration", d: "Indexer, API and frontend wiring when you need it, by the same people." },
      { t: "Handover", d: "Architecture notes, a runbook and a walkthrough, so your team owns it afterwards." },
    ],
    steps: METHOD.map(({ k, d }) => ({ k, d })),
    risks: ["Call ordering and reentrancy", "Privileged roles and upgrade keys", "Rounding and share-price inflation", "Oracle freshness and manipulation", "Cross-chain message replay"],
    stack: ["Solidity", "Rust", "Foundry", "Slither", "Echidna", "LayerZero", "Chainlink", "TypeScript"],
    faqs: [
      ["EVM or Solana?", "Whichever fits the product. If you have not decided, we write out the trade-offs for your case before any code."],
      ["Upgradeable or immutable?", "It depends on how much you expect to change. If upgradeable, we put the upgrade path behind a multisig and a timelock and write down who holds what."],
      ["Do you build the app around it?", "Yes. Indexers, APIs and the frontend can be part of the same engagement."],
    ],
  },
  {
    slug: "smart-contract-audit",
    n: "02",
    title: "Contract review & security testing",
    short: "Static analysis, invariant fuzzing and manual review. Every finding comes with a failing test.",
    lead: "Static analysis, invariant fuzzing and line-by-line manual review of your contracts. Every finding comes with a failing test you can run, a severity and a suggested fix.",
    note: "For a launch that will hold significant value, we still recommend an independent audit on top. Our review makes that audit shorter and cheaper, not unnecessary.",
    deliverables: [
      { t: "Scoped review plan", d: "What is in scope, what is not, and which properties we will try to break." },
      { t: "Findings with proof", d: "Each issue gets a severity, a proof-of-concept test and a suggested fix." },
      { t: "Invariant suite you keep", d: "The fuzzing harness stays in your repo and keeps running after we leave." },
      { t: "Fix verification", d: "We re-run everything against your fixes and confirm each finding is closed." },
      { t: "Written summary", d: "A plain report your team, investors or a later auditor can read." },
    ],
    steps: [
      { k: "Scope", d: "Read the code, docs and tests. Agree on scope, the properties to test and the timeline." },
      { k: "Automated pass", d: "Static analysis to clear the obvious classes of bug quickly, triaged by hand." },
      { k: "Manual review", d: "Line by line, with the business logic and economics in mind." },
      { k: "Fuzz campaigns", d: "Invariant fuzzing across long random call sequences to find the paths nobody wrote down." },
      { k: "Report & verify", d: "Findings with tests and fixes, then a verification pass on your changes." },
    ],
    risks: ["Reentrancy and call ordering", "Access control and privileged roles", "Rounding and share-price inflation", "Oracle manipulation and stale prices", "Proxy storage-layout collisions", "Flash-loan driven economic paths"],
    stack: ["Slither", "Echidna", "Foundry", "Manual review"],
    faqs: [
      ["Is this an audit?", "It is a security review with tests. We do not issue certification badges, and we will tell you when an independent audit is warranted."],
      ["Can you review code you did not write?", "Yes. That is most of this work. We start from your docs and tests and ask questions early."],
      ["What if you find nothing?", "You still keep the invariant suite and a written account of what was tested and how."],
    ],
  },
  {
    slug: "rwa-tokenization",
    n: "03",
    title: "RWA & tokenization",
    short: "Permissioned tokens: identity-gated transfers, on-chain compliance and holder distributions.",
    lead: "Permissioned tokens for regulated assets: identity-gated transfers, on-chain compliance checks, a claims registry and automated distributions to holders.",
    note: "We build the technology. The legal structure, licensing and jurisdiction questions stay with your counsel, and we work alongside them.",
    deliverables: [
      { t: "Token & compliance modules", d: "ERC-3643 style permissioned token with pluggable transfer rules." },
      { t: "Identity & claims", d: "Integration with your KYC provider through an on-chain claims registry." },
      { t: "Issuer console", d: "Minting, freezing, forced transfers and role management with an audit trail." },
      { t: "Distributions", d: "Pro-rata payouts to holders with rounding handled explicitly." },
      { t: "Test suite", d: "Transfer-rule, role and distribution tests, ready for an external audit." },
    ],
    steps: [
      { k: "Model the asset", d: "Who may hold it, who may move it, and what the issuer must be able to do." },
      { k: "Rules as code", d: "Transfer restrictions and roles written as small, testable modules." },
      { k: "Identity", d: "Wire the claims registry to your KYC provider." },
      { k: "Operate", d: "Issuer console, distributions and reporting." },
      { k: "Harden", d: "Role separation, rule edge cases and distribution math under test." },
    ],
    risks: ["Transfers to unverified wallets", "Freeze and forced-transfer misuse", "Issuer and agent role separation", "Distribution rounding", "Stale identity claims"],
    stack: ["Solidity", "ERC-3643", "Polygon", "Chainlink", "Node.js", "Next.js"],
    faqs: [
      ["Which chain?", "Usually an EVM chain your investors and custodians already support. We will discuss the trade-offs with you."],
      ["Can tokens be frozen or recovered?", "Yes, under explicit issuer roles. We make those powers visible and keep them separate from day-to-day operations."],
      ["Do you handle KYC?", "We integrate your KYC provider; we do not run KYC ourselves."],
    ],
  },
  {
    slug: "ai-development",
    n: "04",
    title: "Applied AI",
    short: "Retrieval and tool-calling agents wired into real systems, with a human approving anything that writes.",
    lead: "Retrieval and tool-calling agents connected to the systems you already run. Reads are automatic, and a person approves anything that writes.",
    deliverables: [
      { t: "Retrieval pipeline", d: "Hybrid vector and keyword search over your documents, chunked for your content." },
      { t: "Scoped agent", d: "A tool-calling loop that can only reach the tools you allow." },
      { t: "Approval workflow", d: "Write actions queue for a human before they reach your systems." },
      { t: "Evaluation harness", d: "A test set and scores, so changes are measured, not guessed." },
      { t: "Deployment", d: "Hosting, logging and monitoring for quality and cost." },
    ],
    steps: [
      { k: "Pick the job", d: "One workflow with a clear before and after. No platform first." },
      { k: "Eval set", d: "Real questions and expected answers, written before building." },
      { k: "Build", d: "Retrieval, tools and the approval path." },
      { k: "Measure", d: "Run the evals, fix the worst failures, repeat." },
      { k: "Ship", d: "Deploy with logs and a way to flag bad answers." },
    ],
    risks: ["Actions the model was not meant to take", "Prompt injection through documents", "Data leaking across users", "Quality drifting silently"],
    stack: ["Python", "FastAPI", "pgvector", "LangChain", "TypeScript"],
    faqs: [
      ["Which model?", "The one that passes your evals at the right cost. We keep the code model-agnostic."],
      ["Where does our data go?", "We design around your constraints, including self-hosted retrieval and providers with no training on your data."],
      ["Is this related to Web3?", "Sometimes: agents that read on-chain data or prepare transactions for a human to sign. Often it is plain business automation."],
    ],
  },
];

/** An illustrative interface image for a case study. `name` is the base filename
 *  produced by `npm run shots` (public/img/shots/<name>-<width>.webp). */
export type Shot = { name: string; alt: string };

export type Work = {
  id: string;
  tag: string;
  title: string;
  std: string;
  stdLabel: string;
  summary: string;
  context: string;
  built: string[];
  tested: string[];
  flow: string[];
  stack: string[];
  shot?: Shot;
};

export const WORK: Work[] = [
  {
    id: "amm",
    tag: "DeFi protocol",
    title: "Cross-chain AMM with staking and yield routing",
    std: "ERC-4626",
    stdLabel: "vault standard",
    summary: "A constant-product AMM with a staking module and cross-chain message passing, with invariant tests over every flow.",
    context: "The team needed liquidity on two chains with staking rewards that could not be double-claimed across them.",
    built: ["Constant-product pool with fee accounting", "ERC-4626 staking vault", "Cross-chain router over LayerZero", "Keeper scripts for reward routing"],
    tested: ["Reentrancy guards on every external call path", "Swap, deposit and withdrawal invariants in Foundry", "Cross-chain replay and ordering cases", "Static analysis with Slither, fuzzing with Echidna"],
    flow: ["User", "AMM pool", "Staking vault", "Router"],
    stack: ["Solidity", "Foundry", "LayerZero", "Slither", "Echidna"],
    shot: {
      name: "work-amm",
      alt: "Illustrative interface for a cross-chain AMM: a token swap card, a liquidity pool chart, a staking vault and a bridge between two chains.",
    },
  },
  {
    id: "rwa",
    tag: "Asset manager",
    title: "Permissioned real-world asset tokenization portal",
    std: "ERC-3643",
    stdLabel: "permissioned token",
    summary: "Identity-gated transfers with on-chain compliance checks, a claims registry and automated holder distributions.",
    context: "An issuer needed tokens that only verified investors could hold, with distributions that reconcile to the cent.",
    built: ["Permissioned token with modular transfer rules", "Claims registry tied to a KYC provider", "Issuer console with freeze and recovery", "Pro-rata distribution engine"],
    tested: ["Transfers to unverified wallets always revert", "Issuer and agent roles cannot overlap", "Distribution rounding never exceeds the pool", "Rule changes behind a timelock"],
    flow: ["Investor", "Claims", "Compliance", "Token"],
    stack: ["Solidity", "ERC-3643", "Polygon", "Chainlink"],

    shot: {
      name: "work-rwa",
      alt: "Illustrative issuer console for a permissioned asset token: an investor registry with verification status, compliance rules, a distribution chart and the issuance flow from investor to token.",
    },
  },
  {
    id: "custody",
    tag: "Fintech startup",
    title: "Multi-signature custody wallet with a policy engine",
    std: "2-of-3",
    stdLabel: "threshold signing",
    summary: "Threshold-signature vaults with per-transaction spend policies and hardware-backed keys, on web and mobile.",
    context: "The product needed shared custody where no single device or person could move funds alone.",
    built: ["Policy engine for limits, allowlists and approvals", "Signing service over AWS KMS", "Web and React Native clients on one API", "Audit log of every approval"],
    tested: ["No path signs without two approvals", "Policy bypass attempts through the API", "Key rotation without downtime", "Replay of approved requests"],
    flow: ["Client", "Policy", "Signer", "KMS"],
    stack: ["React Native", "Node.js", "PostgreSQL", "AWS KMS"],

    shot: {
      name: "work-custody",
      alt: "Illustrative custody console: a treasury vault, a pending transfer with two of three approvals, a policy engine and the signing path from client to key service.",
    },
  },
  {
    id: "rag",
    tag: "Logistics operator",
    title: "Retrieval-augmented agent over internal documents",
    std: "Hybrid",
    stdLabel: "vector + keyword",
    summary: "Hybrid retrieval over a chunked corpus, with a tool-calling agent and a human approving every write.",
    context: "Operations staff spent hours searching manuals and emails before updating the ERP.",
    built: ["Hybrid retrieval over pgvector and keyword search", "Tool-calling agent with read-only defaults", "Approval queue for ERP writes", "Evaluation set from real questions"],
    tested: ["Answers cite their sources", "No ERP write without approval", "Prompt injection from documents", "Regression runs on every change"],
    flow: ["Question", "Retriever", "Agent", "Approval"],
    stack: ["Python", "pgvector", "FastAPI", "LangChain"],

    shot: {
      name: "work-rag",
      alt: "Illustrative assistant interface: a chat answer with source citations, the retrieved documents, an approval queue for an ERP update and the pipeline from question to approval.",
    },
  },
];

/* The five kinds of system on /solutions. `fails`, `spec` and `flow` drive the
   page's visuals: the spec deck in the hero and the use-case explorer. Each
   `spec` is an illustrative test in the language that system is usually
   tested in, not code from a client project. `hot` = the flow node the spec
   guards. */
export type Solution = {
  n: string;
  title: string;
  problem: string;
  build: string;
  test: string;
  href: string;
  builds: string[];
  fails: string[];
  flow: string[];
  hot: number;
  file: string;
  runner: string;
  spec: string[];
};

export const SOLUTIONS: Solution[] = [
  {
    n: "01",
    title: "DeFi protocols",
    problem: "Money moves in one transaction, and any path you did not think of is someone else's profit.",
    build: "AMMs, vaults, staking, lending primitives and routers.",
    test: "Solvency and share-price invariants under long random call sequences.",
    href: "/services/blockchain-development",
    builds: ["AMMs", "ERC-4626 vaults", "Staking", "Lending primitives", "Routers"],
    fails: ["A price read from a pool an attacker can move", "Shares minted before the assets arrive", "Rounding that favours the caller"],
    flow: ["User", "Router", "Pool", "Vault", "Oracle"],
    hot: 3,
    file: "VaultInvariants.t.sol",
    runner: "Foundry",
    spec: [
      "// Shares are never worth more than the assets behind them.",
      "function invariant_solvency() public {",
      "  assertGe(asset.balanceOf(address(vault)),",
      "           vault.convertToAssets(vault.totalSupply()));",
      "}",
    ],
  },
  {
    n: "02",
    title: "Tokenized assets",
    problem: "The token must obey rules the law already set: who may hold it, and who may move it.",
    build: "Permissioned tokens, claims registries, issuer consoles and distributions.",
    test: "Transfer rules, role separation and distribution rounding.",
    href: "/services/rwa-tokenization",
    builds: ["ERC-3643 tokens", "Claims registries", "Issuer consoles", "Distributions"],
    fails: ["A transfer to a wallet that never passed KYC", "An agent role that can also mint", "A payout that rounds past the pool"],
    flow: ["Investor", "Claims", "Compliance", "Token", "Payouts"],
    hot: 2,
    file: "Compliance.t.sol",
    runner: "Foundry",
    spec: [
      "// Only verified investors can ever hold the token.",
      "function invariant_holdersVerified() public {",
      "  for (uint256 i; i < holders.length; i++)",
      "    assertTrue(registry.isVerified(holders[i]));",
      "}",
    ],
  },
  {
    n: "03",
    title: "Custody & wallets",
    problem: "Keys are the product. One compromised device should never be enough.",
    build: "Threshold signing, policy engines, web and mobile clients.",
    test: "Approval bypass, replay and key rotation.",
    href: "/case-studies#custody",
    builds: ["Threshold signing", "Policy engines", "Web & mobile clients", "Audit logs"],
    fails: ["One stolen device that can move funds", "An approval replayed on a new request", "A key rotation that locks everyone out"],
    flow: ["Client", "API", "Policy", "Signer", "KMS"],
    hot: 2,
    file: "policy.test.ts",
    runner: "Vitest",
    spec: [
      "// No path signs with fewer than two approvals.",
      'test("cannot sign alone", async () => {',
      "  const req = await policy.request(transfer);",
      "  await approve(req, alice);",
      '  await expect(signer.sign(req)).rejects.toThrow("2 of 3");',
      "});",
    ],
  },
  {
    n: "04",
    title: "Tokens & governance",
    problem: "Supply, voting power and treasury access are where incentives turn into attacks.",
    build: "ERC-20 systems, vesting, governors, timelocks and treasuries.",
    test: "Flash-loan voting, vesting edge cases and privileged roles.",
    href: "/services/blockchain-development",
    builds: ["ERC-20 systems", "Vesting", "Governors", "Timelocks", "Treasuries"],
    fails: ["Voting power borrowed for a single block", "A vesting cliff that unlocks early", "A privileged role with no timelock"],
    flow: ["Holder", "Token", "Governor", "Timelock", "Treasury"],
    hot: 2,
    file: "Governance.t.sol",
    runner: "Foundry",
    spec: [
      "// Votes count at the snapshot, so a flash loan adds nothing.",
      "function invariant_noFlashVotes() public {",
      "  uint256 snap = gov.proposalSnapshot(proposalId);",
      "  assertEq(gov.getVotes(attacker, snap), votesAt[snap]);",
      "}",
    ],
  },
  {
    n: "05",
    title: "AI on real systems",
    problem: "An agent that can write to your systems needs the same care as a contract.",
    build: "Retrieval, scoped tool-calling agents and approval queues.",
    test: "Unapproved actions, prompt injection and quality regressions.",
    href: "/services/ai-development",
    builds: ["Retrieval (RAG)", "Scoped tool-calling agents", "Approval queues", "Evaluation sets"],
    fails: ["A document that tells the agent what to do", "A write that skips human approval", "Answer quality that quietly regresses"],
    flow: ["Question", "Retriever", "Agent", "Approval", "ERP"],
    hot: 3,
    file: "test_agent.py",
    runner: "pytest",
    spec: [
      "# No write reaches the ERP without a human approval.",
      "def test_write_needs_approval(agent, erp, queue):",
      '    agent.run("mark order 4411 as shipped")',
      "    assert erp.writes == []",
      '    assert queue.pending[0].action == "update_order"',
    ],
  },
];

export type CatalogItem = { t: string; d: string; tags: string[]; href?: string };
export type CatalogGroup = { id: string; label: string; items: CatalogItem[] };
