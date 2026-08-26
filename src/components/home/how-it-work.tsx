"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useSpring } from "motion/react";
import {
  AtomIcon,
  AwardIcon,
  CodeIcon,
  LogInIcon,
  RocketIcon
} from "lucide-react";

import { CustomCard } from "@/components/layout";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "end 70%"],
  });
  const timelineProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.25,
  });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background py-10 sm:py-10"
      style={brandSansStyle}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <Reveal className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            How it works
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={brandDisplayStyle}
          >
            Ship your best work in five simple steps
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            Create your profile, choose a hackathon, and let Hackathon Wallah
            guide you from onboarding to win.
          </p>
        </Reveal>
        <div className="relative flex flex-col gap-12">
          <span className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border sm:block" />
          <m.span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px origin-top -translate-x-1/2 bg-gradient-to-b from-sky-400/30 via-primary/70 to-violet-400/30 sm:block"
            style={{ scaleY: shouldReduceMotion ? 1 : timelineProgress }}
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 1;

            return (
              <div
                key={step.title}
                className={cn(
                  "relative flex flex-col gap-8 sm:flex-row sm:items-center",
                  isEven && "sm:flex-row-reverse",
                )}
              >
                <m.span
                  aria-hidden="true"
                  className="absolute left-1/2 top-1/2 z-20 hidden size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-primary shadow-[0_0_0_5px_var(--background)] sm:block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                />
                <div
                  className={cn(
                    "relative flex w-full justify-center sm:w-1/2",
                    isEven
                      ? "sm:justify-start sm:pl-16"
                      : "sm:justify-end sm:pr-16",
                  )}
                >
                  <CustomCard
                    movingBorderVisibility="hover"
                    className="group relative z-10 h-full w-full max-w-sm border-border/60 bg-muted/30 backdrop-blur-sm"
                  >
                    <div className="absolute right-6 top-6 text-sm font-semibold text-muted-foreground">
                      Step {index + 1}
                    </div>
                    <div className="flex h-full flex-col items-start gap-4 pt-10">
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-6 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3 group-hover:scale-105" />
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
                    className="pointer-events-none absolute top-1/2 z-5 hidden h-px bg-primary/35 sm:block"
                    style={
                      isEven
                        ? {
                            width: "clamp(3rem, 12vw, 8rem)",
                            right: "100%",
                            transform: "translateX(100%)",
                          }
                        : {
                            width: "clamp(3rem, 12vw, 8rem)",
                            left: "100%",
                            transform: "translateX(-100%)",
                          }
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
