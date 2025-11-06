import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export function CallToActionSection() {
  return (
    <section className="border-t border-border/60 bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        <Card className="border border-primary/30 bg-primary/5 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Hosting a hackathon?
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Use our end-to-end toolkit for registration, payments, and insights so
              you can focus on crafting a remarkable experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Participant vetting with Clerk and Supabase sync</li>
              <li>Automated payment flows with Cashfree reconciliation</li>
              <li>Real-time analytics dashboards and exports</li>
            </ul>
            <Button asChild size="lg" className="px-6">
              <Link href="/contact">Talk to our team</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-background/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Builders love Hackathon Hub
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Designed for ambitious teams shipping production-quality prototypes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-muted-foreground">
            <p>
              From seamless registration to submission tracking, Hackathon Hub gives
              you the infrastructure to iterate quickly and show up prepared on
              demo day.
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Granular team management and roster updates</li>
              <li>Automated notifications for milestones and payments</li>
              <li>Secure, collaborative workspace out of the box</li>
            </ul>
            <Button asChild variant="outline" size="lg" className="px-6">
              <Link href="/hackathons">Find your next hackathon</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
