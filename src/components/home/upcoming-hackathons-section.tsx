import Link from "next/link";

import type { Hackathon } from "@/types/database";
import { HackathonGrid } from "@/components/hackathons";
import { Button } from "@/components/ui/button";

type UpcomingHackathonsSectionProps = {
  hackathons: Hackathon[];
};

export function UpcomingHackathonsSection({
  hackathons
}: UpcomingHackathonsSectionProps) {
  return (
    <section className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Upcoming hackathons
          </h2>
          <p className="text-base text-muted-foreground">
            Curated events with transparent pricing, structured deliverables, and
            serious rewards. Register early to secure a slot for your team.
          </p>
        </div>
        <Button asChild variant="outline" size="lg" className="self-start sm:self-end">
          <Link href="/hackathons">Browse all events</Link>
        </Button>
      </div>

      {hackathons.length > 0 ? (
        <HackathonGrid hackathons={hackathons} />
      ) : (
        <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
          <h3 className="text-lg font-medium text-foreground">
            No live hackathons right now
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;re curating the next set of challenges. Check back soon or
            follow us on social to be notified first.
          </p>
        </div>
      )}
    </section>
  );
}
