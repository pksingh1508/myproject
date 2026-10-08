import Link from "next/link";
import { ArrowRight, CalendarDays, Globe2, MapPin, Users } from "lucide-react";

import type { Hackathon } from "@/types/database";
import { cn } from "@/lib/utils";
import { HackathonCover } from "./hackathon-cover";
import { RegistrationPill } from "./registration-pill";
import { formatDateRange, formatInr, getRegistrationState } from "./hackathon-utils";

interface HackathonCardProps {
  hackathon: Hackathon;
}

const MODE_ICON = {
  online: Globe2,
  offline: MapPin,
  hybrid: Globe2,
} as const;

// Notches punched into both edges where the ticket stub tears off.
const ticketMask = {
  maskImage:
    "radial-gradient(circle 0.75rem at 0 calc(100% - 5.5rem), transparent 98%, #000), radial-gradient(circle 0.75rem at 100% calc(100% - 5.5rem), transparent 98%, #000)",
  maskComposite: "intersect",
  WebkitMaskImage:
    "radial-gradient(circle 0.75rem at 0 calc(100% - 5.5rem), transparent 98%, #000), radial-gradient(circle 0.75rem at 100% calc(100% - 5.5rem), transparent 98%, #000)",
  WebkitMaskComposite: "source-in",
} as React.CSSProperties;

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const registration = getRegistrationState(hackathon);
  const completed = hackathon.status === "completed";
  const ModeIcon = MODE_ICON[hackathon.location_type] ?? Globe2;
  const themes = hackathon.themes ?? [];
  const summary =
    hackathon.short_description ??
    `${hackathon.description.slice(0, 140)}${hackathon.description.length > 140 ? "…" : ""}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-[1.75rem] transition-transform duration-500 ease-out-quint",
        !completed && "hover:-translate-y-1.5",
      )}
    >
      <div
        style={ticketMask}
        className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft transition-shadow duration-500 group-hover:shadow-lift"
      >
        <div className="relative h-44 overflow-hidden bg-muted">
          {hackathon.banner_url ? (
            // Banners come from arbitrary organiser URLs, so a plain img is used.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hackathon.banner_url}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out-quint group-hover:scale-[1.06]"
            />
          ) : (
            <HackathonCover seed={hackathon.slug} title={hackathon.title} />
          )}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4">
            {registration ? <RegistrationPill state={registration} /> : <span />}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1.5 text-xs font-medium capitalize text-ink shadow-soft backdrop-blur">
              <ModeIcon className="size-3.5" />
              {hackathon.location_type}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          {themes.length > 0 ? (
            <ul className="flex flex-wrap items-center gap-1.5 font-mono text-[0.7rem] lowercase text-muted-foreground">
              {themes.slice(0, 3).map((theme) => (
                <li key={theme} className="rounded-full border border-border px-2 py-0.5">
                  {theme}
                </li>
              ))}
              {themes.length > 3 ? <li>+{themes.length - 3}</li> : null}
            </ul>
          ) : null}

          <h3 className="font-display text-[1.45rem] font-semibold leading-[1.12] tracking-[-0.03em]">
            {completed ? (
              hackathon.title
            ) : (
              <Link
                href={`/hackathons/${hackathon.slug}`}
                className="outline-none after:absolute after:inset-0 after:rounded-[1.75rem] focus-visible:after:ring-[3px] focus-visible:after:ring-ring"
              >
                {hackathon.title}
              </Link>
            )}
          </h3>
          <p className="line-clamp-2 text-[0.95rem] leading-relaxed text-muted-foreground">
            {summary}
          </p>

          <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-3 font-mono text-[0.75rem] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Dates</dt>
              <CalendarDays className="size-3.5 text-foreground/60" aria-hidden />
              <dd>{formatDateRange(hackathon.start_date, hackathon.end_date)}</dd>
            </div>
            <div className="flex items-center gap-1.5">
              <dt className="sr-only">Team size</dt>
              <Users className="size-3.5 text-foreground/60" aria-hidden />
              <dd>
                {hackathon.min_team_size === hackathon.max_team_size
                  ? hackathon.max_team_size
                  : `${hackathon.min_team_size}–${hackathon.max_team_size}`}{" "}
                per team
              </dd>
            </div>
          </dl>
        </div>

        <div className="perforation mx-6 text-foreground/20" />

        <div className="flex h-[5.5rem] items-center gap-6 px-6">
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Prize pool
            </p>
            <p className="font-display text-[1.45rem] font-semibold tracking-[-0.03em]">
              {formatInr(hackathon.prize_pool)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Entry
            </p>
            <p
              className={cn(
                "font-display text-[1.05rem] font-semibold",
                hackathon.participation_fee ? "text-foreground" : "text-signal-ink",
              )}
            >
              {hackathon.participation_fee ? formatInr(Math.round(hackathon.participation_fee)) : "Free"}
            </p>
          </div>
          {completed ? null : (
            <span
              aria-hidden
              className="ml-auto grid size-11 place-items-center overflow-hidden rounded-full bg-foreground text-background transition-transform duration-500 ease-out-quint group-hover:-rotate-[20deg]"
            >
              <ArrowRight className="size-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
