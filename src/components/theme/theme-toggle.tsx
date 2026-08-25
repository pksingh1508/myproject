"use client";

import { flushSync } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { animateView } from "motion";
import { m, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

const revealTransition = {
  duration: 0.64,
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

    if (!button || shouldReduceMotion) {
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

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={changeTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "group relative inline-flex h-9 w-[3.75rem] shrink-0 items-center rounded-full border border-border/80 bg-muted/70 p-1 shadow-inner outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span className="sr-only">
        {isDark ? "Light mode" : "Dark mode"}
      </span>
      <m.span
        aria-hidden="true"
        className="relative flex size-7 items-center justify-center rounded-full border border-border/70 bg-background text-foreground shadow-sm"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
      >
        <m.span
          key={mounted ? resolvedTheme : "loading"}
          initial={mounted ? { opacity: 0, rotate: -45, scale: 0.7 } : false}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
        </m.span>
      </m.span>
    </button>
  );
}
