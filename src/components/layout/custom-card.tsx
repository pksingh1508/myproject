"use client";

import { forwardRef, useCallback } from "react";
import { m, type HTMLMotionProps } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/components/motion/easing";

type CustomCardProps = Omit<HTMLMotionProps<"div">, "ref"> & {
  revealDelay?: number;
  /** Soft light that follows the cursor across the card. */
  spotlight?: boolean;
};

/** Paper card with a reveal-on-scroll and an optional cursor spotlight. */
export const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>(
  function CustomCard(
    { className, children, revealDelay = 0, spotlight = true, onPointerMove, ...props },
    forwardedRef,
  ) {
    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);
        if (!spotlight) return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--cx", `${event.clientX - rect.left}px`);
        event.currentTarget.style.setProperty("--cy", `${event.clientY - rect.top}px`);
      },
      [onPointerMove, spotlight],
    );

    return (
      <m.div
        ref={forwardedRef}
        className={cn(
          "group/card relative isolate flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card p-7 shadow-soft transition-[border-color,box-shadow] duration-500 hover:border-foreground/20 hover:shadow-lift",
          spotlight &&
            "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(420px_circle_at_var(--cx,50%)_var(--cy,0%),color-mix(in_oklch,var(--signal),transparent_86%),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
          className,
        )}
        initial={{ opacity: 0, y: 26 }}
        whileInView={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, delay: revealDelay, ease: EASE_OUT },
        }}
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -6% 0px" }}
        onPointerMove={handlePointerMove}
        {...props}
      >
        {children}
      </m.div>
    );
  },
);
