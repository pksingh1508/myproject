import type { Metadata } from "next";
import { Suspense } from "react";

import {
  HackathonCatalog,
  HackathonGridLoader,
} from "@/components/hackathons";
import { Marker } from "@/components/decor/marker";
import { PageHero } from "@/components/layout/page-hero";
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

export default function HackathonsPage() {
  return (
    <>
      <PageHero
        label="hackathons"
        title={
          <>
            Find your next <Marker trigger="mount" delay={0.7}>build sprint.</Marker>
          </>
        }
        description="Browse live and upcoming hackathons, refine by theme, and secure your spot in minutes. Each listing includes full details to help your team prepare."
        aside={<PlaybookNote />}
      />
      <section className="container-page pb-24 sm:pb-32">
        <Suspense fallback={<HackathonGridLoader />}>
          <HackathonCatalog />
        </Suspense>
      </section>
    </>
  );
}

/** A taped-down sticky note with the three-step playbook. */
function PlaybookNote() {
  return (
    <div className="relative mx-auto w-full max-w-[17rem] rotate-[2.5deg] lg:ml-auto lg:mr-0">
      <span
        aria-hidden
        className="absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3 rounded-[2px] bg-paper/70 shadow-sm ring-1 ring-ink/5 backdrop-blur-sm dark:bg-paper/25"
      />
      <div className="relative overflow-hidden rounded-[4px] bg-[oklch(0.93_0.09_92)] p-6 pt-8 text-ink shadow-lift">
        <div
          aria-hidden
          className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_27px,oklch(0.215_0.045_258/0.09)_27px_28px)] bg-[position:0_14px]"
        />
        <div className="relative font-hand text-[1.15rem] leading-[28px]">
          <p className="font-bold">the playbook</p>
          <p>1. pick a brief you love</p>
          <p>2. rally your team</p>
          <p>3. ship before the deadline</p>
          <p className="mt-1 text-[#1b436b]">→ then celebrate!</p>
        </div>
      </div>
    </div>
  );
}
