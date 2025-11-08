import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getHackathonBySlug } from "@/lib/repos/hackathons";
import { HackathonOverview, HackathonPrizes } from "@/components/hackathons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { HackathonRegistrationButton } from "@/components/registration";

export const revalidate = 120;

interface HackathonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params
}: HackathonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug).catch(() => null);

  if (!hackathon) {
    return {
      title: "Hackathon not found | Hackathon Wallah"
    };
  }

  return {
    title: `${hackathon.title} | Hackathon Wallah`,
    description:
      hackathon.short_description ?? hackathon.description.slice(0, 160),
    openGraph: {
      title: hackathon.title,
      description:
        hackathon.short_description ?? hackathon.description.slice(0, 160),
      images: hackathon.banner_url ? [hackathon.banner_url] : undefined
    }
  };
}

export default async function HackathonPage({ params }: HackathonPageProps) {
  const { slug } = await params;
  const hackathon = await getHackathonBySlug(slug).catch(() => null);

  if (!hackathon) {
    notFound();
  }

  return (
    <div className="bg-background">
      <section className="relative">
        {hackathon.banner_url ? (
          <div className="absolute inset-0">
            <div
              className="h-full w-full bg-cover bg-center opacity-5"
              style={{
                backgroundImage: `url(${hackathon.banner_url})`
              }}
            />
          </div>
        ) : null}

        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">
                {hackathon.title}
              </h1>
              <p className="max-w-2xl text-lg text-muted-foreground">
                {hackathon.short_description ?? hackathon.description}
              </p>
            </div>
            <div className="flex gap-3">
              <HackathonRegistrationButton
                hackathon={hackathon}
                buttonSize="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[2fr,1fr] lg:px-8">
        <div className="space-y-10">
          <HackathonOverview hackathon={hackathon} />

          <Card>
            <CardContent className="space-y-4 py-6">
              <div>
                <h2 className="text-2xl font-semibold">FAQs</h2>
                <p className="text-sm text-muted-foreground">
                  Answers to the most common questions from participants. For
                  additional information, reach out to the organising team.
                </p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="eligibility">
                  <AccordionTrigger>
                    Who can participate in this hackathon?
                  </AccordionTrigger>
                  <AccordionContent>
                    Unless otherwise stated, anyone who is 18+ and passionate
                    about building is welcome. Cross-functional teams with
                    developers, designers, and product minds tend to perform
                    best.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="team">
                  <AccordionTrigger>
                    Do I need a team before registering?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can register solo and match with others later. We share
                    a Discord onboarding link after payment is confirmed so you
                    can find collaborators and form teams of up to{" "}
                    {hackathon.max_team_size} members.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="submission">
                  <AccordionTrigger>
                    How are submissions evaluated?
                  </AccordionTrigger>
                  <AccordionContent>
                    Judges evaluate demos based on impact, technical execution,
                    presentation, and alignment with the hackathon themes.
                    Upload links to repos or prototypes before the submission
                    deadline to stay eligible for prizes.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-6">
          <HackathonPrizes hackathon={hackathon} />

          <Card>
            <CardContent className="space-y-4 py-6">
              <div>
                <h3 className="text-lg font-semibold">Get ready to compete</h3>
                <p className="text-sm text-muted-foreground">
                  Assemble your team, review the rules, and register early to
                  secure your slot. Payment details will be shared during
                  checkout.
                </p>
              </div>
              <HackathonRegistrationButton
                hackathon={hackathon}
                buttonVariant="default"
                buttonSize="lg"
                buttonClassName="w-full"
              />
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}
