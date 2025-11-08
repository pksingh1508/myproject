import type { Metadata } from "next";
import Link from "next/link";

import { listHackathons } from "@/lib/repos/hackathons";
import { HackathonGrid } from "@/components/hackathons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HackathonFilterInput } from "@/lib/validation/hackathons";
import { BRAND_NAME } from "@/constants/site";

export const metadata: Metadata = {
  title: `Upcoming hackathons | ${BRAND_NAME}`,
  description:
    "Find upcoming, ongoing, and completed HackathonWallah events across India. Filter by status or theme and register with one click.",
  alternates: {
    canonical: "/hackathons"
  },
  openGraph: {
    title: `Upcoming hackathons | ${BRAND_NAME}`,
    description:
      "Browse HackathonWallah events curated for Indian campuses, builders, and early-stage founders."
  },
  twitter: {
    title: `Upcoming hackathons | ${BRAND_NAME}`,
    description:
      "Browse HackathonWallah events curated for Indian campuses, builders, and early-stage founders."
  }
};

export const revalidate = 120;

interface HackathonsPageProps {
  searchParams?: Promise<{
    status?: string;
    themes?: string;
    search?: string;
  }>;
}

const STATUS_PRESETS = [
  {
    label: "Upcoming",
    value: "published,ongoing"
  },
  {
    label: "Drafts",
    value: "draft"
  },
  {
    label: "Completed",
    value: "completed"
  }
];

export default async function HackathonsPage({
  searchParams
}: HackathonsPageProps) {
  const resolvedParams = searchParams ? await searchParams : undefined;
  const activeStatus = resolvedParams?.status ?? "published,ongoing";
  const themesValue = resolvedParams?.themes;
  const searchValue = resolvedParams?.search;

  const statusFilter = activeStatus.split(
    ","
  ) as HackathonFilterInput["status"];

  const hackathons = await listHackathons({
    status: statusFilter,
    themes: themesValue ? themesValue.split(",") : undefined,
    search: searchValue
  });

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-0">
      <section className="space-y-4">
        <Badge variant="secondary" className="uppercase">
          Discover Hackathons
        </Badge>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight">
            Explore upcoming challenges and innovation sprints
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Browse live and upcoming hackathons, refine by theme, and secure
            your spot in minutes. Each listing includes full details to help
            your team prepare.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_PRESETS.map((preset) => {
            const isActive = preset.value === activeStatus;
            const href = new URLSearchParams(resolvedParams ?? {});
            href.set("status", preset.value);
            return (
              <Button
                key={preset.value}
                asChild
                variant={isActive ? "default" : "outline"}
                size="sm"
              >
                <Link href={`/hackathons?${href.toString()}`}>
                  {preset.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </section>

      <HackathonGrid
        hackathons={hackathons}
        emptyState={
          <div>
            <h3 className="text-lg font-semibold">
              No hackathons match filters
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting the filters or check back soon for newly published
              events.
            </p>
          </div>
        }
      />
    </div>
  );
}
