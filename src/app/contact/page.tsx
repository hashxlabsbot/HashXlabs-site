import type { Metadata } from "next";
import SiteShell from "@/components/SiteShell";
import Icon from "@/components/icons/Icon";
import ContactForm from "@/components/ContactForm";
import { PageHeader, Section } from "@/components/ui";
import { COMPANY } from "@/content/company";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your blockchain or AI project. An engineer who would work on it will reply.",
};

const NEXT = [
  ["An engineer replies", "With questions about your product, not a sales deck."],
  ["A short call", "We go through the problem, the constraints and what could go wrong."],
  ["A written scope", "Deliverables, milestones and a range, with assumptions spelled out."],
];

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your project"
        lead="Tell us what you are building and what must not go wrong. An engineer who would work on it will reply."
        crumbs={[{ href: "/contact", label: "Contact" }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <aside className="grid content-start gap-8 lg:col-span-5 lg:pl-6">
            <div className="card p-7">
              <h2 className="text-[17px] font-semibold tracking-tight">Reach us directly</h2>
              <ul className="mt-5 grid gap-4">
                <li>
                  <a href={`mailto:${COMPANY.email}`} className="group flex items-center gap-4">
                    <span className="icon-badge h-10 w-10">
                      <Icon name="chat" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[13px] text-[var(--t-lo)]">Email</span>
                      <span className="block text-[15.5px] font-semibold group-hover:text-[var(--signal)]">{COMPANY.email}</span>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={COMPANY.phoneHref} className="group flex items-center gap-4">
                    <span className="icon-badge h-10 w-10">
                      <Icon name="mobile" className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-[13px] text-[var(--t-lo)]">Phone</span>
                      <span className="block text-[15.5px] font-semibold group-hover:text-[var(--signal)]">{COMPANY.phone}</span>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-[17px] font-semibold tracking-tight">What happens next</h2>
              <ol className="mt-5 grid gap-5">
                {NEXT.map(([t, d], i) => (
                  <li key={t} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--signal-soft)] text-sm font-semibold text-[var(--signal)]">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[15.5px] font-semibold tracking-tight">{t}</h3>
                      <p className="mt-0.5 text-[14.5px] leading-relaxed text-[var(--t-mid)]">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="flex gap-3 rounded-xl bg-[var(--bg-soft)] p-5 text-[14px] leading-relaxed text-[var(--t-mid)]">
              <Icon name="lock" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--signal)]" />
              Happy to sign an NDA before you share details. Just mention it in your message.
            </p>
          </aside>
        </div>
      </Section>
    </SiteShell>
  );
}
