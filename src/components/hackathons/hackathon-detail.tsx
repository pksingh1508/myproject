import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Globe2,
  MapPin,
  Ticket,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { Hackathon } from "@/types/database";
import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { SectionLabel } from "@/components/decor/section-label";
import { HackathonRegistrationButton } from "@/components/registration";
import { Reveal } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HackathonCover } from "./hackathon-cover";
import { HackathonOverview } from "./hackathon-overview";
import { HackathonPrizes } from "./hackathon-prizes";
import { HackathonTimeline } from "./hackathon-timeline";
import { RegistrationPill } from "./registration-pill";
import {
  formatDate,
  formatDateRange,
  formatInr,
  getRegistrationState,
} from "./hackathon-utils";

type HackathonDetailProps = {
  hackathon: Hackathon;
  registrationOpen: boolean;
};

export function HackathonDetail({ hackathon, registrationOpen }: HackathonDetailProps) {
  const registration = getRegistrationState(hackathon);
  const fee = hackathon.participation_fee
    ? formatInr(Math.round(hackathon.participation_fee))
    : "Free";
  const teamSize =
    hackathon.min_team_size === hackathon.max_team_size
      ? `${hackathon.max_team_size} members`
      : `${hackathon.min_team_size}–${hackathon.max_team_size} members`;

  const facts: Array<{ label: string; value: string; detail?: string; icon: LucideIcon }> = [
    {
      label: "Dates",
      value: formatDateRange(hackathon.start_date, hackathon.end_date),
      icon: CalendarDays,
    },
    {
      label: "Registration",
      value: `Until ${formatDate(hackathon.registration_end, "MMM d")}`,
      detail: `Opened ${formatDate(hackathon.registration_start, "MMM d")}`,
      icon: Ticket,
    },
    {
      label: "Format",
      value: hackathon.location_type.charAt(0).toUpperCase() + hackathon.location_type.slice(1),
      detail: hackathon.location_details ?? hackathon.venue_address ?? undefined,
      icon: hackathon.location_type === "offline" ? MapPin : Globe2,
    },
    { label: "Team size", value: teamSize, icon: Users },
    { label: "Prize pool", value: formatInr(hackathon.prize_pool), detail: `Entry: ${fee}`, icon: Trophy },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden pb-14 pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+3.5rem)]">
        <GridBackdrop spotlight />
        <div className="container-page">
          <Reveal y={10}>
            <Link
              href="/hackathons"
              className="group inline-flex items-center gap-2 font-mono text-[0.78rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              all hackathons
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Reveal y={10} className="flex flex-wrap items-center gap-2">
                {registration ? <RegistrationPill state={registration} className="shadow-none" /> : null}
                {(hackathon.themes ?? []).map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-[0.72rem] lowercase text-muted-foreground"
                  >
                    {theme}
                  </span>
                ))}
              </Reveal>
              <h1 className="mt-6 font-display text-[clamp(2.5rem,5.8vw,4.9rem)] font-semibold leading-[0.97] tracking-[-0.045em] [font-stretch:92%]">
                <MaskLine trigger="mount" delay={0.05}>
                  {hackathon.title}
                </MaskLine>
              </h1>
              <Reveal delay={0.12} y={14}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {hackathon.short_description ?? hackathon.description}
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.2} className="lg:col-span-4 lg:justify-self-end">
              <HackathonRegistrationButton
                hackathon={hackathon}
                buttonLabel="Register now"
                buttonSize="lg"
                buttonClassName="h-14 px-8 text-base"
                registrationOpen={registrationOpen}
              />
            </Reveal>
          </div>

          <Reveal delay={0.25} y={20}>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-border bg-border shadow-soft lg:grid-cols-5">
              {facts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div
                    key={fact.label}
                    className="flex flex-col gap-1.5 bg-card p-5 last:col-span-2 lg:last:col-span-1"
                  >
                    <dt className="flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden />
                      {fact.label}
                    </dt>
                    <dd className="font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em]">
                      {fact.value}
                    </dd>
                    {fact.detail ? (
                      <dd className="line-clamp-2 text-xs text-muted-foreground">{fact.detail}</dd>
                    ) : null}
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </section>

      <div className="container-page">
        <Reveal y={30}>
          <div className="relative h-56 overflow-hidden rounded-[1.75rem] border border-border bg-muted sm:h-72 lg:h-80">
            {hackathon.banner_url ? (
              // Organiser banners can live on any host.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hackathon.banner_url}
                alt={`${hackathon.title} banner`}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <HackathonCover seed={hackathon.slug} title={hackathon.title} />
            )}
          </div>
        </Reveal>
      </div>

      <section className="container-page grid grid-cols-1 gap-10 pb-24 pt-14 sm:pb-32 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-col gap-14 lg:col-span-8">
          <Reveal>
            <HackathonTimeline hackathon={hackathon} />
          </Reveal>
          <Reveal>
            <HackathonOverview hackathon={hackathon} />
          </Reveal>
          <Reveal>
            <DetailFaq maxTeamSize={hackathon.max_team_size} />
          </Reveal>
        </div>

        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">
            <Reveal delay={0.05}>
              <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-soft">
                <SectionLabel>get ready to compete</SectionLabel>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">
                      Entry fee
                    </p>
                    <p className="mt-1 font-display text-[2.4rem] font-semibold leading-none tracking-[-0.045em]">
                      {fee}
                    </p>
                  </div>
                  <p className="pb-1 text-right text-sm text-muted-foreground">
                    Teams of
                    <br />
                    <span className="font-medium text-foreground">{teamSize}</span>
                  </p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  Assemble your team, review the rules, and register early to
                  secure your slot. Payment details are shared during checkout.
                </p>
                <div className="mt-5">
                  <HackathonRegistrationButton
                    hackathon={hackathon}
                    buttonLabel="Register"
                    buttonVariant="default"
                    buttonSize="lg"
                    buttonClassName="w-full"
                    registrationOpen={registrationOpen}
                  />
                </div>
                <ul className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 text-sm text-muted-foreground">
                  {[
                    "Secure checkout with Cashfree",
                    "Submit your project link before the deadline",
                    "Updates land in your notifications",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 size-4 shrink-0 text-signal-ink" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <HackathonPrizes hackathon={hackathon} />
            </Reveal>
          </div>
        </aside>
      </section>
    </>
  );
}

function DetailFaq({ maxTeamSize }: { maxTeamSize: number }) {
  const items = [
    {
      value: "eligibility",
      question: "Who can participate in this hackathon?",
      answer:
        "Unless otherwise stated, anyone who is 18+ and passionate about building is welcome. Cross-functional teams with developers, designers, and product minds tend to perform best.",
    },
    {
      value: "team",
      question: "Do I need a team before registering?",
      answer: `You can register solo and match with others later. We share a Discord onboarding link after payment is confirmed so you can find collaborators and form teams of up to ${maxTeamSize} members.`,
    },
    {
      value: "submission",
      question: "How are submissions evaluated?",
      answer:
        "Judges evaluate demos based on impact, technical execution, presentation, and alignment with the hackathon themes. Upload links to repos or prototypes before the submission deadline to stay eligible for prizes.",
    },
  ];

  return (
    <section aria-labelledby="faq-heading" className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <SectionLabel>faqs</SectionLabel>
        <h2
          id="faq-heading"
          className="font-display text-[2rem] font-semibold leading-tight tracking-[-0.035em] sm:text-[2.4rem]"
        >
          Questions, answered
        </h2>
        <p className="max-w-xl text-muted-foreground">
          The most common questions from participants. For anything else, reach
          out to the organising team.
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="rounded-[1.75rem] border border-border bg-card px-6 shadow-soft sm:px-8"
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="font-display text-[1.08rem] font-semibold tracking-[-0.01em]">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pr-12 text-[0.95rem] leading-relaxed text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
