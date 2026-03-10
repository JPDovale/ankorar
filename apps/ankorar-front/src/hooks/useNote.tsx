import { useCallback, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNoteRequest,
  type NoteDetails,
} from "@/services/notes/getNoteRequest";
import {
  updateNoteRequest,
  type UpdateNoteRequestBody,
} from "@/services/notes/updateNoteRequest";
import { notesQueryKey } from "@/hooks/useNotes";
import { debounce } from "@/lib/utils";
import { toast } from "sonner";

const UPDATE_NOTE_DEBOUNCE_MS = 1000;

export const noteQueryKey = (id: string) => ["note", id] as const;

interface UseNoteProps {
  id: string | undefined;
}

interface UpdateNoteMutationResult {
  success: boolean;
}

async function getNoteByIdQueryFn(id: string): Promise<NoteDetails | null> {
  const response = await getNoteRequest(id);

  if (response.status === 200 && response.data?.note) {
    return response.data.note;
  }

  return null;
}

export function useNote({ id }: UseNoteProps) {
  const queryClient = useQueryClient();

  const noteQuery = useQuery({
    queryKey: noteQueryKey(id ?? ""),
    queryFn: () => getNoteByIdQueryFn(id!),
    enabled: Boolean(id),
    staleTime: 1 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({
      noteId,
      payload,
    }: {
      noteId: string;
      payload: UpdateNoteRequestBody;
    }) => updateNoteRequest(noteId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: noteQueryKey(variables.noteId),
      });
      queryClient.invalidateQueries({
        queryKey: notesQueryKey,
      });
    },
  });

  const updateNoteMutationRef = useRef(updateNoteMutation);
  updateNoteMutationRef.current = updateNoteMutation;

  const updateNote = useCallback(
    async (
      noteId: string,
      payload: UpdateNoteRequestBody,
    ): Promise<UpdateNoteMutationResult> => {
      try {
        const response = await updateNoteMutation.mutateAsync({
          noteId,
          payload,
        });

        if (response.status !== 200) {
          toast.error(
            response.error?.message ?? "Não foi possível salvar a nota.",
            { action: response.error?.action },
          );
          return { success: false };
        }

        return { success: true };
      } catch {
        toast.error("Não foi possível salvar a nota.");
        return { success: false };
      }
    },
    [updateNoteMutation],
  );

  const updateNoteDebounced = useMemo(
    () =>
      debounce((noteId: string, payload: UpdateNoteRequestBody) => {
        updateNoteMutationRef.current.mutate({ noteId, payload });
      }, UPDATE_NOTE_DEBOUNCE_MS),
    [], // ref garante que sempre usamos a mutation atual; debounce criado uma vez
  );

  return {
    note: noteQuery.data ?? null,
    isLoadingNote: noteQuery.isPending,
    refetchNote: noteQuery.refetch,
    updateNote,
    updateNoteDebounced,
    isUpdatingNote: updateNoteMutation.isPending,
  };
}
