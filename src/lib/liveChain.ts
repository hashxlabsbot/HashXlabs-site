"use client";

import { useSyncExternalStore } from "react";

// Real mainnet data, read straight from public RPC endpoints in the browser.
// One shared poller feeds every subscriber (top bar + hero explorer), so switching
// chain anywhere switches it everywhere. Nothing here is simulated: if an endpoint
// is down, status says so.

type Kind = "evm" | "solana";

export interface Chain {
  id: string;
  name: string;
  short: string;
  kind: Kind;
  rpc: string;
  explorer: string; // block/slot URL prefix
}

export const CHAINS: Chain[] = [
  { id: "eth", name: "Ethereum", short: "ETH", kind: "evm", rpc: "https://ethereum-rpc.publicnode.com", explorer: "https://etherscan.io/block/" },
  { id: "base", name: "Base", short: "BASE", kind: "evm", rpc: "https://base-rpc.publicnode.com", explorer: "https://basescan.org/block/" },
  { id: "arb", name: "Arbitrum One", short: "ARB", kind: "evm", rpc: "https://arbitrum-one-rpc.publicnode.com", explorer: "https://arbiscan.io/block/" },
  { id: "op", name: "Optimism", short: "OP", kind: "evm", rpc: "https://optimism-rpc.publicnode.com", explorer: "https://optimistic.etherscan.io/block/" },
  { id: "polygon", name: "Polygon PoS", short: "POL", kind: "evm", rpc: "https://polygon-bor-rpc.publicnode.com", explorer: "https://polygonscan.com/block/" },
  { id: "bsc", name: "BNB Chain", short: "BNB", kind: "evm", rpc: "https://bsc-rpc.publicnode.com", explorer: "https://bscscan.com/block/" },
  { id: "avax", name: "Avalanche C", short: "AVAX", kind: "evm", rpc: "https://avalanche-c-chain-rpc.publicnode.com", explorer: "https://snowtrace.io/block/" },
  { id: "sol", name: "Solana", short: "SOL", kind: "solana", rpc: "https://solana-rpc.publicnode.com", explorer: "https://solscan.io/block/" },
];

const STORAGE_KEY = "hx_live_chain";

export interface Stat {
  label: string;
  value: string;
  tone?: "good";
  wide?: boolean; // hidden on narrow screens
}

/** One row of the "latest" table: a block (EVM) or a 60s performance window (Solana). */
export interface Row {
  height: number;
  time: number | null; // unix seconds
  txs: number;
  a: string; // EVM: gas used %   · Solana: non-vote txs
  b: string; // EVM: fee recipient · Solana: TPS
}

export interface Snapshot {
  height: number;
  heightLabel: string;
  time: number | null;
  stats: Stat[];
  rows: Row[];
  cols: [string, string]; // headers for Row.a / Row.b
}

export type Status = "loading" | "live" | "stale" | "error";

interface State {
  chain: Chain;
  snap: Snapshot | null;
  status: Status;
  tick: number; // bumps whenever a new block/slot arrives
}

type RpcCall = { method: string; params: unknown[] };

async function rpc<T extends unknown[]>(url: string, calls: RpcCall[], signal: AbortSignal): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(calls.map((c, id) => ({ jsonrpc: "2.0", id, ...c }))),
    signal,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RPC ${res.status}`);
  const out = (await res.json()) as { id: number; result?: unknown; error?: unknown }[];
  const byId = [...out].sort((a, b) => a.id - b.id);
  if (byId.some((r) => r.error || r.result === undefined || r.result === null)) throw new Error("RPC error");
  return byId.map((r) => r.result) as T;
}

const hex = (h: string) => parseInt(h, 16);
const toHex = (n: number) => "0x" + n.toString(16);
export const fmt = (n: number) => n.toLocaleString("en-US");

function gwei(wei: number) {
  const g = wei / 1e9;
  if (g >= 100) return g.toFixed(0);
  if (g >= 1) return g.toFixed(2);
  if (g >= 0.01) return g.toFixed(3);
  return g.toPrecision(2);
}

interface EvmBlock {
  number: string;
  timestamp: string;
  gasUsed: string;
  gasLimit: string;
  miner: string;
  transactions: string[];
}

const ROWS = 6;

async function readEvm(chain: Chain, cache: Map<number, EvmBlock>, signal: AbortSignal): Promise<Snapshot> {
  const [latest, gasPrice] = await rpc<[EvmBlock, string]>(
    chain.rpc,
    [
      { method: "eth_getBlockByNumber", params: ["latest", false] },
      { method: "eth_gasPrice", params: [] },
    ],
    signal,
  );
  const n = hex(latest.number);
  cache.set(n, latest);

  // Recent blocks for the table, plus n-10 to average block time. Only fetch what we lack.
  const want = [...Array.from({ length: ROWS - 1 }, (_, i) => n - 1 - i), n - 10].filter((x) => x >= 0);
  const missing = want.filter((x) => !cache.has(x));
  if (missing.length) {
    const got = await rpc<EvmBlock[]>(
      chain.rpc,
      missing.map((x) => ({ method: "eth_getBlockByNumber", params: [toHex(x), false] })),
      signal,
    );
    got.forEach((b) => cache.set(hex(b.number), b));
  }
  for (const k of cache.keys()) if (k < n - 12) cache.delete(k);

  const ts = hex(latest.timestamp);
  const older = cache.get(n - 10);
  const blockTime = older ? Math.max(1, ts - hex(older.timestamp)) / 10 : 0;
  const used = hex(latest.gasUsed) / Math.max(1, hex(latest.gasLimit));

  const rows: Row[] = [];
  for (let i = 0; i < ROWS; i++) {
    const b = cache.get(n - i);
    if (!b) continue;
    rows.push({
      height: n - i,
      time: hex(b.timestamp),
      txs: b.transactions.length,
      a: `${((hex(b.gasUsed) / Math.max(1, hex(b.gasLimit))) * 100).toFixed(1)}%`,
      b: `${b.miner.slice(0, 6)}…${b.miner.slice(-4)}`,
    });
  }

  return {
    height: n,
    heightLabel: "Block",
    time: ts,
    stats: [
      { label: "Gas", value: `${gwei(hex(gasPrice))} gwei`, tone: "good" },
      { label: "Txs", value: fmt(latest.transactions.length) },
      ...(blockTime ? [{ label: "Block time", value: `${blockTime < 10 ? blockTime.toFixed(2) : blockTime.toFixed(1)}s`, wide: true }] : []),
      { label: "Gas used", value: `${(used * 100).toFixed(1)}%`, wide: true },
    ],
    rows,
    cols: ["Gas used", "Fee recipient"],
  };
}

interface EpochInfo {
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
}
interface PerfSample {
  slot: number;
  numTransactions: number;
  numNonVoteTransactions?: number;
  numSlots: number;
  samplePeriodSecs: number;
}

async function readSolana(chain: Chain, signal: AbortSignal): Promise<Snapshot> {
  const [epoch, samples] = await rpc<[EpochInfo, PerfSample[]]>(
    chain.rpc,
    [
      { method: "getEpochInfo", params: [{ commitment: "confirmed" }] },
      { method: "getRecentPerformanceSamples", params: [ROWS] },
    ],
    signal,
  );
  const s = samples[0];
  const secs = Math.max(1, s?.samplePeriodSecs ?? 60);
  const tps = s ? s.numTransactions / secs : 0;
  const userTps = s?.numNonVoteTransactions != null ? s.numNonVoteTransactions / secs : null;
  const slotTime = s ? secs / Math.max(1, s.numSlots) : 0;

  return {
    height: epoch.absoluteSlot,
    heightLabel: "Slot",
    time: null,
    stats: [
      { label: "TPS", value: fmt(Math.round(tps)), tone: "good" },
      ...(userTps != null ? [{ label: "Non-vote TPS", value: fmt(Math.round(userTps)) }] : []),
      { label: "Slot time", value: `${(slotTime * 1000).toFixed(0)}ms`, wide: true },
      { label: `Epoch ${epoch.epoch}`, value: `${((epoch.slotIndex / epoch.slotsInEpoch) * 100).toFixed(1)}%`, wide: true },
    ],
    rows: samples.map((p) => ({
      height: p.slot,
      time: null,
      txs: p.numTransactions,
      a: p.numNonVoteTransactions != null ? fmt(p.numNonVoteTransactions) : "—",
      b: `${fmt(Math.round(p.numTransactions / Math.max(1, p.samplePeriodSecs)))} tps`,
    })),
    cols: ["Non-vote", "Throughput"],
  };
}

/* ---------- store ---------- */

let state: State = { chain: CHAINS[0], snap: null, status: "loading", tick: 0 };
const listeners = new Set<() => void>();
let stopPoll: (() => void) | null = null;
let restored = false;

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function startPoll() {
  stopPoll?.();
  const chain = state.chain;
  const cache = new Map<number, EvmBlock>();
  let ctrl: AbortController | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let failures = 0;
  let alive = true;
  let last: number | null = null;
  const interval = chain.kind === "solana" ? 4000 : 6000;

  const tick = async () => {
    if (document.hidden) {
      timer = setTimeout(tick, 1000);
      return;
    }
    ctrl = new AbortController();
    const kill = setTimeout(() => ctrl?.abort(), 9000);
    try {
      const snap = chain.kind === "solana" ? await readSolana(chain, ctrl.signal) : await readEvm(chain, cache, ctrl.signal);
      if (!alive) return;
      failures = 0;
      const moved = last !== null && snap.height !== last;
      last = snap.height;
      set({ snap, status: "live", tick: moved ? state.tick + 1 : state.tick });
    } catch {
      if (!alive) return;
      failures += 1;
      set({ status: failures >= 3 ? "error" : state.status === "loading" ? "loading" : "stale" });
    } finally {
      clearTimeout(kill);
      if (alive) timer = setTimeout(tick, failures ? Math.min(30000, interval * 2 ** failures) : interval);
    }
  };
  tick();

  stopPoll = () => {
    alive = false;
    ctrl?.abort();
    clearTimeout(timer);
    stopPoll = null;
  };
}

function subscribe(l: () => void) {
  listeners.add(l);
  if (!restored) {
    restored = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const c = CHAINS.find((x) => x.id === saved);
      if (c) state = { ...state, chain: c };
    } catch {}
  }
  if (!stopPoll) startPoll();
  return () => {
    listeners.delete(l);
    if (listeners.size === 0) stopPoll?.();
  };
}

const serverState = state;

export function selectChain(id: string) {
  const chain = CHAINS.find((c) => c.id === id);
  if (!chain || chain.id === state.chain.id) return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {}
  set({ chain, snap: null, status: "loading" });
  if (listeners.size) startPoll();
}

export function useLiveChain(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverState,
  );
}

/** Seconds-ago clock, ticking once a second. */
export function useNow() {
  return useSyncExternalStore(subscribeClock, () => clock, () => 0);
}
let clock = 0;
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setInterval> | undefined;
function subscribeClock(l: () => void) {
  clockListeners.add(l);
  if (!clockTimer) {
    clock = Date.now();
    clockTimer = setInterval(() => {
      clock = Date.now();
      clockListeners.forEach((x) => x());
    }, 1000);
  }
  return () => {
    clockListeners.delete(l);
    if (!clockListeners.size) {
      clearInterval(clockTimer);
      clockTimer = undefined;
    }
  };
}
