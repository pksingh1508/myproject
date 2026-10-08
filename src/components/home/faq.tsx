"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/layout/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { FAQ as FAQ_ENTRIES } from "@/constants/data";

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              label="faqs"
              title="Answers to your most common questions"
              description="Whether you're a first-time hacker or a returning champion, here is what you need to know before your next build sprint."
            />
          </div>
        </div>

        <Reveal className="lg:col-span-7" y={30}>
          <Accordion
            type="single"
            collapsible
            className="rounded-[1.75rem] border border-border bg-card px-6 shadow-soft sm:px-8"
          >
            {FAQ_ENTRIES.map((entry, index) => (
              <AccordionItem key={entry.question} value={`faq-${index}`}>
                <AccordionTrigger className="font-display text-[1.08rem] font-semibold tracking-[-0.01em]">
                  <span className="flex flex-1 items-baseline gap-4">
                    <span className="font-mono text-xs font-normal text-signal-ink tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{entry.question}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pl-9 pr-12 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {entry.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
