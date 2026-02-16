import { useOrganizations } from "@/hooks/useOrganizations";
import type { OrganizationInvitePreview } from "@/services/organizations/listOrganizationInvitesRequest";
import type { OrganizationOption } from "@/types/auth";
import { getOrganizationSlug } from "@/utils/getOrganizationSlug";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function useOrganizationSwitcher() {
  const {
    organizations: organizationsPreview,
    organizationInvites,
    isLoadingOrganizations,
    isLoadingOrganizationInvites,
    acceptOrganizationInvite,
    rejectOrganizationInvite,
    switchOrganizationContext,
    isAcceptingOrganizationInvite,
    isRejectingOrganizationInvite,
    isSwitchingOrganizationContext,
  } = useOrganizations();
  const [handlingInviteId, setHandlingInviteId] = useState<string | null>(null);

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

  const selectedOrganization = useMemo(() => {
    return (
      organizations.find((organization) => organization.id === selectedOrgId) ??
      organizations[0] ??
      null
    );
  }, [organizations, selectedOrgId]);

  const showLoadingOrganizations = isLoadingOrganizations;
  const showOrganizationSwitcher =
    !isLoadingOrganizations && organizations.length > 0;
  const showEmptyOrganizationsState =
    !isLoadingOrganizations && organizations.length === 0;
  const shouldShowPendingInvites =
    !isLoadingOrganizationInvites && organizationInvites.length > 0;

  async function handleInviteAction(
    invite: OrganizationInvitePreview,
    action: (payload: { inviteId: string }) => Promise<{ success: boolean }>,
    successVerb: string,
  ) {
    setHandlingInviteId(invite.id);
    const { success } = await action({
      inviteId: invite.id,
    });
    setHandlingInviteId(null);

    if (!success) {
      return;
    }

    toast.success(
      `Convite da organização "${invite.organization.name}" ${successVerb}.`,
    );
  }

  async function handleSelectOrganization(orgId: string) {
    if (orgId === selectedOrgId || isSwitchingOrganizationContext) {
      return;
    }

    await switchOrganizationContext({
      organization_id: orgId,
    });
  }

  return {
    organizations,
    selectedOrgId,
    selectedOrganization,
    invites: organizationInvites,
    handlingInviteId,
    showLoadingOrganizations,
    showOrganizationSwitcher,
    showEmptyOrganizationsState,
    shouldShowPendingInvites,
    isLoadingInvites: isLoadingOrganizationInvites,
    isSwitchingOrganization: isSwitchingOrganizationContext,
    isAcceptingInvite: isAcceptingOrganizationInvite,
    isRejectingInvite: isRejectingOrganizationInvite,
    handleSelectOrganization,
    handleAcceptInvite: (invite: OrganizationInvitePreview) => {
      void handleInviteAction(invite, acceptOrganizationInvite, "aceito");
    },
    handleRejectInvite: (invite: OrganizationInvitePreview) => {
      void handleInviteAction(invite, rejectOrganizationInvite, "rejeitado");
    },
  };
}
