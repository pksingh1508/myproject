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

        <Accordion
          type="single"
          collapsible
          className="w-full rounded-2xl border border-border/60 bg-muted/20 p-4 shadow-sm sm:p-6"
        >
          {FAQ_ENTRIES.map((entry, index) => (
            <AccordionItem
              key={entry.question}
              value={`faq-${index}`}
              className="border-border/40"
            >
              <AccordionTrigger className="text-base font-semibold text-foreground">
                {entry.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {entry.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
