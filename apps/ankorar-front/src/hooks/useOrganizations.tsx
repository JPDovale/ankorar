import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { acceptOrganizationInviteRequest } from "@/services/organizations/acceptOrganizationInviteRequest";
import {
  createOrganizationInviteRequest,
  type CreateOrganizationInviteRequestBody,
} from "@/services/organizations/createOrganizationInviteRequest";
import {
  listOrganizationInvitesRequest,
  type OrganizationInvitePreview,
} from "@/services/organizations/listOrganizationInvitesRequest";
import {
  createOrganizationRequest,
  type CreateOrganizationRequestBody,
} from "@/services/organizations/createOrganizationRequest";
import {
  listUserOrganizationsRequest,
  type OrganizationPreview,
} from "@/services/organizations/listUserOrganizationsRequest";
import { rejectOrganizationInviteRequest } from "@/services/organizations/rejectOrganizationInviteRequest";
import { librariesQueryKey } from "@/hooks/useLibraries";
import { mapsQueryKey } from "@/hooks/useMaps";
import {
  switchOrganizationContextRequest,
  type SwitchOrganizationContextRequestBody,
} from "@/services/organizations/switchOrganizationContextRequest";

export const organizationsQueryKey = ["organizations"] as const;
export const organizationInvitesQueryKey = ["organization-invites"] as const;
export const organizationMembersQueryKey = ["organization-members"] as const;

async function getOrganizationsQueryFn(): Promise<OrganizationPreview[]> {
  const response = await listUserOrganizationsRequest();

  if (response.status === 200 && response.data?.organizations) {
    return response.data.organizations;
  }

  return [];
}

async function getOrganizationInvitesQueryFn(): Promise<
  OrganizationInvitePreview[]
> {
  const response = await listOrganizationInvitesRequest();

  if (response.status === 200 && response.data?.invites) {
    return response.data.invites;
  }

  return [];
}

interface CreateOrganizationInviteMutationResult {
  success: boolean;
}

interface UpdateOrganizationInviteMutationResult {
  success: boolean;
}

interface SwitchOrganizationContextMutationResult {
  success: boolean;
}

interface CreateOrganizationMutationResult {
  success: boolean;
  organizationId?: string;
}

interface UpdateOrganizationInviteMutationPayload {
  inviteId: string;
}

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function createOrganizationInviteMutationFn(
  payload: CreateOrganizationInviteRequestBody,
): Promise<CreateOrganizationInviteMutationResult> {
  const response = await createOrganizationInviteRequest(payload);

  if (response.status !== 201) {
    toast.error(
      response.error?.message ?? "Não foi possível enviar o convite.",
      {
        action: response.error?.action,
      },
    );

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function acceptOrganizationInviteMutationFn(
  payload: UpdateOrganizationInviteMutationPayload,
): Promise<UpdateOrganizationInviteMutationResult> {
  const response = await acceptOrganizationInviteRequest({
    inviteId: payload.inviteId,
  });

  if (response.status !== 200) {
    toast.error(
      response.error?.message ?? "Não foi possível aceitar o convite.",
      {
        action: response.error?.action,
      },
    );

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function rejectOrganizationInviteMutationFn(
  payload: UpdateOrganizationInviteMutationPayload,
): Promise<UpdateOrganizationInviteMutationResult> {
  const response = await rejectOrganizationInviteRequest({
    inviteId: payload.inviteId,
  });

  if (response.status !== 200) {
    toast.error(
      response.error?.message ?? "Não foi possível rejeitar o convite.",
      {
        action: response.error?.action,
      },
    );

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function createOrganizationMutationFn(
  payload: CreateOrganizationRequestBody,
): Promise<CreateOrganizationMutationResult> {
  const response = await createOrganizationRequest(payload);

  if (response.status !== 201) {
    toast.error(
      response.error?.message ?? "Não foi possível criar a organização.",
      {
        action: response.error?.action,
      },
    );

    return {
      success: false,
    };
  }

  const organizationId =
    response.data && "organization_id" in response.data
      ? response.data.organization_id
      : undefined;

  return {
    success: true,
    organizationId,
  };
}

async function switchOrganizationContextMutationFn(
  payload: SwitchOrganizationContextRequestBody,
): Promise<SwitchOrganizationContextMutationResult> {
  const response = await switchOrganizationContextRequest(payload);

  if (response.status !== 200) {
    toast.error(
      response.error?.message ??
        "Não foi possível trocar o contexto da organização.",
      {
        action: response.error?.action,
      },
    );

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

interface UseOrganizationsParams {
  enabled?: boolean;
}

export function useOrganizations(params: UseOrganizationsParams = {}) {
  const { enabled = true } = params;
  const queryClient = useQueryClient();

  const organizationsQuery = useQuery({
    queryKey: organizationsQueryKey,
    queryFn: getOrganizationsQueryFn,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const invitesQuery = useQuery({
    queryKey: organizationInvitesQueryKey,
    queryFn: getOrganizationInvitesQueryFn,
    enabled,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createOrganizationInviteMutation = useMutation({
    mutationFn: createOrganizationInviteMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: organizationInvitesQueryKey,
      });
    },
  });

  const acceptOrganizationInviteMutation = useMutation({
    mutationFn: acceptOrganizationInviteMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: organizationsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: organizationInvitesQueryKey,
      });
    },
  });

  const rejectOrganizationInviteMutation = useMutation({
    mutationFn: rejectOrganizationInviteMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: organizationInvitesQueryKey,
      });
    },
  });

  const createOrganizationMutation = useMutation({
    mutationFn: createOrganizationMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: organizationsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: organizationInvitesQueryKey,
      });
    },
  });

  const switchOrganizationContextMutation = useMutation({
    mutationFn: switchOrganizationContextMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      // Invalida apenas dados que dependem do contexto da org. Não invalida user
      // para evitar refetch imediato que pode usar cookies antigos e causar redirect ao login.
      queryClient.invalidateQueries({
        queryKey: organizationsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: mapsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: librariesQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: organizationInvitesQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: organizationMembersQueryKey,
      });
    },
  });

  const createOrganizationInvite = useCallback(
    async (
      payload: CreateOrganizationInviteRequestBody,
    ): Promise<CreateOrganizationInviteMutationResult> => {
      return createOrganizationInviteMutation
        .mutateAsync(payload)
        .catch((error) => {
          toast.error(extractUnexpectedErrorMessage(error));

          return {
            success: false,
          };
        });
    },
    [createOrganizationInviteMutation],
  );

  const acceptOrganizationInvite = useCallback(
    async (
      payload: UpdateOrganizationInviteMutationPayload,
    ): Promise<UpdateOrganizationInviteMutationResult> => {
      return acceptOrganizationInviteMutation
        .mutateAsync(payload)
        .catch((error) => {
          toast.error(extractUnexpectedErrorMessage(error));

          return {
            success: false,
          };
        });
    },
    [acceptOrganizationInviteMutation],
  );

  const rejectOrganizationInvite = useCallback(
    async (
      payload: UpdateOrganizationInviteMutationPayload,
    ): Promise<UpdateOrganizationInviteMutationResult> => {
      return rejectOrganizationInviteMutation
        .mutateAsync(payload)
        .catch((error) => {
          toast.error(extractUnexpectedErrorMessage(error));

          return {
            success: false,
          };
        });
    },
    [rejectOrganizationInviteMutation],
  );

  const createOrganization = useCallback(
    async (
      payload: CreateOrganizationRequestBody,
    ): Promise<CreateOrganizationMutationResult> => {
      return createOrganizationMutation
        .mutateAsync(payload)
        .catch((error) => {
          toast.error(extractUnexpectedErrorMessage(error));

          return {
            success: false,
          };
        });
    },
    [createOrganizationMutation],
  );

  const switchOrganizationContext = useCallback(
    async (
      payload: SwitchOrganizationContextRequestBody,
    ): Promise<SwitchOrganizationContextMutationResult> => {
      return switchOrganizationContextMutation
        .mutateAsync(payload)
        .catch((error) => {
          toast.error(extractUnexpectedErrorMessage(error));

          return {
            success: false,
          };
        });
    },
    [switchOrganizationContextMutation],
  );

  return {
    organizations: organizationsQuery.data ?? [],
    organizationInvites: invitesQuery.data ?? [],
    isLoadingOrganizations: organizationsQuery.isPending,
    isLoadingOrganizationInvites: invitesQuery.isPending,
    refetchOrganizations: organizationsQuery.refetch,
    refetchOrganizationInvites: invitesQuery.refetch,
    createOrganization,
    createOrganizationInvite,
    acceptOrganizationInvite,
    rejectOrganizationInvite,
    switchOrganizationContext,
    isCreatingOrganization: createOrganizationMutation.isPending,
    isCreatingOrganizationInvite: createOrganizationInviteMutation.isPending,
    isAcceptingOrganizationInvite: acceptOrganizationInviteMutation.isPending,
    isRejectingOrganizationInvite: rejectOrganizationInviteMutation.isPending,
    isSwitchingOrganizationContext: switchOrganizationContextMutation.isPending,
  };
}
