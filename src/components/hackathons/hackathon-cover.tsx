import { cn } from "@/lib/utils";
import { hashString } from "./hackathon-utils";

const PALETTES = [
  { surface: "bg-ink", pattern: "text-paper/15", type: "text-hilite" },
  { surface: "bg-[#1b436b]", pattern: "text-paper/15", type: "text-paper/90" },
  { surface: "bg-signal", pattern: "text-ink/20", type: "text-ink" },
  { surface: "bg-marigold", pattern: "text-ink/20", type: "text-ink" },
  { surface: "bg-hilite", pattern: "text-ink/15", type: "text-ink" },
] as const;

const PATTERNS = [
  "bg-[linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] bg-[size:22px_22px]",
  "bg-[radial-gradient(currentColor_1.3px,transparent_1.8px)] bg-[size:16px_16px]",
  "bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_12px)]",
  "bg-[repeating-radial-gradient(circle_at_100%_100%,currentColor_0_1px,transparent_1px_18px)]",
] as const;

function initialsOf(title: string) {
  const words = title
    .split(/\s+/)
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);
  if (words.length === 0) return "HW";
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
}

type HackathonCoverProps = {
  seed: string;
  title: string;
  className?: string;
};

/**
 * A unique, deterministic cover for hackathons without a banner image:
 * brand palette + pattern picked from the slug, with oversized initials.
 */
export function HackathonCover({ seed, title, className }: HackathonCoverProps) {
  const hash = hashString(seed);
  const palette = PALETTES[hash % PALETTES.length];
  const pattern = PATTERNS[(hash >>> 4) % PATTERNS.length];

  return (
    <div aria-hidden className={cn("absolute inset-0 overflow-hidden", palette.surface, className)}>
      <div className={cn("absolute inset-0", pattern, palette.pattern)} />
      <span
        className={cn(
          "absolute -bottom-[0.18em] -right-[0.04em] select-none font-display text-[8.5rem] font-bold leading-none tracking-[-0.07em] [font-stretch:85%] transition-transform duration-700 ease-out-quint group-hover:-translate-y-1 group-hover:-rotate-2",
          palette.type,
        )}
      >
        {initialsOf(title)}
      </span>
    </div>
  );
}
