import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function Checkbox({
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
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "size-[18px] rounded border-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed",
        "border-navy-300 bg-transparent",
        checked && "bg-amber-400 border-amber-400 text-navy-950",
        className
      )}
      {...props}
    >
      {checked && <Check className="size-[11px] font-extrabold" strokeWidth={3} />}
    </button>
  );
}

function CheckboxRow({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-3 cursor-pointer select-none", className)}
      {...props}
    />
  );
}

export { Checkbox, CheckboxRow };
