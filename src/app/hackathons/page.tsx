import type { Metadata } from "next";
import { Suspense } from "react";

import {
  HackathonCatalog,
  HackathonGridLoader,
} from "@/components/hackathons";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
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

const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

export default function HackathonsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-12 sm:px-6 lg:px-0"
      style={brandDisplayStyle}
    >
      <Reveal className="space-y-4">
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

      </Reveal>

      <Suspense fallback={<HackathonGridLoader />}>
        <HackathonCatalog />
      </Suspense>
    </div>
  );
}
