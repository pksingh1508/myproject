import { Trophy } from "lucide-react";

import type { Hackathon } from "@/types/database";
import { SectionLabel } from "@/components/decor/section-label";
import { cn } from "@/lib/utils";
import { formatInr } from "./hackathon-utils";

interface HackathonPrizesProps {
  hackathon: Hackathon;
}

function formatPrize(value?: number | null) {
  if (value === null || value === undefined) return "TBA";
  return formatInr(value);
}

/** Total pool plus a podium: 2nd · 1st · 3rd, like the real thing. */
export function HackathonPrizes({ hackathon }: HackathonPrizesProps) {
  const podium = [
    { place: "2nd", value: hackathon.second_prize, height: "h-20", tone: "bg-foreground/[0.08] text-foreground" },
    { place: "1st", value: hackathon.first_prize, height: "h-28", tone: "bg-marigold text-ink" },
    { place: "3rd", value: hackathon.third_prize, height: "h-14", tone: "bg-foreground/[0.05] text-foreground" },
  ];

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card p-6 shadow-soft">
      <div aria-hidden className="absolute -right-12 -top-12 size-44 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--marigold),transparent_75%),transparent_70%)]" />
      <div className="relative">
        <SectionLabel>prizes &amp; recognition</SectionLabel>
        <p className="mt-5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted-foreground">
          Total prize pool
        </p>
        <p className="mt-1 font-display text-[2.6rem] font-semibold leading-none tracking-[-0.045em]">
          {formatInr(hackathon.prize_pool)}
        </p>

        <div className="mt-7 grid grid-cols-3 items-end gap-2">
          {podium.map((step) => (
            <div key={step.place} className="flex flex-col items-center gap-2 text-center">
              <span className="font-display text-[0.95rem] font-semibold tracking-tight">
                {formatPrize(step.value)}
              </span>
              <div
                className={cn(
                  "flex w-full flex-col items-center justify-start rounded-t-xl pt-2.5",
                  step.height,
                  step.tone,
                )}
              >
                {step.place === "1st" ? (
                  <Trophy className="mb-1 size-4" strokeWidth={2.4} />
                ) : null}
                <span className="font-mono text-[0.7rem] font-semibold">{step.place}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-border" />

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Beyond cash prizes, top teams often unlock fast-track interviews, cloud
          credits, and community recognition. Details are shared with finalists.
        </p>
      </div>
    </div>
  );
}
