"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { ScribbleUnderline } from "@/components/decor/scribbles";
import { CustomCard } from "@/components/layout/custom-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { StatsBand } from "./stats-band";
import { EASE_OUT } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

const reasons = [
  {
    title: "Trusted by serious builders",
    description:
      "We vet every hackathon partner and keep prizes, judging, and communication transparent from start to finish.",
    Illustration: TrustSeal,
  },
  {
    title: (
      <>
        Designed for <span className="whitespace-nowrap">lightning-fast</span>{" "}
        submissions
      </>
    ),
    description:
      "Integrated forms, team tools, and real-time status updates remove the guesswork, so you can focus on the code, not the admin.",
    Illustration: SubmitDemo,
  },
  {
    title: "A community that stays with you",
    description:
      "Collaborate with makers, mentors, and investors who keep supporting your project long after demo day.",
    Illustration: CommunityGraph,
  },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="relative py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          index="03"
          label="why hackathonwallah"
          title={
            <>
              Everything you need to win hackathons that{" "}
              <span className="relative inline-block whitespace-nowrap">
                matter.
                <ScribbleUnderline
                  delay={0.4}
                  className="absolute -bottom-[0.12em] left-0 h-[0.22em] w-full text-signal"
                />
              </span>
            </>
          }
          description="HackathonWallah blends pro-grade tooling with a community that genuinely wants to see you ship. Here's what sets us apart."
        />

        <StatsBand className="mt-16" />

        <div className="mt-16 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {reasons.map(({ title, description, Illustration }, index) => (
            <CustomCard key={index} revealDelay={index * 0.1} className="p-0">
              <div className="relative h-60 overflow-hidden border-b border-border">
                <div aria-hidden className="absolute inset-0 bg-graph mask-fade-edges" />
                <Illustration />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-7">
                <h3 className="font-display text-[1.45rem] font-semibold leading-tight tracking-[-0.03em]">
                  {title}
                </h3>
                <p className="leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </CustomCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Illustrations ------------------------------------------------------------- */

function sealPath(points = 18, outer = 56, inner = 50.5) {
  const coords: string[] = [];
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = (Math.PI * index) / points - Math.PI / 2;
    const x = (60 + radius * Math.cos(angle)).toFixed(2);
    const y = (60 + radius * Math.sin(angle)).toFixed(2);
    coords.push(`${index === 0 ? "M" : "L"}${x} ${y}`);
  }
  return `${coords.join("")}Z`;
}

const SEAL_PATH = sealPath();

function TrustSeal() {
  const chips = [
    { label: "vetted partners", className: "left-[7%] top-[16%]", delay: "0s" },
    { label: "clear judging", className: "right-[6%] top-[42%]", delay: "-2.4s" },
    { label: "transparent prizes", className: "bottom-[13%] left-[11%]", delay: "-4.6s" },
  ];

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative grid size-32 place-items-center">
        <svg aria-hidden viewBox="0 0 120 120" className="absolute inset-0 animate-spin-slow text-signal">
          <path d={SEAL_PATH} fill="currentColor" />
          <circle cx="60" cy="60" r="43" fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
        </svg>
        <span className="relative grid size-14 place-items-center rounded-full bg-ink text-hilite shadow-lift">
          <Check className="size-6" strokeWidth={3} />
        </span>
      </div>
      {chips.map((chip) => (
        <span
          key={chip.label}
          style={{ animationDelay: chip.delay }}
          className={cn(
            "absolute inline-flex animate-float items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 font-mono text-[0.7rem] text-foreground shadow-soft",
            chip.className,
          )}
        >
          <Check className="size-3 text-signal-ink" strokeWidth={3} />
          {chip.label}
        </span>
      ))}
    </div>
  );
}

const DEMO_URL = "github.com/team-404/campus-connect";

function SubmitDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduceMotion = useReducedMotion();
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<"typing" | "uploading" | "done">("typing");

  useEffect(() => {
    if (reduceMotion) {
      setTyped(DEMO_URL.length);
      setPhase("done");
      return;
    }
    if (!inView) return;

    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => timers.push(window.setTimeout(resolve, ms)));

    const loop = async () => {
      while (!cancelled) {
        setPhase("typing");
        setTyped(0);
        await wait(500);
        for (let index = 1; index <= DEMO_URL.length && !cancelled; index += 1) {
          setTyped(index);
          await wait(45);
        }
        await wait(350);
        if (cancelled) return;
        setPhase("uploading");
        await wait(1300);
        if (cancelled) return;
        setPhase("done");
        await wait(2600);
      }
    };

    void loop();
    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [inView, reduceMotion]);

  return (
    <div ref={ref} className="absolute inset-0 grid place-items-center px-6">
      <div className="w-full max-w-[18.5rem] rounded-2xl border border-border bg-background p-4 shadow-lift">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
          Submission URL
        </p>
        <div className="mt-2 flex h-9 items-center overflow-hidden rounded-lg border border-input bg-surface px-3 font-mono text-[0.72rem]">
          <span className="truncate">{DEMO_URL.slice(0, typed)}</span>
          {phase === "typing" ? (
            <span className="ml-px inline-block h-3.5 w-[2px] shrink-0 animate-caret bg-foreground" />
          ) : null}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
          <m.div
            className="h-full rounded-full bg-signal"
            initial={false}
            animate={{ width: phase === "typing" ? "0%" : "100%" }}
            transition={{ duration: phase === "uploading" ? 1.2 : 0.3, ease: EASE_OUT }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[0.68rem] text-muted-foreground">
            {phase === "done" ? "received ✓" : phase === "uploading" ? "uploading…" : "draft"}
          </span>
          <m.span
            layout
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors duration-300",
              phase === "done" ? "bg-signal text-ink" : "bg-foreground text-background",
            )}
          >
            {phase === "done" ? <Check className="size-3.5" strokeWidth={3} /> : null}
            {phase === "done" ? "Submitted" : "Submit"}
          </m.span>
        </div>
      </div>
    </div>
  );
}

const community = [
  { initials: "AP", x: 18, y: 26, tone: "bg-signal text-ink" },
  { initials: "MC", x: 80, y: 20, tone: "bg-marigold text-ink" },
  { initials: "SL", x: 88, y: 66, tone: "bg-foreground text-background" },
  { initials: "DK", x: 60, y: 86, tone: "bg-hilite text-ink" },
  { initials: "OT", x: 22, y: 76, tone: "bg-brand text-background" },
  { initials: "HA", x: 46, y: 12, tone: "bg-surface text-foreground ring-1 ring-border" },
];

function CommunityGraph() {
  return (
    <div className="absolute inset-0">
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full text-foreground/25">
        {community.map((person, index) => (
          <m.line
            key={person.initials}
            x1="50"
            y1="50"
            x2={person.x}
            y2={person.y}
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1.5 1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: EASE_OUT }}
          />
        ))}
      </svg>
      <div className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-border bg-background shadow-lift">
        <BrandMark className="size-9" />
      </div>
      {community.map((person, index) => (
        <m.span
          key={person.initials}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${person.x}%`, top: `${person.y}%` }}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.5 + index * 0.08 }}
        >
          <span
            style={{ animationDelay: `${-index * 1.1}s` }}
            className={cn(
              "grid size-10 animate-float place-items-center rounded-full font-mono text-[0.7rem] font-semibold shadow-soft",
              person.tone,
            )}
          >
            {person.initials}
          </span>
        </m.span>
      ))}
    </div>
  );
}
