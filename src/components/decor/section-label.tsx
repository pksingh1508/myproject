import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  index?: string;
  className?: string;
  /** "light" for always-dark surfaces, "inverse" for bg-foreground blocks. */
  tone?: "auto" | "light" | "inverse";
};

/**
 * Section labels are written like code comments — `// 02 — how it works` —
 * a quiet nod to the people this platform is for.
 */
export function SectionLabel({
  children,
  index,
  className,
  tone = "auto",
}: SectionLabelProps) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[0.8rem] lowercase tracking-tight",
        tone === "light"
          ? "text-paper/70"
          : tone === "inverse"
            ? "text-background/60"
            : "text-muted-foreground",
        className,
      )}
    >
      <span
        className={
          tone === "light"
            ? "text-hilite"
            : tone === "inverse"
              ? "text-hilite dark:text-[oklch(0.45_0.13_142)]"
              : "text-signal-ink"
        }
      >
        {"//"}
      </span>
      {index ? (
        <>
          <span
            className={cn(
              "tabular-nums",
              tone === "light"
                ? "text-paper"
                : tone === "inverse"
                  ? "text-background"
                  : "text-foreground",
            )}
          >
            {index}
          </span>
          <span aria-hidden className="h-px w-6 bg-current opacity-40" />
        </>
      ) : null}
      <span>{children}</span>
    </p>
  );
}
