"use client";

import Image from "next/image";

import { CustomCard } from "@/components/layout";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

const prizes = [
  {
    title: "Win a high-performance laptop",
    description:
      "Take home a cutting-edge laptop to power your next big build.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/laptop.png",
    alt: "Laptop on a desk",
  },
  {
    title: "Bag the latest smartphone",
    description:
      "Upgrade your hustle with a flagship mobile ready for prototyping on the go.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/phone.png",
    alt: "Modern smartphone close-up",
  },
  {
    title: "Swag that turns heads",
    description:
      "Limited-edition tees and bottles for every teammate who makes the shortlist.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/tshirt.png",
    alt: "T-shirt and bottle merchandise",
  },
  {
    title: "Cash prizes that go the distance",
    description:
      "Win generous cash rewards to reinvest in your product roadmap or celebrate with your crew.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/cash.png",
    alt: "Stacks of money",
  },
  {
    title: "Pitch to real investors",
    description:
      "Selected winners unlock direct intros to investors scouting their next portfolio company.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/investor.png",
    alt: "Business investor meeting",
  },
] as const;

export function WhatYouGet() {
  return (
    <section
      className="w-full bg-background pt-10 sm:py-10"
      style={brandSansStyle}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-6">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Prizes
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={brandDisplayStyle}
          >
            Win rewards that level up your journey
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            From gear and cash to investor access, every hackathon on Hackathon
            Hub is stacked with outcomes that accelerate your next move.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {prizes.map((prize) => (
            <CustomCard
              key={prize.title}
              className="group border-border/50 bg-muted/30 backdrop-blur-sm"
            >
              <div className="relative mb-4 h-40 overflow-hidden rounded-2xl">
                <Image
                  src={prize.image}
                  alt={prize.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                  priority={prize.title === "Win a high-performance laptop"}
                />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {prize.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {prize.description}
              </p>
            </CustomCard>
          ))}
        </div>
      </div>
    </section>
  );
}
