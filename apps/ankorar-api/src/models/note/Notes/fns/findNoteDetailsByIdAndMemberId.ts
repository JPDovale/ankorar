import { db } from "@/src/infra/database/pool";
import { NoteNotFound } from "@/src/infra/errors/NoteNotFound";
import { NoteDetails } from "../types/NoteDetails";

type FindNoteDetailsByIdAndMemberIdInput = {
  id: string;
  memberId: string;
};

type FindNoteDetailsByIdAndMemberIdResponse = {
  note: NoteDetails;
};

export async function findNoteDetailsByIdAndMemberId({
  id,
  memberId,
}: FindNoteDetailsByIdAndMemberIdInput): Promise<FindNoteDetailsByIdAndMemberIdResponse> {
  const noteOnDb = await db.note.findFirst({
    where: {
      id,
      member_id: memberId,
      deleted_at: null,
    },
    include: {
      _count: {
        select: { likes: true },
      },
      likes: {
        where: { member_id: memberId },
        take: 1,
        select: { id: true },
      },
    },
  });

  if (!noteOnDb) {
    throw new NoteNotFound();
  }

  const likesCount = noteOnDb._count.likes;
  const likedByMe = noteOnDb.likes.length > 0;

  const noteDetails = NoteDetails.create({
    id: noteOnDb.id,
    title: noteOnDb.title,
    text: noteOnDb.text,
    created_at: noteOnDb.created_at,
    updated_at: noteOnDb.updated_at,
    can_edit: true,
    likes_count: likesCount,
    liked_by_me: likedByMe,
  });

  return { note: noteDetails };
}
