"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type CustomCardProps = React.HTMLAttributes<HTMLDivElement>;

export const CustomCard = forwardRef<HTMLDivElement, CustomCardProps>(
  function CustomCard({ className, children, ...props }, forwardedRef) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const shadowRef = useRef<HTMLSpanElement | null>(null);
    const hoverTimeline = useRef<gsap.core.Tween | null>(null);

    useImperativeHandle(
      forwardedRef,
      () => cardRef.current as HTMLDivElement,
      []
    );

    useEffect(() => {
      const card = cardRef.current;
      const shadow = shadowRef.current;
      if (!card || !shadow) {
        return;
      }

      gsap.set(card, { x: 0, y: 0 });
      gsap.set(shadow, { opacity: 0, scale: 0.95 });

      const handleEnter = () => {
        hoverTimeline.current?.kill();
        hoverTimeline.current = gsap.to(card, {
          x: 10,
          y: -10,
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(shadow, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "power2.out"
        });
      };

      const handleLeave = () => {
        hoverTimeline.current?.kill();
        hoverTimeline.current = gsap.to(card, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(shadow, {
          opacity: 0,
          scale: 0.95,
          duration: 0.35,
          ease: "power2.out"
        });
      };

      card.addEventListener("pointerenter", handleEnter);
      card.addEventListener("pointerleave", handleLeave);

      return () => {
        card.removeEventListener("pointerenter", handleEnter);
        card.removeEventListener("pointerleave", handleLeave);
        hoverTimeline.current?.kill();
        hoverTimeline.current = null;
      };
    }, []);

    useEffect(() => {
      const card = cardRef.current;
      if (!card) {
        return;
      }

      const ctx = gsap.context(() => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              once: true
            }
          }
        );
      }, card);

      return () => {
        ctx.revert();
      };
    }, []);

    return (
      <span className="relative inline-block">
        <span
          ref={shadowRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-foreground/10 opacity-0 transition-opacity duration-300"
        />
        <div
          ref={cardRef}
          className={cn(
            "relative flex h-full flex-col rounded-2xl border border-border/60 bg-background p-6 shadow-lg transition-shadow duration-200",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </span>
    );
  }
);
