"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

const premiumEase = [0.22, 1, 0.36, 1] as const;

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.35, ease: premiumEase }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
