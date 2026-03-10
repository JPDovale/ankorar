import { Editor } from "@/components/editor";
import { useNote } from "@/hooks/useNote";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";

export function EditorNotePage() {
  const { note_id } = useParams<{ note_id: string }>();
  const { note, isLoadingNote, updateNoteDebounced } = useNote({ id: note_id });

  const [title, setTitle] = useState("Sem título");
  const contentRef = useRef("");
  const isInitializedForNote = useRef<string | null>(null);

  // Ao trocar de nota (note_id), resetar estado para não exibir/sobrescrever com dados da nota anterior
  useEffect(() => {
    isInitializedForNote.current = null;
    setTitle("Sem título");
    contentRef.current = "";
  }, [note_id]);

  // Só preencher título e conteúdo quando a nota carregada for a da URL atual
  useEffect(() => {
    if (!note_id || !note || note.id !== note_id) return;
    if (isInitializedForNote.current === note_id) return;

    setTitle(note.title);
    contentRef.current = note.text;
    isInitializedForNote.current = note_id;
  }, [note_id, note]);

  const handleChange = (text: string) => {
    contentRef.current = text;
    if (note_id) {
      updateNoteDebounced(note_id, { title, text });
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (note_id) {
      updateNoteDebounced(note_id, { title: value, text: contentRef.current });
    }
  };

  // Só usar dados da nota se for a nota atual (evita mostrar nota errada ao trocar de contexto)
  const initialContent = note && note.id === note_id ? note.text : "";
  const editorKey = `note-${note_id}-${note && note.id === note_id ? note.id : "loading"}`;

  if (note_id && isLoadingNote && !note) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <div className="mb-4 h-9 animate-pulse rounded bg-zinc-200/80 dark:bg-navy-700/50" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-zinc-200/80 dark:bg-navy-700/50"
              style={{ width: `${100 - i * 15}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Sem título"
        className="mb-4 w-full border-none bg-transparent text-3xl font-bold tracking-tight text-text-primary outline-none placeholder:text-text-muted/40"
      />

      <Editor
        key={editorKey}
        content={initialContent}
        onChange={handleChange}
        placeholder="Pressione '/' para inserir blocos..."
      />
    </div>
  );
}
