import type { ReactNode } from "react";

/* Minimal syntax colouring for the short illustrative tests on the inner
   pages (Solidity, TypeScript, Python). Uses the .code palette in globals.css:
   .k keyword, .f call, .c comment, .s string, .n number. */
const KEYWORDS = new Set([
  "function", "public", "uint256", "for", "const", "await", "async", "def", "assert", "return",
  "contract", "is", "bytes32", "constant", "external", "onlyRole", "import", "from", "test", "expect",
]);
const TOKEN = /(\/\/.*|#.*)|("[^"]*")|(\b\d[\d_e]*\b)|([A-Za-z_][\w]*)(?=\()|([A-Za-z_][\w]*)/g;

function line(src: string, key: number) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const i = m.index ?? 0;
    if (i > last) out.push(src.slice(last, i));
    const [t, comment, str, num, call, word] = m;
    const cls = comment ? "c" : str ? "s" : num ? "n" : call ? (KEYWORDS.has(call) ? "k" : "f") : word && KEYWORDS.has(word) ? "k" : "";
    out.push(cls ? <span key={i} className={cls}>{t}</span> : t);
    last = i + t.length;
  }
  if (last < src.length) out.push(src.slice(last));
  return (
    <span key={key} className="cl">
      {out}
      {"\n"}
    </span>
  );
}

export default function Code({ lines, className = "" }: { lines: string[]; className?: string }) {
  return <pre className={`code ${className}`}>{lines.map(line)}</pre>;
}
