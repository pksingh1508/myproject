import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground/70 selection:bg-hilite selection:text-ink h-11 w-full min-w-0 rounded-[0.8rem] border border-input bg-background/70 px-3.5 py-2 text-base shadow-[inset_0_1px_2px_oklch(0.215_0.045_258/0.04)] transition-[color,box-shadow,border-color,background-color] duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-[0.95rem]",
        "hover:border-foreground/25 focus-visible:border-brand/60 focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-brand/12",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
