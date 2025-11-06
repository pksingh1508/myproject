"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";

import { gsap } from "gsap";

import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type BrandButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export const BrandButton = forwardRef<HTMLButtonElement, BrandButtonProps>(
  function BrandButton(
    {
      className,
      children,
      loading = false,
      loadingText = "Loading...",
      disabled,
      ...props
    },
    forwardedRef
  ) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const shadowRef = useRef<HTMLSpanElement | null>(null);
  const textRef = useRef<HTMLSpanElement | null>(null);
  const hoverTimeline = useRef<gsap.core.Timeline | null>(null);
  const pressTween = useRef<gsap.core.Tween | null>(null);
  const initialTextColor = useRef<string>("");

    useImperativeHandle(forwardedRef, () => buttonRef.current as HTMLButtonElement, []);

    useEffect(() => {
      const btn = buttonRef.current;
      const fill = fillRef.current;
      const shadow = shadowRef.current;

      if (!btn || !fill || !shadow || !textRef.current) {
        return;
      }

      initialTextColor.current =
        window.getComputedStyle(textRef.current).color ?? "";

      gsap.set(fill, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(btn, { x: 0, y: 0, scale: 1 });

      hoverTimeline.current = gsap
        .timeline({ paused: true })
        .to(fill, { scaleY: 1, duration: 0.4, ease: "power2.out" }, 0)
        .to(
          btn,
          { x: -6, y: -6, duration: 0.35, ease: "power2.out" },
          0
        )
        .to(
          shadow,
          { opacity: 1, duration: 0.35, ease: "power2.out" },
          0
        )
        .to(
          textRef.current,
          { color: "#ffffff", duration: 0.35, ease: "power2.out" },
          0
        );

      const handleEnter = () => {
        if (btn.disabled) return;
        hoverTimeline.current?.play();
      };

      const handleLeave = () => {
        hoverTimeline.current?.reverse();
      };

      const handleDown = () => {
        if (btn.disabled) return;
        pressTween.current?.kill();
        pressTween.current = gsap.to(btn, {
          scale: 0.97,
          duration: 0.12,
          ease: "power3.out"
        });
      };

      const handleUp = () => {
        pressTween.current?.kill();
        gsap.to(btn, {
          scale: 1,
          duration: 0.2,
          ease: "power3.out"
        });
      };

      btn.addEventListener("pointerenter", handleEnter);
      btn.addEventListener("pointerleave", handleLeave);
      btn.addEventListener("pointerdown", handleDown);
      window.addEventListener("pointerup", handleUp);

      return () => {
        btn.removeEventListener("pointerenter", handleEnter);
        btn.removeEventListener("pointerleave", handleLeave);
        btn.removeEventListener("pointerdown", handleDown);
        window.removeEventListener("pointerup", handleUp);
        hoverTimeline.current?.kill();
        hoverTimeline.current = null;
        pressTween.current?.kill();
        pressTween.current = null;
      };
    }, []);

    useEffect(() => {
      if (!hoverTimeline.current) {
        return;
      }

      const textEl = textRef.current;

      if (disabled || loading) {
        hoverTimeline.current.pause(0);
        gsap.to(buttonRef.current, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.2,
          ease: "power2.out"
        });
        gsap.to(fillRef.current, {
          scaleY: 0,
          duration: 0.2,
          ease: "power2.out"
        });
        gsap.to(shadowRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out"
        });
        if (textEl) {
          gsap.to(textEl, {
            color: initialTextColor.current || "",
            duration: 0.2,
            ease: "power2.out"
          });
        }
      }
    }, [disabled, loading]);

    return (
      <span className="relative inline-block">
        <span
          ref={shadowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-foreground/15 opacity-0 transition-opacity duration-200"
        />
        <button
          ref={buttonRef}
          className={cn(
            "relative inline-flex items-center justify-center overflow-hidden rounded-xl border border-primary/40 bg-background px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-foreground shadow-md transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70",
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          <span
            ref={fillRef}
            aria-hidden="true"
            className="absolute inset-0 scale-y-0 transform bg-primary"
          />
          <span
            ref={textRef}
            className="relative flex items-center justify-center gap-2 text-foreground transition-colors duration-200"
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                <span className="text-xs font-medium">
                  {loadingText}
                </span>
              </>
            ) : (
              children
            )}
          </span>
        </button>
      </span>
    );
  }
);
