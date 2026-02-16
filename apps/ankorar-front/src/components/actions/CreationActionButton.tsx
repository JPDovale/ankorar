import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoaderCircle, type LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type CreationActionButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children"
> & {
  icon: LucideIcon;
  label: string;
  loading?: boolean;
  loadingLabel?: string;
};

export function CreationActionButton({
  icon: Icon,
  label,
  className,
  loading = false,
  loadingLabel,
  disabled,
  ...buttonProps
}: CreationActionButtonProps) {
  const buttonLabel = loading && loadingLabel ? loadingLabel : label;
  const isDisabled = disabled || loading;

  return (
    <Button
      disabled={isDisabled}
      className={cn(
        "rounded-lg px-5 shadow-[0_1px_2px_rgba(16,24,40,0.12)]",
        className,
      )}
      {...buttonProps}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" />}
      {!loading && <Icon className="size-4" />}
      {buttonLabel}
    </Button>
  );
}
