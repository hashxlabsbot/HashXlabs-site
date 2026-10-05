import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";

/**
 * /solutions thesis band: one rule followed from a sentence to a passing run.
 * Flat ink band, no glows.
 * The three stages light up in sequence when the band is revealed.
 */
const STEPS = [
  {
    k: "Write the failure down",
    d: "Before any code, in plain words, in the specification you sign off.",
    body: (
      <p className="ff-quote">
        &ldquo;Shares can never be worth more than the assets behind them.&rdquo;
        <span className="ff-ref mono">SPEC.md · I-1</span>
      </p>
    ),
  },
  {
    k: "Turn it into a test",
    d: "The sentence becomes an invariant the fuzzer attacks with random call sequences.",
    body: (
      <pre className="code ff-code">
        <span className="k">function</span> <span className="f">invariant_solvency</span>() {"{\n"}
        {"  "}
        <span className="f">assertGe</span>(assets, <span className="f">owed</span>());{"\n"}
        {"}"}
      </pre>
    ),
  },
  {
    k: "Build until it holds",
    d: "Every pull request runs it. A finding reaches you as a failing test, then a fix.",
    body: (
      <pre className="code ff-code">
        <span className="c">$ forge test</span>
        {"\n"}
        <span className="ff-pass">[PASS]</span> invariant_solvency(){"\n"}
        <span className="ff-pass">ok</span> <span className="c">· runs on every PR</span>
      </pre>
    ),
  },
];

export default function FailureFirst() {
  return (
    <section className="ff">
      <div className="container-x ff-inner">
        <Reveal className="ff-head">
          <span className="eyebrow ff-eyebrow">How every solution starts</span>
          <h2 className="t-h2 mt-3 text-white">
            <Words text="From a sentence to a passing test" />
          </h2>
          <p className="ff-lead">Whatever the system, the work starts the same way. Here is one rule, followed all the way through.</p>
        </Reveal>
        <Reveal className="ff-steps">
          <span className="ff-line" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <div key={s.k} className="ff-step" style={{ "--i": i } as CSSProperties}>
              <span className="ff-n mono">0{i + 1}</span>
              <h3 className="ff-k">{s.k}</h3>
              <p className="ff-d">{s.d}</p>
              <div className="ff-card">{s.body}</div>
            </div>
          ))}
        </Reveal>
        <p className="ff-cap">Illustrative example from a vault engagement.</p>
      </div>
    </section>
  );
}
