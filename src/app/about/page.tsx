import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/inner/PageHero";
import ProfileCard from "@/components/about/ProfileCard";
import Manifesto from "@/components/about/Manifesto";
import Principles from "@/components/about/Principles";
import Promises from "@/components/about/Promises";
import Steps from "@/components/about/Steps";
import { Arrow, ButtonLink, CTASection } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "About",
  description:
    "HashX Labs is a blockchain and AI engineering company. Every engagement is led by senior engineers and built on a written specification.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About"
        title="An engineering company for products that"
        accent="hold value"
        lead="HashX Labs designs, builds and secures blockchain and AI systems for Web3 founders, fintechs, asset issuers and enterprises. Every engagement is led by senior engineers and starts from a written specification."
        crumbs={[{ href: "/about", label: "About" }]}
        actions={
          <>
            <ButtonLink href="/contact" className="ih-btn">
              Work with us <Arrow />
            </ButtonLink>
            <ButtonLink href="/case-studies" variant="secondary" className="ih-btn">
              See our work
            </ButtonLink>
          </>
        }
        fig="Fig. 01 — The company, in one file"
        stage="paper"
        visual={<ProfileCard />}
      />

      <Manifesto />

      <Principles />

      <Promises />

      <Steps />

      <div className="pt-20 lg:pt-28" />
      <CTASection />
    </SiteShell>
  );
}
