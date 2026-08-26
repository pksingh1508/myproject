"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import {
  m,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import { BrandButton, CustomCard } from "@/components/layout";

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

const featureCards = [
  {
    title: "Build without fear",
    description:
      "From idea to demo, get the clarity and support you need to participate with confidence — even if you're joining your first hackathon.",
  },
  {
    title: "Seamless participation",
    description:
      "Register, manage your team, and submit your demo in one place—no messy spreadsheets or scattered updates.",
  },
  {
    title: "Prizes worth hustling for",
    description:
      "Cash rewards, internship offers, and swag for top teams across every hackathon hosted on Hackathon Wallah.",
  },
] as const;

const heroSequence: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.08, staggerChildren: 0.09 },
  },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

function CornerHighlight({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const dotClassName =
    "absolute size-2.5 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.45)]";
  const dotAnimation = shouldReduceMotion
    ? undefined
    : { opacity: [0.55, 1, 0.55], scale: [0.9, 1.08, 0.9] };

  const dotTransition = (delay: number) => ({
    duration: 3.2,
    delay,
    repeat: Infinity,
    ease: "easeInOut" as const,
  });

  return (
    <span className="relative inline-block px-[0.32em] py-[0.08em] text-sky-950">
      <m.span
        className="absolute rounded-md inset-0 bg-sky-100/80"
        aria-hidden="true"
        initial={{ opacity: 0, scaleX: 0.88 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      <m.span
        className={`${dotClassName} left-0 top-0`}
        aria-hidden="true"
        animate={dotAnimation}
        transition={dotTransition(0)}
      />
      <m.span
        className={`${dotClassName} right-0 top-0`}
        aria-hidden="true"
        animate={dotAnimation}
        transition={dotTransition(0.35)}
      />
      <m.span
        className={`${dotClassName} bottom-0 left-0`}
        aria-hidden="true"
        animate={dotAnimation}
        transition={dotTransition(0.7)}
      />
      <m.span
        className={`${dotClassName} bottom-0 right-0`}
        aria-hidden="true"
        animate={dotAnimation}
        transition={dotTransition(1.05)}
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export function HeroSection() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const ambientYRaw = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const ambientY = useSpring(ambientYRaw, {
    stiffness: 110,
    damping: 24,
    mass: 0.25,
  });

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background"
      style={brandSansStyle}
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <m.div
          className="absolute left-[8%] top-12 size-72 rounded-full bg-sky-200/25 blur-3xl sm:size-96"
          style={{ y: shouldReduceMotion ? 0 : ambientY }}
        />
        <div className="absolute right-[4%] top-1/3 size-64 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
      </div>

      <m.div
        className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 px-4 pb-20 pt-24 text-center sm:px-6"
        variants={heroSequence}
        initial="hidden"
        animate="visible"
      >
        <div className="space-y-6">
          <m.span
            variants={heroItem}
            data-moving-border
            className="inline-flex items-center rounded-full border border-border/80 bg-background/70 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur"
          >
            Build. Submit. Win.
          </m.span>
          <div className="pt-0 lg:pt-5" />
          <m.h1
            variants={heroItem}
            className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl sm:leading-[1.05] lg:text-7xl"
            style={brandDisplayStyle}
          >
            Built for <CornerHighlight>TIER-2 &amp; TIER-3</CornerHighlight>{" "}
            College Students in India
          </m.h1>
          <m.p
            variants={heroItem}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Not from a famous college? Does not matter. HackathonWallah helps
            students from tier-2 and tier-3 colleges discover real hackathons,
            build strong projects, find teammates, and compete with confidence.
          </m.p>
        </div>

        <m.div
          variants={heroItem}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <BrandButton
            className="px-8 py-3 text-xs"
            onClick={() => router.push("/hackathons")}
          >
            Browse hackathons
          </BrandButton>
          <BrandButton
            className="border border-border/60 bg-muted/40 px-8 py-3 text-xs"
            onClick={() => router.push("/notifications")}
          >
            Stay updated
          </BrandButton>
        </m.div>

        <m.div
          variants={heroItem}
          className="mt-0 grid gap-6 text-left sm:grid-cols-3 md:mt-3"
        >
          {featureCards.map((card, index) => (
            <CustomCard
              key={card.title}
              className="h-full bg-background/65 backdrop-blur-sm"
              revealDelay={0.12 + index * 0.06}
            >
              <p className="text-base font-semibold text-foreground">
                {card.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </CustomCard>
          ))}
        </m.div>
      </m.div>
    </section>
  );
}
