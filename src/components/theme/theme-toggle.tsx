"use client";

import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { animateView } from "motion";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const revealTransition = {
  duration: 0.7,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  const changeTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    const button = buttonRef.current;

    if (!button || shouldReduceMotion || !("startViewTransition" in document)) {
      setTheme(nextTheme);
      return;
    }

    const rect = button.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY),
    );

    animateView(
      () => {
        flushSync(() => setTheme(nextTheme));

        // next-themes applies this class in an effect. Applying the same value
        // synchronously ensures the incoming View Transition snapshot is ready.
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
        document.documentElement.style.colorScheme = nextTheme;
      },
      { ...revealTransition, interrupt: "immediate" },
    )
      .old({ opacity: 1 })
      .new({
        clipPath: [
          `circle(0px at ${originX}px ${originY}px)`,
          `circle(${radius}px at ${originX}px ${originY}px)`,
        ],
      });
  };

  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={changeTheme}
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:border-foreground/30 hover:bg-foreground/[0.04]",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={mounted ? (isDark ? "dark" : "light") : "pending"}
          className="grid place-items-center"
          initial={{ y: 14, rotate: -60, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: -14, rotate: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
        >
          {isDark ? (
            <Moon className="size-[1.05rem]" strokeWidth={1.8} />
          ) : (
            <Sun className="size-[1.05rem]" strokeWidth={1.8} />
          )}
        </m.span>
      </AnimatePresence>
    </button>
  );
}
