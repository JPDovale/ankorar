import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { OrganizationOption } from "@/types/auth";
import { Check, ChevronsUpDown } from "lucide-react";

interface OrganizationSwitcherProps {
  organizations: OrganizationOption[];
  selectedOrgId: string;
  onSelectOrganization: (orgId: string) => void;
}

export function OrganizationSwitcher({
  organizations,
  selectedOrgId,
  onSelectOrganization,
}: OrganizationSwitcherProps) {
  const selectedOrganization =
    organizations.find((organization) => organization.id === selectedOrgId) ??
    organizations[0];

  if (!selectedOrganization) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 gap-3 px-2 sm:px-3">
          <span className="flex size-7 items-center justify-center rounded-md bg-zinc-950 text-xs font-semibold text-zinc-50">
            {selectedOrganization.slug.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden flex-col text-left sm:flex">
            <span className="text-xs text-zinc-500">Organizacao</span>
            <span className="text-sm font-medium leading-none">
              {selectedOrganization.name}
            </span>
          </span>
          <ChevronsUpDown className="size-4 opacity-70" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[320px] p-2">
        <div className="px-2 py-1">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Trocar organizacao
          </p>
        </div>

        <div className="space-y-1">
          {organizations.map((organization) => {
            const isSelected = organization.id === selectedOrgId;

            return (
              <button
                key={organization.id}
                type="button"
                onClick={() => onSelectOrganization(organization.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-2 text-left transition-colors",
                  isSelected ? "bg-zinc-900 text-zinc-50" : "hover:bg-zinc-100",
                )}
              >
                <span className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md text-xs font-semibold",
                      isSelected
                        ? "bg-zinc-700 text-zinc-50"
                        : "bg-zinc-200 text-zinc-700",
                    )}
                  >
                    {organization.slug.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium">
                      {organization.name}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        isSelected ? "text-zinc-300" : "text-zinc-500",
                      )}
                    >
                      {organization.role}
                    </span>
                  </span>
                </span>

                {isSelected ? <Check className="size-4" /> : null}
              </button>
            );
          })}
        </div>

        <Separator className="my-2" />

        <p className="px-2 pb-1 text-xs text-zinc-500">
          Switcher pronto no frontend. A API ainda nao expoe listagem/troca de
          organizacoes.
        </p>
      </PopoverContent>
    </Popover>
  );
}
