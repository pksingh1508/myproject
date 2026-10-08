"use client";

import { usePathname } from "next/navigation";
import { m } from "motion/react";

import { EASE_OUT } from "@/components/motion/easing";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = usePrefersReducedMotion();
  // The home page choreographs its own entrance.
  const isHomePage = pathname === "/";

  return (
    <m.div
      className="min-h-full"
      initial={isHomePage ? false : { opacity: 0, y: shouldReduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
