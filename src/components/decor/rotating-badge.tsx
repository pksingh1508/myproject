"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

type RotatingBadgeProps = {
  text?: string;
  className?: string;
  children?: React.ReactNode;
};

const RADIUS = 47;

/** Circular, slowly spinning type around a centre emblem. */
export function RotatingBadge({
  text = "Submit something • Celebrate everything • ",
  className,
  children,
}: RotatingBadgeProps) {
  const id = `badge-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <div
      className={cn(
        "relative grid size-28 place-items-center rounded-full",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 120 120"
        className="absolute inset-0 size-full animate-spin-slow"
      >
        <defs>
          <path
            id={id}
            d={`M60 60m-${RADIUS} 0a${RADIUS} ${RADIUS} 0 1 1 ${RADIUS * 2} 0a${RADIUS} ${RADIUS} 0 1 1 -${RADIUS * 2} 0`}
          />
        </defs>
        <text className="fill-current font-mono text-[9.5px] font-semibold uppercase">
          <textPath
            href={`#${id}`}
            textLength={2 * Math.PI * RADIUS - 3}
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
