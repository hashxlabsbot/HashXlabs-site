/* Service taxonomy: drives the mega menu, the catalogue and one generated
   page per item at /services/<slug>. Items with `href` point at an existing
   page instead of getting their own. Descriptions are our own wording. */

export type MenuItem = { slug: string; t: string; d: string; lead: string; points: string[]; href?: string };
export type MenuGroup = { id: string; label: string; items: MenuItem[] };
export type MenuSection = { id: string; label: string; overview?: string; groups: MenuGroup[] };

const it = (slug: string, t: string, d: string, lead: string, points: string[], href?: string): MenuItem => ({ slug, t, d, lead, points, href });

export const MENU: MenuSection[] = [
  {
    id: "blockchain",
    label: "Blockchain",
    overview: "/services/blockchain-development",
    groups: [
      {
        id: "core",
        label: "Core development",
        items: [
          it("blockchain-development-services", "Blockchain development", "Production chains, contracts and dApps", "End-to-end blockchain builds, from the first specification to mainnet operations, on public and permissioned networks.", ["Architecture and chain selection", "Contracts, backends and front ends", "Deployment, monitoring and handover"]),
          it("blockchain-integration", "Blockchain integration", "Connect ledgers to the systems you run", "Wire on-chain data and transactions into ERPs, core banking, payment processors and internal APIs.", ["Event indexing and webhooks", "Signing services and key management", "Reconciliation between chain and ledger"]),
          it("blockchain-migration", "Migration & network upgrades", "Move chains and contracts without downtime", "Planned migrations between chains, contract versions and client upgrades, with state carried over and verified.", ["State snapshots and replay", "Contract upgrade and token migration", "Rollback plans and cut-over runbooks"]),
          it("blockchain-consulting", "Blockchain consulting", "Architecture, feasibility and chain choice", "Independent technical advice before you commit budget: whether you need a chain, which one, and what it will cost to run.", ["Feasibility and threat assessment", "Chain and protocol comparison", "Build plan with written assumptions"]),
        ],
      },
      {
        id: "infra",
        label: "Infrastructure & protocols",
        items: [
          it("layer-2-appchains", "Layer 2s & appchains", "Rollups and application-specific chains", "Launch and operate rollups and appchains tuned to your throughput, fees and governance.", ["OP Stack, Arbitrum Orbit and Cosmos SDK", "Sequencer, bridge and explorer setup", "Upgrade and incident procedures"]),
          it("cross-chain-bridges", "Bridges & interoperability", "Messaging and token movement across chains", "Cross-chain messaging and token bridges designed around replay protection, finality and rate limits.", ["LayerZero, CCIP and Wormhole integration", "Lock-mint and burn-mint designs", "Rate limits and emergency pause"]),
          it("node-rpc-infrastructure", "Node & RPC infrastructure", "Dedicated nodes, RPC and monitoring", "Reliable node fleets and RPC endpoints with the monitoring to know when they are not.", ["Multi-client, multi-region nodes", "Load-balanced RPC with failover", "Alerting on lag, reorgs and errors"]),
          it("oracles-indexing", "Oracles & indexing", "Price feeds, data and query APIs", "Bring off-chain data on-chain safely, and on-chain data into your apps quickly.", ["Chainlink and Pyth with staleness checks", "Subgraphs and custom indexers", "Query APIs for dApps and analytics"]),
        ],
      },
      {
        id: "contracts",
        label: "Smart contracts",
        items: [
          it("smart-contract-development", "Smart contract development", "Specified, tested contracts", "Contracts written against a specification, with unit, fuzz and invariant tests from the first commit.", ["Solidity, Vyper and Rust", "Upgradeable and immutable designs", "Deployment scripts and verification"]),
          it("smart-contract-audit-link", "Security review & testing", "Static analysis, fuzzing, manual review", "", [], "/services/smart-contract-audit"),
          it("token-development", "Token development", "Fungible tokens and tokenomics", "Tokens with the controls your model needs, and the supply schedule tested before launch.", ["ERC-20 and SPL tokens with permits and caps", "Vesting, cliffs and emissions", "Allow-listed sales and claims"]),
          it("gas-optimisation", "Gas optimisation", "Lower costs, same behaviour", "Cut transaction costs through storage, calldata and loop review, with tests proving behaviour did not change.", ["Storage packing and caching", "Calldata and event review", "Before-and-after gas reports"]),
        ],
      },
      {
        id: "ecosystems",
        label: "Frameworks & ecosystems",
        items: [
          it("ethereum-evm-development", "Ethereum & EVM chains", "Ethereum, L2s and EVM networks", "Build once for the EVM and deploy across Ethereum, its L2s and compatible chains.", ["Foundry and Hardhat toolchains", "Multi-chain deployment scripts", "Chain-specific gas and finality tuning"]),
          it("solana-development", "Solana", "Programs, SPL tokens and clients", "Solana programs and clients with account validation and CPI handled explicitly.", ["Rust and Anchor programs", "SPL tokens and token extensions", "Client SDKs and transaction building"]),
          it("cosmos-sdk-development", "Cosmos SDK", "Sovereign chains and IBC", "Application chains on the Cosmos SDK with IBC connectivity.", ["Custom modules in Go", "Validator and genesis setup", "IBC channels and relayers"]),
          it("polkadot-substrate", "Polkadot & Substrate", "Runtimes and parachains", "Custom runtimes and pallets on Substrate, as solo chains or parachains.", ["Pallet development in Rust", "Runtime upgrades", "Parachain onboarding"]),
          it("hyperledger-fabric", "Hyperledger Fabric", "Permissioned enterprise networks", "Permissioned networks where members, privacy and throughput matter more than openness.", ["Chaincode development", "Channels and private data", "Integration with existing systems"]),
        ],
      },
      {
        id: "nextgen",
        label: "Next-generation",
        items: [
          it("zero-knowledge-development", "Zero-knowledge proofs", "Private and succinct verification", "Circuits and verifiers for private transactions, proofs of reserve and scaling.", ["Circom and Noir circuits", "On-chain verifier contracts", "Proof generation services"]),
          it("account-abstraction", "Account abstraction", "Smart accounts and gasless UX", "Smart accounts that make wallets feel like apps: passkeys, sponsored gas and session keys.", ["ERC-4337 accounts and bundlers", "Paymasters for sponsored gas", "Session keys and recovery"]),
          it("decentralized-identity", "Decentralised identity", "Credentials users control", "Verifiable credentials and on-chain attestations for KYC, access and reputation.", ["DIDs and verifiable credentials", "On-chain attestations", "Privacy-preserving checks"]),
          it("depin-development", "DePIN networks", "Physical infrastructure on-chain", "Networks that reward real-world devices and services with verifiable on-chain accounting.", ["Device identity and proofs", "Reward and slashing logic", "Operator dashboards"]),
        ],
      },
    ],
  },
  {
    id: "stablecoins",
    label: "Stablecoins",
    groups: [
      {
        id: "stable-infra",
        label: "Stablecoin infrastructure",
        items: [
          it("stablecoin-development", "Stablecoin development", "Fiat- and crypto-backed tokens", "Stablecoins with mint, burn and freeze controls, and the operational tooling around them.", ["Fiat-backed and collateralised designs", "Role-separated mint and burn", "Blocklist and freeze controls"]),
          it("mint-redemption-rails", "Mint & redemption rails", "Issue and redeem against reserves", "Issuance and redemption flows that reconcile tokens with the reserve account.", ["Banking and custodian integration", "Redemption queues and limits", "Daily reconciliation"]),
          it("proof-of-reserves", "Reserves & attestation tooling", "Show the backing, continuously", "Publish reserve data holders can verify, on-chain and in dashboards.", ["Proof-of-reserve feeds", "Attestation publishing", "Public transparency dashboards"]),
        ],
      },
      {
        id: "payments",
        label: "Payment rails",
        items: [
          it("crypto-payment-gateway", "Crypto payment gateway", "Stablecoin checkout for merchants", "Accept stablecoins and crypto with checkout, invoicing and settlement your finance team can reconcile.", ["Hosted checkout and invoicing", "Webhooks and settlement reports", "Auto-conversion options"]),
          it("cross-border-payments", "Cross-border settlement", "Faster international transfers", "Move value across borders on stablecoin rails with compliance checks built in.", ["Corridor and liquidity design", "Sanctions and travel-rule checks", "Settlement monitoring"]),
          it("on-off-ramp", "On- & off-ramps", "Between fiat and crypto", "Integrate fiat on- and off-ramps into your product with KYC and limits handled.", ["Ramp provider integration", "KYC and limit management", "Payout status tracking"]),
          it("treasury-payouts", "Treasury & payouts", "Mass payouts and treasury ops", "Pay contributors, partners and users in stablecoins, with approvals and audit trails.", ["Batch payouts", "Multi-approver flows", "Accounting exports"]),
        ],
      },
    ],
  },
  {
    id: "rwa",
    label: "RWA",
    overview: "/services/rwa-tokenization",
    groups: [
      {
        id: "rwa-infra",
        label: "RWA infrastructure",
        items: [
          it("rwa-compliance-stack", "Compliance stack", "Identity and transfer rules on-chain", "Identity registries, claims and transfer rules that keep tokenized assets with eligible holders.", ["Identity and claims registry", "Pluggable transfer rules", "Freeze, recovery and forced transfer"]),
          it("tokenization-platform", "Tokenization platform", "The full issuance stack", "The contracts, services and consoles an issuer needs to put assets on-chain and run them.", ["Issuer and agent consoles", "Investor onboarding", "Cap table and reporting"]),
          it("rwa-token-standards", "Token standards", "ERC-3643, ERC-1400, ERC-4626", "Choose and implement the standard that fits the asset, the investors and the venue.", ["ERC-3643 permissioned tokens", "ERC-1400 security tokens", "ERC-4626 yield-bearing vaults"]),
          it("jurisdiction-controls", "Jurisdiction-aware controls", "Rules by investor type and region", "Encode eligibility by investor type and region, with the rules set alongside your counsel.", ["Per-region eligibility rules", "Holding and lock-up limits", "Rule changes behind a timelock"]),
        ],
      },
      {
        id: "rwa-solutions",
        label: "RWA solutions",
        items: [
          it("issuance-investor-portal", "Issuance & investor portal", "Primary issuance and onboarding", "Portals for subscribing, onboarding and holding tokenized assets.", ["Subscription and payments", "KYC and accreditation", "Holder dashboards and documents"]),
          it("rwa-secondary-trading", "Secondary trading", "Compliant transfers and venues", "Let eligible holders trade, through a venue or peer to peer, with compliance checks on every transfer.", ["Order book or RFQ venues", "Compliance on every transfer", "Settlement and reporting"]),
          it("yield-distributions", "Yield & distributions", "Pro-rata payouts to holders", "Distribute income to holders automatically, with rounding handled explicitly.", ["Snapshot-based distributions", "Stablecoin payouts", "Tax and statement exports"]),
        ],
      },
      {
        id: "asset-classes",
        label: "Asset classes",
        items: [
          it("real-estate-tokenization", "Real estate", "Fractional property ownership", "Tokenize property or property funds into fractional, transferable interests.", ["SPV and share mapping", "Rental income distribution", "Investor reporting"]),
          it("private-credit-tokenization", "Private credit", "Loans and credit funds on-chain", "Bring loan pools and credit funds on-chain with transparent performance data.", ["Loan-level data feeds", "Tranching and waterfalls", "Repayment tracking"]),
          it("treasury-bond-tokenization", "Treasuries & bonds", "Tokenized fixed income", "Tokenized government and corporate debt with coupon and maturity handled on-chain.", ["Coupon distributions", "Maturity and redemption", "NAV reporting"]),
          it("commodity-tokenization", "Commodities", "Gold, metals and goods", "Tokens backed by physical commodities, with custody and audit data on-chain.", ["Vault and custodian integration", "Bar-level or pooled backing", "Redemption for physical"]),
          it("fund-tokenization", "Funds", "Tokenized fund units", "Issue fund units as tokens for faster subscriptions, transfers and reporting.", ["Subscription and redemption", "NAV updates", "Transfer agent integration"]),
          it("carbon-credit-tokenization", "Carbon credits", "Traceable environmental assets", "Tokenize carbon credits with registry links and retirement you can verify.", ["Registry bridging", "Retirement and certificates", "Double-counting protection"]),
        ],
      },
    ],
  },
  {
    id: "solutions",
    label: "Exchanges & DeFi",
    groups: [
      {
        id: "exchanges",
        label: "Crypto exchanges",
        items: [
          it("centralized-exchange-development", "Centralized exchange", "Order books, custody and trading", "Exchanges with a matching engine, custody, KYC and the back office to run them.", ["Matching engine and order types", "Hot and cold wallet custody", "KYC, AML and admin console"]),
          it("dex-development", "DEX development", "AMMs and on-chain order books", "Decentralised exchanges with pools, routing and fee logic tested under adversarial conditions.", ["AMM and concentrated liquidity", "Routers and aggregation", "Fee and LP accounting"]),
          it("p2p-exchange", "P2P trading platform", "Escrowed user-to-user trades", "Peer-to-peer trading with escrow, dispute handling and reputation.", ["Escrow contracts or custodial escrow", "Disputes and arbitration", "Payment-method management"]),
          it("white-label-exchange", "White-label exchange", "Launch on proven components", "A branded exchange on a pre-built core, configured for your markets and compliance.", ["Branding and configuration", "Liquidity integrations", "Launch and operations support"]),
          it("derivatives-exchange", "Derivatives exchange", "Perpetuals, futures and margin", "Derivatives trading with margin, funding and liquidation engines built for stress.", ["Perpetuals and futures", "Margin and liquidation engine", "Insurance fund and risk limits"]),
          it("hybrid-exchange", "Hybrid exchange", "Central liquidity, self-custody", "Central-order-book speed with settlement or custody on-chain.", ["Off-chain matching", "On-chain settlement", "Proof of solvency"]),
        ],
      },
      {
        id: "banking",
        label: "Digital banking",
        items: [
          it("crypto-banking-platform", "Crypto banking platform", "Accounts, custody and payments", "Banking-style products for digital assets: accounts, custody, transfers and statements.", ["Multi-asset accounts", "Custody integration", "Statements and reporting"]),
          it("digital-asset-rails-for-banks", "Digital asset rails for banks", "Add crypto to existing banking", "Let an existing bank or fintech offer digital assets without replacing its core.", ["Core-banking integration", "Custody and trading partners", "Compliance workflows"]),
          it("crypto-card-programs", "Crypto card programs", "Spend digital assets anywhere", "Card programs funded from crypto or stablecoin balances, integrated with an issuing partner.", ["Issuer and processor integration", "Real-time conversion", "Spend controls"]),
        ],
      },
      {
        id: "wallets",
        label: "Wallets & digital assets",
        items: [
          it("crypto-wallet-development", "Crypto wallet development", "Web, mobile and extension wallets", "Non-custodial wallets with clear transaction previews and safe defaults.", ["Web, mobile and extension", "Transaction simulation", "Multi-chain support"]),
          it("mpc-custody-wallets", "MPC & custody wallets", "Threshold signing and policies", "Institutional custody with threshold signing, approval policies and hardware-backed keys.", ["MPC and multisig signing", "Policy engine and approvals", "Audit trail"]),
          it("nft-marketplace", "NFT marketplace", "Mint, list and trade", "Marketplaces for collections and digital items, with royalties and lazy minting.", ["ERC-721 and ERC-1155", "Auctions and offers", "Royalties and creator tools"]),
          it("token-launchpad", "Token launchpad", "Sales, vesting and claims", "Launch tokens with allow-listed sales, vesting and claim portals.", ["Allow-lists and tiers", "Vesting-aware claims", "Anti-bot protections"]),
        ],
      },
      {
        id: "defi",
        label: "Decentralised finance",
        items: [
          it("defi-lending-protocol", "Lending & borrowing", "Collateral, rates and liquidations", "Lending markets with interest-rate models, liquidations and oracle safety under test.", ["Collateral and risk parameters", "Interest-rate models", "Liquidation engines"]),
          it("staking-platform", "Staking & liquid staking", "Rewards and liquid tokens", "Staking pools and liquid staking tokens with correct reward accounting.", ["Staking and reward pools", "Liquid staking tokens", "Validator integration"]),
          it("yield-vaults", "Yield vaults", "ERC-4626 strategy vaults", "Tokenised vaults with pluggable strategies and share-price invariants under test.", ["ERC-4626 vaults", "Strategy modules", "Harvest and fee logic"]),
          it("dex-aggregator", "DEX aggregator", "Best-price routing", "Route trades across venues for the best execution, with slippage protection.", ["Multi-venue routing", "Slippage and MEV protection", "Gas-aware paths"]),
          it("dao-development", "DAO & governance", "Governors, voting and treasuries", "On-chain governance with timelocks and treasury controls that resist flash-loan attacks.", ["Governor and voting tokens", "Timelocked execution", "Treasury modules"]),
        ],
      },
    ],
  },
  {
    id: "ai",
    label: "AI",
    overview: "/services/ai-development",
    groups: [
      {
        id: "ai-web3",
        label: "AI for Web3",
        items: [
          it("ai-trading-agents", "Trading & execution agents", "Agents with policy guardrails", "Agents that research and propose trades, executing only within policies a human sets.", ["Strategy and signal pipelines", "Policy-bound execution", "Full decision logs"]),
          it("onchain-analytics-ai", "On-chain analytics", "Ask questions of chain data", "Natural-language analytics over indexed on-chain data for teams and users.", ["Indexed chain data", "Question-to-query agents", "Dashboards and alerts"]),
          it("ai-compliance-monitoring", "AI-assisted compliance", "Transaction monitoring and triage", "Flag and triage suspicious activity faster, with analysts making the final call.", ["Risk scoring", "Alert triage and summaries", "Case management integration"]),
          it("ai-crypto-exchange", "AI for exchanges", "Surveillance, support and risk", "AI inside exchange operations: market surveillance, support automation and risk signals.", ["Market-abuse detection", "Support automation", "Risk and fraud signals"]),
        ],
      },
      {
        id: "ai-enterprise",
        label: "Enterprise AI",
        items: [
          it("ai-agents-automation", "AI agents & automation", "Tool-calling agents on real systems", "Agents connected to your systems, with a human approving anything that writes.", ["Scoped tool access", "Approval workflows", "Audit logging"]),
          it("rag-development", "Retrieval (RAG) systems", "Answers from your documents", "Search and question answering over your documents, with sources cited.", ["Hybrid vector and keyword search", "Citations on every answer", "Access control per user"]),
          it("ai-evaluation", "Evaluation & monitoring", "Measure quality, not vibes", "Test sets, scoring and monitoring so AI changes are measured before they ship.", ["Evaluation datasets", "Automated scoring", "Drift and cost monitoring"]),
        ],
      },
    ],
  },
];

export const ITEMS = MENU.flatMap((s) =>
  s.groups.flatMap((g) => g.items.map((item) => ({ item, group: g, section: s })))
);
export const itemHref = (i: MenuItem) => i.href ?? `/services/${i.slug}`;

import type { CatalogGroup } from "./site";

/** The whole taxonomy as catalogue groups (one per top-level area). */
export const CATALOG: CatalogGroup[] = MENU.map((s) => ({
  id: s.id,
  label: s.label,
  items: s.groups.flatMap((g) => g.items.map((i) => ({ t: i.t, d: i.d, tags: [g.label], href: itemHref(i) }))),
}));
