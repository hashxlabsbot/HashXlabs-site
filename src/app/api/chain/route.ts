/* Latest Ethereum blocks for the home hero (components/home/HorizonChain).

   The hero used to call public RPC nodes from every visitor's browser. That
   breaks in two ways: the shared public nodes rate-limit a busy site, and some
   ISPs block or intercept the RPC hostnames, so the hero sat on "Connecting…".
   Now the server reads the chain and the CDN keeps the answer for a few
   seconds, so every visitor shares one upstream request (about six a minute
   per region, whatever the traffic) and nothing depends on a visitor's network.

   - Providers are tried in order with short timeouts; the first good answer wins.
   - Success is cached by the CDN: `s-maxage=10`, then served stale for up to
     five minutes while one request refreshes it in the background.
   - If every provider fails, the last good answer this instance holds (at most
     10 minutes old) is returned, marked `stale`; otherwise a 503 that is not
     cached, which the hero shows as "feed unavailable" instead of spinning.
   Real data only: nothing here is simulated. */

const PROVIDERS = [
  "https://ethereum-rpc.publicnode.com",
  "https://ethereum.publicnode.com",
  "https://eth.drpc.org",
  "https://1rpc.io/eth",
  "https://rpc.mevblocker.io",
  "https://gateway.tenderly.co/public/mainnet",
  "https://eth-mainnet.public.blastapi.io",
];
const ROWS = 6; // newest first
const PER_CALL_MS = 3500;
const MAX_STALE_MS = 10 * 60 * 1000;

type RpcBlock = { number: string; timestamp: string; gasUsed: string; gasLimit: string; transactions: unknown[] };
type Row = { height: number; time: number; txs: number; gas: number };
type Feed = { height: number; rows: Row[]; at: number; stale?: boolean };

let last: Feed | null = null; // best-effort memory of this warm instance

const hex = (h: string) => parseInt(h, 16);

async function call<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(PER_CALL_MS),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return (await res.json()) as T;
}

async function read(url: string): Promise<Feed> {
  const [head] = await call<{ result?: RpcBlock }[]>(url, [{ jsonrpc: "2.0", id: 0, method: "eth_getBlockByNumber", params: ["latest", false] }]);
  if (!head?.result) throw new Error(`${url} no block`);
  const n = hex(head.result.number);
  const blocks: RpcBlock[] = [head.result];
  if (ROWS > 1) {
    const older = await call<{ id: number; result?: RpcBlock }[]>(
      url,
      Array.from({ length: ROWS - 1 }, (_, i) => ({ jsonrpc: "2.0", id: i + 1, method: "eth_getBlockByNumber", params: ["0x" + (n - 1 - i).toString(16), false] })),
    );
    for (const r of [...older].sort((a, b) => a.id - b.id)) if (r.result) blocks.push(r.result);
  }
  const rows = blocks.map((b) => ({
    height: hex(b.number),
    time: hex(b.timestamp),
    txs: b.transactions.length,
    gas: Math.round((hex(b.gasUsed) / Math.max(1, hex(b.gasLimit))) * 1000) / 10,
  }));
  if (rows.some((r) => !Number.isFinite(r.height) || !Number.isFinite(r.time))) throw new Error(`${url} bad block`);
  return { height: n, rows, at: Date.now() };
}

export async function GET() {
  for (const url of PROVIDERS) {
    try {
      last = await read(url);
      return Response.json(last, { headers: { "Cache-Control": "public, max-age=0, s-maxage=10, stale-while-revalidate=300" } });
    } catch {
      // try the next provider
    }
  }
  if (last && Date.now() - last.at < MAX_STALE_MS) {
    return Response.json({ ...last, stale: true }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=5, stale-while-revalidate=60" } });
  }
  return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
