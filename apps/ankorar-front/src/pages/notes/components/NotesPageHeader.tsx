import { Can } from "@/components/auth/Can";
import { Button } from "@/components/ui/button";
import { useNotesSection } from "@/pages/notes/hooks/useNotesSection";
import { FilePlus } from "lucide-react";

export function NotesPageHeader() {
  const { notes, handleCreateNote, isCreatingNote } = useNotesSection();
  const notesSummaryText =
    notes.length === 0
      ? "Nenhuma nota"
      : notes.length === 1
        ? "1 nota"
        : `${notes.length} notas`;

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 transition-colors duration-200">
        <h1 className="text-xl font-semibold tracking-tight text-navy-900 transition-colors duration-200 dark:text-ds-white">
          Notas
        </h1>
        <p className="text-xs text-text-muted transition-colors duration-200">
          {notesSummaryText}
        </p>
      </div>

      <div className="flex sm:items-center sm:justify-end">
        <Can feature="create:note">
          <Button
            onClick={handleCreateNote}
            disabled={isCreatingNote}
            className="gap-2"
          >
            <FilePlus className="size-4" />
            {isCreatingNote ? "Criando..." : "Nova nota"}
          </Button>
        </Can>
      </div>
    </header>
  );
}
