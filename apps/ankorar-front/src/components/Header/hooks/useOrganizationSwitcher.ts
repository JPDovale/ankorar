import { zodResolver } from "@hookform/resolvers/zod";
import { useOrganizations } from "@/hooks/useOrganizations";
import type { OrganizationInvitePreview } from "@/services/organizations/listOrganizationInvitesRequest";
import type { OrganizationOption } from "@/types/auth";
import { getOrganizationSlug } from "@/utils/getOrganizationSlug";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const organizationInviteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe um e-mail para enviar o convite.")
    .email("Informe um e-mail válido.")
    .max(256, "Use no máximo 256 caracteres."),
});

type OrganizationInviteFormValues = z.input<typeof organizationInviteSchema>;

export function useOrganizationSwitcher() {
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
  const [handlingInviteId, setHandlingInviteId] = useState<string | null>(null);
  const form = useForm<OrganizationInviteFormValues>({
    resolver: zodResolver(organizationInviteSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

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

  const handleCreateInvite = form.handleSubmit(
    async (values) => {
      const normalizedEmail = values.email.trim().toLowerCase();
      const { success } = await createOrganizationInvite({
        email: normalizedEmail,
      });

      if (!success) {
        return;
      }

      toast.success(`Convite enviado para ${normalizedEmail}.`);
      form.reset();
    },
    () => {
      const firstError = Object.values(form.formState.errors)[0];
      toast.error(
        typeof firstError?.message === "string"
          ? firstError.message
          : "Verifique os dados do formulário.",
      );
    },
  );

  return {
    organizations,
    selectedOrgId,
    selectedOrganization,
    invites: organizationInvites,
    form,
    handlingInviteId,
    showLoadingOrganizations,
    showOrganizationSwitcher,
    showEmptyOrganizationsState,
    shouldShowPendingInvites,
    isLoadingInvites: isLoadingOrganizationInvites,
    isSwitchingOrganization: isSwitchingOrganizationContext,
    isCreatingInvite: isCreatingOrganizationInvite,
    isAcceptingInvite: isAcceptingOrganizationInvite,
    isRejectingInvite: isRejectingOrganizationInvite,
    handleSelectOrganization,
    handleCreateInvite,
    handleAcceptInvite: (invite: OrganizationInvitePreview) => {
      void handleInviteAction(invite, acceptOrganizationInvite, "aceito");
    },
    handleRejectInvite: (invite: OrganizationInvitePreview) => {
      void handleInviteAction(invite, rejectOrganizationInvite, "rejeitado");
    },
  };
}
