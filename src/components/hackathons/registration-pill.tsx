import { cn } from "@/lib/utils";
import type { RegistrationState } from "./hackathon-utils";

const TONES = {
  open: "bg-signal text-ink",
  soon: "bg-marigold text-ink",
  closed: "bg-paper/90 text-ink",
  done: "bg-ink/80 text-paper",
} as const;

/** Status chip; the dot pulses only while registration is open. */
export function RegistrationPill({
  state,
  className,
}: {
  state: RegistrationState;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-soft backdrop-blur",
        TONES[state.tone],
        className,
      )}
    >
      <span className="relative grid size-1.5 place-items-center">
        {state.tone === "open" ? (
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-ink" />
        ) : null}
        <span className="relative size-1.5 rounded-full bg-current" />
      </span>
      {state.label}
    </span>
  );
}
