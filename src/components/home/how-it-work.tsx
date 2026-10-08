"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  Code2,
  Rocket,
  Trophy,
  Upload,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react";

import { Marker } from "@/components/decor/marker";
import { BrandButton } from "@/components/layout/brand-button";
import { SectionHeading } from "@/components/layout/section-heading";
import { EASE_OUT } from "@/components/motion/easing";
import { Reveal } from "@/components/motion/reveal";
import { useMotionFactor } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

type Step = {
  hash: string;
  message: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const steps: Step[] = [
  {
    hash: "a1f3c9e",
    message: "feat: create your profile",
    title: "Register on the platform",
    description:
      "Create your profile in a few clicks, verify your details, and unlock access to every upcoming hackathon.",
    icon: UserRoundPlus,
  },
  {
    hash: "7b2e4d1",
    message: "feat: join a live hackathon",
    title: "Join a live hackathon",
    description:
      "Browse curated challenges and secure your team's spot before registrations hit capacity.",
    icon: Rocket,
  },
  {
    hash: "c94f0a2",
    message: "feat: build something bold",
    title: "Build something bold",
    description:
      "Collaborate with your crew, tackle problem statements, and craft a solution judges will remember.",
    icon: Code2,
  },
  {
    hash: "e15d7b8",
    message: "chore: submit the demo",
    title: "Submit seamlessly",
    description:
      "Upload demos, docs, and presentation decks without juggling multiple tools or email threads.",
    icon: Upload,
  },
  {
    hash: "f00d1e5",
    message: "release: v1.0",
    title: "Claim the spotlight",
    description:
      "Walk away with prizes, recognition, and investor attention ready to back your next leap.",
    icon: Trophy,
  },
];

export function HowItWork() {
  const listRef = useRef<HTMLOListElement>(null);
  const factor = useMotionFactor();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 65%", "end 55%"],
  });
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });
  // Fully drawn when the user prefers reduced motion.
  const lineProgress = useTransform(
    [springProgress, factor],
    ([progress, f]: number[]) => (f === 0 ? 1 : progress),
  );

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length + 0.1)));
    setActive((current) => (current === next ? current : next));
  });

  const current = steps[active];

  return (
    <section id="how-it-works" className="relative pb-20 pt-16 sm:pb-28 sm:pt-20">
      <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <SectionHeading
              index="01"
              label="how it works"
              title={
                <>
                  From <span className="whitespace-nowrap">sign-up</span> to spotlight in{" "}
                  <Marker>five commits.</Marker>
                </>
              }
              description="Create your profile, choose a hackathon, and let HackathonWallah guide you from onboarding to win."
            />

            <Reveal delay={0.1} className="hidden lg:block">
              <div className="rounded-2xl border border-border bg-card/80 p-5 font-mono text-[0.78rem] shadow-soft backdrop-blur">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>
                    <span className="text-signal-ink">HEAD</span> → main
                  </span>
                  <span className="tabular-nums">
                    {String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-foreground/[0.07]">
                  <m.div
                    className="h-full origin-left rounded-full bg-signal"
                    style={{ scaleX: lineProgress }}
                  />
                </div>
                <div className="relative mt-4 h-5 overflow-hidden text-foreground">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.p
                      key={current.hash}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                    >
                      <span className="text-marigold-ink">{current.hash}</span>{" "}
                      {current.message}
                    </m.p>
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <BrandButton asChild arrow>
                <Link href="/hackathons">Make your first commit</Link>
              </BrandButton>
            </Reveal>
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7 lg:pt-4">
          <span
            aria-hidden
            className="absolute bottom-6 left-[1.2rem] top-6 w-px -translate-x-1/2 bg-border"
          />
          <m.span
            aria-hidden
            className="absolute bottom-6 left-[1.2rem] top-6 w-[2px] origin-top -translate-x-1/2 rounded-full bg-signal"
            style={{ scaleY: lineProgress }}
          />
          {steps.map((step, index) => (
            <CommitRow
              key={step.hash}
              step={step}
              reached={index <= active}
              isHead={index === active}
              isRelease={index === steps.length - 1}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

type CommitRowProps = {
  step: Step;
  reached: boolean;
  isHead: boolean;
  isRelease: boolean;
};

function CommitRow({ step, reached, isHead, isRelease }: CommitRowProps) {
  const Icon = step.icon;

  return (
    <li className="relative grid grid-cols-[2.4rem_1fr] gap-4 pb-6 last:pb-0 sm:gap-6 sm:pb-8">
      <span
        className={cn(
          "relative z-10 mt-5 grid size-[2.4rem] place-items-center rounded-full border transition-[background-color,border-color,color,box-shadow] duration-500",
          reached
            ? isRelease
              ? "border-transparent bg-marigold text-ink shadow-[0_0_0_6px_color-mix(in_oklch,var(--marigold),transparent_78%)]"
              : "border-transparent bg-signal text-ink shadow-[0_0_0_6px_color-mix(in_oklch,var(--signal),transparent_80%)]"
            : "border-border bg-background text-muted-foreground",
        )}
      >
        <Icon className="size-[1.05rem]" strokeWidth={2} />
      </span>

      <Reveal y={30}>
        <article
          className={cn(
            "group relative overflow-hidden rounded-[1.6rem] border bg-card p-6 transition-[border-color,box-shadow,transform] duration-500 sm:p-7",
            isHead
              ? "border-foreground/20 shadow-lift"
              : "border-border shadow-soft hover:-translate-y-0.5",
          )}
        >
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-[0.75rem]">
            <span className="text-marigold-ink">{step.hash}</span>
            <span className="text-muted-foreground">{step.message}</span>
            {isHead ? (
              <m.span
                layoutId="commit-head"
                className="rounded-full bg-foreground px-2 py-0.5 text-[0.65rem] text-background"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              >
                HEAD
              </m.span>
            ) : null}
          </div>
          <h3 className="mt-4 font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.035em] sm:text-[1.85rem]">
            {step.title}
          </h3>
          <p className="mt-2 max-w-lg leading-relaxed text-muted-foreground">
            {step.description}
          </p>
          {isRelease ? (
            <span
              aria-hidden
              className="absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--marigold),transparent_80%),transparent_68%)]"
            />
          ) : null}
        </article>
      </Reveal>
    </li>
  );
}
