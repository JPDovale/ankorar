import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OrganizationOption } from "@/types/auth";
import { ChevronsUpDown } from "lucide-react";
import type { ComponentProps } from "react";

interface OrganizationSwitcherTriggerProps extends Omit<
  ComponentProps<typeof Button>,
  "children"
> {
  selectedOrganization: OrganizationOption;
}

export function OrganizationSwitcherTrigger({
  selectedOrganization,
  className,
  ...props
}: OrganizationSwitcherTriggerProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-9 min-w-[13rem] justify-between rounded-lg border-navy-200/80 bg-white px-2 shadow-none hover:bg-navy-50/80",
        className,
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-amber-400/15 text-[11px] font-semibold text-amber-700">
          {selectedOrganization.slug.slice(0, 2).toUpperCase()}
        </span>
        <span className="truncate text-sm font-medium text-navy-900">
          {selectedOrganization.name}
        </span>
      </span>
      <ChevronsUpDown className="size-4 shrink-0 text-text-muted" />
    </Button>
  );
}
