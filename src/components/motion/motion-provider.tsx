"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";

import { EASE_OUT } from "./easing";

// domMax (not domAnimation) so shared-layout animations (layoutId) work for
// the nav pill, tabs, and segmented controls.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domMax}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.45, ease: EASE_OUT }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
