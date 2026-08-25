"use client";

import { usePathname } from "next/navigation";
import { m, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const isHomePage = pathname === "/";

  return (
    <m.div
      className="min-h-full"
      initial={
        isHomePage
          ? false
          : { opacity: 0, y: shouldReduceMotion ? 0 : 10 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
