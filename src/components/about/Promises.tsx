import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import Icon from "@/components/icons/Icon";
import { REASONS, WONT } from "@/content/company";

/**
 * /about "What you can expect" next to "Promises we refuse to make". When the
 * dark panel is revealed, a line is drawn through each refused promise in
 * turn (scaleX on a pseudo element).
 */
export default function Promises() {
  return (
    <section className="section">
      <div className="container-x pm-grid">
        <div>
          <Reveal>
            <span className="eyebrow">What you can expect</span>
            <h2 className="t-h2 mt-3">
              <Words text="Working with us" />
            </h2>
          </Reveal>
          <div className="pm-cards">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={i * 80} className="h-full">
                <div className="card card-hover pm-card">
                  <span className="icon-badge">
                    <Icon name={r.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="pm-t">{r.title}</h3>
                  <p className="pm-d">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="pm-no">
          <span className="eyebrow pm-no-eyebrow">What we won&apos;t do</span>
          <h2 className="t-h2 mt-3 text-white">Promises we refuse to make</h2>
          <p className="pm-no-lead">Each of these would make a sales call easier. None of them would be true.</p>
          <ul className="pm-list">
            {WONT.map((w, i) => {
              const cut = w.indexOf(". ");
              const head = cut === -1 ? w : w.slice(0, cut + 1);
              const tail = cut === -1 ? "" : w.slice(cut + 2);
              return (
                <li key={w} style={{ "--i": i } as CSSProperties}>
                  <span className="pm-n mono">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="pm-strike">{head}</span>
                    {tail && <span className="pm-tail">{tail}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
