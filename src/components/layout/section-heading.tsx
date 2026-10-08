import { cn } from "@/lib/utils";
import { SectionLabel } from "@/components/decor/section-label";
import { Reveal } from "@/components/motion/reveal";

type SectionHeadingProps = {
  label: string;
  index?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  action?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  as?: "h1" | "h2";
};

export function SectionHeading({
  label,
  index,
  title,
  description,
  align = "left",
  action,
  className,
  titleClassName,
  as: Heading = "h2",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-8",
        !centered && action && "lg:flex-row lg:items-end lg:justify-between",
        centered && "items-center text-center",
        className,
      )}
    >
      <Reveal className={cn("flex max-w-3xl flex-col gap-5", centered && "items-center")}>
        <SectionLabel index={index}>{label}</SectionLabel>
        <Heading
          className={cn(
            "font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-semibold leading-[1] tracking-[-0.035em] text-foreground [font-stretch:94%]",
            titleClassName,
          )}
        >
          {title}
        </Heading>
        {description ? (
          <p className="max-w-xl text-[1.0625rem] leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </Reveal>
      {action ? <Reveal delay={0.1}>{action}</Reveal> : null}
    </div>
  );
}
