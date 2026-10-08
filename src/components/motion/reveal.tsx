"use client";

import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "./easing";

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
};

/** Fades and lifts content into place the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  amount = 0.2,
  ...props
}: RevealProps) {
  return (
    <m.div
      {...props}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}

type StaggerProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  amount?: number;
};

/** Parent for <StaggerItem>; children reveal one after another. */
export function Stagger({
  children,
  className,
  delay = 0,
  stagger = 0.08,
  amount = 0.15,
  ...props
}: StaggerProps) {
  return (
    <m.div
      {...props}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: "0px 0px -6% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: { delayChildren: delay, staggerChildren: stagger },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 22,
  ...props
}: Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <m.div
      {...props}
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.75, ease: EASE_OUT },
        },
      }}
    >
      {children}
    </m.div>
  );
}
