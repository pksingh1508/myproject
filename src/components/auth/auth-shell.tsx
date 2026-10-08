import Link from "next/link";
import { ArrowLeft, Timer, Trophy } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { RotatingBadge } from "@/components/decor/rotating-badge";
import { Sparkle } from "@/components/decor/scribbles";
import { Sticker } from "@/components/decor/sticker";
import { Reveal } from "@/components/motion/reveal";

type AuthShellProps = {
  label: string;
  children: React.ReactNode;
};

/** Split layout for sign in / sign up: brand story left, Clerk right. */
export function AuthShell({ label, children }: AuthShellProps) {
  return (
    <div className="grid grid-cols-1 min-h-dvh lg:grid-cols-2">
      <aside className="relative isolate hidden overflow-hidden bg-ink p-10 text-paper lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-graph mask-fade-edges [--grid-line:oklch(1_0_0/0.06)]"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-40 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,oklch(0.737_0.163_137/0.22),transparent_65%)]"
        />

        <Link href="/" className="inline-flex w-fit items-center gap-2.5" aria-label="HackathonWallah home">
          <BrandMark tone="light" className="size-9" />
          <span className="font-display text-lg font-semibold tracking-[-0.03em]">
            Hackathon<span className="text-paper/60">Wallah</span>
          </span>
        </Link>

        <div className="relative">
          <p className="font-mono text-[0.8rem] lowercase text-paper/60">
            <span className="text-hilite">{"// "}</span>for every campus
          </p>
          <p className="mt-6 max-w-lg font-display text-[clamp(2.4rem,3.6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] [font-stretch:92%]">
            Not from a famous college?{" "}
            <span className="text-hilite">Doesn&apos;t matter.</span>
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-paper/65">
            Discover real hackathons, build strong projects, find teammates,
            and compete with confidence.
          </p>

          <div className="pointer-events-none absolute -top-28 right-0 xl:right-8" aria-hidden>
            <RotatingBadge className="size-28 bg-paper text-ink shadow-lift">
              <Sparkle className="size-6 text-marigold" />
            </RotatingBadge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3" aria-hidden>
          <Sticker className="-rotate-3">
            <Timer className="size-4" strokeWidth={2.4} />
            Build sprint
          </Sticker>
          <Sticker className="rotate-2 bg-marigold">
            <Trophy className="size-4" strokeWidth={2.4} />
            Prizes for top teams
          </Sticker>
        </div>
      </aside>

      <div className="relative isolate flex flex-col items-center justify-center gap-6 px-4 py-20 sm:px-8">
        <GridBackdrop spotlight />
        <Link
          href="/"
          className="group absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-2 font-mono text-xs text-muted-foreground backdrop-blur transition-colors hover:text-foreground sm:left-8 sm:top-8"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          back home
        </Link>
        <Reveal y={12} className="flex flex-col items-center gap-4">
          <BrandMark animated className="size-11 lg:hidden" />
          <p className="font-mono text-[0.8rem] lowercase text-muted-foreground">
            <span className="text-signal-ink">{"// "}</span>
            {label}
          </p>
        </Reveal>
        <Reveal delay={0.08} y={24}>
          {children}
        </Reveal>
      </div>
    </div>
  );
}
