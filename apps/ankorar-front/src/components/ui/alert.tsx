import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const alertVariants = {
  amber:
    "bg-amber-400/15 border-amber-400/30 text-amber-700",
  success:
    "bg-ds-success/12 border-ds-success/25 text-[#2d8f5f]",
  danger:
    "bg-ds-danger/12 border-ds-danger/25 text-[#c94a4a]",
  info:
    "bg-ds-info/12 border-ds-info/25 text-[#2e7ba8]",
} as const;

function Alert({
  className,
  variant = "amber",
  icon: Icon,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: keyof typeof alertVariants;
  icon?: LucideIcon;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-4 items-start p-4 py-5 rounded-xl border text-sm mb-3",
        alertVariants[variant],
        className
      )}
      {...props}
    >
      {Icon && (
        <span className="text-lg shrink-0 mt-0.5">
          <Icon className="size-5" />
        </span>
      )}
      <div className="min-w-0">{props.children}</div>
    </div>
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("font-bold text-sm mb-0.5", className)}
      {...props}
    />
  );
}

function AlertBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("opacity-90 text-xs leading-relaxed", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertBody, alertVariants };
