import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { GridBackdrop } from "@/components/decor/grid-backdrop";
import { SectionLabel } from "@/components/decor/section-label";
import { Reveal } from "@/components/motion/reveal";
import { MaskLine } from "@/components/motion/text-reveal";
import { cn } from "@/lib/utils";
import { PolicyToc } from "./policy-toc";

export type PolicySection = {
  title: string;
  content: React.ReactNode;
};

const POLICIES = [
  { title: "Terms & Conditions", href: "/terms-and-conditions" },
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Refund Policy", href: "/refund-policy" },
  { title: "Cancellation Policy", href: "/cancellation-policy" },
];

function splitTitle(title: string, index: number) {
  const match = title.match(/^(\d+)\.\s*(.*)$/);
  const number = match ? Number(match[1]) : index + 1;
  return {
    number: String(number).padStart(2, "0"),
    heading: match ? match[2] : title,
  };
}

const slugify = (value: string) =>
  value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type PolicyPageProps = {
  title: string;
  href: string;
  intro: React.ReactNode;
  sections: PolicySection[];
};

/** Shared reading layout for legal pages: sticky contents + numbered sections. */
export function PolicyPage({ title, href, intro, sections }: PolicyPageProps) {
  const items = sections.map((section, index) => {
    const { number, heading } = splitTitle(section.title, index);
    return { ...section, number, heading, id: slugify(heading) };
  });

  const updated = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-border pb-14 pt-[calc(var(--header-h)+3rem)] sm:pb-16 sm:pt-[calc(var(--header-h)+4.5rem)]">
        <GridBackdrop spotlight />
        <div className="container-page flex flex-col gap-6">
          <Reveal y={12}>
            <SectionLabel>legal</SectionLabel>
          </Reveal>
          <h1 className="font-display text-[clamp(2.6rem,6.4vw,5rem)] font-semibold leading-[0.96] tracking-[-0.045em] [font-stretch:92%]">
            <MaskLine trigger="mount" delay={0.05}>
              {title}
            </MaskLine>
          </h1>
          <Reveal delay={0.12} y={14} className="flex max-w-3xl flex-col gap-4">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 font-mono text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-signal" />
              Last updated {updated}
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">{intro}</p>
          </Reveal>
        </div>
      </section>

      <div className="container-page grid grid-cols-1 gap-12 py-14 sm:py-20 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-28">
            <PolicyToc items={items.map(({ id, number, heading }) => ({ id, number, heading }))} />
          </div>
        </aside>

        <div className="lg:col-span-9 xl:col-span-8">
          <div className="flex flex-col">
            {items.map((item) => (
              <Reveal
                key={item.id}
                y={18}
                amount={0.1}
                className="border-b border-border py-10 first:pt-0 last:border-b-0"
              >
                <section
                  id={item.id}
                  aria-labelledby={`${item.id}-heading`}
                  className="grid scroll-mt-28 gap-4 sm:grid-cols-[4rem_1fr]"
                >
                  <span className="font-mono text-sm text-signal-ink tabular-nums">
                    {item.number}
                  </span>
                  <div>
                    <h2
                      id={`${item.id}-heading`}
                      className="font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.03em]"
                    >
                      {item.heading}
                    </h2>
                    <div className="rich-text mt-4">
                      {typeof item.content === "string" ? <p>{item.content}</p> : item.content}
                    </div>
                  </div>
                </section>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 border-t border-border pt-10">
            <p className="font-mono text-xs lowercase text-muted-foreground">
              <span className="text-signal-ink">{"// "}</span>read alongside
            </p>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {POLICIES.filter((policy) => policy.href !== href).map((policy) => (
                <Link
                  key={policy.href}
                  href={policy.href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 font-display font-semibold tracking-[-0.01em] shadow-soft transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-foreground/25",
                  )}
                >
                  {policy.title}
                  <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
