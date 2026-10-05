"use client";

import { useEffect } from "react";

/**
 * Marks which section of a long list is in the middle of the viewport:
 * sets `data-active` on the matching `[data-spy-link="<id>"]` elements and on
 * the `[data-spy="<id>"]` section itself. Renders nothing.
 */
export default function ScrollSpy({ root }: { root: string }) {
  useEffect(() => {
    const el = document.querySelector(root);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const sections = [...el.querySelectorAll<HTMLElement>("[data-spy]")];
    const links = [...el.querySelectorAll<HTMLElement>("[data-spy-link]")];
    const set = (id: string) => {
      for (const s of sections) s.toggleAttribute("data-active", s.dataset.spy === id);
      for (const l of links) l.toggleAttribute("data-active", l.dataset.spyLink === id);
    };
    if (sections[0]?.dataset.spy) set(sections[0].dataset.spy);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) set((e.target as HTMLElement).dataset.spy ?? "");
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [root]);
  return null;
}
