import type { ReactNode } from "react";

/* Re-mounts on every navigation, so each page fades in. Opacity only: a
   transform here would make the fixed header scroll with the page. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
