import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Standardized Input Component (Professional Geist Module)
 * Implements height 40px, radius 6px, and 14px font size.
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-[6px] border-none bg-white px-3 py-2 text-[14px] ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground placeholder:text-muted-foreground/40 placeholder:font-normal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
          className
        )}
        ref={ref}
        style={{ fontSynthesis: 'none' }}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
