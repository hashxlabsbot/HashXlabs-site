"use client";

import type { ReactNode } from "react";
import { pick, type Pick } from "./pick";

export default function PickButton({ children, className = "", ...p }: Pick & { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => pick(p)}>
      {children}
    </button>
  );
}
