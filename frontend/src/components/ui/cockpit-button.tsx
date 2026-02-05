import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cockpitButtonVariants = cva(
  "relative inline-flex items-center justify-center gap-3 font-semibold text-base uppercase tracking-wider transition-all duration-200 disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        start: [
          "bg-primary",
          "text-primary-foreground",
          "rounded-lg",
          "hover:brightness-110",
          "active:scale-[0.98]",
        ].join(" "),
        stop: [
          "bg-destructive",
          "text-destructive-foreground",
          "rounded-lg",
          "hover:brightness-110",
          "active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        default: "h-14 px-12 py-4",
        lg: "h-16 px-16 py-5 text-lg",
        sm: "h-12 px-8 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "start",
      size: "default",
    },
  }
);

export interface CockpitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof cockpitButtonVariants> {}

const CockpitButton = React.forwardRef<HTMLButtonElement, CockpitButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <button
        className={cn(cockpitButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
CockpitButton.displayName = "CockpitButton";

export { CockpitButton, cockpitButtonVariants };
