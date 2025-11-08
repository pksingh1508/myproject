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
          <span className="inline-flex items-center rounded-full border border-border/80 bg-muted/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Compete. Create. Celebrate.
          </span>
          <h1
            className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={brandDisplayStyle}
          >
            Join India&apos;s most exciting hackathons and win big
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Discover curated challenges, register instantly, and ship
            production-ready projects. Submit your build, impress the judges,
            and take home the prizes.
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
              Build with confidence
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Access detailed problem statements, starter kits, and mentor
              support so you can focus on shipping a standout solution.
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
