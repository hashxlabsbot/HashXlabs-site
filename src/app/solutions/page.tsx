import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/inner/PageHero";
import SpecDeck from "@/components/solutions/SpecDeck";
import Industries from "@/components/solutions/Industries";
import UseCases from "@/components/solutions/UseCases";
import FailureFirst from "@/components/solutions/FailureFirst";
import { Arrow, ButtonLink, CTASection } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "Solutions",
  description:
    "DeFi protocols, tokenized assets, custody and wallets, tokens and governance, and AI on real systems.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Solutions"
        title="Solutions for systems that"
        accent="move real value"
        lead="Each kind of system fails in its own way. We start every project by writing that failure down, then build and test against it."
        crumbs={[{ href: "/solutions", label: "Solutions" }]}
        actions={
          <>
            <ButtonLink href="/contact" className="ih-btn">
              Talk to an engineer <Arrow />
            </ButtonLink>
            <ButtonLink href="#use-cases" variant="secondary" className="ih-btn">
              See use cases
            </ButtonLink>
          </>
        }
        fig="Fig. 01 — One spec per kind of system"
        visual={<SpecDeck />}
      />

      <Industries />

      <FailureFirst />

      <UseCases />

      <div className="pt-20 lg:pt-28" />
      <CTASection title="Not sure which of these you need?" lead="Describe the product and the risk you are worried about. We will tell you what we would build, and what we would not." />
    </SiteShell>
  );
}
