"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import Icon from "@/components/icons/Icon";
import { ButtonLink } from "@/components/ui";
import { REASONS } from "@/content/company";
import { BUGS, STEPS, TOTAL, cols, tokens } from "./whyBugs";

/**
 * Home "Why HashX Labs": the lead sentence, demonstrated.
 *
 * The three mistakes it names are buttons. Each plays a short scene in the
 * window below: the code compiles cleanly, `forge test` fails and points at
 * the line, the fix lands (the line slides into place, the rounding flips, a
 * guard is replaced and a cap slides in), the test re-runs green. The scenes
 * advance on their own while the window is in view (paused on hover or
 * focus), and stop once someone picks one. The highlighter under the active
 * phrase doubles as the progress bar.
 *
 * Steps are timers that drive data attributes; every visual change is a CSS
 * transition or a short keyframe on transform/opacity. Reduced motion shows
 * each scene's end state.
 */
const RM = "(prefers-reduced-motion: reduce)";
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(RM);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const vars = (v: Record<string, string | number>) => v as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");
const LAST = STEPS.length - 1;

function Code({ text }: { text: string }) {
  const indent = /^\s*/.exec(text)?.[0] ?? "";
  return (
    <>
      {indent}
      <span className="wl-u">{tokens(text.slice(indent.length)).map(([t, c], i) => (c ? <span key={i} className={`tk-${c}`}>{t}</span> : t))}</span>
    </>
  );
}

function Cmd({ text, typing, gap }: { text: string; typing: boolean; gap?: boolean }) {
  return (
    <p className={`tl tl-cmd${gap ? " tl-gap" : ""}`}>
      <span className="tl-p">❯</span> <span className="tl-typed" style={vars({ "--n": text.length })}>{text}</span>
      {typing && <i className="tl-caret" />}
    </p>
  );
}

export default function Why() {
  const reduce = useSyncExternalStore(subscribe, () => window.matchMedia(RM).matches, () => false);
  const [bug, setBug] = useState(0);
  const [step, setStep] = useState(0);
  const [run, setRun] = useState(0);
  const [auto, setAuto] = useState(true);
  const [seen, setSeen] = useState(false);
  const [hold, setHold] = useState(false);
  const win = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const runRef = useRef(0);
  const spent = useRef(0); // ms already spent in the current step before a pause

  const playing = seen && !hold && !reduce;

  const start = useCallback((b: number, manual: boolean) => {
    runRef.current += 1;
    spent.current = 0;
    setBug(b);
    setStep(0);
    setRun(runRef.current);
    if (manual) setAuto(false);
  }, []);

  // Start the scenes only once the window is properly in view, pause when it leaves.
  useEffect(() => {
    const el = win.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Step clock: one timeout per step, resumable after a pause.
  useEffect(() => {
    if (!playing) return;
    const last = step >= LAST;
    if (last && !auto) return;
    const mine = runRef.current;
    const dur = (last ? TOTAL : STEPS[step + 1].t) - STEPS[step].t;
    const t0 = performance.now();
    let done = false;
    const id = window.setTimeout(() => {
      done = true;
      spent.current = 0;
      if (!last) setStep(step + 1);
      else start((bug + 1) % BUGS.length, false);
    }, Math.max(0, dur - spent.current));
    return () => {
      clearTimeout(id);
      if (!done && runRef.current === mine) spent.current += performance.now() - t0;
    };
  }, [playing, step, run, auto, bug, start]);

  const onTabKey = (e: KeyboardEvent) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const i = (bug + d + BUGS.length) % BUGS.length;
    start(i, true);
    tabs.current[i]?.focus();
  };

  const B = BUGS[bug];
  const s = reduce ? LAST : step;
  const fixed = s >= 4;
  const state = s >= 7 ? "pass" : s >= 5 ? "run" : s >= 3 ? "fail" : s >= 1 ? "run" : "idle";
  const diag = s >= 7 ? "ok" : s >= 4 ? "fix" : s >= 3 ? "bad" : "idle";
  const flagRow = (B.lines.find((l) => l.flag)?.from ?? 0) + 1;
  const status = { idle: "ready", run: "running", fail: "1 failing", pass: "1 passing" }[state];

  return (
    <section className={`why${playing ? "" : " is-paused"}`} aria-labelledby="why-title">
      <div className="container-x">
        <div className="why-top">
          <Reveal className="why-head">
            <span className="eyebrow">Why HashX Labs</span>
            <h2 id="why-title" className="t-h2 mt-3">
              <Words text="Engineering you can trust with value" />
            </h2>
            <div className="mt-8">
              <ButtonLink href="/about" variant="secondary">
                How we think{" "}
                <span className="arr" aria-hidden="true">
                  →
                </span>
              </ButtonLink>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <p className="why-lead">
              Most exploits are ordinary mistakes:{" "}
              {BUGS.map((b, i) => (
                <Fragment key={b.id}>
                  <button type="button" className="why-ph" aria-pressed={i === bug} aria-controls="why-panel" onClick={() => start(i, true)}>
                    {i === bug && <span key={run} className="why-ph-hl" style={vars({ "--dur": `${TOTAL}ms` })} aria-hidden="true" />}
                    {b.phrase}
                    <sup aria-hidden="true">{i + 1}</sup>
                  </button>
                  {i < BUGS.length - 1 ? ", " : ""}
                </Fragment>
              ))}
              . We make each of them fail a test long before it can fail on mainnet.
            </p>
          </Reveal>
        </div>

        <div className="why-demo">
          <div className="why-dhead">
            <p className="why-note">
              <i aria-hidden="true" />
              Illustrative example: each mistake made to fail a test, then fixed.
            </p>
            <div role="tablist" aria-label="Example mistakes" className="why-seg" style={vars({ "--i": bug })} onKeyDown={onTabKey}>
              <span className="why-seg-pill" aria-hidden="true" />
              {BUGS.map((b, i) => (
                <button
                  key={b.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`why-tab-${i}`}
                  aria-selected={i === bug}
                  aria-controls="why-panel"
                  tabIndex={i === bug ? 0 : -1}
                  onClick={() => start(i, true)}
                >
                  <span className="why-seg-n">{pad(i + 1)}</span>
                  {b.tab}
                </button>
              ))}
            </div>
          </div>

          <div className="why-stage">
            <div
              ref={win}
              id="why-panel"
              role="tabpanel"
              aria-labelledby={`why-tab-${bug}`}
              className="why-win"
              data-state={state}
              onPointerEnter={(e) => e.pointerType === "mouse" && setHold(true)}
              onPointerLeave={() => setHold(false)}
              onFocus={() => setHold(true)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
              }}
            >
              <p className="sr-only">{B.summary}</p>

              <div className="why-bar" aria-hidden="true">
                <span className="why-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="why-files">
                  {BUGS.map((b, i) => (
                    <span key={b.id} data-on={i === bug || undefined}>
                      {b.file}
                    </span>
                  ))}
                </span>
                <span className="why-status" data-s={state}>
                  <i />
                  <span key={status}>{status}</span>
                </span>
              </div>

              <div className="why-panes">
                <div className="why-cpane" aria-hidden="true">
                  <div className="why-code" style={vars({ "--rows": B.rows, "--cols": cols(B) })}>
                    <ol className="why-gutter" key={`g-${bug}`}>
                      {Array.from({ length: fixed ? B.rows : B.lines.filter((l) => l.from !== null).length }, (_, i) => (
                        <li key={i}>{i + 1}</li>
                      ))}
                    </ol>
                    <div className="why-lines" key={`${bug}-${run}`}>
                      {B.lines.map((l) => {
                        const row = fixed ? l.to : l.from;
                        return (
                          <div
                            key={l.k}
                            className="wl"
                            style={vars({ "--r": row ?? l.to })}
                            data-hidden={row === null || undefined}
                            data-ins={l.from === null || undefined}
                            data-flag={(l.flag && s === 3) || undefined}
                            data-changed={(l.changed && fixed) || undefined}
                            data-move={(l.changed && fixed && l.from !== null && l.from !== l.to) || undefined}
                          >
                            <span className="wl-mark" />
                            {l.next ? (
                              <span className="wl-roll" data-on={fixed || undefined}>
                                <span className="wl-a">
                                  <Code text={l.code} />
                                </span>
                                <span className="wl-b">
                                  <Code text={l.next} />
                                </span>
                              </span>
                            ) : (
                              <Code text={l.code} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="why-diag" data-s={diag}>
                    <span data-k="idle">Compiles cleanly · 0 warnings</span>
                    <span data-k="bad">
                      {B.file.split("/").pop()}:{flagRow} · {B.bad}
                    </span>
                    <span data-k="fix">Fix applied · {B.fix}</span>
                    <span data-k="ok">Test passes · {B.fix}</span>
                  </div>
                </div>

                <div className="why-term">
                  <div className="why-term-bar">
                    <span aria-hidden="true">zsh · forge</span>
                    <button type="button" className="why-replay" onClick={() => start(bug, true)} aria-label={`Replay the ${B.tab.toLowerCase()} example`}>
                      <Icon name="refresh" className="h-3.5 w-3.5" />
                      Replay
                    </button>
                  </div>
                  <div className="why-term-body" key={`${bug}-${run}`} aria-hidden="true">
                    {s >= 1 && <Cmd text={B.cmd} typing={s === 1} />}
                    {s === 2 && (
                      <p className="tl tl-dim">
                        <i className="tl-spin" />
                        Compiling and running 1 test…
                      </p>
                    )}
                    {s >= 3 && (
                      <>
                        <p className="tl tl-dim">{B.ran}</p>
                        <p className="tl tl-fail" style={{ animationDelay: ".08s" }}>
                          {B.fail}
                        </p>
                        <p className="tl tl-why" style={{ animationDelay: ".16s" }}>
                          ↳ {B.why}
                        </p>
                        <p className="tl tl-bad" style={{ animationDelay: ".24s" }}>
                          Suite result: FAILED. 0 passed; 1 failed
                        </p>
                      </>
                    )}
                    {s >= 5 && <Cmd text={B.cmd} typing={s === 5} gap />}
                    {s === 6 && (
                      <p className="tl tl-dim">
                        <i className="tl-spin" />
                        Compiling and running 1 test…
                      </p>
                    )}
                    {s >= 7 && (
                      <>
                        <p className="tl tl-pass">{B.pass}</p>
                        <p className="tl tl-ok" style={{ animationDelay: ".1s" }}>
                          Suite result: ok. 1 passed; 0 failed
                        </p>
                      </>
                    )}
                  </div>
                  <span className="why-glow" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="why-rs-wrap">
          <ol className="why-rs">
            {REASONS.map((r, i) => (
              <li key={r.title} className="why-r" style={vars({ "--i": i })}>
                <div className="why-r-top">
                  <span className="why-r-n">{pad(i + 1)}</span>
                </div>
                <h3 className="why-r-t">{r.title}</h3>
                <p className="why-r-d">{r.d}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
