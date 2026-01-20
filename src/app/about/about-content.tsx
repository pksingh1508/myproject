"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { BrandButton, CustomCard } from "@/components/layout";

type StatDescriptor = {
  label: string;
  target: number;
  prefix?: string;
  suffix?: string;
  format: "integer" | "compact" | "decimal";
};

const stats: StatDescriptor[] = [
  { label: "Hackathons launched", target: 120, suffix: "+", format: "integer" },
  {
    label: "Projects submitted",
    target: 18_000,
    suffix: "+",
    format: "compact"
  },
  {
    label: "Prizes awarded",
    target: 3.2,
    prefix: "₹",
    suffix: " Cr",
    format: "decimal"
  },
  { label: "Campuses represented", target: 640, suffix: "+", format: "integer" }
];

const pillars = [
  {
    title: "Curated challenges",
    description:
      "Every problem statement is built with mentors and partners so students solve real problems while learning industry best practices."
  },
  {
    title: "Frictionless experience",
    description:
      "We handle the logistics, mentoring, judging, and communications so participants can code, iterate, and demo without distractions."
  },
  {
    title: "Guaranteed recognition",
    description:
      "If you ship, you shine. Every submitted solution earns a reward because we believe progress deserves the prize."
  }
];

const values = [
  {
    title: "Build together",
    description:
      "HackathonWallah brings together developers, designers, makers, and dreamers from hundreds of campuses to collaborate in public."
  },
  {
    title: "Learn out loud",
    description:
      "Workshops, AMAs, retros, and mentor office hours help teams pick up new stacks and ship production-ready ideas."
  },
  {
    title: "Celebrate courage",
    description:
      "We reward the courage to finish projects, not just to win. Shipping early and often is the mindset that powers careers."
  }
];

const milestones = [
  {
    year: "2019",
    title: "Born in campus corridors",
    description:
      "HackathonWallah began as a basement experiment by a group of students who wanted an inclusive space to prototype and learn."
  },
  {
    year: "2021",
    title: "India-wide adoption",
    description:
      "Universities from Delhi to Bengaluru signed on, partners joined the movement, and every submission started receiving rewards."
  },
  {
    year: "2024",
    title: "Beyond the weekend",
    description:
      "We now power year-long innovation programs, job pipelines, and founder cohorts while keeping hackathon energy at the center."
  }
];

const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

export default function AboutContent() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const statsRefs = useRef<Array<HTMLParagraphElement | null>>([]);
  const compactFormatter = useMemo(
    () =>
      Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1
      }),
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const hero = heroRef.current;
    if (hero) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          hero.querySelectorAll("[data-animate=hero]"),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out"
          }
        );
      }, hero);

      return () => ctx.revert();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

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
        duration: 1.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref,
          start: "top 85%",
          once: true
        },
        onUpdate: () => {
          ref.textContent = formatValue(tracker.value);
        }
      });
    });
  }, [compactFormatter]);

  return (
    <main className="bg-background text-foreground" style={brandSansStyle}>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_40%)]" />
        <div
          ref={heroRef}
          className="relative mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col justify-center gap-6 px-4 py-20 sm:px-6 lg:px-8"
        >
          <span
            data-animate="hero"
            className="inline-flex w-fit items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-primary/80"
          >
            About HackathonWallah
          </span>
          <h1
            data-animate="hero"
            className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            style={brandDisplayStyle}
          >
            Where students build fearlessly, submit boldly, and win together.
          </h1>
          <p
            data-animate="hero"
            className="max-w-3xl text-lg text-muted-foreground"
          >
            HackathonWallah is India&apos;s home for student-led innovation. We
            host high-energy hackathons that reward every submission, champion
            real-world learning, and connect budding builders with mentors,
            investors, and lifelong collaborators.
          </p>
          <p
            data-animate="hero"
            className="text-base font-semibold text-primary"
          >
            Our mantra: &ldquo;Submit something. Celebrate everything.&rdquo;
            Because every shipped idea deserves the spotlight.
          </p>
          <div
            data-animate="hero"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <BrandButton
              className="px-8 py-3 text-xs"
              onClick={() => router.push("/hackathons")}
            >
              Browse live hackathons
            </BrandButton>
            <BrandButton
              className="px-8 py-3 text-xs border border-primary/40 bg-primary/10"
              onClick={() => router.push("/notifications")}
            >
              Stay in the loop
            </BrandButton>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8">
        {stats.map((stat, index) => (
          <CustomCard key={stat.label} className="h-full">
            <p
              ref={(el) => {
                statsRefs.current[index] = el;
              }}
              className="text-3xl font-semibold text-primary"
            />
            <p className="mt-2 text-sm uppercase tracking-[0.25em] text-muted-foreground">
              {stat.label}
            </p>
          </CustomCard>
        ))}
      </section>

      <section className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={brandDisplayStyle}
          >
            Why HackathonWallah exists
          </h2>
          <p className="text-muted-foreground">
            We wanted a space where students could iterate fast, learn from
            peers, and gain recognition no matter their starting point. So we
            built a platform that makes the hackathon journey inclusive,
            transparent, and genuinely rewarding.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <CustomCard key={pillar.title} className="h-full bg-muted/40">
              <h3
                className="text-lg font-semibold text-foreground"
                style={brandDisplayStyle}
              >
                {pillar.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {pillar.description}
              </p>
            </CustomCard>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={brandDisplayStyle}
          >
            The HackathonWallah promise
          </h2>
          <p className="max-w-3xl text-muted-foreground">
            When students sign up for a HackathonWallah event, they enter a
            playground where effort is celebrated and momentum is guaranteed.
            Here&rsquo;s what we believe in:
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <CustomCard key={value.title} className="h-full bg-muted/20">
              <h3
                className="text-lg font-semibold text-foreground"
                style={brandDisplayStyle}
              >
                {value.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {value.description}
              </p>
            </CustomCard>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <h2
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
            style={brandDisplayStyle}
          >
            Our journey so far
          </h2>
          <p className="text-muted-foreground">
            From a scrappy student collective to India&rsquo;s most loved
            hackathon network, here&rsquo;s a glance at the milestones that
            shaped us.
          </p>
        </div>
        <div className="mt-10 space-y-6 w-full max-w-3xl mx-auto">
          {milestones.map((milestone) => (
            <CustomCard
              key={milestone.year}
              className="border border-border/60 bg-muted/30"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
                {milestone.year}
              </p>
              <h3
                className="mt-1 text-lg font-semibold text-foreground"
                style={brandDisplayStyle}
              >
                {milestone.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {milestone.description}
              </p>
            </CustomCard>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <CustomCard className="space-y-4 border border-border/60 bg-muted/20">
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={brandDisplayStyle}
            >
              Built for every kind of student innovator
            </h2>
            <p className="text-muted-foreground">
              Whether you&rsquo;re writing your first lines of code or chasing
              your third startup idea, HackathonWallah is where curiosity meets
              momentum.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  New builders get guided starter kits, matching teammates, and
                  mentors ready to teach.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  Seasoned hackers tap into investors, designers, and hiring
                  partners at every showcase.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>
                  Alumni stay active through build sprints, job boards, and
                  launchpad programs all year long.
                </span>
              </li>
            </ul>
          </CustomCard>

          <CustomCard className="border border-primary/40 bg-primary/10">
            <h3
              className="text-lg font-semibold text-primary"
              style={brandDisplayStyle}
            >
              “Submit something. Celebrate everything.”
            </h3>
            <p className="mt-3 text-sm text-primary/80">
              Our commitment to fairness, effort, and the courage to learn in
              public. Every submission earns rewards because finishing a project
              is the real victory.
            </p>
            <p className="mt-6 text-sm font-semibold text-primary">
              Prizes aren’t just trophies—they’re momentum for your next launch.
            </p>
          </CustomCard>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="items-center gap-5 border border-primary/30 bg-primary/10 text-center shadow-lg sm:p-14 rounded-lg flex flex-col p-5">
          <h2
            className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
            style={brandDisplayStyle}
          >
            Ready to ship your next big idea?
          </h2>
          <p className="max-w-2xl text-sm text-primary/80 mx-auto text-center">
            Join thousands of students who are already building, submitting, and
            celebrating with HackathonWallah.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BrandButton
              className="px-8 py-3 text-xs"
              onClick={() => router.push("/hackathons")}
            >
              Explore live hackathons
            </BrandButton>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/10"
              style={brandSansStyle}
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
