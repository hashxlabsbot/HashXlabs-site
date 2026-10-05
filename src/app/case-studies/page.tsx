import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import SiteShell from "@/components/SiteShell";
import PageHero from "@/components/inner/PageHero";
import WorkDeck from "@/components/work/WorkDeck";
import CaseDossier from "@/components/work/CaseDossier";
import LiveProjects from "@/components/home/LiveProjects";
import { Arrow, ButtonLink, CTASection, SectionHeader } from "@/components/ui";
import { WORK } from "@/content/site";

export const metadata: Metadata = pageMeta({
  title: "Case studies",
  description:
    "Selected engagements: DeFi, tokenized assets, custody and applied AI. Client names withheld under NDA.",
  path: "/case-studies",
});

export default function WorkPage() {
  return (
    <SiteShell>
      <PageHero
        layout="stack"
        eyebrow="Work"
        title="Selected work,"
        accent="built to hold up"
        lead="Client sites you can open today, and engagements described under NDA: what was built, and how it was tested, as it was delivered."
        crumbs={[{ href: "/case-studies", label: "Work" }]}
        actions={
          <>
            <ButtonLink href="/contact" className="ih-btn">
              Discuss a similar project <Arrow />
            </ButtonLink>
            <ButtonLink href="#engagements" variant="secondary" className="ih-btn">
              Read the case studies
            </ButtonLink>
          </>
        }
        fig="Fig. 01 — Four engagements, as delivered"
        visual={<WorkDeck />}
      />

      <LiveProjects />

      <section id="engagements" className="dz-list">
        <div className="container-x">
          <SectionHeader
            eyebrow="Engagements under NDA"
            title="How the work was built and tested"
            lead="Client names stay private. We are happy to walk through the architecture and test approach of any of these on a call."
          />
          {WORK.map((w, i) => (
            <CaseDossier key={w.id} w={w} i={i} n={WORK.length} />
          ))}
        </div>
      </section>

      <div className="pt-20 lg:pt-28" />
      <CTASection title="Building something similar?" />
    </SiteShell>
  );
}
