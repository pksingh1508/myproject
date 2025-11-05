import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton
} from "@clerk/nextjs";
import Link from "next/link";

import { listHackathons } from "@/lib/repos/hackathons";
import { HackathonGrid } from "@/components/hackathons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 120;

export default async function Home() {
  const upcomingHackathons = (await listHackathons({
    status: ["published", "ongoing"]
  })).slice(0, 3);

  return (
    <main className="space-y-16 bg-background">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.15),transparent_60%)]" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center gap-10 px-4 py-20 text-center sm:px-6">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Build. Ship. Celebrate.
            </span>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
              Launch your next winning hackathon experience
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Hackathon Hub combines authentication, payments, and seamless
              registration so teams can focus on building. Discover challenges,
              pay the INR 99 commitment fee, and compete for serious prizes.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg">Create your account</Button>
              </SignUpButton>
              <SignInButton mode="modal">
                <Button size="lg" variant="outline">
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/hackathons">Browse hackathons</Link>
                </Button>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-11 w-11"
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Trusted team formation
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              Secure payment handling
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-500" />
              Supabase-backed submissions
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-8 px-4 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2 text-left sm:text-left">
            <h2 className="text-3xl font-semibold tracking-tight">
              Upcoming hackathons
            </h2>
            <p className="max-w-xl text-muted-foreground">
              Hand-picked challenges that are open for registration right now.
              Secure your team's spot before slots fill up.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/hackathons">View all hackathons</Link>
          </Button>
        </div>

        <HackathonGrid hackathons={upcomingHackathons} />
      </section>

      <section
        id="cta"
        className="border-t bg-muted/30 py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:px-0">
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">
                  Hosting a hackathon?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use our pay-to-register flow, participant management, and
                  real-time analytics to run professional-grade hackathons
                  without the operational overhead.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/contact">Talk to the team</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">
                  Why teams choose Hackathon Hub
                </h3>
                <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
                  <li>Clerk-authenticated experience to keep registrations real</li>
                  <li>Supabase-powered submissions, triggers, and analytics</li>
                  <li>Cashfree transaction pipeline with webhook reconciliation</li>
                  <li>Automated notifications and best-in-class observability</li>
                </ul>
              </div>
              <Button asChild variant="outline" size="lg">
                <Link href="/hackathons">Find your next hackathon</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
