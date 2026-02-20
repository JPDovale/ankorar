import { useOrganizations } from "@/hooks/useOrganizations";
import { useCurrentSubscription } from "@/hooks/useSubscription";
import type { OrganizationInvitePreview } from "@/services/organizations/listOrganizationInvitesRequest";
import type { OrganizationOption } from "@/types/auth";
import { getOrganizationSlug } from "@/utils/getOrganizationSlug";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export function useOrganizationSwitcher() {
  const { data: subscription } = useCurrentSubscription();
  const {
    organizations: organizationsPreview,
    organizationInvites,
    isLoadingOrganizations,
    isLoadingOrganizationInvites,
    acceptOrganizationInvite,
    rejectOrganizationInvite,
    switchOrganizationContext,
    createOrganization,
    isAcceptingOrganizationInvite,
    isRejectingOrganizationInvite,
    isSwitchingOrganizationContext,
    isCreatingOrganization,
  } = useOrganizations();
  const [handlingInviteId, setHandlingInviteId] = useState<string | null>(null);
  const [createOrganizationDialogOpen, setCreateOrganizationDialogOpen] = useState(false);

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

  const organizationsCreatedCount = useMemo(
    () => organizationsPreview.filter((o) => o.role === "Owner").length,
    [organizationsPreview],
  );
  const maxOrganizationsCreate = subscription?.limits?.max_organizations_create ?? 1;
  const canCreateOrganization = organizationsCreatedCount < maxOrganizationsCreate;
  const createOrganizationLimitLabel =
    maxOrganizationsCreate < 999
      ? `Limite do plano: ${organizationsCreatedCount}/${maxOrganizationsCreate} organizações criadas.`
      : undefined;

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

  async function handleCreateOrganization(payload: { name: string }) {
    const result = await createOrganization(payload);
    if (result.success && result.organizationId) {
      await switchOrganizationContext({
        organization_id: result.organizationId,
      });
      toast.success("Organização criada. Você está nela agora.");
    }
    return result;
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
    createOrganizationDialogOpen,
    setCreateOrganizationDialogOpen,
    handleCreateOrganization,
    isCreatingOrganization,
    canCreateOrganization,
    createOrganizationLimitLabel,
  };
}
