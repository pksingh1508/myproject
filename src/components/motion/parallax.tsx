"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, type HTMLMotionProps } from "motion/react";

import { useMotionFactor } from "./use-reduced-motion";

type ParallaxProps = Omit<HTMLMotionProps<"div">, "style"> & {
  children?: React.ReactNode;
  /** Pixels travelled across the element's full pass through the viewport. */
  distance?: number;
  rotate?: number;
  style?: HTMLMotionProps<"div">["style"];
};

/**
 * Moves its children at a different speed to the page while it scrolls past.
 * Positive distance drifts up (feels closer), negative drifts down.
 */
export function Parallax({
  children,
  distance = 80,
  rotate = 0,
  className,
  style,
  ...props
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const factor = useMotionFactor();
  // Lenis already smooths the scroll position, so no extra spring here.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => (distance / 2 - distance * progress) * f,
  );
  const r = useTransform(
    [scrollYProgress, factor],
    ([progress, f]: number[]) => (rotate * progress - rotate / 2) * f,
  );

  return (
    <m.div
      ref={ref}
      className={className}
      style={{ ...style, y, rotate: rotate ? r : undefined }}
      {...props}
    >
      {children}
    </m.div>
  );
}
