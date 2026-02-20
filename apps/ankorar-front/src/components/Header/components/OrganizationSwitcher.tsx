import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import { OrganizationSwitcherOrganizationsList } from "./OrganizationSwitcherOrganizationsList";
import { OrganizationSwitcherPendingInvites } from "./OrganizationSwitcherPendingInvites";
import { OrganizationSwitcherTrigger } from "./OrganizationSwitcherTrigger";
import { useOrganizationSwitcher } from "../hooks/useOrganizationSwitcher";

export function OrganizationSwitcher() {
  const {
    organizations,
    selectedOrgId,
    selectedOrganization,
    invites,
    handlingInviteId,
    showLoadingOrganizations,
    showOrganizationSwitcher,
    showEmptyOrganizationsState,
    shouldShowPendingInvites,
    isLoadingInvites,
    isSwitchingOrganization,
    isAcceptingInvite,
    isRejectingInvite,
    handleSelectOrganization,
    handleAcceptInvite,
    handleRejectInvite,
    createOrganizationDialogOpen,
    setCreateOrganizationDialogOpen,
    handleCreateOrganization,
    isCreatingOrganization,
    canCreateOrganization,
    createOrganizationLimitLabel,
  } = useOrganizationSwitcher();

  return (
    <>
      {showLoadingOrganizations && (
        <Button variant="outline" className="h-10 gap-3 px-3" disabled>
          Carregando organizações...
        </Button>
      )}

      {showEmptyOrganizationsState && (
        <Button
          variant="outline"
          className="h-10 gap-3 px-3"
          onClick={() => canCreateOrganization && setCreateOrganizationDialogOpen(true)}
          disabled={!canCreateOrganization}
        >
          {canCreateOrganization
            ? "Criar organização"
            : "Limite de organizações atingido"}
        </Button>
      )}

      {showOrganizationSwitcher && selectedOrganization && (
        <Popover>
          <PopoverTrigger asChild>
            <OrganizationSwitcherTrigger
              selectedOrganization={selectedOrganization}
            />
          </PopoverTrigger>

          <PopoverContent
            align="start"
            sideOffset={8}
            className="w-[340px] overflow-hidden border-zinc-200 p-0"
          >
            <div className="border-b border-zinc-200 bg-zinc-50/80 px-3 py-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
                Organizações
              </p>
            </div>

            <OrganizationSwitcherOrganizationsList
              organizations={organizations}
              selectedOrgId={selectedOrgId}
              isSwitchingOrganization={isSwitchingOrganization}
              onSelectOrganization={handleSelectOrganization}
            />

            <div className="border-t border-zinc-200 px-2 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-zinc-600"
                onClick={() => setCreateOrganizationDialogOpen(true)}
                disabled={!canCreateOrganization}
              >
                <Plus className="size-4" />
                Criar organização
              </Button>
              {createOrganizationLimitLabel != null && (
                <p className="mt-1 px-2 text-[11px] text-zinc-500">
                  {createOrganizationLimitLabel}
                </p>
              )}
            </div>

            {isLoadingInvites && (
              <div className="border-t border-zinc-200 px-3 py-2">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32 rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              </div>
            )}

            {shouldShowPendingInvites && (
              <OrganizationSwitcherPendingInvites
                invites={invites}
                handlingInviteId={handlingInviteId}
                isAcceptingInvite={isAcceptingInvite}
                isRejectingInvite={isRejectingInvite}
                onAcceptInvite={handleAcceptInvite}
                onRejectInvite={handleRejectInvite}
              />
            )}
          </PopoverContent>
        </Popover>
      )}

      <CreateOrganizationDialog
        open={createOrganizationDialogOpen}
        onOpenChange={setCreateOrganizationDialogOpen}
        onSubmit={handleCreateOrganization}
        isCreating={isCreatingOrganization}
        limitReached={!canCreateOrganization}
        limitLabel={createOrganizationLimitLabel}
      />
    </>
  );
}
