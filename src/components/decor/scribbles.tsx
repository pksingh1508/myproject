"use client";

import { m, type SVGMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_IN_OUT } from "@/components/motion/easing";

type ScribbleProps = {
  className?: string;
  delay?: number;
  duration?: number;
  strokeWidth?: number;
  trigger?: "mount" | "view";
};

function drawProps(
  trigger: ScribbleProps["trigger"],
  delay: number,
  duration: number,
): SVGMotionProps<SVGPathElement> {
  const transition = {
    pathLength: { duration, delay, ease: EASE_IN_OUT },
    opacity: { duration: 0.01, delay },
  };

  return trigger === "mount"
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition,
      }
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, amount: 0.6 },
        transition,
      };
}

const strokeBase = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Hand-drawn curved arrow that ends pointing down-left. */
export function ScribbleArrow({
  className,
  delay = 0,
  duration = 0.9,
  strokeWidth = 2.4,
  trigger = "view",
}: ScribbleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 80"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      <m.path
        {...strokeBase}
        strokeWidth={strokeWidth}
        d="M110 8C92 10 70 22 58 38C48 52 40 62 22 70"
        {...drawProps(trigger, delay, duration)}
      />
      <m.path
        {...strokeBase}
        strokeWidth={strokeWidth}
        d="M35.8 71.5L22 70L30.2 58.8"
        {...drawProps(trigger, delay + duration * 0.85, 0.3)}
      />
    </svg>
  );
}

/** Loopy arrow, the kind you doodle in a margin. Points down. */
export function ScribbleLoopArrow({
  className,
  delay = 0,
  duration = 1.2,
  strokeWidth = 2.4,
  trigger = "view",
}: ScribbleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 110 72"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      <m.path
        {...strokeBase}
        strokeWidth={strokeWidth}
        d="M5 10C30 5 55 10 60 28C64 44 46 50 42 40C38 28 62 22 80 34C92 42 98 52 100 64"
        {...drawProps(trigger, delay, duration)}
      />
      <m.path
        {...strokeBase}
        strokeWidth={strokeWidth}
        d="M104.2 52.8L100 64L92.4 54.7"
        {...drawProps(trigger, delay + duration * 0.9, 0.3)}
      />
    </svg>
  );
}

/** Overshooting oval drawn around a word. */
export function ScribbleCircle({
  className,
  delay = 0,
  duration = 1,
  strokeWidth = 2.2,
  trigger = "view",
}: ScribbleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 80"
      preserveAspectRatio="none"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      <m.path
        {...strokeBase}
        strokeWidth={strokeWidth}
        d="M120 8C165 6 196 22 194 40C192 60 150 74 96 74C44 74 6 62 6 40C6 18 48 6 100 6C130 6 150 10 168 18"
        {...drawProps(trigger, delay, duration)}
      />
    </svg>
  );
}

/** Wavy underline. */
export function ScribbleUnderline({
  className,
  delay = 0,
  duration = 0.8,
  strokeWidth = 3,
  trigger = "view",
}: ScribbleProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      className={cn("pointer-events-none overflow-visible", className)}
    >
      <m.path
        {...strokeBase}
        strokeWidth={strokeWidth}
        d="M3 13C30 6 52 6 70 11S110 17 132 10S175 5 197 9"
        {...drawProps(trigger, delay, duration)}
      />
    </svg>
  );
}

/** Four-point sparkle with soft, inked curves. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("pointer-events-none", className)}
    >
      <path
        fill="currentColor"
        d="M12 1C12.8 7.5 16.5 11.2 23 12C16.5 12.8 12.8 16.5 12 23C11.2 16.5 7.5 12.8 1 12C7.5 11.2 11.2 7.5 12 1Z"
      />
    </svg>
  );
}

/** Six-armed asterisk used as a separator in tickers. */
export function Asterisk({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("pointer-events-none", className)}
    >
      <g stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
        <path d="M12 2.5v19" />
        <path d="M3.8 7.25l16.4 9.5" />
        <path d="M3.8 16.75l16.4-9.5" />
      </g>
    </svg>
  );
}
