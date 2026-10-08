"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type CountUpProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

const formatter = new Intl.NumberFormat("en-IN");

function format(value: number, prefix = "", suffix = "") {
  return `${prefix}${formatter.format(Math.round(value))}${suffix}`;
}

/**
 * Counts up to `to` once visible. The final value is server-rendered so the
 * number is correct without JavaScript; the count only plays client-side.
 */
export function CountUp({
  to,
  prefix,
  suffix,
  duration = 1.8,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const primed = useRef(false);

  // Before the number is seen, reset it to zero so it can count up.
  useEffect(() => {
    const node = ref.current;
    if (!node || reduceMotion || primed.current) return;
    const rect = node.getBoundingClientRect();
    if (rect.top > window.innerHeight) {
      node.textContent = format(0, prefix, suffix);
      primed.current = true;
    }
  }, [prefix, suffix, reduceMotion]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || !primed.current) return;

    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest, prefix, suffix);
      },
      onComplete: () => {
        node.textContent = format(to, prefix, suffix);
      },
    });

    return () => controls.stop();
  }, [inView, to, prefix, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {format(to, prefix, suffix)}
    </span>
  );
}
