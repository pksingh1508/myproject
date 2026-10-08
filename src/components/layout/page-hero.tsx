import { cn } from "@/lib/utils";
import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { SectionLabel } from "@/components/decor/section-label";
import { Reveal } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";

type PageHeroProps = {
  label: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Opening block for inner pages: graph paper, label, big headline. */
export function PageHero({
  label,
  title,
  description,
  actions,
  aside,
  children,
  className,
  contentClassName,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden pb-14 pt-[calc(var(--header-h)+3.5rem)] sm:pb-20 sm:pt-[calc(var(--header-h)+5rem)]",
        className,
      )}
    >
      <GridBackdrop spotlight />
      <div
        className={cn(
          "container-page grid grid-cols-1 items-end gap-12 lg:grid-cols-12",
          contentClassName,
        )}
      >
        <div className={cn("flex flex-col gap-6", aside ? "lg:col-span-8" : "lg:col-span-10")}>
          <Reveal y={12}>
            <SectionLabel>{label}</SectionLabel>
          </Reveal>
          <h1 className="font-display text-[clamp(2.3rem,6.4vw,5.25rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-foreground [font-stretch:92%]">
            <MaskLine trigger="mount" delay={0.05}>
              {title}
            </MaskLine>
          </h1>
          {description ? (
            <Reveal delay={0.15} y={16}>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Reveal>
          ) : null}
          {actions ? (
            <Reveal delay={0.25} y={16} className="flex flex-wrap items-center gap-3 pt-2">
              {actions}
            </Reveal>
          ) : null}
        </div>
        {aside ? (
          <Reveal delay={0.2} className="lg:col-span-4">
            {aside}
          </Reveal>
        ) : null}
      </div>
      {children}
    </section>
  );
}
