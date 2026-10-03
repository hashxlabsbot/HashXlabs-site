import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import Words from "@/components/fx/Words";
import { STACK } from "@/content/company";
import TechLogo from "./TechLogo";

/**
 * Home "Technology", scroll version: the stack builds itself.
 *
 * Wide screens that support CSS scroll-driven animations pin the section and
 * scroll lays the five groups down one at a time, foundation first (smart
 * contracts at the bottom, apps on top): each layer drops into place, its
 * logos land one after another, a spine grows up the side and the left
 * column says what the layer is for. When the last layer lands the pin
 * releases. Everything is opacity / translate / scale on the compositor;
 * there is no JavaScript.
 *
 * Elsewhere (narrow or short screens, reduced motion, no scroll timelines)
 * the same markup is a plain list of the five layers, each with its sentence.
 * Styles: "Tech layers" in globals.css. The canvas orbit (TechStack) is the
 * other version of this section.
 */
const vars = (v: Record<string, string | number>) => v as CSSProperties;
const pad = (n: number) => String(n).padStart(2, "0");
const TOTAL = STACK.reduce((n, g) => n + g.items.length, 0);
const UPTO = STACK.map((_, k) => STACK.slice(0, k + 1).reduce((n, g) => n + g.items.length, 0));

export default function TechLayers() {
  const n = STACK.length;
  return (
    <section className="txl" aria-labelledby="txl-title" style={vars({ "--n": n })}>
      <div className="txl-track">
        <div className="txl-stage container-x">
          <div className="txl-side">
            <Reveal>
              <span className="eyebrow">Technology</span>
              <h2 id="txl-title" className="t-h2 mt-3">
                <Words text="Proven tools, chosen for the job" />
              </h2>
              <p className="t-lead mt-4">We pick the stack that fits your product and your team, and explain why in writing.</p>
            </Reveal>

            {/* Which layer just landed (pinned version only). */}
            <div className="txl-now" aria-hidden="true">
              {STACK.map((g, k) => (
                <div key={g.group} className="txl-now-i" data-edge={k === 0 ? "first" : k === n - 1 ? "last" : undefined} style={vars({ "--i": k })}>
                  <span className="txl-now-n">
                    {pad(k + 1)} / {pad(n)} · {UPTO[k]} of {TOTAL} tools
                  </span>
                  <span className="txl-now-t">{g.group}</span>
                  <span className="txl-now-d">{g.d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="txl-stack">
            <span className="txl-spine" aria-hidden="true" />
            <ol className="txl-layers">
              {STACK.map((g, k) => (
                <li key={g.group} className="txl-layer" style={vars({ "--i": k })}>
                  <div className="txl-lab">
                    <span className="txl-n">{pad(k + 1)}</span>
                    <h3 className="txl-t">{g.group}</h3>
                    <p className="txl-d">{g.d}</p>
                  </div>
                  <ul className="txl-tiles" style={vars({ "--m": g.items.length })}>
                    {g.items.map((it, j) => (
                      <li key={it.name} className="txl-tile" style={vars({ "--j": j })} title={it.note}>
                        <span className="txl-logo">
                          <TechLogo item={it} size={26} />
                        </span>
                        <span className="txl-name">{it.name}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
