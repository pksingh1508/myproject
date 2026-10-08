import Link from "next/link";
import { Check } from "lucide-react";

import { SectionLabel } from "@/components/decor/section-label";
import { BrandButton } from "@/components/layout/brand-button";
import { Reveal } from "@/components/motion/reveal";

const organiserPoints = [
  "Participant vetting with Clerk and Supabase sync",
  "Automated payment flows with Cashfree reconciliation",
  "Real-time analytics dashboards and exports",
];

const builderPoints = [
  "Granular team management and roster updates",
  "Automated notifications for milestones and payments",
  "Secure, collaborative workspace out of the box",
];

export function CallToActionSection() {
  return (
    <section className="container-page grid grid-cols-1 gap-5 py-20 sm:py-28 lg:grid-cols-2">
      <Reveal y={30}>
        <div className="relative flex h-full flex-col gap-6 overflow-hidden rounded-[2rem] bg-foreground p-8 text-background shadow-lift sm:p-10">
          <SectionLabel tone="inverse">for organisers</SectionLabel>
          <h2 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.035em]">
            Hosting a hackathon?
          </h2>
          <p className="leading-relaxed text-background/70">
            Use our end-to-end toolkit for registration, payments, and insights
            so you can focus on crafting a remarkable experience.
          </p>
          <ul className="flex flex-col gap-3 text-sm text-background/80">
            {organiserPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-hilite dark:text-[oklch(0.45_0.13_142)]" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2">
            <BrandButton asChild variant="signal" arrow>
              <Link href="/contact">Talk to our team</Link>
            </BrandButton>
          </div>
        </div>
      </Reveal>

      <Reveal y={30} delay={0.1}>
        <div className="flex h-full flex-col gap-6 rounded-[2rem] border border-border bg-card p-8 shadow-soft sm:p-10">
          <SectionLabel>for builders</SectionLabel>
          <h2 className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.035em]">
            Builders love HackathonWallah
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            From seamless registration to submission tracking, HackathonWallah
            gives you the infrastructure to iterate quickly and show up prepared
            on demo day.
          </p>
          <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
            {builderPoints.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-signal-ink" strokeWidth={2.5} />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-2">
            <BrandButton asChild variant="outline" arrow>
              <Link href="/hackathons">Find your next hackathon</Link>
            </BrandButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
