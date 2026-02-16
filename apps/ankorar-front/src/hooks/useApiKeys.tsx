import { useCallback } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { createApiKeyRequest } from "@/services/organizations/createApiKeyRequest";
import { deleteApiKeyRequest } from "@/services/organizations/deleteApiKeyRequest";
import {
  listApiKeysRequest,
  type ApiKeyPreview,
} from "@/services/organizations/listApiKeysRequest";
import { revokeApiKeyRequest } from "@/services/organizations/revokeApiKeyRequest";

export const apiKeysQueryKey = ["api-keys"] as const;

async function listApiKeysQueryFn(): Promise<{ apiKeys: ApiKeyPreview[] }> {
  const response = await listApiKeysRequest();

  if (response.status === 200 && response.data?.api_keys) {
    return { apiKeys: response.data.api_keys };
  }

  return { apiKeys: [] };
}

function buildApiKeysQueryConfig() {
  return {
    queryKey: apiKeysQueryKey,
    queryFn: listApiKeysQueryFn,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  };
}

interface CreateApiKeyMutationResult {
  success: boolean;
  apiKeyText: string | null;
}

interface CreateApiKeyMutationPayload {
  expires_at?: string | null;
}

async function createApiKeyMutationFn(
  payload?: CreateApiKeyMutationPayload,
): Promise<CreateApiKeyMutationResult> {
  const response = await createApiKeyRequest(payload);

  if (response.status !== 201) {
    toast.error(
      response.error?.message ?? "Não foi possível gerar a chave de API.",
      {
        action: response.error?.action,
      },
    );

    return {
      success: false,
      apiKeyText: null,
    };
  }

  return {
    success: true,
    apiKeyText: response.data?.api_key ?? null,
  };
}

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

export function useSuspenseApiKeys() {
  return useSuspenseQuery(buildApiKeysQueryConfig());
}

export function useApiKeys() {
  const queryClient = useQueryClient();

  const apiKeysQuery = useSuspenseQuery(buildApiKeysQueryConfig());

  const createApiKeyMutation = useMutation({
    mutationFn: createApiKeyMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey,
      });
    },
  });

  const revokeApiKeyMutation = useMutation({
    mutationFn: revokeApiKeyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey,
      });
    },
  });

  const deleteApiKeyMutation = useMutation({
    mutationFn: deleteApiKeyRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: apiKeysQueryKey,
      });
    },
  });

  const createApiKey = useCallback(
    async (
      payload?: CreateApiKeyMutationPayload,
    ): Promise<CreateApiKeyMutationResult> => {
      return createApiKeyMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
          apiKeyText: null,
        };
      });
    },
    [createApiKeyMutation],
  );

  const revokeApiKey = useCallback(
    async (apiKeyId: string): Promise<boolean> => {
      try {
        const response = await revokeApiKeyMutation.mutateAsync(apiKeyId);

        if (response.status !== 200) {
          toast.error(
            (response as { error?: { message?: string } }).error?.message ??
              "Não foi possível revogar a chave.",
          );
          return false;
        }

        toast.success("Chave revogada.");
        return true;
      } catch {
        toast.error("Não foi possível revogar a chave.");
        return false;
      }
    },
    [revokeApiKeyMutation],
  );

  const deleteApiKey = useCallback(
    async (apiKeyId: string): Promise<boolean> => {
      try {
        const response = await deleteApiKeyMutation.mutateAsync(apiKeyId);

        if (response.status !== 200) {
          toast.error(
            (response as { error?: { message?: string } }).error?.message ??
              "Não foi possível excluir a chave.",
          );
          return false;
        }

        toast.success("Chave excluída.");
        return true;
      } catch {
        toast.error("Não foi possível excluir a chave.");
        return false;
      }
    },
    [deleteApiKeyMutation],
  );

  return {
    apiKeys: apiKeysQuery.data.apiKeys ?? [],
    refetchApiKeys: apiKeysQuery.refetch,
    createApiKey,
    revokeApiKey,
    deleteApiKey,
    isCreatingApiKey: createApiKeyMutation.isPending,
    isRevokingApiKey: revokeApiKeyMutation.isPending,
    isDeletingApiKey: deleteApiKeyMutation.isPending,
  };
}
