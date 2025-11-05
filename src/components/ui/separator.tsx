import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  orientation = "horizontal",
  className,
  ...props
}: SeparatorProps) {
  const orientationClasses =
    orientation === "vertical"
      ? "h-full w-px"
      : "h-px w-full";

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn("bg-border", orientationClasses, className)}
      {...props}
    />
  );
}
