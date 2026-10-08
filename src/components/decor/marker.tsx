"use client";

import { useRef } from "react";
import { m, useInView } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/components/motion/easing";

type MarkerProps = {
  children: React.ReactNode;
  className?: string;
  /** Tailwind text-* colour class that tints the highlighter. */
  tone?: string;
  delay?: number;
  trigger?: "mount" | "view";
};

/**
 * A highlighter swipe behind inline text, drawn left to right like a
 * real marker on notebook paper. On the dark theme the ink glows through
 * a translucent swipe instead, so the type itself never changes colour.
 */
export function Marker({
  children,
  className,
  tone = "text-hilite",
  delay = 0.5,
  trigger = "view",
}: MarkerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const active = trigger === "mount" || inView;

  return (
    <span
      ref={ref}
      className={cn("relative isolate inline-block whitespace-nowrap", className)}
    >
      <m.svg
        aria-hidden
        viewBox="0 0 300 60"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none absolute -left-[0.14em] -right-[0.14em] bottom-[0.02em] top-[0.18em] -z-10 h-[calc(100%-0.16em)] w-[calc(100%+0.28em)] -rotate-[0.6deg] dark:opacity-40",
          tone,
        )}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        animate={active ? { clipPath: "inset(0 0% 0 0)" } : undefined}
        transition={{ duration: 0.75, delay, ease: EASE_OUT }}
      >
        <path
          d="M6 14C60 9 160 6 292 10C296 22 297 36 294 48C200 53 90 55 8 52C3 40 3 26 6 14Z"
          fill="currentColor"
        />
        <path
          d="M14 22C100 18 200 17 288 20"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          className="opacity-60 mix-blend-multiply"
        />
      </m.svg>
      {children}
    </span>
  );
}
