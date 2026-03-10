import { CreationActionButton } from "@/components/actions/CreationActionButton";
import { Card, CardContent } from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";
import { NoteCard } from "@/pages/notes/components/NoteCard";
import { useNotesSection } from "@/pages/notes/hooks/useNotesSection";
import { FilePlus } from "lucide-react";

export function NotesSection() {
  const { can } = useUser();
  const { notes, handleCreateNote, isCreatingNote } = useNotesSection();
  const isEmptyState = notes.length === 0;
  const canCreateNote = can("create:note");

  return (
    <>
      {isEmptyState && (
        <Card className="border-dashed border-zinc-300/80 bg-zinc-50/50">
          <CardContent className="flex flex-col items-center gap-4 px-4 py-12 text-center">
            <span className="inline-flex size-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
              <FilePlus className="size-5 text-zinc-600" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900">
                Nenhuma nota criada ainda
              </p>
              <p className="text-xs text-zinc-500">
                {canCreateNote
                  ? "Crie sua primeira nota para começar a escrever."
                  : "Você não tem permissão para criar notas nesta organização."}
              </p>
            </div>
            {canCreateNote && (
              <CreationActionButton
                icon={FilePlus}
                label="Criar nota"
                loading={isCreatingNote}
                loadingLabel="Criando nota..."
                onClick={handleCreateNote}
                disabled={isCreatingNote}
                className="h-9 min-w-56 px-5"
              />
            )}
          </CardContent>
        </Card>
      )}

      {!isEmptyState && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  );
}
