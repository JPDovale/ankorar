import { db } from "@/src/infra/database/pool";

type GetNotesLikesInfoInput = {
  noteIds: string[];
  memberId: string;
};

type NoteLikesInfo = {
  likes_count: number;
  liked_by_me: boolean;
};

type GetNotesLikesInfoResponse = Record<string, NoteLikesInfo>;

export async function getNotesLikesInfo({
  noteIds,
  memberId,
}: GetNotesLikesInfoInput): Promise<GetNotesLikesInfoResponse> {
  if (noteIds.length === 0) {
    return {};
  }

  const [counts, myLikes] = await Promise.all([
    db.noteLike.groupBy({
      by: ["note_id"],
      where: { note_id: { in: noteIds } },
      _count: { note_id: true },
    }),
    db.noteLike.findMany({
      where: {
        note_id: { in: noteIds },
        member_id: memberId,
      },
      select: { note_id: true },
    }),
  ]);

  const myLikeNoteIds = new Set(myLikes.map((r) => r.note_id));
  const countByNoteId = new Map(
    counts.map((c) => [c.note_id, c._count.note_id]),
  );

  const result: GetNotesLikesInfoResponse = {};
  for (const id of noteIds) {
    result[id] = {
      likes_count: countByNoteId.get(id) ?? 0,
      liked_by_me: myLikeNoteIds.has(id),
    };
  }
  return result;
}
