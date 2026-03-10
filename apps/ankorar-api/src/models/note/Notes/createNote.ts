import { CreateNoteProps, Note } from "./Note";
import { persistNote } from "./fns/persistNote";

type CreateNoteInput = CreateNoteProps;

type CreateNoteResponse = {
  note: Note;
};

export async function createNote(
  props: CreateNoteInput,
): Promise<CreateNoteResponse> {
  const note = Note.create(props);

  await persistNote({ note });

  return { note };
}
