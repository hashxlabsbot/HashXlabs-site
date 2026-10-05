import Link from "next/link";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import Code from "@/components/inner/Code";
import Flow from "@/components/inner/Flow";
import ScrollSpy from "@/components/inner/ScrollSpy";
import { Arrow, ButtonLink } from "@/components/ui";
import { SOLUTIONS } from "@/content/site";

/**
 * /solutions use-case explorer. Wide screens: a sticky index on the left that
 * follows the panel in the middle of the viewport (ScrollSpy), panels on the
 * right. Each panel: the problem, the architecture with the guarded node, what
 * we build and the test we lean on hardest. Phones: the panels stacked.
 */
export default function UseCases() {
  return (
    <section id="use-cases" className="uc section">
      <div className="container-x">
        <Reveal className="uc-head">
          <span className="eyebrow">Use cases</span>
          <h2 className="t-h2 mt-3">
            <Words text="The problem, what we build, what we test" />
          </h2>
          <p className="t-lead mt-4">Five kinds of system we build most often, and the one failure each is designed around.</p>
        </Reveal>

        <div className="uc-grid">
          <nav className="uc-nav" aria-label="Use cases">
            <ol>
              {SOLUTIONS.map((s) => (
                <li key={s.n}>
                  <a href={`#uc-${s.n}`} data-spy-link={s.n} className="uc-link">
                    <span className="uc-link-n mono">{s.n}</span>
                    <span className="uc-link-t">{s.title}</span>
                  </a>
                </li>
              ))}
            </ol>
            <ButtonLink href="/contact" size="sm" className="uc-nav-cta">
              Talk to an engineer <Arrow />
            </ButtonLink>
          </nav>

          <div className="uc-panels">
            {SOLUTIONS.map((s) => (
              <article key={s.n} id={`uc-${s.n}`} data-spy={s.n} className="uc-panel">
                <div className="uc-top">
                  <span className="uc-num mono" aria-hidden="true">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="uc-title">{s.title}</h3>
                    <p className="uc-problem">{s.problem}</p>
                  </div>
                </div>

                <div className="uc-arch">
                  <span className="uc-k mono">Architecture</span>
                  <Flow nodes={s.flow} hot={s.hot} label={`${s.title}: architecture`} />
                </div>

                <div className="uc-cols">
                  <div>
                    <span className="uc-k mono">What we build</span>
                    <p className="uc-build">{s.build}</p>
                    <ul className="uc-chips">
                      {s.builds.map((b) => (
                        <li key={b} className="chip">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="uc-k mono">What we test hardest</span>
                    <p className="uc-build">{s.test}</p>
                    <Link href={s.href} className="link mt-5 text-[14.5px]">
                      Related service <Arrow />
                    </Link>
                  </div>
                </div>

                <figure className="uc-test">
                  <div className="uc-test-bar">
                    <span className="mono">{s.file}</span>
                    <span className="uc-test-run mono">{s.runner} · illustrative test</span>
                  </div>
                  <Code lines={s.spec} className="uc-code" />
                </figure>
              </article>
            ))}
          </div>
        </div>
      </div>
      <ScrollSpy root="#use-cases" />
    </section>
  );
}
