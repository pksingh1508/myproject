"use client";

import { ShieldCheckIcon, SparklesIcon, UsersIcon } from "lucide-react";

import { CustomCard } from "@/components/layout";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

const reasons = [
  {
    title: "Trusted by serious builders",
    description:
      "We vet every hackathon partner and ensure prizes, judging, and communication are transparent from start to finish.",
    icon: ShieldCheckIcon
  },
  {
    title: "Designed for lightning-fast submissions",
    description:
      "Integrated forms, team tools, and real-time status updates eliminate guesswork so you can focus on the code, not the admin.",
    icon: SparklesIcon
  },
  {
    title: "Community that stays with you",
    description:
      "Collaborate with thousands of makers, mentors, and investors who keep supporting your project long after demo day.",
    icon: UsersIcon
  }
] as const;

export function WhyChooseUs() {
  return (
    <section
      className="w-full bg-background py-10 sm:py-10"
      style={brandSansStyle}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Why choose us
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={brandDisplayStyle}
          >
            Everything you need to win hackathons that matter
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            Hackathon Hub blends pro-grade tooling with a community that
            genuinely wants to see you ship. Here’s what sets us apart.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <CustomCard
                key={reason.title}
                className="group h-full border-border/60 bg-muted/30 backdrop-blur-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-110" />
                </span>
                <div className="mt-4 space-y-2 text-left">
                  <h3 className="text-lg font-semibold text-foreground">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {reason.description}
                  </p>
                </div>
              </CustomCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
