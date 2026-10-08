import Link from "next/link";

import type { Hackathon } from "@/types/database";
import { HackathonGrid } from "@/components/hackathons";
import { BrandButton } from "@/components/layout/brand-button";
import { SectionHeading } from "@/components/layout/section-heading";

type UpcomingHackathonsSectionProps = {
  hackathons: Hackathon[];
};

export function UpcomingHackathonsSection({
  hackathons
}: UpcomingHackathonsSectionProps) {
  return (
    <section className="container-page flex flex-col gap-12 py-20 sm:py-28">
      <SectionHeading
        label="upcoming"
        title="Upcoming hackathons"
        description="Curated events with transparent pricing, structured deliverables, and serious rewards. Register early to secure a slot for your team."
        action={
          <BrandButton asChild variant="outline" arrow>
            <Link href="/hackathons">Browse all events</Link>
          </BrandButton>
        }
      />
      <HackathonGrid
        hackathons={hackathons}
        emptyState={
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight">
              No live hackathons right now
            </h3>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We&apos;re curating the next set of challenges. Check back soon or
              follow us on social to be notified first.
            </p>
          </div>
        }
      />
    </section>
  );
}
