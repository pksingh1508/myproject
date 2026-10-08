"use client";

import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { Marker } from "@/components/decor/marker";
import { RotatingBadge } from "@/components/decor/rotating-badge";
import { ScribbleUnderline } from "@/components/decor/scribbles";
import { SectionLabel } from "@/components/decor/section-label";
import { StatsBand } from "@/components/home/stats-band";
import { BrandButton } from "@/components/layout/brand-button";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { Parallax } from "@/components/motion/parallax";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

const focusAreas = [
  {
    title: "Clear opportunities",
    description:
      "Students should know what to build, how to join, and what comes next without digging through ten different links.",
  },
  {
    title: "Real support",
    description:
      "A good hackathon feels less scary when you can find teammates, ask questions, and get unstuck quickly.",
  },
  {
    title: "Fair recognition",
    description:
      "Winning matters, but so does showing up and shipping something real. We want effort to count too.",
  },
];

const reasons = [
  {
    title: "Find events fast",
    description: "No need to hunt through scattered groups and random posts.",
  },
  {
    title: "Build with people",
    description: "Meet teammates who want to learn and finish something real.",
  },
  {
    title: "Get a fair shot",
    description: "First-time builders should feel welcome, not out of place.",
  },
];

const studentPromises = [
  {
    title: "Less confusion",
    description: "Simple steps, clear timelines, and fewer last-minute surprises.",
  },
  {
    title: "More confidence",
    description: "Helpful nudges before submission day so first-time teams feel ready.",
  },
  {
    title: "Momentum after the event",
    description: "The next teammate, project, or hackathon should be easier to find.",
  },
];

const milestones = [
  {
    year: "2019",
    title: "Started by students",
    description:
      "HackathonWallah began with one simple goal: make hackathons feel open and doable for more students.",
  },
  {
    year: "2021",
    title: "More campuses came in",
    description:
      "Students from different cities and colleges joined, and the community started growing beyond one circle.",
  },
  {
    year: "2024",
    title: "Built for the long run",
    description:
      "It became more than a weekend event. Students stayed for the next build, the next team, and the next chance.",
  },
];

export default function AboutContent() {
  return (
    <>
      <PageHero
        label="about hackathonwallah"
        title={
          <>
            We built this for students who want a{" "}
            <Marker trigger="mount" delay={0.8}>
              fair chance
            </Marker>{" "}
            to try, build, and ship.
          </>
        }
        description="HackathonWallah started with a simple thought: good students get missed all the time just because they are not from the right college, city, or circle. We wanted one place where they could find real hackathons, build with others, and feel good enough to submit their work."
        actions={
          <>
            <BrandButton asChild size="lg" arrow>
              <Link href="/hackathons">Explore hackathons</Link>
            </BrandButton>
            <BrandButton asChild size="lg" variant="outline">
              <Link href="/notifications">
                <Bell className="size-4" />
                Stay updated
              </Link>
            </BrandButton>
          </>
        }
        aside={
          <div className="relative mx-auto grid size-56 place-items-center lg:ml-auto lg:mr-6">
            <Parallax distance={60}>
              <RotatingBadge
                text="Since 2019 • Built for every campus • "
                className="size-56 rounded-full bg-background text-foreground shadow-lift ring-1 ring-border"
              >
                <span className="grid size-24 place-items-center rounded-full bg-foreground">
                  <BrandMark tone="inverse" className="size-12" />
                </span>
              </RotatingBadge>
            </Parallax>
          </div>
        }
      />

      <section className="container-page pb-6">
        <StatsBand />
      </section>

      {/* What we are trying to fix */}
      <section className="container-page grid grid-cols-1 gap-12 py-20 sm:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              index="01"
              label="the problem"
              title="What we are trying to fix"
              description="A lot of good students never get started because hackathons can feel noisy, confusing, or made for people who already know the system. We want the whole experience to feel simpler from day one."
            />
          </div>
        </div>
        <Stagger className="flex flex-col lg:col-span-7" stagger={0.12}>
          {focusAreas.map((area, index) => (
            <StaggerItem
              key={area.title}
              className="group grid grid-cols-[3.5rem_1fr] gap-4 border-b border-border py-9 first:border-t sm:grid-cols-[5rem_1fr]"
            >
              <span className="font-display text-[2.6rem] font-semibold leading-none tracking-[-0.05em] text-foreground/15 transition-colors duration-500 group-hover:text-signal sm:text-[3.4rem]">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.03em]">
                  {area.title}
                </h3>
                <p className="mt-3 max-w-lg text-[1.02rem] leading-relaxed text-muted-foreground">
                  {area.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Manifesto */}
      <section className="container-page pb-20 sm:pb-28">
        <Reveal y={40}>
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-foreground p-8 text-background shadow-lift sm:p-12 lg:p-16">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-graph mask-fade-edges [--grid-line:color-mix(in_oklch,var(--background),transparent_90%)]"
            />
            <div
              aria-hidden
              className="absolute -right-24 -top-24 -z-10 size-96 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--signal),transparent_70%),transparent_65%)]"
            />
            <SectionLabel index="02" tone="inverse">
              why we started this
            </SectionLabel>

            <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.035em]">
                  “We kept seeing smart students hold back because they felt late,
                  underprepared, or not connected enough. That feeling is real,
                  especially in{" "}
                  <span className="relative whitespace-nowrap text-hilite dark:text-[oklch(0.45_0.13_142)]">
                    tier-2 and tier-3 colleges.
                    <ScribbleUnderline className="absolute -bottom-2 left-0 h-3 w-full" />
                  </span>
                  ”
                </p>
                <p className="mt-6 max-w-xl leading-relaxed text-background/70">
                  So we built a space that feels more welcoming and less
                  intimidating.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {reasons.map((reason) => (
                    <div
                      key={reason.title}
                      className="rounded-2xl border border-background/12 bg-background/[0.04] p-5"
                    >
                      <p className="font-display font-semibold tracking-[-0.01em]">
                        {reason.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-background/65">
                        {reason.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-5">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-background/50">
                  What students can expect
                </p>
                <ul className="mt-5 flex flex-col">
                  {studentPromises.map((promise) => (
                    <li
                      key={promise.title}
                      className="flex gap-4 border-b border-background/12 py-5 last:border-b-0"
                    >
                      <span className="mt-1.5 grid size-5 shrink-0 place-items-center rounded-full bg-signal text-ink">
                        <ArrowRight className="size-3" strokeWidth={3} />
                      </span>
                      <div>
                        <p className="font-display text-lg font-semibold tracking-[-0.02em]">
                          {promise.title}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-background/65">
                          {promise.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Story */}
      <section className="container-page pb-20 sm:pb-28">
        <SectionHeading
          index="03"
          label="our story"
          title="How we got here"
          description="The story has grown over time, but the goal has stayed the same: make it easier for students to build and actually put their work out there."
        />
        <ol className="relative mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-[0.375rem] hidden border-t border-dashed border-foreground/25 lg:block"
          />
          {milestones.map((milestone, index) => (
            <li key={milestone.year} className="relative lg:pt-10">
              <span
                aria-hidden
                className="absolute left-0 top-0 hidden size-3 rounded-full bg-signal ring-4 ring-background lg:block"
              />
              <Reveal delay={index * 0.12} y={30}>
                <span className="block font-display text-[5.5rem] font-bold leading-none tracking-[-0.06em] text-foreground/[0.08] [-webkit-text-stroke:1.5px_var(--foreground)] [font-stretch:85%] sm:text-[6.5rem]">
                  {milestone.year}
                </span>
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-[-0.03em]">
                  {milestone.title}
                </h3>
                <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
                  {milestone.description}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="container-page pb-24 sm:pb-32">
        <Reveal y={30}>
          <div className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-16 text-center shadow-soft sm:px-12 sm:py-20">
            <GridBackdrop spotlight />
            <SectionLabel>your move</SectionLabel>
            <h2 className="mx-auto mt-5 max-w-3xl font-display text-[clamp(2.25rem,5vw,3.75rem)] font-semibold leading-[1] tracking-[-0.04em]">
              Ready to build your next project?
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Join students who are learning in public, building with real
              intent, and getting better one submission at a time.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <BrandButton asChild size="lg" arrow>
                <Link href="/hackathons">Explore live hackathons</Link>
              </BrandButton>
              <BrandButton asChild size="lg" variant="outline">
                <Link href="/contact">Partner with us</Link>
              </BrandButton>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
