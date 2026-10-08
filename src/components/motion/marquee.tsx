"use client";

import { useRef } from "react";
import {
  m,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

const COPIES = 4;

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
}

type VelocityMarqueeProps = {
  children: React.ReactNode;
  /** Base speed in % of one copy per second. Negative scrolls left. */
  baseVelocity?: number;
  className?: string;
  trackClassName?: string;
};

/**
 * An endless ticker that speeds up — and flips direction — with the
 * user's scroll velocity.
 */
export function VelocityMarquee({
  children,
  baseVelocity = -2,
  className,
  trackClassName,
}: VelocityMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);
  const reduceMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });
  const x = useTransform(baseX, (value) => `${wrap(-25, -50, value)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduceMotion) return;

    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const factor = velocityFactor.get();

    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * factor;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div ref={containerRef} className={cn("flex overflow-hidden", className)}>
      <m.div
        className={cn("flex shrink-0 flex-nowrap whitespace-nowrap", trackClassName)}
        style={{ x }}
      >
        {Array.from({ length: COPIES }, (_, index) => (
          <div
            key={index}
            className="flex shrink-0 flex-nowrap"
            aria-hidden={index > 0 ? true : undefined}
          >
            {children}
          </div>
        ))}
      </m.div>
    </div>
  );
}

type LoopMarqueeProps = {
  children: React.ReactNode;
  reverse?: boolean;
  /** Seconds per full loop. */
  duration?: number;
  className?: string;
  pauseOnHover?: boolean;
};

/** CSS-driven loop for card rows; cheap and pauses on hover. */
export function LoopMarquee({
  children,
  reverse = false,
  duration = 60,
  className,
  pauseOnHover = true,
}: LoopMarqueeProps) {
  return (
    <div className={cn("group/marquee flex overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 flex-nowrap",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
          "motion-reduce:animate-none",
        )}
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <div className="flex shrink-0 flex-nowrap">{children}</div>
        <div className="flex shrink-0 flex-nowrap" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
