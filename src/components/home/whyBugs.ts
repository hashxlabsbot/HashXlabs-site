/* The three "ordinary mistakes" played in the home Why section
   (components/home/Why.tsx). Each is a real, common Solidity bug class, the
   test that catches it and the fix. Illustrative code, not client code. */

export type BugLine = {
  k: string;
  code: string;
  /** Rewritten version of the line after the fix (rolls in place). */
  next?: string;
  /** Row before the fix (null = line doesn't exist yet). */
  from: number | null;
  /** Row after the fix. */
  to: number;
  /** The line the failing test points at. */
  flag?: boolean;
  /** Touched by the fix. */
  changed?: boolean;
};

export type Bug = {
  id: string;
  phrase: string;
  tab: string;
  file: string;
  rows: number;
  lines: BugLine[];
  cmd: string;
  ran: string;
  fail: string;
  why: string;
  pass: string;
  bad: string;
  fix: string;
  summary: string;
};

export const BUGS: Bug[] = [
  {
    id: "order",
    phrase: "a line in the wrong order",
    tab: "Wrong order",
    file: "src/Escrow.sol",
    rows: 6,
    lines: [
      { k: "sig", code: "function withdraw() external {", from: 0, to: 0 },
      { k: "amt", code: "    uint256 amount = balances[msg.sender];", from: 1, to: 1 },
      { k: "call", code: '    (bool ok, ) = msg.sender.call{value: amount}("");', from: 2, to: 3 },
      { k: "req", code: '    require(ok, "transfer failed");', from: 3, to: 4 },
      { k: "zero", code: "    balances[msg.sender] = 0;", from: 4, to: 2, flag: true, changed: true },
      { k: "end", code: "}", from: 5, to: 5 },
    ],
    cmd: "forge test --mt test_reentrantWithdraw",
    ran: "Ran 1 test for test/Escrow.t.sol:EscrowTest",
    fail: "[FAIL] test_reentrantWithdraw()",
    why: "attacker withdrew 2 ETH against a 1 ETH deposit",
    pass: "[PASS] test_reentrantWithdraw()",
    bad: "balance is cleared after the external call",
    fix: "balance cleared before the external call",
    summary:
      "Example: withdraw() sends ETH before clearing the balance, so a reentrancy test withdraws twice the deposit. Moving the balance update above the external call makes the test pass.",
  },
  {
    id: "rounding",
    phrase: "a rounding direction",
    tab: "Rounding",
    file: "src/Vault4626.sol",
    rows: 7,
    lines: [
      { k: "sig", code: "function previewWithdraw(uint256 assets)", from: 0, to: 0 },
      { k: "vis", code: "    public view returns (uint256)", from: 1, to: 1 },
      { k: "open", code: "{", from: 2, to: 2 },
      { k: "sup", code: "    uint256 supply = totalSupply();", from: 3, to: 3 },
      { k: "zero", code: "    if (supply == 0) return assets;", from: 4, to: 4 },
      {
        k: "ret",
        code: "    return assets.mulDivDown(supply, totalAssets());",
        next: "    return assets.mulDivUp(supply, totalAssets());",
        from: 5,
        to: 5,
        flag: true,
        changed: true,
      },
      { k: "end", code: "}", from: 6, to: 6 },
    ],
    cmd: "forge test --mt testFuzz_withdrawNeverFree",
    ran: "Ran 1 test for test/Vault4626.t.sol:VaultTest",
    fail: "[FAIL] testFuzz_withdrawNeverFree(uint256)",
    why: "counterexample: assets = 1 burns 0 shares",
    pass: "[PASS] testFuzz_withdrawNeverFree(uint256) (runs: 256)",
    bad: "rounds down, in the caller's favour",
    fix: "rounds up, in the vault's favour",
    summary:
      "Example: previewWithdraw() rounds down, so a fuzz test finds a withdrawal that burns zero shares. Rounding up, in the vault's favour, makes the test pass.",
  },
  {
    id: "keys",
    phrase: "a key with too much power",
    tab: "Key power",
    file: "src/Token.sol",
    rows: 7,
    lines: [
      { k: "sig", code: "function mint(address to, uint256 amount)", from: 0, to: 0 },
      { k: "ext", code: "    external", from: 1, to: 1 },
      { k: "mod", code: "    onlyOwner", next: "    onlyRole(MINTER_ROLE)", from: 2, to: 2, flag: true, changed: true },
      { k: "open", code: "{", from: 3, to: 3 },
      { k: "cap", code: '    require(totalSupply() + amount <= cap, "cap");', from: null, to: 4, changed: true },
      { k: "mint", code: "    _mint(to, amount);", from: 4, to: 5 },
      { k: "end", code: "}", from: 5, to: 6 },
    ],
    cmd: "forge test --mt test_mintStaysUnderCap",
    ran: "Ran 1 test for test/Token.t.sol:TokenTest",
    fail: "[FAIL] test_mintStaysUnderCap()",
    why: "a single key minted 10x the cap in one call",
    pass: "[PASS] test_mintStaysUnderCap()",
    bad: "one owner key can mint without limit",
    fix: "a minter role plus a hard supply cap",
    summary:
      "Example: mint() is guarded only by onlyOwner, so one key can mint without limit. A minter role and a supply cap make the test pass.",
  },
];

/** The play-through of one bug, in ms from its start. */
export const STEPS = [
  { k: "code", t: 0 }, // 0: code on screen, compiles cleanly
  { k: "run", t: 900 }, // 1: test command typed
  { k: "spin", t: 1700 }, // 2: running
  { k: "fail", t: 2500 }, // 3: red, the test points at the line
  { k: "fix", t: 4300 }, // 4: the fix lands in the editor
  { k: "rerun", t: 5300 }, // 5: command typed again
  { k: "spin2", t: 6000 }, // 6: running
  { k: "pass", t: 6600 }, // 7: green
] as const;
export const TOTAL = 9000;

/* A tiny Solidity highlighter, enough for the snippets above. */
const KW = new Set(["function", "external", "public", "view", "returns", "return", "if", "require"]);
const TY = new Set(["uint256", "address", "bool"]);
export type Tok = [text: string, cls: string];

export function tokens(line: string): Tok[] {
  const out: Tok[] = [];
  const re = /("[^"]*")|(\d+)|([A-Za-z_][\w]*)|(\s+)|([^\s\w"]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const [s, str, num, id] = m;
    let c = "";
    if (str) c = "s";
    else if (num) c = "n";
    else if (id) {
      const after = line[re.lastIndex];
      if (KW.has(id)) c = "k";
      else if (TY.has(id)) c = "t";
      else if (/^[A-Z][A-Z0-9_]+$/.test(id)) c = "c";
      else if (after === "(" || after === "{") c = "f";
    }
    out.push([s, c]);
  }
  return out;
}

/** Widest line in characters, so the code can scroll sideways on small screens. */
export const cols = (b: Bug) => Math.max(...b.lines.flatMap((l) => [l.code.length, l.next?.length ?? 0]));
