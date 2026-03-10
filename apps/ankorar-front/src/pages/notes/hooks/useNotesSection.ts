import { useNotes, useSuspenseNotes } from "@/hooks/useNotes";
import { toast } from "sonner";

export function useNotesSection() {
  const { data: notes } = useSuspenseNotes();
  const { createNote, isCreatingNote } = useNotes();

  async function handleCreateNote() {
    const title = "Nova nota";
    const { success } = await createNote({
      title,
      text: "",
    });

    if (!success) {
      return;
    }

    toast.success(`Nota "${title}" criada com sucesso.`);
  }

  return {
    notes,
    handleCreateNote,
    isCreatingNote,
  };
}
