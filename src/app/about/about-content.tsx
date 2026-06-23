"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  animate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
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

import { BrandButton } from "@/components/layout";
import { Footer } from "@/components/home/footer";
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

const cardClassName =
  "rounded-2xl border border-border/60 bg-muted/40 p-6 shadow-sm";

function formatStatValue(
  value: number,
  stat: Pick<StatDescriptor, "format" | "prefix" | "suffix">,
  compactFormatter: Intl.NumberFormat,
) {
  switch (stat.format) {
    case "compact":
      return `${compactFormatter.format(Math.round(value))}${stat.suffix ?? ""}`;
    case "decimal":
      return `${stat.prefix ?? ""}${value.toFixed(1)}${stat.suffix ?? ""}`;
    default:
      return `${stat.prefix ?? ""}${Math.round(value)}${stat.suffix ?? ""}`;
  }
}

function CountUpNumber({
  target,
  prefix,
  suffix,
  format,
}: Pick<StatDescriptor, "target" | "prefix" | "suffix" | "format">) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const count = useMotionValue(0);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const compactFormatter = useMemo(
    () =>
      Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [],
  );
  const statFormat = useMemo(
    () => ({ format, prefix, suffix }),
    [format, prefix, suffix],
  );
  const [displayValue, setDisplayValue] = useState(() =>
    formatStatValue(0, statFormat, compactFormatter),
  );

  useMotionValueEvent(count, "change", (latest) => {
    setDisplayValue(formatStatValue(latest, statFormat, compactFormatter));
  });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, target, {
      duration: 1.5,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [count, isInView, target]);

  return (
    <p
      ref={ref}
      className="text-3xl font-semibold text-foreground sm:text-4xl"
      style={brandDisplayStyle}
    >
      {displayValue}
    </p>
  );
}

function StaticIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-12 items-center justify-center rounded-2xl border border-border/80 bg-background text-foreground shadow-sm",
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={2.1} />
    </div>
  );
}

function AboutCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn(cardClassName, className)}>{children}</div>;
}

export default function AboutContent() {
  const router = useRouter();

  return (
    <main className="bg-background text-foreground" style={brandSansStyle}>
      <section className="bg-background">
        <div className="mx-auto flex min-h-[58vh] w-full max-w-6xl flex-col justify-center gap-6 px-4 pt-20 sm:px-6 lg:px-8 lg:pt-24">
          <span className="inline-flex w-fit items-center rounded-full border border-border/80 bg-muted/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">
            About HackathonWallah
          </span>

          <h1
            className="max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            style={brandDisplayStyle}
          >
            We built this for students who want a fair chance to try, build, and
            ship.
          </h1>

          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            HackathonWallah started with a simple thought: good students get
            missed all the time just because they are not from the right
            college, city, or circle. We wanted one place where they could find
            real hackathons, build with others, and feel good enough to submit
            their work.
          </p>

          <p className="max-w-2xl rounded-2xl border border-border/80 bg-muted/40 px-4 py-3 text-sm leading-6 text-muted-foreground">
            We are not here to make things look bigger than they are. We are
            here to make the path clearer for students who are willing to put in
            the work.
          </p>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <BrandButton
              className="px-8 py-3 text-xs"
              onClick={() => router.push("/hackathons")}
            >
              Explore hackathons
            </BrandButton>
            <BrandButton
              className="border border-border/60 bg-muted/40 px-8 py-3 text-xs"
              onClick={() => router.push("/notifications")}
            >
              Stay updated
            </BrandButton>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <AboutCard key={stat.label} className="h-full">
            <div className="flex h-full flex-col gap-5">
              <StaticIcon icon={stat.icon} />
              <div className="space-y-2">
                <CountUpNumber
                  target={stat.target}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  format={stat.format}
                />
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          </AboutCard>
        ))}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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
            <AboutCard key={item.title} className="h-full">
              <div className="flex h-full flex-col gap-5">
                <StaticIcon icon={item.icon} />
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
              </div>
            </AboutCard>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <AboutCard className="h-full">
            <div className="flex h-full flex-col gap-6">
              <StaticIcon icon={Users} className="size-14 rounded-3xl" />
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
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Find events fast
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    No need to hunt through scattered groups and random posts.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Build with people
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Meet teammates who want to learn and finish something real.
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background p-4">
                  <p className="text-sm font-semibold text-foreground">
                    Get a fair shot
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    First-time builders should feel welcome, not out of place.
                  </p>
                </div>
              </div>
            </div>
          </AboutCard>

          <div className="grid gap-6">
            {studentPromises.map((item) => (
              <AboutCard key={item.title} className="h-full bg-background">
                <div className="flex h-full items-start gap-4">
                  <StaticIcon
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
                </div>
              </AboutCard>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
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
            <AboutCard key={milestone.year} className="h-full">
              <div className="flex h-full flex-col gap-5">
                <StaticIcon icon={Sparkles} className="size-11 rounded-2xl" />
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
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
              </div>
            </AboutCard>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-6 shadow-sm sm:p-10">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="space-y-4">
              <h2
                className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
                style={brandDisplayStyle}
              >
                Ready to build your next project?
              </h2>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Join students who are learning in public, building with real
                intent, and getting better one submission at a time.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <BrandButton
                className="px-8 py-3 text-xs"
                onClick={() => router.push("/hackathons")}
              >
                Explore live hackathons
              </BrandButton>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                style={brandSansStyle}
              >
                Partner with us
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
