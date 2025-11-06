"use client";

import { useMemo } from "react";
import {
  AtomIcon,
  AwardIcon,
  CodeIcon,
  LogInIcon,
  RocketIcon
} from "lucide-react";

import { CustomCard } from "@/components/layout";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Register on the platform",
    description:
      "Create your profile in a few clicks, verify your details, and unlock access to every upcoming hackathon.",
    icon: LogInIcon
  },
  {
    title: "Join a live hackathon",
    description:
      "Browse curated challenges and secure your team's spot before registrations hit capacity.",
    icon: RocketIcon
  },
  {
    title: "Build something bold",
    description:
      "Collaborate with your crew, tackle problem statements, and craft a solution judges will remember.",
    icon: CodeIcon
  },
  {
    title: "Submit seamlessly",
    description:
      "Upload demos, docs, and presentation decks without juggling multiple tools or email threads.",
    icon: AtomIcon
  },
  {
    title: "Claim the spotlight",
    description:
      "Walk away with prizes, recognition, and investor attention ready to back your next leap.",
    icon: AwardIcon
  }
] as const;

export function HowItWork() {
  const renderedSteps = useMemo(() => {
    return steps.map((step, index) => {
      const Icon = step.icon;
      const isEven = index % 2 === 1;

      return (
        <div
          key={step.title}
          className={cn(
            "relative flex flex-col gap-8 sm:flex-row sm:items-center",
            isEven && "sm:flex-row-reverse"
          )}
        >
          <div
            className={cn(
              "relative flex w-full justify-center sm:w-1/2",
              isEven ? "sm:justify-start sm:pl-16" : "sm:justify-end sm:pr-16"
            )}
          >
            <CustomCard className="group relative h-full w-full z-10 max-w-sm border-border/60 bg-muted/30 backdrop-blur-sm">
              <div className="absolute right-6 top-6 text-sm font-semibold text-muted-foreground">
                Step {index + 1}
              </div>
              <div className="flex h-full flex-col items-start gap-4 pt-10">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="size-6 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-110" />
                </span>
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </CustomCard>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 hidden h-0.5 bg-primary/40 sm:block z-5"
              style={
                isEven
                  ? {
                      width: "clamp(3rem, 12vw, 8rem)",
                      right: "100%",
                      transform: "translateX(100%)"
                    }
                  : {
                      width: "clamp(3rem, 12vw, 8rem)",
                      left: "100%",
                      transform: "translateX(-100%)"
                    }
              }
            />
          </div>
        </div>
      );
    });
  }, []);

  return (
    <section className="w-full bg-background py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            How it works
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Ship your best work in five simple steps
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            Create your profile, choose a hackathon, and let Hackathon Hub guide
            you from onboarding to win.
          </p>
        </div>
        <div className="relative flex flex-col gap-12">
          <span className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/30 to-transparent sm:block" />
          {renderedSteps}
        </div>
      </div>
    </section>
  );
}
