import { db } from "@/src/infra/database/pool";
import { NotePreview } from "../types/NotePreview";

type FindNotePreviewsByMemberIdInput = {
  memberId: string;
};

type FindNotePreviewsByMemberIdResponse = {
  notes: NotePreview[];
};

export async function findNotePreviewsByMemberId({
  memberId,
}: FindNotePreviewsByMemberIdInput): Promise<FindNotePreviewsByMemberIdResponse> {
  const rows = await db.note.findMany({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      title: true,
      created_at: true,
      updated_at: true,
      _count: {
        select: { likes: true },
      },
    },
  });

  const notes = rows.map((row) =>
    NotePreview.create({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      updated_at: row.updated_at,
      likes_count: row._count.likes,
    }),
  );

  return { notes };
}
