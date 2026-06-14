import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-navy-700 to-navy-900 text-white hover:from-navy-600 hover:to-navy-800 shadow-card focus-visible:ring-navy-700",
  accent:
    "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-glow focus-visible:ring-accent",
  secondary:
    "bg-muted text-foreground hover:bg-graphite-100 focus-visible:ring-graphite-300",
  outline:
    "border border-border bg-card text-foreground hover:bg-muted focus-visible:ring-navy-300",
  ghost: "text-foreground hover:bg-muted focus-visible:ring-navy-300",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
  icon: "h-9 w-9",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
