"use client";

import { m } from "motion/react";

import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/components/motion/easing";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

/*
 * Vector redraw of /public/brand.png. Geometry was fitted from the raster:
 * outer clip circle c(259,257) r245, swoosh inner arc c(263,215) r253,
 * W lower arc c(259,206) r248. The H is the deeper navy, the W a shade
 * lighter, exactly like the original mark.
 */
const H_PATH =
  "M74.5 95.8V227H189V22.2A245 245 0 0 1 248.5 12.2V501.8A245 245 0 0 1 189 491.8V287H74.5V418.2A245 245 0 0 1 74.5 95.8Z";
const W_PATH =
  "M270 12.25A245 245 0 0 1 329 22.2V277L369 204H404L443.5 274V95.8A245 245 0 0 1 503.75 246A248 248 0 0 1 434.7 381.1L387 297L322.6 445.7A248 248 0 0 1 270 453.8Z";
const SWOOSH_PATH =
  "M271 467.9A253 253 0 0 0 499 306.1A245 245 0 0 1 271 501.7Z";

type BrandMarkProps = {
  className?: string;
  /** Play the entrance animation on mount. */
  animated?: boolean;
  /**
   * "auto" follows the theme, "light" is for always-dark backgrounds and
   * "inverse" is for surfaces that invert with the theme (bg-foreground).
   */
  tone?: "auto" | "light" | "inverse";
  title?: string;
};

const TONES = {
  auto: {
    h: "fill-[#153155] dark:fill-paper",
    w: "fill-[#1b436b] dark:fill-paper/75",
  },
  light: { h: "fill-paper", w: "fill-paper/75" },
  inverse: {
    h: "fill-paper dark:fill-[#153155]",
    w: "fill-paper/75 dark:fill-[#1b436b]",
  },
} as const;

export function BrandMark({
  className,
  animated = false,
  tone = "auto",
  title,
}: BrandMarkProps) {
  const reduceMotion = usePrefersReducedMotion();
  const play = animated && !reduceMotion;

  const { h: hTone, w: wTone } = TONES[tone];

  return (
    <svg
      viewBox="14 12 490 490"
      className={cn("size-8 shrink-0 overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <m.path
        d={H_PATH}
        className={hTone}
        initial={play ? { opacity: 0, y: -90 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE_OUT }}
      />
      <m.path
        d={W_PATH}
        className={wTone}
        initial={play ? { opacity: 0, y: 90 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.08, ease: EASE_OUT }}
      />
      <m.path
        d={SWOOSH_PATH}
        className="fill-[#75c154] dark:fill-signal"
        // Rotate around the circle's centre so the swoosh "orbits" in.
        style={{ transformBox: "view-box", originX: "259px", originY: "257px" }}
        initial={play ? { opacity: 0, rotate: -80 } : false}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: EASE_OUT }}
      />
    </svg>
  );
}
