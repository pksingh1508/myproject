"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform } from "motion/react";

import { Marker } from "@/components/decor/marker";
import { SectionHeading } from "@/components/layout/section-heading";
import { EASE_OUT } from "@/components/motion/easing";
import { useMotionFactor } from "@/components/motion/use-reduced-motion";
import { cn } from "@/lib/utils";

const prizes = [
  {
    title: "Win a high-performance laptop",
    description: "Take home a cutting-edge laptop to power your next big build.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/laptop.png",
    alt: "HackathonWallah branded laptop box on a desk",
    tag: "hardware",
    span: "md:col-span-2 lg:col-span-7 lg:row-span-2",
    sizes: "(min-width: 1024px) 700px, 100vw",
  },
  {
    title: "Bag the latest smartphone",
    description:
      "Upgrade your hustle with a flagship phone ready for prototyping on the go.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/phone.png",
    alt: "Modern smartphone next to its box",
    tag: "hardware",
    span: "lg:col-span-5",
    sizes: "(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Cash prizes that go the distance",
    description:
      "Generous cash rewards to reinvest in your roadmap or celebrate with your crew.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/cash.png",
    alt: "Stacks of cash with a HackathonWallah card",
    tag: "cash",
    span: "lg:col-span-5",
    sizes: "(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Swag that turns heads",
    description:
      "Limited-edition tees and bottles for every teammate who makes the shortlist.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/tshirt.png",
    alt: "Black HackathonWallah t-shirt",
    tag: "swag",
    span: "lg:col-span-5",
    sizes: "(min-width: 1024px) 500px, (min-width: 768px) 50vw, 100vw",
  },
  {
    title: "Pitch to real investors",
    description:
      "Selected winners unlock direct intros to investors scouting their next portfolio company.",
    image: "https://ik.imagekit.io/eucareerserwis/Hackathonwallah/investor.png",
    alt: "Investor reviewing a pitch",
    tag: "network",
    span: "lg:col-span-7",
    sizes: "(min-width: 1024px) 700px, (min-width: 768px) 50vw, 100vw",
  },
] as const;

export function WhatYouGet() {
  return (
    <section id="prizes" className="relative py-20 sm:py-28">
      <div className="container-page flex flex-col gap-14">
        <SectionHeading
          index="02"
          label="prizes"
          title={
            <>
              Prizes worth the <Marker tone="text-marigold">all-nighter.</Marker>
            </>
          }
          description="From gear and cash to investor access, every hackathon on HackathonWallah is stacked with outcomes that accelerate your next move."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[17.5rem] lg:grid-cols-12 lg:gap-5">
          {prizes.map((prize, index) => (
            <PrizeCard key={prize.title} prize={prize} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PrizeCard({
  prize,
  index,
}: {
  prize: (typeof prizes)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const factor = useMotionFactor();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => `${(progress * 14 - 7) * f}%`,
  );

  return (
    <m.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      className={cn(
        "group relative isolate min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-border bg-muted lg:min-h-0",
        prize.span,
      )}
    >
      <m.div
        className="absolute -inset-y-[9%] inset-x-0 -z-20"
        style={{ y: imageY }}
      >
        <Image
          src={prize.image}
          alt={prize.alt}
          fill
          sizes={prize.sizes}
          className="object-cover transition-transform duration-[1.2s] ease-out-quint group-hover:scale-[1.06]"
        />
      </m.div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/45 to-ink/0 opacity-90 transition-opacity duration-700 group-hover:opacity-100"
      />

      <div className="flex h-full flex-col justify-end p-6 text-paper sm:p-7">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-paper/20 bg-paper/10 px-2.5 py-1 font-mono text-[0.68rem] lowercase text-paper/85 backdrop-blur-md">
          <span className="tabular-nums text-hilite">0{index + 1}</span>
          <span className="opacity-50">/</span>
          {prize.tag}
        </span>
        <h3 className="mt-3 max-w-md font-display text-[1.55rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-[1.8rem]">
          {prize.title}
        </h3>
        <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-paper/75">
          {prize.description}
        </p>
      </div>
    </m.article>
  );
}
