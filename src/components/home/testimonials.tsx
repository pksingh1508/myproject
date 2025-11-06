"use client";

import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { TESTIMONIALS } from "@/constants/data";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

function truncateWords(text: string, maxWords = 200) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function Testimonials() {
  return (
    <section
      className="w-full bg-background py-10 sm:py-10"
      style={brandSansStyle}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Voices from the community
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={brandDisplayStyle}
          >
            Builders love shipping with Hackathon Wallah
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            Hear from hackers who turned weekend projects into standout
            portfolio pieces, job offers, and investor-ready products.
          </p>
        </div>

        <div className="relative">
          <Carousel
            className="pb-12 px-2 sm:px-6"
            opts={{ align: "center", loop: true, autoplayInterval: 5000 }}
          >
            <CarouselContent>
              {TESTIMONIALS.map((testimonial) => (
                <CarouselItem
                  key={testimonial.id}
                  className="basis-full px-1 sm:basis-1/2 lg:basis-1/3"
                >
                  <Card className="h-full border-border/60 bg-muted/20 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-4 @container">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full bg-muted">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          unoptimized
                          width={48}
                          height={48}
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex flex-col">
                        <CardTitle className="text-base font-semibold text-foreground">
                          {testimonial.name}
                        </CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wide">
                          {testimonial.role}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <blockquote className="text-sm leading-relaxed text-muted-foreground">
                        “{truncateWords(testimonial.quote)}”
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
