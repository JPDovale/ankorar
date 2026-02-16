import { useCallback } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { createApiKeyRequest } from "@/services/organizations/createApiKeyRequest";
import {
  listApiKeysRequest,
  type ApiKeyPreview,
} from "@/services/organizations/listApiKeysRequest";

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

async function createApiKeyMutationFn(): Promise<CreateApiKeyMutationResult> {
  const response = await createApiKeyRequest();

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

  const createApiKey =
    useCallback(async (): Promise<CreateApiKeyMutationResult> => {
      return createApiKeyMutation.mutateAsync().catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
          apiKeyText: null,
        };
      });
    }, [createApiKeyMutation]);

  return {
    apiKeys: apiKeysQuery.data.apiKeys ?? [],
    refetchApiKeys: apiKeysQuery.refetch,
    createApiKey,
    isCreatingApiKey: createApiKeyMutation.isPending,
  };
}
