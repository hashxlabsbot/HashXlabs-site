// Scene data for the load intro (Intro.tsx): a ledger of transactions being
// processed behind the wordmark. Seeded, so the server markup is identical on
// every build.

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = rng(2049);
const r2 = (n: number) => Math.round(n * 100) / 100;
const HEX = "0123456789abcdef";
const hex = (n: number) => Array.from({ length: n }, () => HEX[Math.floor(rand() * 16)]).join("");
const addr = () => `0x${hex(4)}…${hex(4)}`;

export type Tx = { from: string; to: string; amt: string; unit: string; d: number };
export type Column = { rows: Tx[]; shift: number };

const UNITS = ["ETH", "USDC", "SOL", "BTC", "USDT", "ARB"];
const AMOUNT: Record<string, () => number> = {
  ETH: () => 0.05 + rand() * 9,
  USDC: () => 20 + rand() * 48000,
  SOL: () => 1 + rand() * 340,
  BTC: () => 0.002 + rand() * 1.4,
  USDT: () => 20 + rand() * 48000,
  ARB: () => 40 + rand() * 9000,
};

const tx = (): Tx => {
  const unit = UNITS[Math.floor(rand() * UNITS.length)];
  const v = AMOUNT[unit]();
  const amt = v < 10 ? v.toFixed(3) : Math.round(v).toLocaleString("en-US");
  // Each row confirms at its own moment, so the ledger is never in step.
  return { from: addr(), to: addr(), amt, unit, d: r2(0.15 + rand() * 2.1) };
};

export const ROWS_PER_COLUMN = 44;
// Columns drift up at slightly different speeds (px over the intro).
export const COLUMNS: Column[] = [220, 300, 250].map((shift) => ({ shift, rows: Array.from({ length: ROWS_PER_COLUMN }, tx) }));

// When the inline script starts the exit (ms after first paint).
export const EXIT_MS = 2400;
