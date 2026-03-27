"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPinned,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BrandButton, CustomCard } from "@/components/layout";
import { cn } from "@/lib/utils";

type StatDescriptor = {
  label: string;
  target: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  format: "integer" | "compact" | "decimal";
};

type FeatureDescriptor = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type MilestoneDescriptor = {
  year: string;
  title: string;
  description: string;
};

const stats: StatDescriptor[] = [
  {
    label: "Hackathons hosted",
    target: 50,
    icon: Trophy,
    suffix: "+",
    format: "integer",
  },
  {
    label: "Projects submitted",
    target: 1_000,
    icon: Rocket,
    suffix: "+",
    format: "compact",
  },
  {
    label: "Prize money won",
    target: 20,
    icon: Sparkles,
    prefix: "₹",
    suffix: " Lakhs+",
    format: "integer",
  },
  {
    label: "Campuses joined",
    target: 40,
    icon: MapPinned,
    suffix: "+",
    format: "integer",
  },
];

const focusAreas: FeatureDescriptor[] = [
  {
    title: "Clear opportunities",
    description:
      "Students should know what to build, how to join, and what comes next without digging through ten different links.",
    icon: Target,
  },
  {
    title: "Real support",
    description:
      "A good hackathon feels less scary when you can find teammates, ask questions, and get unstuck quickly.",
    icon: Users,
  },
  {
    title: "Fair recognition",
    description:
      "Winning matters, but so does showing up and shipping something real. We want effort to count too.",
    icon: ShieldCheck,
  },
];

const studentPromises: FeatureDescriptor[] = [
  {
    title: "Less confusion",
    description:
      "Simple steps, clear timelines, and fewer last-minute surprises.",
    icon: Sparkles,
  },
  {
    title: "More confidence",
    description:
      "Helpful nudges before submission day so first-time teams feel ready.",
    icon: Rocket,
  },
  {
    title: "Momentum after the event",
    description:
      "The next teammate, project, or hackathon should be easier to find.",
    icon: ArrowRight,
  },
];

const milestones: MilestoneDescriptor[] = [
  {
    year: "2019",
    title: "Started by students",
    description:
      "HackathonWallah began with one simple goal: make hackathons feel open and doable for more students.",
  },
  {
    year: "2021",
    title: "More campuses came in",
    description:
      "Students from different cities and colleges joined, and the community started growing beyond one circle.",
  },
  {
    year: "2024",
    title: "Built for the long run",
    description:
      "It became more than a weekend event. Students stayed for the next build, the next team, and the next chance.",
  },
];

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

const hoverCardClassName =
  "border border-border/60 bg-background/80 backdrop-blur-sm transition-colors duration-300 hover:border-sky-300/80";

gsap.registerPlugin(ScrollTrigger);

function MotionIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        rest: { y: 0, rotate: 0, scale: 1 },
        hover: {
          y: -4,
          rotate: [0, -5, 4, 0],
          scale: 1.05,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      }}
      className={cn(
        "flex size-12 items-center justify-center rounded-2xl border border-sky-200/80 bg-sky-100 text-sky-700 shadow-sm",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={2.1} />
    </motion.div>
  );
}

export default function AboutContent() {
  const router = useRouter();
  const mainRef = useRef<HTMLElement | null>(null);
  const statsRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const compactFormatter = useMemo(
    () =>
      Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate=hero]",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
      );

      gsap.utils
        .toArray<HTMLElement>("[data-animate=section]")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                once: true,
              },
            },
          );
        });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      statsRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const descriptor = stats[index];
        const tracker = { value: 0 };

        const formatValue = (value: number) => {
          switch (descriptor.format) {
            case "compact":
              return `${compactFormatter.format(Math.round(value))}${
                descriptor.suffix ?? ""
              }`;
            case "decimal":
              return `${descriptor.prefix ?? ""}${value.toFixed(1)}${
                descriptor.suffix ?? ""
              }`;
            default:
              return `${descriptor.prefix ?? ""}${Math.round(value)}${
                descriptor.suffix ?? ""
              }`;
          }
        };

        ref.textContent = formatValue(0);

        gsap.to(tracker, {
          value: descriptor.target,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            ref.textContent = formatValue(tracker.value);
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, [compactFormatter]);

  return (
    <main
      ref={mainRef}
      className="bg-background text-foreground"
      style={brandSansStyle}
    >
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_42%)]" />
        <div className="relative mx-auto flex min-h-[58vh] w-full max-w-6xl flex-col justify-center gap-6 px-4 pt-20 sm:px-6 lg:px-8 lg:pt-24">
          <span
            data-animate="hero"
            className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80"
          >
            About HackathonWallah
          </span>

          <h1
            data-animate="hero"
            className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            style={brandDisplayStyle}
          >
            We built this for students who want a fair chance to try, build, and
            ship.
          </h1>

          <p
            data-animate="hero"
            className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            HackathonWallah started with a simple thought: good students get
            missed all the time just because they are not from the right
            college, city, or circle. We wanted one place where they could find
            real hackathons, build with others, and feel good enough to submit
            their work.
          </p>

          <p
            data-animate="hero"
            className="max-w-2xl rounded-2xl border border-sky-200/80 bg-sky-100/80 px-4 py-3 text-sm leading-6 text-sky-900"
          >
            We are not here to make things look bigger than they are. We are
            here to make the path clearer for students who are willing to put in
            the work.
          </p>

          <div
            data-animate="hero"
            className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center"
          >
            <BrandButton
              className="px-8 py-3 text-xs"
              onClick={() => router.push("/hackathons")}
            >
              Explore hackathons
            </BrandButton>
            <BrandButton
              className="border border-primary/40 bg-primary/10 px-8 py-3 text-xs"
              onClick={() => router.push("/notifications")}
            >
              Stay updated
            </BrandButton>
          </div>
        </div>
      </section>

      <section
        data-animate="section"
        className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <CustomCard
              key={stat.label}
              className={cn(hoverCardClassName, "h-full bg-muted/20")}
            >
              <motion.div
                initial="rest"
                whileHover="hover"
                className="flex h-full flex-col gap-5"
              >
                <MotionIcon icon={Icon} />
                <div className="space-y-2">
                  <p
                    ref={(el) => {
                      statsRefs.current[index] = el;
                    }}
                    className="text-3xl font-semibold text-foreground sm:text-4xl"
                    style={brandDisplayStyle}
                  />
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            </CustomCard>
          );
        })}
      </section>

      <section
        data-animate="section"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="max-w-3xl space-y-4">
          <h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={brandDisplayStyle}
          >
            What we are trying to fix
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            A lot of good students never get started because hackathons can feel
            noisy, confusing, or made for people who already know the system. We
            want the whole experience to feel simpler from day one.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {focusAreas.map((item) => (
            <CustomCard
              key={item.title}
              className={cn(hoverCardClassName, "h-full bg-muted/20")}
            >
              <motion.div
                initial="rest"
                whileHover="hover"
                className="flex h-full flex-col gap-5"
              >
                <MotionIcon icon={item.icon} />
                <div className="space-y-2">
                  <h3
                    className="text-xl font-semibold text-foreground"
                    style={brandDisplayStyle}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </CustomCard>
          ))}
        </div>
      </section>

      <section
        data-animate="section"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <CustomCard className={cn(hoverCardClassName, "h-full bg-muted/30")}>
            <motion.div
              initial="rest"
              whileHover="hover"
              className="flex h-full flex-col gap-6"
            >
              <MotionIcon icon={Users} className="size-14 rounded-3xl" />
              <div className="space-y-4">
                <h2
                  className="text-3xl font-semibold tracking-tight sm:text-4xl"
                  style={brandDisplayStyle}
                >
                  Why we started this
                </h2>
                <p className="text-base leading-7 text-muted-foreground">
                  We kept seeing smart students hold back because they felt
                  late, underprepared, or not connected enough. That feeling is
                  real, especially in tier-2 and tier-3 colleges. So we built a
                  space that feels more welcoming and less intimidating.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-sky-200/70 bg-sky-100/70 p-4">
                  <p className="text-sm font-semibold text-sky-950">
                    Find events fast
                  </p>
                  <p className="mt-2 text-sm leading-6 text-sky-900/80">
                    No need to hunt through scattered groups and random posts.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-200/70 bg-sky-100/70 p-4">
                  <p className="text-sm font-semibold text-sky-950">
                    Build with people
                  </p>
                  <p className="mt-2 text-sm leading-6 text-sky-900/80">
                    Meet teammates who want to learn and finish something real.
                  </p>
                </div>
                <div className="rounded-2xl border border-sky-200/70 bg-sky-100/70 p-4">
                  <p className="text-sm font-semibold text-sky-950">
                    Get a fair shot
                  </p>
                  <p className="mt-2 text-sm leading-6 text-sky-900/80">
                    First-time builders should feel welcome, not out of place.
                  </p>
                </div>
              </div>
            </motion.div>
          </CustomCard>

          <div className="grid gap-6">
            {studentPromises.map((item) => (
              <CustomCard
                key={item.title}
                className={cn(hoverCardClassName, "h-full bg-background")}
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  className="flex h-full items-start gap-4"
                >
                  <MotionIcon
                    icon={item.icon}
                    className="size-11 rounded-[1.15rem]"
                  />
                  <div className="space-y-2">
                    <h3
                      className="text-lg font-semibold text-foreground"
                      style={brandDisplayStyle}
                    >
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </CustomCard>
            ))}
          </div>
        </div>
      </section>

      <section
        data-animate="section"
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14"
      >
        <div className="max-w-3xl space-y-4 text-center mx-auto">
          <h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={brandDisplayStyle}
          >
            How we got here
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            The story has grown over time, but the goal has stayed the same:
            make it easier for students to build and actually put their work out
            there.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {milestones.map((milestone) => (
            <CustomCard
              key={milestone.year}
              className={cn(hoverCardClassName, "h-full bg-muted/20")}
            >
              <motion.div
                initial="rest"
                whileHover="hover"
                className="flex h-full flex-col gap-5"
              >
                <MotionIcon icon={Sparkles} className="size-11 rounded-2xl" />
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">
                    {milestone.year}
                  </p>
                  <h3
                    className="text-xl font-semibold text-foreground"
                    style={brandDisplayStyle}
                  >
                    {milestone.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            </CustomCard>
          ))}
        </div>
      </section>

      <section
        data-animate="section"
        className="mx-auto w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8"
      >
        <div className="rounded-[2rem] border border-primary/30 bg-primary/3 p-6 shadow-lg sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <h2
                className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
                style={brandDisplayStyle}
              >
                Ready to build your next project?
              </h2>
              <p className="text-sm leading-6 text-primary/80 sm:text-base">
                Join students who are learning in public, building with real
                intent, and getting better one submission at a time.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <BrandButton
                className="px-8 py-3 text-xs"
                onClick={() => router.push("/hackathons")}
              >
                Explore live hackathons
              </BrandButton>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10"
                style={brandSansStyle}
              >
                Partner with us
                <motion.span
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <ArrowRight className="size-4" />
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
