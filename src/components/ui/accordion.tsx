"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { animate as animateValue, m, useReducedMotion } from "motion/react";
import { PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AccordionItemState = {
  isOpen: boolean;
};

const AccordionItemStateContext = React.createContext<AccordionItemState>({
  isOpen: false
});

function useAccordionItemState() {
  return React.useContext(AccordionItemStateContext);
}

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const itemRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const item = itemRef.current;
    if (!item) return;

    const syncState = () => {
      setIsOpen(item.getAttribute("data-state") === "open");
    };

    syncState();

    const observer = new MutationObserver(syncState);
    observer.observe(item, {
      attributes: true,
      attributeFilter: ["data-state"]
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionItemStateContext.Provider value={{ isOpen }}>
      <AccordionPrimitive.Item
        ref={itemRef}
        data-slot="accordion-item"
        className={cn("border-b border-border last:border-b-0", className)}
        {...props}
      />
    </AccordionItemStateContext.Provider>
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { isOpen } = useAccordionItemState();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex flex-1 items-start justify-between gap-6 rounded-xl py-5 text-left text-[0.98rem] font-medium transition-colors duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <m.span
          aria-hidden="true"
          className={cn(
            "pointer-events-none grid size-8 shrink-0 place-items-center rounded-full border transition-colors duration-300",
            isOpen
              ? "border-transparent bg-foreground text-background"
              : "border-border bg-background text-foreground group-hover/trigger:border-foreground/30",
          )}
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.18 : 0.28,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <PlusIcon className="size-4" strokeWidth={2} />
        </m.span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, forwardedRef) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const animationRef = React.useRef<ReturnType<typeof animateValue> | null>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useImperativeHandle(
    forwardedRef,
    () => contentRef.current as HTMLDivElement
  );

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    content.style.overflow = "hidden";

    const runAnimation = () => {
      animationRef.current?.stop();
      const state = content.getAttribute("data-state");
      const isOpen = state === "open";

      if (prefersReducedMotion) {
        content.style.height = isOpen ? "auto" : "0px";
        content.style.opacity = isOpen ? "1" : "0";
        return;
      }

      if (isOpen) {
        const height = content.scrollHeight;
        animationRef.current = animateValue(
          content,
          {
            height: [0, height],
            opacity: [0, 1]
          },
          {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
            onComplete: () => {
              if (content.getAttribute("data-state") === "open") {
                content.style.height = "auto";
              }
            }
          }
        );
      } else {
        const currentHeight =
          content.getBoundingClientRect().height || content.scrollHeight;
        content.style.height = `${currentHeight}px`;
        animationRef.current = animateValue(
          content,
          {
            height: 0,
            opacity: 0
          },
          {
            duration: 0.22,
            ease: [0.4, 0, 0.2, 1],
            onComplete: () => {
              content.style.height = "0px";
            }
          }
        );
      }
    };

    const observer = new MutationObserver(runAnimation);
    observer.observe(content, {
      attributes: true,
      attributeFilter: ["data-state"]
    });

    // set initial state if rendered open
    if (content.getAttribute("data-state") === "open") {
      content.style.height = "auto";
      content.style.opacity = "1";
    } else {
      content.style.height = "0px";
      content.style.opacity = "0";
    }

    return () => {
      observer.disconnect();
      animationRef.current?.stop();
    };
  }, [prefersReducedMotion]);

  return (
    <AccordionPrimitive.Content
      ref={contentRef}
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
