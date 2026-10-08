"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceStrict } from "date-fns";
import { m } from "motion/react";

import type { Hackathon } from "@/types/database";
import { SectionLabel } from "@/components/decor/section-label";
import { EASE_OUT } from "@/components/motion/easing";
import { cn } from "@/lib/utils";

type Milestone = { key: string; label: string; time: number };

function buildMilestones(hackathon: Hackathon): Milestone[] {
  return [
    { key: "reg-open", label: "Registration opens", value: hackathon.registration_start },
    { key: "reg-close", label: "Registration closes", value: hackathon.registration_end },
    { key: "start", label: "Hackathon starts", value: hackathon.start_date },
    { key: "end", label: "Hackathon ends", value: hackathon.end_date },
  ]
    .map(({ key, label, value }) => ({ key, label, time: new Date(value).getTime() }))
    .filter((milestone) => !Number.isNaN(milestone.time))
    .sort((a, b) => a.time - b.time);
}

/** Position of "now" along evenly spaced milestones, from 0 to 1. */
function progressAlong(milestones: Milestone[], now: number) {
  if (milestones.length < 2) return 0;
  if (now <= milestones[0].time) return 0;
  const lastIndex = milestones.length - 1;
  if (now >= milestones[lastIndex].time) return 1;

  for (let index = 0; index < lastIndex; index += 1) {
    const from = milestones[index].time;
    const to = milestones[index + 1].time;
    if (now >= from && now <= to) {
      const fraction = to === from ? 1 : (now - from) / (to - from);
      return (index + fraction) / lastIndex;
    }
  }
  return 0;
}

function describeNow(hackathon: Hackathon, now: number) {
  const time = (value: string) => new Date(value).getTime();
  const distance = (value: string) => formatDistanceStrict(time(value), now);

  if (hackathon.status === "completed" || now > time(hackathon.end_date)) {
    return "Wrapped up";
  }
  if (now < time(hackathon.registration_start)) {
    return `Registration opens in ${distance(hackathon.registration_start)}`;
  }
  if (now <= time(hackathon.registration_end)) {
    return `Registration closes in ${distance(hackathon.registration_end)}`;
  }
  if (now < time(hackathon.start_date)) {
    return `Starts in ${distance(hackathon.start_date)}`;
  }
  return `Live now · ends in ${distance(hackathon.end_date)}`;
}

export function HackathonTimeline({ hackathon }: { hackathon: Hackathon }) {
  // "Now" is only known on the client; render the static schedule first.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const milestones = buildMilestones(hackathon);
  if (milestones.length === 0) return null;

  const progress = now === null ? 0 : progressAlong(milestones, now);
  const lastIndex = Math.max(milestones.length - 1, 1);
  // Columns are separated by a 1rem gap, so the last dot sits
  // lastIndex/n of the way across plus lastIndex/n of a gap per column.
  const share = lastIndex / milestones.length;
  const trackWidth = `calc(${share * 100}% + ${share}rem)`;

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionLabel>timeline</SectionLabel>
        {now !== null ? (
          <m.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-foreground/[0.05] px-3 py-1.5 font-mono text-[0.72rem] text-foreground"
          >
            <span className="size-1.5 rounded-full bg-signal" />
            {describeNow(hackathon, now)}
          </m.span>
        ) : null}
      </div>

      <ol
        className="relative mt-8 grid gap-7 md:gap-4"
        style={{ gridTemplateColumns: `repeat(${milestones.length}, minmax(0, 1fr))` }}
      >
        {/* Track + progress, from the first dot's centre to the last one's */}
        <span
          aria-hidden
          className="absolute left-[0.6rem] top-[0.6rem] hidden h-px bg-border md:block"
          style={{ width: trackWidth }}
        />
        <m.span
          aria-hidden
          className="absolute left-[0.6rem] top-[calc(0.6rem-0.5px)] hidden h-[2px] origin-left rounded-full bg-signal md:block"
          style={{ width: trackWidth }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={{ duration: 1.4, ease: EASE_OUT }}
        />
        {milestones.map((milestone) => {
          const reached = now !== null && now >= milestone.time;
          return (
            <li
              key={milestone.key}
              className="relative col-span-full flex items-start gap-4 md:col-span-1 md:flex-col md:gap-4"
            >
              <span
                className={cn(
                  "relative z-10 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-500 md:mt-0",
                  reached ? "border-signal bg-signal" : "border-border bg-card",
                )}
              >
                {reached ? <span className="size-1.5 rounded-full bg-ink" /> : null}
              </span>
              <div>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {milestone.label}
                </p>
                <p className="mt-1 font-display text-xl font-semibold tracking-[-0.02em]">
                  {format(milestone.time, "MMM d")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(milestone.time, "EEE · h:mm a")}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
