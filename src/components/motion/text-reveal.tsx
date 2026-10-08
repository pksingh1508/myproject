"use client";

import { m } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "./easing";

type Trigger = "mount" | "view";

function motionTrigger(trigger: Trigger) {
  return trigger === "mount"
    ? { animate: "visible" as const }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.6 },
      };
}

type MaskLineProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  trigger?: Trigger;
};

/**
 * Slides a line of text up from behind a mask, like type being set.
 * Use one per visual line of a headline.
 */
export function MaskLine({
  children,
  className,
  delay = 0,
  trigger = "view",
}: MaskLineProps) {
  return (
    <span
      className={cn(
        // Extra bottom padding keeps descenders from being clipped by the mask.
        "block overflow-hidden pb-[0.12em] -mb-[0.12em]",
        className,
      )}
    >
      <m.span
        className="block will-change-transform"
        initial="hidden"
        {...motionTrigger(trigger)}
        variants={{
          hidden: { y: "105%" },
          visible: {
            y: "0%",
            transition: { duration: 1, delay, ease: EASE_OUT },
          },
        }}
      >
        {children}
      </m.span>
    </span>
  );
}

type SplitWordsProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: Trigger;
};

/** Word-by-word rise for headlines and statements. */
export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.045,
  trigger = "view",
}: SplitWordsProps) {
  const words = text.split(" ");

  return (
    <m.span
      className={cn("inline", className)}
      initial="hidden"
      {...motionTrigger(trigger)}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: delay, staggerChildren: stagger },
        },
      }}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom"
        >
          <m.span
            className={cn("inline-block will-change-transform", wordClassName)}
            variants={{
              hidden: { y: "110%", rotate: 4 },
              visible: {
                y: "0%",
                rotate: 0,
                transition: { duration: 0.9, ease: EASE_OUT },
              },
            }}
          >
            {word}
          </m.span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </m.span>
  );
}
