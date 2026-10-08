"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";

import { cn } from "@/lib/utils";

type TocItem = { id: string; number: string; heading: string };

/** Contents list that tracks which section is currently being read. */
export function PolicyToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page">
      <p className="font-mono text-xs lowercase text-muted-foreground">
        <span className="text-signal-ink">{"// "}</span>on this page
      </p>
      <ol className="relative mt-5 flex flex-col border-l border-border">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="relative">
              {isActive ? (
                <m.span
                  layoutId="policy-toc-indicator"
                  className="absolute -left-px top-0 h-full w-[2px] bg-signal"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              ) : null}
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "flex gap-3 py-2 pl-4 text-sm leading-snug transition-colors duration-300",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-[0.7rem] tabular-nums opacity-60">{item.number}</span>
                <span>{item.heading}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
