import { useCallback } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useOrganizations } from "@/hooks/useOrganizations";
import { cancelOrganizationInviteRequest } from "@/services/organizations/cancelOrganizationInviteRequest";
import {
  listOrganizationMembersRequest,
  type OrganizationMemberPreview,
} from "@/services/organizations/listOrganizationMembersRequest";
import { removeMemberRequest } from "@/services/organizations/removeMemberRequest";
import type { OrganizationMember } from "../models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

export const organizationMembersQueryKey = ["organization-members"] as const;

const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe um e-mail para enviar o convite.")
    .email("Informe um e-mail valido.")
    .max(256, "Use no maximo 256 caracteres."),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

function mapPreviewToMember(
  preview: OrganizationMemberPreview,
): OrganizationMember {
  return {
    id: preview.id,
    type: preview.type,
    name: preview.name,
    email: preview.email,
    role: preview.role,
    status: preview.status,
  };
}

async function listOrganizationMembersQueryFn(): Promise<{
  members: OrganizationMember[];
}> {
  const response = await listOrganizationMembersRequest();

  if (response.status === 200 && response.data?.members) {
    return { members: response.data.members.map(mapPreviewToMember) };
  }

  return { members: [] };
}

function buildOrganizationMembersQueryConfig() {
  return {
    queryKey: organizationMembersQueryKey,
    queryFn: listOrganizationMembersQueryFn,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  };
}

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

export function useOrganizationMembers() {
  const queryClient = useQueryClient();
  const { createOrganizationInvite, isCreatingOrganizationInvite } =
    useOrganizations();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const form = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const membersQuery = useSuspenseQuery(buildOrganizationMembersQueryConfig());
  const members = membersQuery.data.members ?? [];

  const removeMemberMutation = useMutation({
    mutationFn: async ({ member }: { member: OrganizationMember }) => {
      if (member.type === "member") {
        return removeMemberRequest(member.id);
      }

      return cancelOrganizationInviteRequest(member.id);
    },
    onSuccess: (_, variables) => {
      if (variables.member.status === "invited") {
        toast.success("Convite cancelado.");
      } else {
        toast.success("Membro removido da organização.");
      }

      queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey,
      });
    },
  });

  async function onValidInviteSubmit(values: InviteMemberFormValues) {
    const normalizedEmail = values.email.trim().toLowerCase();
    const { success } = await createOrganizationInvite({
      email: normalizedEmail,
    });

    if (!success) {
      return;
    }

    toast.success(`Convite enviado para ${normalizedEmail}.`);
    form.reset();
    setIsInviteDialogOpen(false);

    queryClient.invalidateQueries({
      queryKey: organizationMembersQueryKey,
    });
  }

  function handleInviteMember() {
    setIsInviteDialogOpen(true);
  }

  function handleCloseInviteDialog() {
    setIsInviteDialogOpen(false);
  }

  const handleInviteSubmit = form.handleSubmit(onValidInviteSubmit, () => {
    const firstError = Object.values(form.formState.errors)[0];
    toast.error(
      typeof firstError?.message === "string"
        ? firstError.message
        : "Verifique os dados do formulario.",
    );
  });

  function handleChangeMemberRole(member: OrganizationMember) {
    toast.info(`Placeholder: alterar perfil do usuario "${member.name}".`);
  }

  const handleRemoveMember = useCallback(
    async (member: OrganizationMember) => {
      return removeMemberMutation.mutateAsync({ member }).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));
      });
    },
    [removeMemberMutation],
  );

  return {
    handleChangeMemberRole,
    handleCloseInviteDialog,
    handleInviteMember,
    handleInviteSubmit,
    handleRemoveMember,
    inviteForm: form,
    isInviteDialogOpen,
    isCreatingInvite: isCreatingOrganizationInvite,
    isRemovingMember: removeMemberMutation.isPending,
    members,
  };
}
