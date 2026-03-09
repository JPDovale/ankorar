import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-bold tracking-wide px-2.5 py-0.5 border",
  {
    variants: {
      variant: {
        default:
          "border-amber-400/30 bg-amber-400/15 text-amber-600 dark:border-amber-500/35 dark:bg-amber-400/12 dark:text-amber-300",
        secondary:
          "border-navy-200/60 bg-navy-100/80 text-text-secondary dark:border-navy-700/60 dark:bg-navy-800/70 dark:text-navy-200",
        outline: "border-border text-foreground dark:border-navy-700/60 dark:text-navy-100",
        amber:
          "border-amber-400/30 bg-amber-400/15 text-amber-600 dark:border-amber-500/35 dark:bg-amber-400/12 dark:text-amber-300",
        success:
          "border-ds-success/25 bg-ds-success/12 text-ds-success dark:border-emerald-500/35 dark:bg-emerald-400/10 dark:text-emerald-300",
        danger:
          "border-ds-danger/25 bg-ds-danger/12 text-ds-danger dark:border-red-500/35 dark:bg-red-400/10 dark:text-red-300",
        info: "border-ds-info/25 bg-ds-info/12 text-ds-info dark:border-sky-500/35 dark:bg-sky-400/10 dark:text-sky-300",
        neutral:
          "border-navy-200/60 bg-navy-100/80 text-text-secondary dark:border-navy-700/60 dark:bg-navy-800/70 dark:text-navy-200",
      },
      dot: {
        true: "pl-1.5",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      dot: false,
    },
  },
);

function Badge({
  className,
  variant,
  dot,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      className={cn(badgeVariants({ variant, dot }), className)}
      {...props}
    >
      {dot && (
        <span
          className="size-1.5 rounded-full bg-current shrink-0"
          aria-hidden
        />
      )}
      {props.children}
    </span>
  );
}

export { Badge, badgeVariants };
