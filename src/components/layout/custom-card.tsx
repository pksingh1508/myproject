"use client";

import { forwardRef } from "react";
import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";

type CustomCardProps = Omit<HTMLMotionProps<"div">, "ref"> & {
  revealDelay?: number;
};

export const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>(
  function CustomCard(
    { className, children, revealDelay = 0, ...props },
    forwardedRef,
  ) {
    return (
      <m.div
        ref={forwardedRef}
        data-moving-border
        className={cn(
          "relative flex h-full flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.42)] will-change-transform",
          className,
        )}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: revealDelay,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        whileHover={{
          y: -4,
          transition: { type: "spring", stiffness: 420, damping: 30, delay: 0 },
        }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
        {...props}
      >
        {children}
      </m.div>
    );
  }
);
