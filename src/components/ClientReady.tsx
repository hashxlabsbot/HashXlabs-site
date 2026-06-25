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
  }, []);

  return null;
}
