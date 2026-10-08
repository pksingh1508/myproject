import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const brandButtonVariants = cva(
  "group/btn relative inline-flex shrink-0 select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] outline-none transition-[transform,background-color,color,box-shadow,border-color] duration-300 ease-out-quint focus-visible:ring-[3px] focus-visible:ring-ring active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.14),0_1px_2px_oklch(0_0_0/0.12)] hover:-translate-y-0.5 hover:shadow-lift",
        signal:
          "bg-signal text-ink shadow-[inset_0_1px_0_oklch(1_0_0/0.35)] hover:-translate-y-0.5 hover:shadow-lift",
        outline:
          "border border-foreground/15 bg-background/60 text-foreground backdrop-blur-sm hover:border-foreground/35 hover:bg-foreground/[0.04]",
        ghost: "text-foreground hover:bg-foreground/[0.06]",
        inverse:
          "bg-paper text-ink hover:-translate-y-0.5 hover:shadow-lift",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-[0.95rem]",
        lg: "h-[3.25rem] px-6 text-base",
      },
      withArrow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { withArrow: true, size: "sm", className: "pr-1.5" },
      { withArrow: true, size: "md", className: "pr-1.5" },
      { withArrow: true, size: "lg", className: "pr-2" },
    ],
    defaultVariants: {
      variant: "solid",
      size: "md",
      withArrow: false,
    },
  },
);

const chipTone: Record<string, string> = {
  solid: "bg-signal text-ink",
  signal: "bg-ink text-signal",
  outline: "bg-foreground text-background",
  ghost: "bg-foreground/10 text-foreground",
  inverse: "bg-ink text-paper",
};

const chipSize: Record<string, string> = {
  sm: "size-6",
  md: "size-8",
  lg: "size-9",
};

type BrandButtonProps = React.ComponentProps<"button"> &
  Omit<VariantProps<typeof brandButtonVariants>, "withArrow"> & {
    asChild?: boolean;
    arrow?: boolean;
    loading?: boolean;
    loadingText?: string;
  };

/**
 * The primary call-to-action. With `arrow`, a round chip on the right swaps
 * its arrow on hover — one slides out, the next slides in.
 */
export function BrandButton({
  className,
  variant = "solid",
  size = "md",
  asChild = false,
  arrow = false,
  loading = false,
  loadingText = "Loading…",
  disabled,
  children,
  ...props
}: BrandButtonProps) {
  const Comp = asChild ? Slot : "button";
  const tone = variant ?? "solid";
  const scale = size ?? "md";

  return (
    <Comp
      data-slot="brand-button"
      className={cn(brandButtonVariants({ variant, size, withArrow: arrow }), className)}
      disabled={asChild ? undefined : disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <Spinner className="size-4" />
          <span>{loadingText}</span>
        </>
      ) : (
        <Slottable>{children}</Slottable>
      )}
      {arrow && !loading ? (
        <span
          aria-hidden
          className={cn(
            "relative grid place-items-center overflow-hidden rounded-full transition-transform duration-500 ease-out-quint group-hover/btn:rotate-[-8deg]",
            chipTone[tone],
            chipSize[scale],
          )}
        >
          <ArrowRight className="size-4 transition-transform duration-500 ease-out-quint group-hover/btn:translate-x-7" />
          <ArrowRight className="absolute size-4 -translate-x-7 transition-transform duration-500 ease-out-quint group-hover/btn:translate-x-0" />
        </span>
      ) : null}
    </Comp>
  );
}

export { brandButtonVariants };
