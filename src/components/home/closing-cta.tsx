import Link from "next/link";

import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { ScribbleLoopArrow, Sparkle } from "@/components/decor/scribbles";
import { SectionLabel } from "@/components/decor/section-label";
import { BrandButton } from "@/components/layout/brand-button";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { SplitWords } from "@/components/motion/text-reveal";

// Paper-confetti scattered around the statement, each at its own depth.
const confetti = [
  { className: "left-[7%] top-[18%] size-5 rotate-12 rounded-[3px] bg-signal", distance: 160 },
  { className: "left-[16%] bottom-[16%] size-3.5 rounded-full bg-marigold", distance: 90 },
  { className: "right-[9%] top-[14%] size-4 rounded-full border-[3px] border-brand", distance: 220 },
  { className: "right-[15%] bottom-[22%] size-6 -rotate-12 rounded-[4px] bg-hilite", distance: 130 },
  { className: "right-[30%] bottom-[8%] size-3 rounded-full bg-signal", distance: 70 },
];

export function ClosingCta() {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-40">
      <GridBackdrop spotlight />
      {confetti.map((piece, index) => (
        <Parallax
          key={index}
          distance={piece.distance}
          rotate={index % 2 === 0 ? 40 : -30}
          className={`absolute hidden sm:block ${piece.className}`}
        />
      ))}
      <Parallax distance={180} className="absolute left-[10%] top-[48%] hidden text-marigold lg:block">
        <Sparkle className="size-10" />
      </Parallax>
      <Parallax distance={120} className="absolute right-[8%] top-[40%] hidden text-signal lg:block">
        <Sparkle className="size-7" />
      </Parallax>

      <div className="container-page flex flex-col items-center text-center">
        <Reveal y={12}>
          <SectionLabel>ready when you are</SectionLabel>
        </Reveal>
        <h2 className="mt-7 font-display text-[clamp(3rem,9.4vw,8.6rem)] font-semibold leading-[0.9] tracking-[-0.055em] [font-stretch:88%]">
          <SplitWords text="Submit something." className="block" />
          <SplitWords
            text="Celebrate everything."
            delay={0.25}
            className="block text-brand"
          />
        </h2>
        <Reveal delay={0.3} className="mt-9 max-w-xl">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Your first hackathon is the scariest one. Pick a challenge, rally a
            team, and ship — every submission counts here.
          </p>
        </Reveal>
        <Reveal delay={0.4} className="relative mt-10 flex flex-wrap justify-center gap-3">
          <BrandButton asChild size="lg" arrow>
            <Link href="/hackathons">Browse hackathons</Link>
          </BrandButton>
          <BrandButton asChild size="lg" variant="outline">
            <Link href="/contact">Partner with us</Link>
          </BrandButton>
          <span
            aria-hidden
            className="pointer-events-none absolute right-full top-1/2 mr-6 hidden -translate-y-[85%] -rotate-[8deg] flex-col items-end text-brand md:flex"
          >
            <span className="whitespace-nowrap font-hand text-xl font-bold leading-none">first-timers welcome</span>
            <ScribbleLoopArrow delay={0.6} className="-mr-6 mt-1 h-11 w-[4.5rem] -rotate-[12deg]" />
          </span>
        </Reveal>
      </div>
    </section>
  );
}
