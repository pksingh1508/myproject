import { TESTIMONIALS } from "@/constants/data";
import { SectionHeading } from "@/components/layout/section-heading";
import { LoopMarquee } from "@/components/motion/marquee";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Testimonial = (typeof TESTIMONIALS)[number];

const AVATAR_TONES = [
  "bg-signal text-ink",
  "bg-marigold text-ink",
  "bg-foreground text-background",
  "bg-hilite text-ink",
  "bg-brand text-background",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const half = Math.ceil(TESTIMONIALS.length / 2);
const rows = [TESTIMONIALS.slice(0, half), TESTIMONIALS.slice(half)];

export function Testimonials() {
  return (
    <section id="community" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          index="04"
          label="community"
          title="Builders love HackathonWallah."
          description="Hear from hackers who turned weekend projects into standout portfolio pieces, job offers, and investor-ready products."
        />
      </div>

      <Reveal className="mt-14 flex flex-col gap-5 mask-fade-x" y={30}>
        {rows.map((row, rowIndex) => (
          <LoopMarquee key={rowIndex} reverse={rowIndex === 1} duration={rowIndex === 1 ? 70 : 60}>
            {row.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                tone={AVATAR_TONES[(index + rowIndex * 2) % AVATAR_TONES.length]}
              />
            ))}
          </LoopMarquee>
        ))}
      </Reveal>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  tone,
}: {
  testimonial: Testimonial;
  tone: string;
}) {
  return (
    <figure className="mr-5 flex w-[19.5rem] shrink-0 flex-col justify-between gap-8 rounded-[1.6rem] border border-border bg-card p-6 shadow-soft transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lift sm:w-[23rem] sm:p-7">
      <blockquote className="text-[1.02rem] leading-relaxed text-foreground/90">
        <span aria-hidden className="mr-1 font-display text-2xl leading-none text-signal-ink">
          “
        </span>
        {testimonial.quote}
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full font-mono text-[0.72rem] font-semibold",
            tone,
          )}
        >
          {initials(testimonial.name)}
        </span>
        <span className="flex flex-col">
          <span className="font-display font-semibold tracking-[-0.01em]">
            {testimonial.name}
          </span>
          <span className="font-mono text-[0.7rem] lowercase text-muted-foreground">
            {testimonial.role}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
