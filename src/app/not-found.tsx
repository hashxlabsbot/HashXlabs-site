import SiteShell from "@/components/SiteShell";
import { Arrow, ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-[var(--header-h)]">
        <span className="eyebrow">404</span>
        <h1 className="t-h1 mt-3">This page doesn&apos;t exist</h1>
        <p className="t-lead mt-4 max-w-xl">The link may be old, or the page may have moved. Try the homepage or browse our services.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/">
            Go to homepage <Arrow />
          </ButtonLink>
          <ButtonLink href="/services" variant="secondary">
            Browse services
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
