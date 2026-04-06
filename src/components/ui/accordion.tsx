"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { animate as animateValue, motion, useReducedMotion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";

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
        className={cn("border-b last:border-b-0", className)}
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
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-[color,background-color] duration-300 outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none flex size-9 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background/80 text-muted-foreground shadow-sm"
          animate={
            prefersReducedMotion
              ? { rotate: isOpen ? 180 : 0 }
              : {
                  rotate: isOpen ? 180 : 0,
                  scale: isOpen ? 1.05 : 1,
                  y: isOpen ? -1 : 0
                }
          }
          transition={{
            duration: prefersReducedMotion ? 0.18 : 0.28,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <ChevronDownIcon className="size-4" />
        </motion.span>
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
