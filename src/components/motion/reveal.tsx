"use client";

import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

const premiumEase = [0.22, 1, 0.36, 1] as const;

type RevealProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  ...props
}: RevealProps) {
  return (
    <m.div
      {...props}
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: premiumEase }}
    >
      {children}
    </m.div>
  );
}
