// Generates minimalist aesthetic dApp and service cards for the hero stream corridor.
// Each card represents a real service/dApp product built by HashX Labs:
// 1. DEX & AMM Token Swap
// 2. Smart Contract Audit & Formal Verification
// 3. Institutional RWA Tokenization
// 4. MPC Multisig Custody & Key Quorum
// 5. Autonomous Web3 AI Agent
// 6. Stablecoin Issuance & Reserve Attestation
// 7. ZK Cross-Chain Bridge
// 8. Liquid Staking & Yield Protocol
// 9. L2 Rollup Sequencer & Gas Telemetry

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = "public/img/stream";
const WIDTHS = [360, 720, 1080];
const QUALITY = 88;

function baseCard({ title, subtitle, badge, badgeColor = "green", isDark = false, content }) {
  const bg = isDark ? "#0b1220" : "#ffffff";
  const border = isDark ? "#1e293b" : "#e2e8f0";
  const headerBg = isDark ? "#111c30" : "#f8fafc";
  const headerBorder = isDark ? "#1e293b" : "#edf2f7";
  const titleColor = isDark ? "#ffffff" : "#0f172a";
  const subColor = isDark ? "#94a3b8" : "#64748b";
  const outerBg = isDark ? "#060a12" : "#f4f6f9";

  const badgeStyles = {
    green: {
      bg: isDark ? "#064e3b" : "#ecfdf5",
      border: isDark ? "#059669" : "#a7f3d0",
      dot: "#10b981",
      text: isDark ? "#34d399" : "#065f46",
    },
    blue: {
      bg: isDark ? "#0c2d6b" : "#eff6ff",
      border: isDark ? "#2563eb" : "#bfdbfe",
      dot: "#3b82f6",
      text: isDark ? "#60a5fa" : "#1d4ed8",
    },
    purple: {
      bg: isDark ? "#3b0764" : "#faf5ff",
      border: isDark ? "#9333ea" : "#e9d5ff",
      dot: "#a855f7",
      text: isDark ? "#c084fc" : "#6b21a8",
    },
  }[badgeColor];

  return `<svg width="720" height="1000" viewBox="0 0 720 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0b1220" flood-opacity="${isDark ? "0.3" : "0.07"}"/>
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0b1220" flood-opacity="${isDark ? "0.2" : "0.04"}"/>
    </filter>
  </defs>
  <rect width="720" height="1000" fill="${outerBg}"/>
  
  <!-- Outer Window Card -->
  <g filter="url(#shadow)">
    <rect x="36" y="36" width="648" height="928" rx="22" fill="${bg}" stroke="${border}" stroke-width="1.5"/>
  </g>

  <!-- Window controls -->
  <circle cx="68" cy="72" r="5.5" fill="#f87171"/>
  <circle cx="86" cy="72" r="5.5" fill="#fbbf24"/>
  <circle cx="104" cy="72" r="5.5" fill="#34d399"/>

  <!-- Protocol Header -->
  <g transform="translate(48, 100)">
    <rect x="0" y="0" width="624" height="66" rx="14" fill="${headerBg}" stroke="${headerBorder}" stroke-width="1"/>
    <text x="22" y="37" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="19" font-weight="700" fill="${titleColor}">${title}</text>
    <text x="22" y="55" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="12" fill="${subColor}">${subtitle}</text>
    
    <!-- Badge -->
    <rect x="470" y="19" width="134" height="28" rx="14" fill="${badgeStyles.bg}" stroke="${badgeStyles.border}" stroke-width="1"/>
    <circle cx="486" cy="33" r="3.5" fill="${badgeStyles.dot}"/>
    <text x="498" y="37" font-family="-apple-system, BlinkMacSystemFont, Arial, sans-serif" font-size="11.5" font-weight="600" fill="${badgeStyles.text}">${badge}</text>
  </g>

  <!-- Body Content -->
  <g transform="translate(48, 185)">
    ${content}
  </g>
</svg>`;
}

const CARDS = [
  // 1. AMM Token Swap
  {
    name: "dapp-amm-swap",
    svg: baseCard({
      title: "Uniswap v3 AMM Pool",
      subtitle: "Ethereum Mainnet · Low Slippage Engine",
      badge: "Mainnet Live",
      badgeColor: "green",
      content: `
        <!-- Input -->
        <rect x="0" y="0" width="624" height="145" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">YOU PAY</text>
        <text x="24" y="85" font-family="sans-serif" font-size="44" font-weight="700" fill="#0f172a">14.50</text>
        <text x="24" y="116" font-family="sans-serif" font-size="14" fill="#94a3b8">~$39,875.00 USD</text>
        <rect x="460" y="44" width="140" height="50" rx="25" fill="#0f172a"/>
        <circle cx="488" cy="69" r="14" fill="#627eea"/>
        <text x="514" y="75" font-family="sans-serif" font-size="17" font-weight="700" fill="#ffffff">ETH</text>

        <!-- Swap Arrow -->
        <circle cx="312" cy="175" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <path d="M312 165v20M304 177l8 8 8-8" stroke="#0057d9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>

        <!-- Output -->
        <rect x="0" y="205" width="624" height="145" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
        <text x="24" y="239" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">YOU RECEIVE</text>
        <text x="24" y="290" font-family="sans-serif" font-size="44" font-weight="700" fill="#0f172a">39,836.20</text>
        <text x="24" y="321" font-family="sans-serif" font-size="14" fill="#94a3b8">Rate: 1 ETH = 2,747.32 USDC</text>
        <rect x="440" y="249" width="160" height="50" rx="25" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <circle cx="468" cy="274" r="14" fill="#2775ca"/>
        <text x="494" y="280" font-family="sans-serif" font-size="17" font-weight="700" fill="#0f172a">USDC</text>

        <!-- Metrics -->
        <g transform="translate(0, 380)">
          <rect x="0" y="0" width="624" height="190" rx="16" fill="#ffffff" stroke="#edf2f7" stroke-width="1"/>
          
          <text x="24" y="38" font-family="sans-serif" font-size="14" fill="#64748b">Expected Output</text>
          <text x="600" y="38" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="600" fill="#0f172a">39,836.20 USDC</text>

          <text x="24" y="80" font-family="sans-serif" font-size="14" fill="#64748b">Price Impact</text>
          <text x="600" y="80" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="600" fill="#10b981">&lt; 0.01%</text>

          <text x="24" y="122" font-family="sans-serif" font-size="14" fill="#64748b">Network Gas Fee</text>
          <text x="600" y="122" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="600" fill="#0f172a">$1.42 (12 Gwei)</text>

          <text x="24" y="164" font-family="sans-serif" font-size="14" fill="#64748b">Routing Protocol</text>
          <text x="600" y="164" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="600" fill="#0057d9">HashX Optimal AMM</text>
        </g>

        <!-- Button -->
        <rect x="0" y="605" width="624" height="64" rx="16" fill="#0057d9"/>
        <text x="312" y="645" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">Execute Swap</text>
      `,
    }),
  },

  // 2. Smart Contract Audit & Formal Verification
  {
    name: "dapp-security-audit",
    svg: baseCard({
      title: "Smart Contract Audit Suite",
      subtitle: "Foundry &amp; Certora Invariant Fuzzing",
      badge: "Audit Verified",
      badgeColor: "green",
      isDark: true,
      content: `
        <!-- Test Results Box -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="210" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
          
          <rect x="20" y="20" width="68" height="24" rx="6" fill="#064e3b"/>
          <text x="54" y="36" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#34d399">PASS</text>
          <text x="100" y="37" font-family="monospace" font-size="13.5" fill="#f1f5f9">invariant_solvencyRatioAbove100()</text>
          <text x="604" y="37" text-anchor="end" font-family="monospace" font-size="12" fill="#64748b">50,000 runs</text>

          <line x1="20" y1="65" x2="604" y2="65" stroke="#1e293b" stroke-width="1"/>

          <rect x="20" y="85" width="68" height="24" rx="6" fill="#064e3b"/>
          <text x="54" y="101" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#34d399">PASS</text>
          <text x="100" y="102" font-family="monospace" font-size="13.5" fill="#f1f5f9">testFuzz_noReentrancyDrain(address,uint)</text>
          <text x="604" y="102" text-anchor="end" font-family="monospace" font-size="12" fill="#64748b">10,000 runs</text>

          <line x1="20" y1="130" x2="604" y2="130" stroke="#1e293b" stroke-width="1"/>

          <rect x="20" y="150" width="68" height="24" rx="6" fill="#064e3b"/>
          <text x="54" y="166" text-anchor="middle" font-family="monospace" font-size="12" font-weight="700" fill="#34d399">PASS</text>
          <text x="100" y="167" font-family="monospace" font-size="13.5" fill="#f1f5f9">invariant_zeroUnbackedMint()</text>
          <text x="604" y="167" text-anchor="end" font-family="monospace" font-size="12" fill="#64748b">depth k=32</text>
        </g>

        <!-- Code Snippet -->
        <g transform="translate(0, 235)">
          <rect x="0" y="0" width="624" height="270" rx="16" fill="#050914" stroke="#1e293b" stroke-width="1"/>
          
          <!-- Code Title -->
          <rect x="0" y="0" width="624" height="40" rx="16" fill="#0a1020"/>
          <text x="24" y="25" font-family="monospace" font-size="13" fill="#60a5fa">VaultKernel.sol · Invariant Guard</text>

          <text x="24" y="75" font-family="monospace" font-size="13" fill="#93c5fd">function <tspan fill="#f1f5f9">withdraw</tspan>(uint256 shares) external nonReentrant {</text>
          <text x="44" y="105" font-family="monospace" font-size="13" fill="#94a3b8">uint256 assets = previewWithdraw(shares);</text>
          <text x="44" y="135" font-family="monospace" font-size="13" fill="#34d399">// Invariant: reserves must strictly back liabilities</text>
          <text x="44" y="165" font-family="monospace" font-size="13" fill="#f1f5f9">require(totalAssets() &gt;= totalDebt(), <tspan fill="#fbbf24">"Insolvent"</tspan>);</text>
          <text x="44" y="195" font-family="monospace" font-size="13" fill="#94a3b8">_burn(msg.sender, shares);</text>
          <text x="44" y="225" font-family="monospace" font-size="13" fill="#94a3b8">SafeERC20.safeTransfer(asset, msg.sender, assets);</text>
          <text x="24" y="255" font-family="monospace" font-size="13" fill="#93c5fd">}</text>
        </g>

        <!-- Coverage Banner -->
        <g transform="translate(0, 530)">
          <rect x="0" y="0" width="624" height="130" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
          <text x="24" y="42" font-family="sans-serif" font-size="15" font-weight="600" fill="#f1f5f9">Formal Verification Coverage</text>
          <text x="600" y="42" text-anchor="end" font-family="sans-serif" font-size="15" font-weight="700" fill="#34d399">100% Passed</text>
          
          <!-- Progress bar -->
          <rect x="24" y="62" width="576" height="12" rx="6" fill="#1e293b"/>
          <rect x="24" y="62" width="576" height="12" rx="6" fill="#10b981"/>

          <text x="24" y="105" font-family="sans-serif" font-size="13" fill="#94a3b8">0 Criticals · 0 Highs · Formal Mathematical Proof Active</text>
        </g>
      `,
    }),
  },

  // 3. RWA Tokenization Console
  {
    name: "dapp-rwa-tokenization",
    svg: baseCard({
      title: "RWA Asset Tokenization",
      subtitle: "ERC-3643 Compliant Security Token",
      badge: "ERC-3643 Active",
      badgeColor: "blue",
      content: `
        <!-- Asset Overview -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="150" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">TOTAL ASSET VALUE</text>
          <text x="24" y="86" font-family="sans-serif" font-size="44" font-weight="700" fill="#0f172a">$48,500,000</text>
          <text x="24" y="120" font-family="sans-serif" font-size="14" fill="#059669">48,500,000 Tokens (NAV: $1.0000 USD)</text>

          <rect x="450" y="40" width="150" height="54" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
          <text x="525" y="64" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="600" fill="#1e40af">ASSET CLASS</text>
          <text x="525" y="82" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="700" fill="#1d4ed8">Private Debt</text>
        </g>

        <!-- Compliance List -->
        <g transform="translate(0, 175)">
          <rect x="0" y="0" width="624" height="270" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="38" font-family="sans-serif" font-size="16" font-weight="700" fill="#0f172a">On-Chain Compliance Controls</text>

          <!-- Item 1 -->
          <g transform="translate(24, 60)">
            <circle cx="16" cy="16" r="16" fill="#ecfdf5"/>
            <path d="M11 16l3.5 3.5 7-7" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round"/>
            <text x="44" y="15" font-family="sans-serif" font-size="14.5" font-weight="600" fill="#0f172a">Identity Registry (ONCHAINID)</text>
            <text x="44" y="32" font-family="sans-serif" font-size="12.5" fill="#64748b">64 of 64 accredited investors KYC verified</text>
          </g>

          <!-- Item 2 -->
          <g transform="translate(24, 125)">
            <circle cx="16" cy="16" r="16" fill="#ecfdf5"/>
            <path d="M11 16l3.5 3.5 7-7" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round"/>
            <text x="44" y="15" font-family="sans-serif" font-size="14.5" font-weight="600" fill="#0f172a">Jurisdiction Allowlist</text>
            <text x="44" y="32" font-family="sans-serif" font-size="12.5" fill="#64748b">Reg D / Reg S compliant · US · EU · SG</text>
          </g>

          <!-- Item 3 -->
          <g transform="translate(24, 190)">
            <circle cx="16" cy="16" r="16" fill="#ecfdf5"/>
            <path d="M11 16l3.5 3.5 7-7" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round"/>
            <text x="44" y="15" font-family="sans-serif" font-size="14.5" font-weight="600" fill="#0f172a">Automated Yield Distributions</text>
            <text x="44" y="32" font-family="sans-serif" font-size="12.5" fill="#64748b">Quarterly smart contract dividend payouts</text>
          </g>
        </g>

        <!-- Holder Breakdown -->
        <g transform="translate(0, 470)">
          <rect x="0" y="0" width="624" height="195" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          
          <text x="24" y="36" font-family="sans-serif" font-size="15" font-weight="600" fill="#0f172a">Investor Cap Table Allocation</text>

          <g transform="translate(24, 55)">
            <text x="0" y="14" font-family="sans-serif" font-size="13" fill="#64748b">Institutional Credit Fund</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="13" font-weight="700" fill="#0f172a">42.5% ($20.6M)</text>
            <rect x="0" y="24" width="576" height="8" rx="4" fill="#e2e8f0"/>
            <rect x="0" y="24" width="245" height="8" rx="4" fill="#0057d9"/>
          </g>

          <g transform="translate(24, 115)">
            <text x="0" y="14" font-family="sans-serif" font-size="13" fill="#64748b">Accredited Family Offices</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="13" font-weight="700" fill="#0f172a">35.0% ($17.0M)</text>
            <rect x="0" y="24" width="576" height="8" rx="4" fill="#e2e8f0"/>
            <rect x="0" y="24" width="201" height="8" rx="4" fill="#2563eb"/>
          </g>
        </g>
      `,
    }),
  },

  // 4. MPC Multisig Custody & Key Quorum
  {
    name: "dapp-mpc-custody",
    svg: baseCard({
      title: "Institutional Custody Vault",
      subtitle: "Multi-Party Computation · 2-of-3 Threshold",
      badge: "Quorum Met",
      badgeColor: "green",
      content: `
        <!-- Pending Action Box -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="155" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">PENDING VAULT DISBURSEMENT</text>
          <text x="24" y="85" font-family="sans-serif" font-size="44" font-weight="700" fill="#0f172a">1,250,000</text>
          <text x="235" y="85" font-family="sans-serif" font-size="20" font-weight="700" fill="#64748b">USDC</text>
          <text x="24" y="120" font-family="sans-serif" font-size="14" fill="#64748b">Destination: Cold Treasury Wallet · <tspan font-family="monospace">0x8f3…9d1a</tspan></text>
        </g>

        <!-- Signers Matrix -->
        <g transform="translate(0, 180)">
          <rect x="0" y="0" width="624" height="260" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="38" font-family="sans-serif" font-size="16" font-weight="700" fill="#0f172a">Signer Approval Quorum (2 / 3)</text>

          <!-- Signer 1 -->
          <g transform="translate(24, 60)">
            <circle cx="18" cy="18" r="18" fill="#ecfdf5"/>
            <path d="M12 18l4 4 8-8" stroke="#10b981" stroke-width="2.2" fill="none" stroke-linecap="round"/>
            <text x="50" y="16" font-family="sans-serif" font-size="15" font-weight="600" fill="#0f172a">Signer 1: Hardware Security Module (HSM)</text>
            <text x="50" y="34" font-family="sans-serif" font-size="12.5" fill="#10b981">Signed · Oct 04, 18:24 UTC</text>
          </g>

          <line x1="24" y1="125" x2="600" y2="125" stroke="#edf2f7" stroke-width="1"/>

          <!-- Signer 2 -->
          <g transform="translate(24, 140)">
            <circle cx="18" cy="18" r="18" fill="#ecfdf5"/>
            <path d="M12 18l4 4 8-8" stroke="#10b981" stroke-width="2.2" fill="none" stroke-linecap="round"/>
            <text x="50" y="16" font-family="sans-serif" font-size="15" font-weight="600" fill="#0f172a">Signer 2: AWS Cloud KMS Shard</text>
            <text x="50" y="34" font-family="sans-serif" font-size="12.5" fill="#10b981">Signed · Oct 04, 18:26 UTC</text>
          </g>

          <line x1="24" y1="200" x2="600" y2="200" stroke="#edf2f7" stroke-width="1"/>

          <!-- Signer 3 -->
          <g transform="translate(24, 215)">
            <circle cx="18" cy="18" r="18" fill="#f1f5f9"/>
            <circle cx="18" cy="18" r="4" fill="#94a3b8"/>
            <text x="50" y="16" font-family="sans-serif" font-size="15" font-weight="600" fill="#64748b">Signer 3: Executive Recovery Key</text>
            <text x="50" y="34" font-family="sans-serif" font-size="12.5" fill="#94a3b8">Quorum satisfied (optional)</text>
          </g>
        </g>

        <!-- Time-lock Details -->
        <g transform="translate(0, 465)">
          <rect x="0" y="0" width="624" height="100" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="36" font-family="sans-serif" font-size="14" fill="#64748b">Time-lock Enforced</text>
          <text x="600" y="36" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#0f172a">24 Hours Required</text>
          
          <text x="24" y="72" font-family="sans-serif" font-size="14" fill="#64748b">Execution Time Remaining</text>
          <text x="600" y="72" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#10b981">Ready to Broadcast</text>
        </g>

        <!-- Button -->
        <rect x="0" y="590" width="624" height="64" rx="16" fill="#10b981"/>
        <text x="312" y="630" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">Broadcast Transaction</text>
      `,
    }),
  },

  // 5. Autonomous Web3 AI Agent
  {
    name: "dapp-ai-agents",
    svg: baseCard({
      title: "Autonomous Web3 AI Agent",
      subtitle: "Arbitrage, Yield &amp; Invariant Execution",
      badge: "Agent Active",
      badgeColor: "purple",
      isDark: true,
      content: `
        <!-- Agent Metric Box -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="150" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
          
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#a855f7">NET REALIZED GAIN (24H)</text>
          <text x="24" y="85" font-family="sans-serif" font-size="44" font-weight="700" fill="#ffffff">+$28,450.80</text>
          <text x="24" y="118" font-family="sans-serif" font-size="14" fill="#34d399">Win Rate: 99.2% · 142 of 143 bundles landed</text>
        </g>

        <!-- Live Agent Execution Stream -->
        <g transform="translate(0, 175)">
          <rect x="0" y="0" width="624" height="310" rx="16" fill="#050914" stroke="#1e293b" stroke-width="1"/>
          
          <rect x="0" y="0" width="624" height="42" rx="16" fill="#0a1020"/>
          <circle cx="28" cy="21" r="4" fill="#10b981"/>
          <text x="42" y="26" font-family="monospace" font-size="13" fill="#e2e8f0">agent_runtime.log · 18ms latency</text>

          <g transform="translate(24, 70)">
            <text x="0" y="0" font-family="monospace" font-size="13" fill="#c084fc">[18:24:02.120] SCAN</text>
            <text x="140" y="0" font-family="monospace" font-size="13" fill="#94a3b8">Spread detected: WETH/USDC on Base vs Arb</text>

            <text x="0" y="34" font-family="monospace" font-size="13" fill="#38bdf8">[18:24:02.128] SIMULATE</text>
            <text x="140" y="34" font-family="monospace" font-size="13" fill="#94a3b8">Invariant check: Gas 112k, Min Profit &gt; $850</text>

            <text x="0" y="68" font-family="monospace" font-size="13" fill="#34d399">[18:24:02.135] PROVE</text>
            <text x="140" y="68" font-family="monospace" font-size="13" fill="#94a3b8">Zero-loss constraint verified by ZK-solver</text>

            <text x="0" y="102" font-family="monospace" font-size="13" fill="#fbbf24">[18:24:02.144] BUNDLE</text>
            <text x="140" y="102" font-family="monospace" font-size="13" fill="#94a3b8">Submitted to Flashbots Builder #12</text>

            <text x="0" y="136" font-family="monospace" font-size="13" fill="#34d399">[18:24:02.210] CONFIRMED</text>
            <text x="140" y="136" font-family="monospace" font-size="13" fill="#f1f5f9">Tx 0x93f…4c12 · Profit +$1,142.50 USDC</text>
          </g>

          <line x1="24" y1="230" x2="600" y2="230" stroke="#1e293b" stroke-width="1"/>
          
          <text x="24" y="270" font-family="sans-serif" font-size="13.5" fill="#94a3b8">Safety constraints: Human-in-loop approval over $50k</text>
          <text x="600" y="270" text-anchor="end" font-family="sans-serif" font-size="13.5" font-weight="600" fill="#34d399">Guardrails Engaged</text>
        </g>

        <!-- Control Action -->
        <rect x="0" y="515" width="624" height="64" rx="16" fill="#1e293b"/>
        <text x="312" y="554" text-anchor="middle" font-family="sans-serif" font-size="17" font-weight="700" fill="#ffffff">Configure Agent Bounds</text>
      `,
    }),
  },

  // 6. Stablecoin Issuance & Reserve Attestation
  {
    name: "dapp-stablecoin-treasury",
    svg: baseCard({
      title: "USDX Stablecoin Console",
      subtitle: "100% Cash-Backed Institutional Stablecoin",
      badge: "102% Collateral",
      badgeColor: "green",
      content: `
        <!-- Supply Box -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="150" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">CIRCULATING MINTED SUPPLY</text>
          <text x="24" y="86" font-family="sans-serif" font-size="44" font-weight="700" fill="#0f172a">$185,000,000</text>
          <text x="24" y="118" font-family="sans-serif" font-size="14" fill="#059669">Total Reserves: $188,700,000 USD (+102%)</text>

          <rect x="470" y="44" width="130" height="48" rx="12" fill="#eff6ff" stroke="#bfdbfe" stroke-width="1"/>
          <text x="535" y="74" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#1d4ed8">USDX</text>
        </g>

        <!-- Reserve Breakdown -->
        <g transform="translate(0, 175)">
          <rect x="0" y="0" width="624" height="230" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="36" font-family="sans-serif" font-size="16" font-weight="700" fill="#0f172a">Verified Reserve Composition</text>

          <g transform="translate(24, 60)">
            <text x="0" y="14" font-family="sans-serif" font-size="14" fill="#64748b">US Short-Term Treasury Bills (0–3m)</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#0f172a">82.4% ($155.5M)</text>
            <rect x="0" y="24" width="576" height="8" rx="4" fill="#e2e8f0"/>
            <rect x="0" y="24" width="474" height="8" rx="4" fill="#0057d9"/>
          </g>

          <g transform="translate(24, 130)">
            <text x="0" y="14" font-family="sans-serif" font-size="14" fill="#64748b">Overnight Reverse Repo &amp; Bank Cash</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#0f172a">17.6% ($33.2M)</text>
            <rect x="0" y="24" width="576" height="8" rx="4" fill="#e2e8f0"/>
            <rect x="0" y="24" width="102" height="8" rx="4" fill="#10b981"/>
          </g>
        </g>

        <!-- Proof of Reserve -->
        <g transform="translate(0, 430)">
          <rect x="0" y="0" width="624" height="135" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <circle cx="44" cy="42" r="18" fill="#ecfdf5"/>
          <path d="M38 42l4 4 8-8" stroke="#10b981" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <text x="74" y="38" font-family="sans-serif" font-size="15" font-weight="700" fill="#0f172a">Chainlink Proof of Reserve (PoR)</text>
          <text x="74" y="58" font-family="sans-serif" font-size="13" fill="#64748b">Verified on-chain · Updated 4 minutes ago</text>

          <line x1="24" y1="85" x2="600" y2="85" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="112" font-family="sans-serif" font-size="13.5" fill="#64748b">Instant 1:1 Minting &amp; Redemption Settlement Active</text>
        </g>

        <!-- Action Button -->
        <rect x="0" y="590" width="624" height="64" rx="16" fill="#0057d9"/>
        <text x="312" y="630" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">Mint USDX Tokens</text>
      `,
    }),
  },

  // 7. ZK Cross-Chain Bridge
  {
    name: "dapp-crosschain-bridge",
    svg: baseCard({
      title: "ZK Cross-Chain Bridge",
      subtitle: "Zero-Knowledge State Proof Relay",
      badge: "Proof Verified",
      badgeColor: "blue",
      content: `
        <!-- Route Matrix -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="170" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          
          <!-- Source -->
          <g transform="translate(24, 25)">
            <text x="0" y="14" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">FROM SOURCE</text>
            <text x="0" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#0f172a">Ethereum Mainnet</text>
            <text x="0" y="70" font-family="sans-serif" font-size="14" fill="#64748b">Amount: <tspan font-weight="700" fill="#0f172a">25.00 ETH</tspan></text>
          </g>

          <!-- Arrow -->
          <circle cx="312" cy="85" r="22" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M304 85h16M314 78l7 7-7 7" stroke="#0057d9" stroke-width="2.2" stroke-linecap="round"/>

          <!-- Target -->
          <g transform="translate(380, 25)">
            <text x="0" y="14" font-family="sans-serif" font-size="12" font-weight="600" fill="#64748b">TO DESTINATION</text>
            <text x="0" y="44" font-family="sans-serif" font-size="22" font-weight="700" fill="#0f172a">Solana Network</text>
            <text x="0" y="70" font-family="sans-serif" font-size="14" fill="#64748b">Receive: <tspan font-weight="700" fill="#0f172a">24.998 ETH (Wormhole)</tspan></text>
          </g>

          <line x1="24" y1="125" x2="600" y2="125" stroke="#edf2f7" stroke-width="1"/>
          <text x="24" y="150" font-family="sans-serif" font-size="13" fill="#64748b">Estimated arrival: ~14 seconds · Relayer fee: $0.85</text>
        </g>

        <!-- Proof Verification Steps -->
        <g transform="translate(0, 195)">
          <rect x="0" y="0" width="624" height="270" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="38" font-family="sans-serif" font-size="16" font-weight="700" fill="#0f172a">ZK-SNARK Verification Lifecycle</text>

          <!-- Step 1 -->
          <g transform="translate(24, 60)">
            <circle cx="16" cy="16" r="16" fill="#ecfdf5"/>
            <path d="M11 16l3.5 3.5 7-7" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round"/>
            <text x="44" y="15" font-family="sans-serif" font-size="14.5" font-weight="600" fill="#0f172a">Ethereum Block Finality</text>
            <text x="44" y="32" font-family="sans-serif" font-size="12.5" fill="#64748b">Block #20,918,440 confirmed</text>
          </g>

          <!-- Step 2 -->
          <g transform="translate(24, 125)">
            <circle cx="16" cy="16" r="16" fill="#ecfdf5"/>
            <path d="M11 16l3.5 3.5 7-7" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round"/>
            <text x="44" y="15" font-family="sans-serif" font-size="14.5" font-weight="600" fill="#0f172a">ZK State Transition Proof</text>
            <text x="44" y="32" font-family="sans-serif" font-size="12.5" fill="#64748b">Proof generated in 3.8s · Plonk Verifier</text>
          </g>

          <!-- Step 3 -->
          <g transform="translate(24, 190)">
            <circle cx="16" cy="16" r="16" fill="#ecfdf5"/>
            <path d="M11 16l3.5 3.5 7-7" stroke="#10b981" stroke-width="2" fill="none" stroke-linecap="round"/>
            <text x="44" y="15" font-family="sans-serif" font-size="14.5" font-weight="600" fill="#0f172a">Relayer Settlement on Destination</text>
            <text x="44" y="32" font-family="sans-serif" font-size="12.5" fill="#64748b">Zero trust assumptions · Instant unlock</text>
          </g>
        </g>

        <!-- Button -->
        <rect x="0" y="580" width="624" height="64" rx="16" fill="#0057d9"/>
        <text x="312" y="620" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">Bridge Tokens Now</text>
      `,
    }),
  },

  // 8. Liquid Staking & Yield Protocol
  {
    name: "dapp-liquid-staking",
    svg: baseCard({
      title: "Liquid Staking Protocol",
      subtitle: "hsxETH Auto-Compounding Vault",
      badge: "4.92% APY",
      badgeColor: "green",
      content: `
        <!-- Vault TVL Box -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="150" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">TOTAL VALUE LOCKED</text>
          <text x="24" y="86" font-family="sans-serif" font-size="44" font-weight="700" fill="#0f172a">$92,400,000</text>
          <text x="24" y="118" font-family="sans-serif" font-size="14" fill="#059669">Annual Staking Rewards: 4.92% net APY</text>

          <rect x="460" y="44" width="140" height="50" rx="25" fill="#0057d9"/>
          <text x="530" y="75" text-anchor="middle" font-family="sans-serif" font-size="16" font-weight="700" fill="#ffffff">hsxETH</text>
        </g>

        <!-- Staking Details -->
        <g transform="translate(0, 175)">
          <rect x="0" y="0" width="624" height="230" rx="16" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="38" font-family="sans-serif" font-size="16" font-weight="700" fill="#0f172a">Validator Health &amp; Security</text>

          <g transform="translate(24, 60)">
            <text x="0" y="14" font-family="sans-serif" font-size="14" fill="#64748b">Active Validator Nodes</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#0f172a">2,880 Distributed</text>
          </g>

          <line x1="24" y1="100" x2="600" y2="100" stroke="#edf2f7" stroke-width="1"/>

          <g transform="translate(24, 120)">
            <text x="0" y="14" font-family="sans-serif" font-size="14" fill="#64748b">Attestation Effectiveness</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#10b981">99.96% Optimal</text>
          </g>

          <line x1="24" y1="160" x2="600" y2="160" stroke="#edf2f7" stroke-width="1"/>

          <g transform="translate(24, 180)">
            <text x="0" y="14" font-family="sans-serif" font-size="14" fill="#64748b">Slashing Insurance Cover</text>
            <text x="576" y="14" text-anchor="end" font-family="sans-serif" font-size="14" font-weight="700" fill="#0057d9">100% Backed</text>
          </g>
        </g>

        <!-- Staking Input -->
        <g transform="translate(0, 430)">
          <rect x="0" y="0" width="624" height="135" rx="16" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#64748b">STAKE ETH TO RECEIVE hsxETH</text>
          <text x="24" y="80" font-family="sans-serif" font-size="34" font-weight="700" fill="#0f172a">32.00 ETH</text>
          <text x="24" y="112" font-family="sans-serif" font-size="13.5" fill="#64748b">Receives: 33.57 hsxETH (Instant Liquidity)</text>
        </g>

        <!-- Button -->
        <rect x="0" y="585" width="624" height="64" rx="16" fill="#0057d9"/>
        <text x="312" y="625" text-anchor="middle" font-family="sans-serif" font-size="18" font-weight="700" fill="#ffffff">Stake Now</text>
      `,
    }),
  },

  // 9. L2 Rollup Sequencer & Gas Telemetry
  {
    name: "dapp-l2-rollup",
    svg: baseCard({
      title: "L2 Rollup Telemetry",
      subtitle: "High-Throughput Execution Sequencer",
      badge: "2,450 TPS",
      badgeColor: "blue",
      isDark: true,
      content: `
        <!-- Sequencer Metrics -->
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="624" height="150" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
          
          <text x="24" y="34" font-family="sans-serif" font-size="13" font-weight="600" fill="#38bdf8">TRANSACTION THROUGHPUT</text>
          <text x="24" y="86" font-family="sans-serif" font-size="44" font-weight="700" fill="#ffffff">2,450 TPS</text>
          <text x="24" y="118" font-family="sans-serif" font-size="14" fill="#34d399">Sub-second Finality: 250ms block times</text>

          <rect x="460" y="44" width="140" height="50" rx="25" fill="#0369a1"/>
          <text x="530" y="75" text-anchor="middle" font-family="sans-serif" font-size="15" font-weight="700" fill="#ffffff">&lt; $0.001</text>
        </g>

        <!-- Batch Explorer -->
        <g transform="translate(0, 175)">
          <rect x="0" y="0" width="624" height="280" rx="16" fill="#050914" stroke="#1e293b" stroke-width="1"/>
          
          <rect x="0" y="0" width="624" height="42" rx="16" fill="#0a1020"/>
          <text x="24" y="26" font-family="monospace" font-size="13" fill="#38bdf8">Batch #192,840 Commit Details</text>

          <g transform="translate(24, 70)">
            <text x="0" y="0" font-family="sans-serif" font-size="14" fill="#64748b">Transactions inside batch</text>
            <text x="576" y="0" text-anchor="end" font-family="monospace" font-size="14" font-weight="700" fill="#ffffff">3,120 txs</text>

            <line x1="0" y1="20" x2="576" y2="20" stroke="#1e293b" stroke-width="1"/>

            <text x="0" y="46" font-family="sans-serif" font-size="14" fill="#64748b">Batch State Root</text>
            <text x="576" y="46" text-anchor="end" font-family="monospace" font-size="13" fill="#38bdf8">0xa94f…81ec</text>

            <line x1="0" y1="66" x2="576" y2="66" stroke="#1e293b" stroke-width="1"/>

            <text x="0" y="92" font-family="sans-serif" font-size="14" fill="#64748b">EIP-4844 Blob DA Commitment</text>
            <text x="576" y="92" text-anchor="end" font-family="monospace" font-size="14" font-weight="700" fill="#34d399">Blob 2 / 6</text>

            <line x1="0" y1="112" x2="576" y2="112" stroke="#1e293b" stroke-width="1"/>

            <text x="0" y="138" font-family="sans-serif" font-size="14" fill="#64748b">Sequencer Uptime (30d)</text>
            <text x="576" y="138" text-anchor="end" font-family="monospace" font-size="14" font-weight="700" fill="#34d399">99.99%</text>
          </g>
        </g>

        <!-- Action / Health -->
        <g transform="translate(0, 480)">
          <rect x="0" y="0" width="624" height="120" rx="16" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
          <circle cx="44" cy="40" r="18" fill="#064e3b"/>
          <path d="M38 40l4 4 8-8" stroke="#34d399" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <text x="74" y="36" font-family="sans-serif" font-size="15" font-weight="700" fill="#ffffff">Sequencer Healthy &amp; Synchronized</text>
          <text x="74" y="56" font-family="sans-serif" font-size="13" fill="#94a3b8">Decentralized fraud-proof window active</text>
        </g>
      `,
    }),
  },
];

await mkdir(OUT, { recursive: true });

for (const card of CARDS) {
  for (const w of WIDTHS) {
    const h = Math.round((w * 25) / 18);
    const outFile = path.join(OUT, `${card.name}-${w}.webp`);
    const info = await sharp(Buffer.from(card.svg))
      .resize(w, h)
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(outFile);
    console.log(`Rendered: ${outFile} (${info.width}x${info.height}) ${(info.size / 1024).toFixed(1)} KB`);
  }
}
console.log("All 9 minimalist dApp cards rendered successfully!");
