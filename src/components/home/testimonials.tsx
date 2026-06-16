"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TESTIMONIALS } from "@/constants/data";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;
const testimonialCount: number = TESTIMONIALS.length;
const visibleTestimonials = 3;

function withLoopBuffer<T>(items: readonly T[], bufferSize: number) {
  if (items.length === 0) {
    return [];
  }

  return [
    ...items,
    ...Array.from(
      { length: bufferSize },
      (_, index) => items[index % items.length]!,
    ),
  ];
}

const loopedTestimonials = withLoopBuffer(TESTIMONIALS, visibleTestimonials);

function truncateWords(text: string, maxWords = 200) {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) {
    return text;
  }
  return `${words.slice(0, maxWords).join(" ")}...`;
}

export function Testimonials() {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!carouselApi || testimonialCount === 0) {
      return;
    }

    const resetLoop = (api: CarouselApi) => {
      if (!api) {
        return;
      }

      const selectedIndex = api.selectedScrollSnap();

      if (selectedIndex >= testimonialCount) {
        api.scrollTo(selectedIndex % testimonialCount, true);
      }
    };

    carouselApi.on("select", resetLoop);
    carouselApi.on("reInit", resetLoop);

    const autoplay = window.setInterval(() => {
      carouselApi.scrollNext();
    }, 5000);

    return () => {
      window.clearInterval(autoplay);
      carouselApi.off("select", resetLoop);
      carouselApi.off("reInit", resetLoop);
    };
  }, [carouselApi]);

  return (
    <section className="w-full bg-background pt-10" style={brandSansStyle}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Voices from the community
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={brandDisplayStyle}
          >
            Builders loves Hackathon Wallah
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            Hear from hackers who turned weekend projects into standout
            portfolio pieces, job offers, and investor-ready products.
          </p>
        </div>

        <div className="relative">
          <Carousel
            className="pb-12 px-2 sm:px-6"
            opts={{ align: "start", loop: false }}
            setApi={(api) => setCarouselApi(api)}
          >
            <CarouselContent>
              {loopedTestimonials.map((testimonial, index) => (
                <CarouselItem
                  key={`${testimonial.id}-${index}`}
                  className="basis-full sm:basis-1/2 lg:basis-1/3"
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
