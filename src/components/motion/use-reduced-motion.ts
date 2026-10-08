"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useMotionValue } from "motion/react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Like Motion's useReducedMotion, but it reports `false` on the server and
 * during hydration, so markup never differs between the two renders.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * A motion value that is 1 normally and 0 when the user prefers reduced
 * motion. Multiply scroll-linked transforms by it instead of branching
 * render output, which keeps SSR and hydration in sync.
 */
export function useMotionFactor() {
  const reduce = usePrefersReducedMotion();
  const factor = useMotionValue(1);

  useEffect(() => {
    factor.set(reduce ? 0 : 1);
  }, [factor, reduce]);

  return factor;
}
