import { Asterisk } from "@/components/decor/scribbles";
import { VelocityMarquee } from "@/components/motion/marquee";

const tracks = [
  "AI & ML",
  "Web3",
  "Cybersecurity",
  "IoT",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Mobile apps",
  "Data science",
  "Open innovation",
];

/** A slanted ticker of tracks that reacts to scroll speed and direction. */
export function TracksMarquee() {
  return (
    <section aria-label="Hackathon tracks" className="relative overflow-hidden py-10 sm:py-14">
      <div className="-mx-4 -rotate-[1.8deg] border-y border-foreground bg-foreground py-4 text-background sm:py-5">
        <VelocityMarquee baseVelocity={-1.4}>
          {tracks.map((track) => (
            <span
              key={track}
              className="flex items-center gap-7 pr-7 font-display text-[clamp(1.6rem,3.6vw,2.9rem)] font-semibold leading-none tracking-[-0.035em] [font-stretch:92%]"
            >
              {track}
              <Asterisk className="size-[0.7em] text-hilite dark:text-[oklch(0.5_0.13_142)]" />
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
