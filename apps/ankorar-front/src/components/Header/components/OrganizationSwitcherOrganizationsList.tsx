import type { OrganizationOption } from "@/types/auth";
import { Check, LoaderCircle } from "lucide-react";

interface OrganizationSwitcherOrganizationsListProps {
  organizations: OrganizationOption[];
  selectedOrgId: string;
  isSwitchingOrganization: boolean;
  onSelectOrganization: (orgId: string) => void;
}

export function OrganizationSwitcherOrganizationsList({
  organizations,
  selectedOrgId,
  isSwitchingOrganization,
  onSelectOrganization,
}: OrganizationSwitcherOrganizationsListProps) {
  return (
    <div className="space-y-1 px-2 py-2">
      {organizations.map((organization) => {
        const isSelected = organization.id === selectedOrgId;
        const isCurrentSelectionLoading = isSelected && isSwitchingOrganization;

        return (
          <button
            key={organization.id}
            type="button"
            data-selected={isSelected}
            onClick={() => onSelectOrganization(organization.id)}
            disabled={isSwitchingOrganization}
            className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-zinc-900 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 data-[selected=true]:bg-violet-400 data-[selected=true]:text-white"
          >
            <span className="flex items-center gap-2.5">
              <span
                data-selected={isSelected}
                className="flex size-7 items-center justify-center rounded-md bg-zinc-200 text-[11px] font-semibold text-zinc-700 data-[selected=true]:bg-violet-500 data-[selected=true]:text-white"
              >
                {organization.slug.slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex flex-col">
                <span
                  data-selected={isSelected}
                  className="truncate text-sm font-medium leading-tight text-zinc-900 data-[selected=true]:text-white"
                >
                  {organization.name}
                </span>
                <span
                  data-selected={isSelected}
                  className="text-[11px] leading-tight text-zinc-500 data-[selected=true]:text-zinc-300"
                >
                  {organization.role}
                </span>
              </span>
            </span>

            <span className="flex size-4 items-center justify-center">
              {isCurrentSelectionLoading && (
                <LoaderCircle className="size-3.5 animate-spin" />
              )}
              {isSelected && !isCurrentSelectionLoading && (
                <Check className="size-3.5" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
