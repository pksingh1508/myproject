"use client"
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "lucide-react";
import { gsap } from "gsap";

import { cn } from "@/lib/utils";

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, forwardedRef) => {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const animationRef = React.useRef<gsap.core.Tween | null>(null);

  React.useImperativeHandle(forwardedRef, () => contentRef.current as HTMLDivElement);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    content.style.overflow = "hidden";

    const animate = () => {
      animationRef.current?.kill();
      const state = content.getAttribute("data-state");
      const isOpen = state === "open";

      if (isOpen) {
        const height = content.scrollHeight;
        animationRef.current = gsap.fromTo(
          content,
          { height: 0, opacity: 0 },
          {
            height,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            onComplete: () => {
              if (content.getAttribute("data-state") === "open") {
                content.style.height = "auto";
              }
            }
          }
        );
      } else {
        const currentHeight = content.scrollHeight;
        content.style.height = `${currentHeight}px`;
        animationRef.current = gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.28,
          ease: "power2.inOut",
          onComplete: () => {
            content.style.height = "0px";
          }
        });
      }
    };

    const observer = new MutationObserver(() => animate());
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
      animationRef.current?.kill();
    };
  }, []);

  return (
    <AccordionPrimitive.Content
      ref={contentRef}
      data-slot="accordion-content"
      className="overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
});
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
