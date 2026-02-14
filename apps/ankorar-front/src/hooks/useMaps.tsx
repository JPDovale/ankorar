import { useCallback } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { librariesQueryKey } from "@/hooks/useLibraries";
import { connectMapToLibraryRequest } from "@/services/libraries/connectMapToLibraryRequest";
import {
  createMapRequest,
  type CreateMapRequestBody,
} from "@/services/maps/createMapRequest";
import { deleteMapRequest } from "@/services/maps/deleteMapRequest";
import {
  listMapsRequest,
  type MapPreview,
} from "@/services/maps/listMapsRequest";
import { toast } from "sonner";

export const mapsQueryKey = ["maps"] as const;

interface CreateMapMutationResult {
  success: boolean;
}

interface DeleteMapMutationResult {
  success: boolean;
}

interface ConnectMapToLibraryMutationResult {
  success: boolean;
}

interface DeleteMapMutationPayload {
  id: string;
}

interface ConnectMapToLibraryMutationPayload {
  mapId: string;
  libraryId: string;
}

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function createMapMutationFn(
  payload: CreateMapRequestBody,
): Promise<CreateMapMutationResult> {
  const response = await createMapRequest(payload);

  if (response.status !== 201) {
    toast.error(response.error?.message ?? "Não foi possível criar o mapa.", {
      action: response.error?.action,
    });

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function listMapsQueryFn(): Promise<MapPreview[]> {
  const response = await listMapsRequest();

  if (response.status === 200 && response.data?.maps) {
    return response.data.maps;
  }

  return [];
}

function buildMapsQueryConfig() {
  return {
    queryKey: mapsQueryKey,
    queryFn: listMapsQueryFn,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  };
}

export function useSuspenseMaps() {
  return useSuspenseQuery(buildMapsQueryConfig());
}

async function deleteMapMutationFn(
  payload: DeleteMapMutationPayload,
): Promise<DeleteMapMutationResult> {
  const response = await deleteMapRequest({
    mapId: payload.id,
  });

  if (response.status !== 200) {
    toast.error(response.error?.message ?? "Não foi possível excluir o mapa.", {
      action: response.error?.action,
    });

    return {
      success: false,
    };
  }

  return {
    success: true,
  };
}

async function connectMapToLibraryMutationFn(
  payload: ConnectMapToLibraryMutationPayload,
): Promise<ConnectMapToLibraryMutationResult> {
  const response = await connectMapToLibraryRequest({
    mapId: payload.mapId,
    libraryId: payload.libraryId,
  });

  if (response.status !== 200) {
    toast.error(
      response.error?.message ??
        "Não foi possível vincular o mapa à biblioteca.",
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

export function useMaps() {
  const queryClient = useQueryClient();

  const mapsQuery = useQuery(buildMapsQueryConfig());

  const createMapMutation = useMutation({
    mutationFn: createMapMutationFn,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: mapsQueryKey,
        });
      }
    },
  });

  const deleteMapMutation = useMutation({
    mutationFn: deleteMapMutationFn,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: mapsQueryKey,
        });
      }
    },
  });

  const connectMapToLibraryMutation = useMutation({
    mutationFn: connectMapToLibraryMutationFn,
    onSuccess: (result) => {
      if (!result.success) {
        return;
      }

      queryClient.invalidateQueries({
        queryKey: mapsQueryKey,
      });
      queryClient.invalidateQueries({
        queryKey: librariesQueryKey,
      });
    },
  });

  const createMap = useCallback(
    async (payload: CreateMapRequestBody): Promise<CreateMapMutationResult> => {
      return createMapMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
        };
      });
    },
    [createMapMutation],
  );

  const deleteMap = useCallback(
    async (
      payload: DeleteMapMutationPayload,
    ): Promise<DeleteMapMutationResult> => {
      return deleteMapMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
        };
      });
    },
    [deleteMapMutation],
  );

  const connectMapToLibrary = useCallback(
    async (
      payload: ConnectMapToLibraryMutationPayload,
    ): Promise<ConnectMapToLibraryMutationResult> => {
      return connectMapToLibraryMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
        };
      });
    },
    [connectMapToLibraryMutation],
  );

  return {
    maps: mapsQuery.data ?? [],
    isLoadingMaps: mapsQuery.isPending,
    refetchMaps: mapsQuery.refetch,
    createMap,
    deleteMap,
    connectMapToLibrary,
    isCreatingMap: createMapMutation.isPending,
    isDeletingMap: deleteMapMutation.isPending,
    isConnectingMapToLibrary: connectMapToLibraryMutation.isPending,
  };
}
