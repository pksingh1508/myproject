"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type GridBackdropProps = {
  className?: string;
  /** Brighter grid lines that follow the cursor across the parent. */
  spotlight?: boolean;
  fade?: "edges" | "bottom" | "none";
  size?: string;
};

/** Graph-paper backdrop. Place inside a `relative isolate` section. */
export function GridBackdrop({
  className,
  spotlight = false,
  fade = "edges",
  size,
}: GridBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const host = node?.parentElement;
    if (!spotlight || !node || !host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    const handleMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect();
        node.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        node.style.setProperty("--my", `${event.clientY - rect.top}px`);
        node.style.setProperty("--spot", "1");
      });
    };
    const handleLeave = () => node.style.setProperty("--spot", "0");

    host.addEventListener("pointermove", handleMove);
    host.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", handleMove);
      host.removeEventListener("pointerleave", handleLeave);
    };
  }, [spotlight]);

  const fadeClass =
    fade === "edges" ? "mask-fade-edges" : fade === "bottom" ? "mask-fade-b" : "";

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={size ? ({ "--graph-size": size } as React.CSSProperties) : undefined}
    >
      <div className={cn("absolute inset-0 bg-graph", fadeClass)} />
      {spotlight ? (
        <div
          className="absolute inset-0 bg-graph-strong opacity-[var(--spot,0)] transition-opacity duration-700"
          style={{
            maskImage:
              "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), #000 0%, transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), #000 0%, transparent 72%)",
          }}
        />
      ) : null}
    </div>
  );
}
