import { useCallback } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createNoteRequest,
  type CreateNoteRequestBody,
} from "@/services/notes/createNoteRequest";
import {
  listNotesRequest,
  type NotePreview,
} from "@/services/notes/listNotesRequest";
import { toast } from "sonner";

export const notesQueryKey = ["notes"] as const;

interface CreateNoteMutationResult {
  success: boolean;
}

function extractUnexpectedErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir a operação.";
}

async function listNotesQueryFn(): Promise<NotePreview[]> {
  const response = await listNotesRequest();

  if (response.status === 200 && response.data?.notes) {
    return response.data.notes;
  }

  return [];
}

function buildNotesQueryConfig() {
  return {
    queryKey: notesQueryKey,
    queryFn: listNotesQueryFn,
    staleTime: 2 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  };
}

export function useSuspenseNotes() {
  return useSuspenseQuery(buildNotesQueryConfig());
}

async function createNoteMutationFn(
  payload: CreateNoteRequestBody,
): Promise<CreateNoteMutationResult> {
  const response = await createNoteRequest(payload);

  if (response.status !== 201) {
    toast.error(response.error?.message ?? "Não foi possível criar a nota.", {
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

export function useNotes() {
  const queryClient = useQueryClient();

  const notesQuery = useQuery(buildNotesQueryConfig());

  const createNoteMutation = useMutation({
    mutationFn: createNoteMutationFn,
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: notesQueryKey,
        });
      }
    },
  });

  const createNote = useCallback(
    async (
      payload: CreateNoteRequestBody,
    ): Promise<CreateNoteMutationResult> => {
      return createNoteMutation.mutateAsync(payload).catch((error) => {
        toast.error(extractUnexpectedErrorMessage(error));

        return {
          success: false,
        };
      });
    },
    [createNoteMutation],
  );

  return {
    notes: notesQuery.data ?? [],
    isLoadingNotes: notesQuery.isPending,
    refetchNotes: notesQuery.refetch,
    createNote,
    isCreatingNote: createNoteMutation.isPending,
  };
}
