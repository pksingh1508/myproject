"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Bell, Timer, Trophy } from "lucide-react";

import { BrandMark } from "@/components/brand/brand-mark";
import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { Marker } from "@/components/decor/marker";
import { RotatingBadge } from "@/components/decor/rotating-badge";
import { ScribbleArrow, Sparkle } from "@/components/decor/scribbles";
import { Barcode, Sticker } from "@/components/decor/sticker";
import { BrandButton } from "@/components/layout/brand-button";
import { EASE_OUT } from "@/components/motion/easing";
import { Magnetic } from "@/components/motion/magnetic";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";
import {
  useMotionFactor,
  usePrefersReducedMotion,
} from "@/components/motion/use-reduced-motion";

const featureCards = [
  {
    title: "Build without fear",
    description:
      "From idea to demo, get the clarity and support you need to participate with confidence — even if it's your first hackathon.",
  },
  {
    title: "Seamless participation",
    description:
      "Register, manage your team, and submit your demo in one place — no messy spreadsheets or scattered updates.",
  },
  {
    title: "Prizes worth hustling for",
    description:
      "Cash rewards, internship offers, and swag for top teams across every hackathon hosted on HackathonWallah.",
  },
] as const;

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();
  const factor = useMotionFactor();

  // Scroll parallax: copy sinks and fades, the visual rises.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => progress * 140 * f,
  );
  const copyOpacity = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => (f === 0 ? 1 : Math.max(0, 1 - progress / 0.75)),
  );
  const visualY = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => progress * -90 * f,
  );

  // Pointer parallax: layers drift by depth, the pass tilts in 3D.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 18, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 18, mass: 0.6 });

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    pointerX.set(event.clientX / window.innerWidth - 0.5);
    pointerY.set(event.clientY / window.innerHeight - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate overflow-hidden pb-16 pt-[calc(var(--header-h)+2rem)] sm:pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+2.25rem)]"
    >
      <GridBackdrop spotlight size="2.5rem" />
      <div
        aria-hidden
        className="absolute -right-[12%] -top-48 -z-10 size-[46rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--signal),transparent_82%),transparent_64%)]"
      />
      <div
        aria-hidden
        className="absolute -left-[18%] top-1/3 -z-10 size-[40rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand),transparent_90%),transparent_62%)]"
      />

      <div className="container-page grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-6">
        <m.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="relative lg:col-span-7"
        >
          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-background/70 py-1.5 pl-3 pr-4 font-mono text-[0.78rem] text-muted-foreground backdrop-blur"
          >
            <span className="relative grid size-2 place-items-center">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-signal" />
              <span className="relative size-2 rounded-full bg-signal" />
            </span>
            Build <span className="text-foreground/30">·</span> Submit{" "}
            <span className="text-foreground/30">·</span> Win
          </m.p>

          <h1 className="relative font-display text-[clamp(2.9rem,6.2vw,5.75rem)] font-semibold leading-[0.93] tracking-[-0.05em] text-foreground [font-stretch:90%]">
            <MaskLine trigger="mount" delay={0.1}>
              Built for
            </MaskLine>
            <MaskLine trigger="mount" delay={0.18}>
              <Marker trigger="mount" delay={1.05}>
                tier-2 &amp; tier-3
              </Marker>
            </MaskLine>
            <MaskLine trigger="mount" delay={0.26}>
              college students
            </MaskLine>
            <MaskLine trigger="mount" delay={0.34}>
              in India<span className="text-signal">.</span>
            </MaskLine>

            <span
              aria-hidden
              className="pointer-events-none absolute left-[min(73%,33rem)] top-[18%] hidden -rotate-6 items-start gap-1 text-brand md:flex lg:hidden xl:flex"
            >
              <ScribbleArrow
                trigger="mount"
                delay={1.6}
                className="mt-6 h-14 w-20 -scale-x-100 rotate-[150deg]"
              />
              <m.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2, ease: EASE_OUT }}
                className="font-hand text-[1.6rem] font-bold leading-none tracking-normal"
              >
                yes, you!
              </m.span>
            </span>
          </h1>

          <m.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE_OUT }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-[1.15rem]"
          >
            Not from a famous college? Doesn&apos;t matter. HackathonWallah helps
            students from tier-2 and tier-3 colleges discover real hackathons,
            build strong projects, find teammates, and compete with confidence.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68, ease: EASE_OUT }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <BrandButton asChild size="lg" arrow>
                <Link href="/hackathons">Browse hackathons</Link>
              </BrandButton>
            </Magnetic>
            <BrandButton asChild size="lg" variant="outline">
              <Link href="/notifications">
                <Bell className="size-4" />
                Stay updated
              </Link>
            </BrandButton>
          </m.div>
        </m.div>

        <m.div
          style={{ y: visualY }}
          className="relative lg:col-span-5"
        >
          <HeroVisual pointerX={smoothX} pointerY={smoothY} />
        </m.div>
      </div>

      <div className="container-page mt-20 sm:mt-28">
        <Stagger delay={0.9} className="grid grid-cols-1 border-t border-border sm:grid-cols-3">
          {featureCards.map((card, index) => (
            <StaggerItem
              key={card.title}
              className="group relative border-b border-border py-7 last:border-b-0 sm:border-b-0 sm:border-l sm:px-7 sm:first:border-l-0 sm:first:pl-0 lg:px-9"
            >
              <span
                aria-hidden
                className="absolute -top-px left-0 right-0 h-[2px] origin-left scale-x-0 bg-signal transition-transform duration-700 ease-out-quint group-hover:scale-x-100 sm:left-7 sm:right-7 sm:group-first:left-0 lg:left-9 lg:right-9 lg:group-first:left-0"
              />
              <span className="font-mono text-xs text-muted-foreground">
                0{index + 1}
              </span>
              <h2 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em]">
                {card.title}
              </h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

type HeroVisualProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

function useDepth(pointer: MotionValue<number>, amount: number) {
  return useTransform(pointer, (value) => value * amount);
}

function HeroVisual({ pointerX, pointerY }: HeroVisualProps) {
  const tiltX = useTransform(pointerY, [-0.5, 0.5], [9, -9]);
  const tiltY = useTransform(pointerX, [-0.5, 0.5], [-12, 12]);
  const farX = useDepth(pointerX, -22);
  const farY = useDepth(pointerY, -16);
  const nearX = useDepth(pointerX, 46);
  const nearY = useDepth(pointerY, 34);
  const midX = useDepth(pointerX, 24);
  const midY = useDepth(pointerY, 18);

  const pop = (delay: number, rotate = 0) => ({
    initial: { opacity: 0, scale: 0.6, rotate: rotate - 18 },
    animate: { opacity: 1, scale: 1, rotate },
    transition: { type: "spring" as const, stiffness: 200, damping: 16, delay },
  });

  return (
    <div className="relative mx-auto aspect-[1/1.08] w-full max-w-[31rem] [perspective:1400px]">
      {/* Terminal, furthest back */}
      <m.div
        style={{ x: farX, y: farY }}
        className="absolute right-0 top-[1%] w-[78%]"
      >
        <m.div
          initial={{ opacity: 0, y: 30, rotate: 9 }}
          animate={{ opacity: 1, y: 0, rotate: 5 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE_OUT }}
        >
          <TerminalCard />
        </m.div>
      </m.div>

      {/* The pass, closest to the viewer */}
      <m.div
        style={{ x: midX, y: midY, rotateX: tiltX, rotateY: tiltY }}
        className="absolute bottom-0 left-0 w-[88%] [transform-style:preserve-3d]"
      >
        <m.div
          initial={{ opacity: 0, y: 50, rotate: -12 }}
          animate={{ opacity: 1, y: 0, rotate: -4 }}
          transition={{ duration: 1.1, delay: 0.5, ease: EASE_OUT }}
        >
          <HackathonPass />
        </m.div>
      </m.div>

      {/* Stickers */}
      <m.div style={{ x: nearX, y: nearY }} className="absolute -left-8 top-[14%] hidden sm:block">
        <m.div {...pop(1.1, -8)}>
          <RotatingBadge className="size-[6.5rem] bg-background text-foreground shadow-soft ring-1 ring-border">
            <Sparkle className="size-6 text-marigold" />
          </RotatingBadge>
        </m.div>
      </m.div>

      <m.div style={{ x: nearX, y: nearY }} className="absolute -bottom-[5%] -right-1 sm:-right-6">
        <m.div {...pop(1.3, 7)}>
          <Sticker className="bg-marigold">
            <Trophy className="size-4" strokeWidth={2.4} />
            Prizes for top teams
          </Sticker>
        </m.div>
      </m.div>

      <m.div style={{ x: midX, y: farY }} className="absolute left-[4%] top-[-2%] sm:left-[10%]">
        <m.div {...pop(1.45, -5)}>
          <Sticker>
            <Timer className="size-4" strokeWidth={2.4} />
            Build sprint
          </Sticker>
        </m.div>
      </m.div>
    </div>
  );
}

const terminalLines = [
  { text: "idea validated", delay: 1.2 },
  { text: "team assembled (4/4)", delay: 1.55 },
  { text: "demo recorded", delay: 1.9 },
];

function TerminalCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full border border-foreground/25" />
        <span className="size-2.5 rounded-full border border-foreground/25" />
        <span className="size-2.5 rounded-full bg-signal" />
        <span className="ml-2 font-mono text-[0.68rem] text-muted-foreground">
          ~/team-404
        </span>
      </div>
      <div className="space-y-1.5 px-4 pb-16 pt-4 font-mono text-[0.76rem] leading-relaxed sm:pb-20">
        <p>
          <span className="text-signal-ink">❯</span> npm run ship
        </p>
        {terminalLines.map((line) => (
          <m.p
            key={line.text}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: line.delay }}
            className="text-muted-foreground"
          >
            <span className="text-signal-ink">✓</span> {line.text}
          </m.p>
        ))}
        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.3 }}
        >
          <span className="text-marigold-ink">→</span> submitted. celebrate!
        </m.p>
      </div>
    </div>
  );
}

function HackathonPass() {
  return (
    <div
      className="relative overflow-hidden rounded-[1.6rem] bg-foreground text-background shadow-lift"
      style={{
        // Punch real notches into both edges at the perforation line.
        maskImage:
          "radial-gradient(circle 0.8rem at 0 calc(100% - 4.6rem), transparent 98%, #000), radial-gradient(circle 0.8rem at 100% calc(100% - 4.6rem), transparent 98%, #000)",
        maskComposite: "intersect",
        WebkitMaskImage:
          "radial-gradient(circle 0.8rem at 0 calc(100% - 4.6rem), transparent 98%, #000), radial-gradient(circle 0.8rem at 100% calc(100% - 4.6rem), transparent 98%, #000)",
        WebkitMaskComposite: "source-in",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-graph opacity-60 [--grid-line:color-mix(in_oklch,var(--background),transparent_92%)]"
      />
      <div className="relative p-6 sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrandMark tone="inverse" className="size-7" />
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-background/70">
              Hackathon pass
            </span>
          </div>
          <span className="font-mono text-[0.66rem] text-background/55">№ 0001</span>
        </div>

        <p className="mt-8 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-background/55">
          Admit
        </p>
        <p className="mt-1 font-display text-[2.15rem] font-semibold leading-none tracking-[-0.04em] sm:text-[2.4rem]">
          You &amp; your team
        </p>

        <dl className="mt-7 grid grid-cols-3 gap-4 text-[0.82rem]">
          <div>
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-background/50">
              College
            </dt>
            <dd className="mt-1 font-medium">Any. Seriously.</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-background/50">
              Track
            </dt>
            <dd className="mt-1 font-medium">Your call</dd>
          </div>
          <div>
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-background/50">
              Status
            </dt>
            <dd className="mt-1 flex items-center gap-1.5 font-medium">
              <span className="size-1.5 rounded-full bg-signal" />
              Ready
            </dd>
          </div>
        </dl>
      </div>

      <div className="perforation mx-5 text-background/35" />

      <div className="relative flex h-[4.6rem] items-center gap-4 px-6 sm:px-7">
        <Barcode className="h-9 w-36 text-background/85" />
        <span className="ml-auto text-right font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.2em] text-hilite dark:text-[oklch(0.45_0.13_142)]">
          Build · Submit
          <br />
          Win
        </span>
      </div>
    </div>
  );
}
