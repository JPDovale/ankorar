import { db } from "@/src/infra/database/pool";
import { Note } from "../Note";

type PersistNoteInput = {
  note: Note;
};

type PersistNoteResponse = {
  note: Note;
};

export async function persistNote({
  note,
}: PersistNoteInput): Promise<PersistNoteResponse> {
  const data = {
    id: note.id,
    member_id: note.member_id,
    title: note.title,
    text: note.text,
    created_at: note.created_at,
    updated_at: note.updated_at,
    deleted_at: note.deleted_at,
  };

  if (note.isNewEntity) {
    await db.note.create({
      data,
    });
  }

  if (note.isUpdatedRecently) {
    await db.note.update({
      where: {
        id: note.id,
      },
      data,
    });
  }

  note.forceNotNew();

  return { note };
}
