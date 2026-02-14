import { Button } from "@/components/ui/button";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useSideBar } from "@/hooks/useSideBar";
import type { OrganizationOption } from "@/types/auth";
import { PanelLeftOpen } from "lucide-react";
import { useMemo } from "react";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

function getOrganizationSlug(name: string, id: string) {
  const letters = name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toLowerCase();

  if (letters.length > 0) {
    return letters;
  }

  return id.slice(0, 2).toLowerCase();
}

export function Header() {
  const {
    organizations: organizationsPreview,
    organizationInvites,
    isLoadingOrganizations,
    isLoadingOrganizationInvites,
    createOrganizationInvite,
    acceptOrganizationInvite,
    rejectOrganizationInvite,
    switchOrganizationContext,
    isCreatingOrganizationInvite,
    isAcceptingOrganizationInvite,
    isRejectingOrganizationInvite,
    isSwitchingOrganizationContext,
  } = useOrganizations();
  const { collapsed, toggleCollapsed } = useSideBar();

  const organizations = useMemo<OrganizationOption[]>(() => {
    return organizationsPreview.map((organization) => ({
      id: organization.id,
      name: organization.name,
      role: organization.role,
      slug: getOrganizationSlug(organization.name, organization.id),
    }));
  }, [organizationsPreview]);

  const currentOrganizationId =
    organizationsPreview.find((organization) => organization.is_current)?.id ??
    "";

  const selectedOrgId = useMemo(() => {
    if (organizations.length === 0) {
      return "";
    }

    if (currentOrganizationId) {
      return currentOrganizationId;
    }

    return organizations[0].id;
  }, [currentOrganizationId, organizations]);

  async function handleSelectOrganization(orgId: string) {
    if (orgId === selectedOrgId || isSwitchingOrganizationContext) {
      return;
    }

    await switchOrganizationContext({
      organization_id: orgId,
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <div className="flex h-16 items-center px-4 sm:px-4">
        <div className="flex items-center gap-2">
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              onClick={toggleCollapsed}
              aria-label="Expandir sidebar"
            >
              <PanelLeftOpen className="size-4" />
            </Button>
          )}
          {isLoadingOrganizations ? (
            <Button variant="outline" className="h-10 gap-3 px-3" disabled>
              Carregando organizações...
            </Button>
          ) : organizations.length > 0 ? (
            <OrganizationSwitcher
              organizations={organizations}
              selectedOrgId={selectedOrgId}
              onSelectOrganization={handleSelectOrganization}
              isSwitchingOrganization={isSwitchingOrganizationContext}
              invites={organizationInvites}
              isLoadingInvites={isLoadingOrganizationInvites}
              createInvite={createOrganizationInvite}
              acceptInvite={acceptOrganizationInvite}
              rejectInvite={rejectOrganizationInvite}
              isCreatingInvite={isCreatingOrganizationInvite}
              isAcceptingInvite={isAcceptingOrganizationInvite}
              isRejectingInvite={isRejectingOrganizationInvite}
            />
          ) : (
            <Button variant="outline" className="h-10 gap-3 px-3" disabled>
              Sem organizações
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
