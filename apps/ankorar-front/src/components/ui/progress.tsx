import * as React from "react";
import { cn } from "@/lib/utils";

const progressFillVariants = {
  amber: "bg-gradient-to-r from-amber-500 to-amber-200",
  success: "bg-ds-success",
  info: "bg-ds-info",
  muted: "bg-navy-500",
} as const;

function ProgressRoot({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-navy-200/50 bg-ds-surface-elevated p-6",
        className
      )}
      {...props}
    />
  );
}

function ProgressItem({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("", className)} {...props} />;
}

function ProgressHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex justify-between mb-2", className)} {...props} />
  );
}

function ProgressName({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-sm font-semibold text-text-primary", className)}
      {...props}
    />
  );
}

function ProgressPct({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-xs font-bold text-text-muted font-syne-mono", className)}
      {...props}
    />
  );
}

function ProgressTrack({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "h-1.5 rounded-full bg-navy-200/50 overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

function ProgressFill({
  className,
  variant = "amber",
  style,
  value = 0,
  ...props
}: React.ComponentProps<"div"> & {
  variant?: keyof typeof progressFillVariants;
  value?: number;
}) {
  const width = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "h-full rounded-full transition-[width] duration-[0.8s] ease-out",
        progressFillVariants[variant],
        className
      )}
      style={{ width: `${width}%`, ...style }}
      {...props}
    />
  );
}

export {
  ProgressRoot,
  ProgressItem,
  ProgressHeader,
  ProgressName,
  ProgressPct,
  ProgressTrack,
  ProgressFill,
  progressFillVariants,
};
