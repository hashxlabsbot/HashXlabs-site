"use client";

import { useEffect } from "react";

/**
 * Adds `.js-ready` to <html> once the client app has hydrated. CSS uses this
 * class to enable the scroll-reveal start-state. If hydration ever fails, the
 * class is never added and all content stays fully visible (never blank).
 */
export default function ClientReady() {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");

    const onPointerMove = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(".spotlight") as HTMLElement | null;
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty("--mx", `${e.clientX - rect.left}px`);
        target.style.setProperty("--my", `${e.clientY - rect.top}px`);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
