import { db } from "@/src/infra/database/pool";
import { NoteNotFound } from "@/src/infra/errors/NoteNotFound";
import { Note } from "../Note";

type FindNoteByIdAndMemberIdInput = {
  id: string;
  memberId: string;
};

type FindNoteByIdAndMemberIdResponse = {
  note: Note;
};

export async function findNoteByIdAndMemberId({
  id,
  memberId,
}: FindNoteByIdAndMemberIdInput): Promise<FindNoteByIdAndMemberIdResponse> {
  const noteOnDb = await db.note.findFirst({
    where: {
      id,
      member_id: memberId,
      deleted_at: null,
    },
  });

  if (!noteOnDb) {
    throw new NoteNotFound();
  }

  const note = Note.create(
    {
      member_id: noteOnDb.member_id,
      title: noteOnDb.title,
      text: noteOnDb.text,
      created_at: noteOnDb.created_at,
      updated_at: noteOnDb.updated_at,
      deleted_at: noteOnDb.deleted_at,
    },
    noteOnDb.id,
  );

  return { note };
}
