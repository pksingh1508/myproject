import type { Hackathon } from "@/types/database";
import { HackathonCard } from "./hackathon-card";
import { Reveal } from "@/components/motion/reveal";
import { ScribbleCircle } from "@/components/decor/scribbles";

interface HackathonGridProps {
  hackathons: Hackathon[];
  emptyState?: React.ReactNode;
  sortByCreatedAt?: boolean;
}

export function HackathonGrid({
  hackathons,
  emptyState,
  sortByCreatedAt = false,
}: HackathonGridProps) {
  if (hackathons.length === 0) {
    return (
      <div className="relative flex min-h-[18rem] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed border-foreground/20 bg-card/60 p-10 text-center">
        <div aria-hidden className="absolute inset-0 bg-graph mask-fade-edges" />
        <div className="relative flex flex-col items-center">
          <span className="relative mb-6 inline-block px-4 py-2 font-hand text-2xl text-brand">
            nothing here… yet
            <ScribbleCircle className="absolute inset-0 size-full text-signal" />
          </span>
          {emptyState ?? (
            <>
              <h3 className="font-display text-xl font-semibold tracking-tight">
                No hackathons yet
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Stay tuned! New hackathons will appear here as soon as they are
                published.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  const displayedHackathons = sortByCreatedAt
    ? [...hackathons].sort(
        (current, next) =>
          new Date(next.created_at).getTime() -
          new Date(current.created_at).getTime(),
      )
    : hackathons;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {displayedHackathons.map((hackathon, index) => (
        <Reveal
          key={hackathon.id}
          className="h-full"
          delay={(index % 3) * 0.08}
          y={30}
        >
          <HackathonCard hackathon={hackathon} />
        </Reveal>
      ))}
    </div>
  );
}
