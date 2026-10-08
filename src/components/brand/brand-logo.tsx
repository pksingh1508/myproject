import Link from "next/link";

import { cn } from "@/lib/utils";
import { BrandMark } from "./brand-mark";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  animated?: boolean;
  tone?: "auto" | "light";
  onNavigate?: () => void;
};

/** Mark + two-tone wordmark that mirrors the logo's navy pairing. */
export function BrandLogo({
  className,
  markClassName,
  animated,
  tone = "auto",
  onNavigate,
}: BrandLogoProps) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="HackathonWallah home"
      className={cn(
        "group/logo inline-flex items-center gap-2.5 rounded-full outline-none",
        className,
      )}
    >
      <BrandMark
        animated={animated}
        tone={tone}
        className={cn(
          "size-8 transition-transform duration-700 ease-out-quint group-hover/logo:rotate-[-8deg]",
          markClassName,
        )}
      />
      <span
        className={cn(
          "font-display text-[1.07rem] font-semibold leading-none tracking-[-0.03em]",
          tone === "light" ? "text-paper" : "text-foreground",
        )}
      >
        Hackathon
        <span className={tone === "light" ? "text-paper/60" : "text-brand"}>
          Wallah
        </span>
      </span>
    </Link>
  );
}
