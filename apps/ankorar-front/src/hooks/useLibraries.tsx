import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createLibraryRequest,
  type CreateLibraryRequestBody,
} from "@/services/libraries/createLibraryRequest";
import {
  listLibrariesRequest,
  type LibraryPreview,
} from "@/services/libraries/listLibrariesRequest";
import { toast } from "sonner";

export const librariesQueryKey = ["libraries"] as const;

interface CreateLibraryMutationResult {
  success: boolean;
}

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function createLibraryMutationFn(
  payload: CreateLibraryRequestBody,
): Promise<CreateLibraryMutationResult> {
  const response = await createLibraryRequest(payload);

  if (response.status !== 201) {
    toast.error(
      response.error?.message ?? "Não foi possível criar a biblioteca.",
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

async function listLibrariesQueryFn(): Promise<LibraryPreview[]> {
  const response = await listLibrariesRequest();

  if (response.status === 200 && response.data?.libraries) {
    return response.data.libraries;
  }

  return [];
}

export function useLibraries() {
  const queryClient = useQueryClient();

  const librariesQuery = useQuery({
    queryKey: librariesQueryKey,
    queryFn: listLibrariesQueryFn,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createLibraryMutation = useMutation({
    mutationFn: createLibraryMutationFn,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: librariesQueryKey,
        });
      }
    },
  });

  const createLibrary = useCallback(
    async (
      payload: CreateLibraryRequestBody,
    ): Promise<CreateLibraryMutationResult> => {
      return createLibraryMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
        };
      });
    },
    [createLibraryMutation],
  );

  return {
    libraries: librariesQuery.data ?? [],
    isLoadingLibraries: librariesQuery.isPending,
    refetchLibraries: librariesQuery.refetch,
    createLibrary,
    isCreatingLibrary: createLibraryMutation.isPending,
  };
}
