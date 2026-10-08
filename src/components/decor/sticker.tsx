import { cn } from "@/lib/utils";

type StickerProps = {
  children: React.ReactNode;
  className?: string;
};

/** Laptop-sticker style chip: thick outline and a hard offset shadow. */
export function Sticker({ children, className }: StickerProps) {
  return (
    <span
      className={cn(
        "inline-flex select-none items-center gap-1.5 rounded-full border-2 border-ink bg-hilite px-3.5 py-1.5 font-display text-sm font-bold tracking-[-0.01em] text-ink shadow-sticker",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Deterministic barcode, purely decorative. */
export function Barcode({
  value = "HACKATHONWALLAH",
  className,
}: {
  value?: string;
  className?: string;
}) {
  const bars: Array<{ x: number; w: number }> = [];
  let x = 0;
  for (let index = 0; index < value.length * 3; index += 1) {
    const code = value.charCodeAt(index % value.length) + index * 7;
    const width = (code % 3) + 1;
    const gap = ((code >> 2) % 2) + 1;
    bars.push({ x, w: width });
    x += width + gap;
  }

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${x} 40`}
      preserveAspectRatio="none"
      className={cn("h-8 w-full", className)}
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y={0} width={bar.w} height={40} fill="currentColor" />
      ))}
    </svg>
  );
}
