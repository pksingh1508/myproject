"use client";

import { forwardRef } from "react";
import { m, type HTMLMotionProps } from "motion/react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type BrandButtonProps = Omit<HTMLMotionProps<"button">, "ref"> & {
  loading?: boolean;
  loadingText?: string;
};

export const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(
  function BrandButton(
    {
      className,
      children,
      loading = false,
      loadingText = "Loading...",
      disabled,
      ...props
    },
    forwardedRef
  ) {
    return (
      <span className="relative inline-block">
        <m.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-foreground/15 opacity-0"
          variants={{
            rest: { opacity: 0, x: 0, y: 0 },
            hover: { opacity: 1, x: 3, y: 3 },
          }}
        />
        <m.button
          ref={forwardedRef}
          className={cn(
            "relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-background px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
            className
          )}
          disabled={disabled || loading}
          initial="rest"
          animate="rest"
          whileHover={disabled || loading ? undefined : "hover"}
          whileTap={disabled || loading ? undefined : { scale: 0.98 }}
          variants={{
            rest: { x: 0, y: 0 },
            hover: { x: -3, y: -3 },
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          {...props}
        >
          <m.span
            aria-hidden="true"
            className="absolute inset-0 scale-y-0 transform bg-primary"
            style={{ transformOrigin: "50% 100%" }}
            variants={{
              rest: { scaleY: 0 },
              hover: { scaleY: 1 },
            }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          />
          <m.span
            className="relative flex items-center justify-center gap-2 text-foreground"
            variants={{ rest: { color: "var(--foreground)" }, hover: { color: "#ffffff" } }}
            transition={{ duration: 0.16 }}
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                <span className="text-xs font-medium">
                  {loadingText}
                </span>
              </>
            ) : (
              children
            )}
          </m.span>
        </m.button>
      </span>
    );
  }
);
