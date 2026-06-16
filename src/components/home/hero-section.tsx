"use client";

import { useRouter } from "next/navigation";
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

function CornerHighlight({ children }: { children: React.ReactNode }) {
  const dotClassName =
    "absolute size-2.5 animate-pulse rounded-full bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.6)] duration-1000";

  return (
    <span className="relative inline-block px-[0.32em] py-[0.08em] text-sky-950">
      <span
        className="absolute rounded-md inset-0 bg-sky-100/80"
        aria-hidden="true"
      />
      <span className={`${dotClassName} left-0 top-0`} aria-hidden="true" />
      <span
        className={`${dotClassName} right-0 top-0 [animation-delay:300ms]`}
        aria-hidden="true"
      />
      <span
        className={`${dotClassName} bottom-0 left-0 [animation-delay:600ms]`}
        aria-hidden="true"
      />
      <span
        className={`${dotClassName} bottom-0 right-0 [animation-delay:900ms]`}
        aria-hidden="true"
      />
      <span className="relative z-10">{children}</span>
    </span>
  );
}

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative isolate bg-background" style={brandSansStyle}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 px-4 pt-24 pb-20 text-center sm:px-6">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Build. Submit. Win.
          </span>
          <div className="pt-0 lg:pt-5" />
          <h1
            className="text-balance text-slate-700 text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl"
            style={brandDisplayStyle}
          >
            Built for <CornerHighlight>TIER-2 &amp; TIER-3</CornerHighlight>{" "}
            College Students in India
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Not from a famous college? Does not matter. HackathonWallah helps
            students from tier-2 and tier-3 colleges discover real hackathons,
            build strong projects, find teammates, and compete with confidence.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
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
        </div>

        <div className="mt-0 grid gap-6 text-left md:mt-3 sm:grid-cols-3">
          {featureCards.map((card) => (
            <CustomCard key={card.title} className="h-full bg-muted/40">
              <p className="text-base font-semibold text-foreground">
                {card.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </CustomCard>
          ))}
        </div>
      </div>
    </section>
  );
}
