"use client";

import { useRouter } from "next/navigation";

import { BrandButton, CustomCard } from "@/components/layout";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative bg-background" style={brandSansStyle}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),transparent_40%)]" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-10 px-4 pt-24 pb-20 text-center sm:px-6">
        <div className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Build. Submit. Win.
          </span>
          <div className="pt-0 lg:pt-5" />
          <h1
            className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={brandDisplayStyle}
          >
            Built for{" "}
            <span className="inline-block rounded-[0.45em] bg-sky-100 px-[0.24em] py-[0.08em] text-sky-950 ring-1 ring-sky-200/80">
              TIER-2 &amp; TIER-3
            </span>{" "}
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
            className="px-8 py-3 text-xs border border-border/60 bg-muted/40"
            onClick={() => router.push("/notifications")}
          >
            Stay updated
          </BrandButton>
        </div>

        <div className="grid gap-6 text-left sm:grid-cols-3 mt-0 md:mt-3">
          <CustomCard className="h-full bg-muted/40">
            <p className="text-base font-semibold text-foreground">
              Build without fear
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              From idea to demo, get the clarity and support you need to
              participate with confidence — even if you’re joining your first
              hackathon.
            </p>
          </CustomCard>
          <CustomCard className="h-full bg-muted/40">
            <p className="text-base font-semibold text-foreground">
              Seamless participation
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Register, manage your team, and submit your demo in one place—no
              messy spreadsheets or scattered updates.
            </p>
          </CustomCard>
          <CustomCard className="h-full bg-muted/40">
            <p className="text-base font-semibold text-foreground">
              Prizes worth hustling for
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Cash rewards, internship offers, and swag for top teams across
              every hackathon hosted on Hackathon Wallah.
            </p>
          </CustomCard>
        </div>
      </div>
    </section>
  );
}
