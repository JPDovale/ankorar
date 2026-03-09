import * as React from "react";
import { cn } from "@/lib/utils";

function Switch({
  className,
  checked = false,
  onCheckedChange,
  disabled,
  ...props
}: Omit<React.ComponentProps<"button">, "onClick"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "w-10 h-[22px] rounded-full relative transition-colors border shrink-0 cursor-pointer disabled:cursor-not-allowed",
        "bg-navy-200 border-navy-300/60",
        "after:content-[''] after:absolute after:size-4 after:rounded-full after:bg-ds-surface-elevated after:top-0.5 after:left-0.5 after:transition-transform after:shadow-sm",
        checked && "bg-amber-400 border-amber-400 after:translate-x-[18px]",
        className
      )}
      {...props}
    />
  );
}

function SwitchRow({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 cursor-pointer", className)}
      {...props}
    />
  );
}

function SwitchLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-sm font-medium text-text-secondary", className)}
      {...props}
    />
  );
}

export { Switch, SwitchRow, SwitchLabel };
