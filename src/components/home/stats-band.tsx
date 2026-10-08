import { CountUp } from "@/components/motion/count-up";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const stats = [
  { to: 50, suffix: "+", label: "Hackathons hosted" },
  { to: 1000, suffix: "+", label: "Projects submitted" },
  { to: 20, prefix: "₹", suffix: "L+", label: "Prize money won" },
  { to: 40, suffix: "+", label: "Campuses joined" },
];

// 2×2 on mobile, 4 across on desktop, with hairline dividers between cells.
const CELL = [
  "pr-5",
  "border-l pl-5 sm:pl-8",
  "border-t pr-5 lg:border-l lg:border-t-0 lg:pl-8",
  "border-l border-t pl-5 sm:pl-8 lg:border-t-0",
];

export function StatsBand({ className }: { className?: string }) {
  return (
    <Stagger className={cn("grid grid-cols-2 border-y border-border lg:grid-cols-4", className)}>
      {stats.map((stat, index) => (
        <StaggerItem
          key={stat.label}
          className={cn("flex flex-col gap-2 border-border py-8 sm:py-10", CELL[index])}
        >
          <CountUp
            to={stat.to}
            prefix={stat.prefix}
            suffix={stat.suffix}
            className="font-display text-[clamp(2.6rem,5.4vw,4.4rem)] font-semibold leading-none tracking-[-0.05em] tabular-nums [font-stretch:90%]"
          />
          <span className="font-mono text-[0.78rem] lowercase text-muted-foreground">
            {stat.label}
          </span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
