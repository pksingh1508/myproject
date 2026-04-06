"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { FAQ as FAQ_ENTRIES } from "@/constants/data";
const brandSansStyle = { fontFamily: "var(--font-brand-sans)" } as const;
const brandDisplayStyle = { fontFamily: "var(--font-brand-display)" } as const;

export function FAQ() {
  return (
    <section
      className="w-full bg-background py-10 sm:py-10"
      style={brandSansStyle}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            FAQs
          </p>
          <h2
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            style={brandDisplayStyle}
          >
            Answers to your most common questions
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:mx-0">
            Whether you&apos;re a first-time hacker or a returning champion,
            here is what you need to know before your next build sprint.
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -left-8 top-10 h-28 w-28 rounded-full bg-primary/6 blur-3xl" />
          <div className="pointer-events-none absolute -right-6 bottom-6 h-32 w-32 rounded-full bg-primary/8 blur-3xl" />

          <Accordion
            type="single"
            collapsible
            className="relative w-full rounded-[2rem] border border-border/60 bg-muted/20 p-3 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur-sm sm:p-4"
          >
            {FAQ_ENTRIES.map((entry, index) => (
              <AccordionItem
                key={entry.question}
                value={`faq-${index}`}
                className="group relative mb-3 overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/85 px-1 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.45)] transition-colors duration-300 data-[state=open]:border-primary/20 last:mb-0"
              >
                <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent opacity-0 transition-opacity duration-300 group-data-[state=open]:opacity-100" />

                <AccordionTrigger className="px-5 py-5 text-left text-base font-semibold text-foreground transition-colors duration-300 hover:no-underline data-[state=open]:text-primary sm:px-6 sm:text-[1.05rem]">
                  <span className="flex flex-1 items-start gap-4 pr-2">
                    <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-[0.68rem] font-semibold tracking-[0.18em] text-primary/75 transition-all duration-300 group-data-[state=open]:scale-105 group-data-[state=open]:border-primary/25 group-data-[state=open]:bg-primary/12">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="pt-1">{entry.question}</span>
                  </span>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5 text-sm leading-7 text-muted-foreground sm:px-6 sm:pb-6">
                  <div className="ml-12 border-l border-border/70 pl-4">
                    {entry.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
