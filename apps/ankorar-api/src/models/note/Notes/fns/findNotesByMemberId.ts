import { db } from "@/src/infra/database/pool";
import { Note } from "../Note";

type FindNotesByMemberIdInput = {
  memberId: string;
};

type FindNotesByMemberIdResponse = {
  notes: Note[];
};

export async function findNotesByMemberId({
  memberId,
}: FindNotesByMemberIdInput): Promise<FindNotesByMemberIdResponse> {
  const notesOnDb = await db.note.findMany({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const notes = notesOnDb.map((noteOnDb) =>
    Note.create(
      {
        member_id: noteOnDb.member_id,
        title: noteOnDb.title,
        text: noteOnDb.text,
        created_at: noteOnDb.created_at,
        updated_at: noteOnDb.updated_at,
        deleted_at: noteOnDb.deleted_at,
      },
      noteOnDb.id,
    ),
  );

  return { notes };
}
