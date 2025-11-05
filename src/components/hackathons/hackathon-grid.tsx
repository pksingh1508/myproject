import type { Hackathon } from "@/types/database";
import { HackathonCard } from "./hackathon-card";

interface HackathonGridProps {
  hackathons: Hackathon[];
  emptyState?: React.ReactNode;
}

export function HackathonGrid({
  hackathons,
  emptyState
}: HackathonGridProps) {
  if (hackathons.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        {emptyState ?? (
          <>
            <h3 className="text-lg font-semibold">No hackathons yet</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Stay tuned! New hackathons will appear here as soon as they are
              published.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  );
}
