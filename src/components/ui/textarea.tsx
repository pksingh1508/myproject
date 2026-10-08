import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-[0.8rem] border border-input bg-background/70 px-3.5 py-3 text-base leading-relaxed shadow-[inset_0_1px_2px_oklch(0.215_0.045_258/0.04)] transition-[color,box-shadow,border-color,background-color] duration-200 outline-none placeholder:text-muted-foreground/70 disabled:cursor-not-allowed disabled:opacity-50 md:text-[0.95rem]",
        "hover:border-foreground/25 focus-visible:border-brand/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-brand/12",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
