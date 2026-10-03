import type { ReactNode } from "react";
import Header from "./site/Header";
import Footer from "./site/Footer";
import Search from "./site/Search";
import WhatsAppButton from "./site/WhatsAppButton";

/* Page chrome for every route. The previous shell (Navbar with live-chain bar,
   CommandPalette, SceneFlow cross-fades) is retired; those components remain
   in the repo, unused. `ctaHref`/`darkHero` are accepted for old callers. */
export default function SiteShell({ children }: { children: ReactNode; ctaHref?: string; darkHero?: boolean }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <Search />
      <WhatsAppButton />
    </>
  );
}
