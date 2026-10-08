"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Marker } from "@/components/decor/marker";
import { BrandButton } from "@/components/layout/brand-button";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeading } from "@/components/layout/section-heading";
import { EASE_OUT } from "@/components/motion/easing";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { jobData } from "@/constants/jobData";
import { cn } from "@/lib/utils";

const hiringSteps = [
  "Participate in any ongoing hackathons.",
  "Build a project related to your job title using proper tech stack.",
  "Submit the project.",
  "We schedule an interview. This is guaranteed if you submit a proper project.",
  "Get the job.",
];

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function CareerContent() {
  const router = useRouter();
  const [selectedJobTitle, setSelectedJobTitle] = useState<string | null>(null);
  const [openRole, setOpenRole] = useState<string | null>(jobData[0]?.title ?? null);

  return (
    <>
      <PageHero
        label="career"
        title={
          <>
            Build your career with <Marker trigger="mount" delay={0.7}>HackathonWallah.</Marker>
          </>
        }
        description="Explore open roles and apply for the team that matches your skills."
        actions={
          <BrandButton asChild size="lg" arrow>
            <Link href="#open-roles">See open roles</Link>
          </BrandButton>
        }
      />

      {/* How we hire */}
      <section className="container-page pb-20 sm:pb-28">
        <SectionHeading
          index="01"
          label="how we hire"
          title="Here is how we hire."
          description="We hire builders the way hackathons judge them — by what they ship."
        />
        <Stagger className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5" stagger={0.09}>
          {hiringSteps.map((step, index) => {
            const last = index === hiringSteps.length - 1;
            return (
              <StaggerItem
                key={step}
                className={cn(
                  "relative flex min-h-48 flex-col justify-between gap-6 rounded-[1.5rem] border p-6",
                  last
                    ? "border-transparent bg-signal text-ink"
                    : "border-border bg-card shadow-soft",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      last ? "text-ink/70" : "text-muted-foreground",
                    )}
                  >
                    step 0{index + 1}
                  </span>
                  {!last ? (
                    <ArrowRight className="size-4 text-foreground/30" aria-hidden />
                  ) : null}
                </div>
                <p
                  className={cn(
                    "font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]",
                    last && "text-[1.6rem]",
                  )}
                >
                  {step}
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* Open roles */}
      <section id="open-roles" className="container-page scroll-mt-28 pb-24 sm:pb-32">
        <SectionHeading
          index="02"
          label="open roles"
          title={`${jobData.length} open roles`}
          description="Pick the role that matches your stack, then prove it with a hackathon project."
        />

        <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
          {jobData.map((job) => (
            <a
              key={job.title}
              href={`#${slugify(job.title)}`}
              onClick={() => setOpenRole(job.title)}
              className="rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {job.title}
            </a>
          ))}
        </Reveal>

        <ul className="mt-10 flex flex-col gap-3">
          {jobData.map((job, index) => {
            const open = openRole === job.title;
            const panelId = `${slugify(job.title)}-details`;
            return (
              <li key={job.title} id={slugify(job.title)} className="scroll-mt-28">
                <Reveal
                  y={24}
                  delay={(index % 4) * 0.05}
                  className={cn(
                    "overflow-hidden rounded-[1.75rem] border bg-card transition-[border-color,box-shadow] duration-500",
                    open ? "border-foreground/20 shadow-lift" : "border-border shadow-soft hover:border-foreground/20",
                  )}
                >
                  <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center">
                    <span className="hidden font-mono text-sm text-muted-foreground tabular-nums lg:block lg:w-10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em] sm:text-[1.85rem]">
                          {job.title}
                        </h3>
                        <span className="rounded-full bg-foreground/[0.06] px-3 py-1 font-mono text-xs text-foreground">
                          ₹{job.salaryRange.replace(/\s*-\s*/, "–")}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 max-w-3xl leading-relaxed text-muted-foreground">
                        {job.description}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenRole(open ? null : job.title)}
                        aria-expanded={open}
                        aria-controls={panelId}
                        className="inline-flex h-11 items-center gap-2 rounded-full border border-foreground/15 px-4 text-sm font-medium transition-colors hover:border-foreground/35 hover:bg-foreground/[0.04]"
                      >
                        Details
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-300",
                            open && "rotate-180",
                          )}
                        />
                      </button>
                      <BrandButton arrow onClick={() => setSelectedJobTitle(job.title)}>
                        Apply
                      </BrandButton>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {open ? (
                      <m.div
                        id={panelId}
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE_OUT }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 gap-8 border-t border-border px-6 py-8 sm:px-8 lg:grid-cols-2 lg:pl-[4.5rem]">
                          <div>
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                              Responsibilities
                            </p>
                            <div className="rich-text mt-4 text-[0.95rem]">
                              <ul>
                                {job.responsibilities.map((responsibility) => (
                                  <li key={responsibility}>{responsibility}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div>
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">
                              Required skills
                            </p>
                            <ul className="mt-4 flex flex-wrap gap-2">
                              {job.requiredSkills.map((skill) => (
                                <li
                                  key={skill}
                                  className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/85"
                                >
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>

      <Dialog
        open={Boolean(selectedJobTitle)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedJobTitle(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Here is how we hire.</DialogTitle>
            <DialogDescription>
              Follow these steps for the{" "}
              <span className="font-medium text-foreground">{selectedJobTitle}</span> role.
            </DialogDescription>
          </DialogHeader>

          <ol className="flex flex-col gap-2">
            {hiringSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-2xl border border-border bg-muted/50 p-4 text-sm leading-relaxed text-muted-foreground"
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold",
                    index === hiringSteps.length - 1
                      ? "bg-signal text-ink"
                      : "bg-foreground text-background",
                  )}
                >
                  {index + 1}
                </span>
                <span className="pt-0.5 text-foreground/85">{step}</span>
              </li>
            ))}
          </ol>

          <div className="pt-1">
            <BrandButton
              arrow
              className="w-full sm:w-auto"
              onClick={() => {
                setSelectedJobTitle(null);
                router.push("/hackathons");
              }}
            >
              See ongoing hackathons
            </BrandButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
