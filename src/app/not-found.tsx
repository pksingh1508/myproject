import type { Metadata } from "next";
import Link from "next/link";

import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { SectionLabel } from "@/components/decor/section-label";
import { BrandButton } from "@/components/layout/brand-button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden pb-20 pt-[calc(var(--header-h)+3rem)]">
      <GridBackdrop spotlight />
      <div className="container-page grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <SectionLabel>error 404</SectionLabel>
          <h1 className="font-display text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] [font-stretch:92%]">
            This page missed the submission deadline.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            The link may be broken, or the page may have moved. The good news?
            There&apos;s always another hackathon.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <BrandButton asChild size="lg" arrow>
              <Link href="/hackathons">Browse hackathons</Link>
            </BrandButton>
            <BrandButton asChild size="lg" variant="outline">
              <Link href="/">Back to home</Link>
            </BrandButton>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative mx-auto max-w-md rotate-[2deg] overflow-hidden rounded-2xl border border-border bg-surface font-mono text-[0.82rem] shadow-lift">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="size-2.5 rounded-full border border-foreground/25" />
              <span className="size-2.5 rounded-full border border-foreground/25" />
              <span className="size-2.5 rounded-full bg-destructive/80" />
              <span className="ml-2 text-[0.7rem] text-muted-foreground">~/hackathonwallah</span>
            </div>
            <div className="space-y-1.5 p-5 leading-relaxed">
              <p>
                <span className="text-signal-ink">❯</span> cd ./this-page
              </p>
              <p className="text-destructive">cd: no such file or directory</p>
              <p>
                <span className="text-signal-ink">❯</span> git log --oneline -1
              </p>
              <p className="text-muted-foreground">
                <span className="text-marigold-ink">404c0de</span> fix: page not found
              </p>
              <p className="flex items-center">
                <span className="text-signal-ink">❯</span>
                <span className="ml-2 inline-block h-4 w-2 animate-caret bg-foreground" />
              </p>
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -right-3 select-none font-display text-[9rem] font-bold leading-none tracking-[-0.08em] text-foreground/[0.05]"
            >
              404
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
