import { db } from "@/src/infra/database/pool";

type CountNotesByMemberIdInput = {
  memberId: string;
};

type CountNotesByMemberIdResponse = {
  count: number;
};

export async function countNotesByMemberId({
  memberId,
}: CountNotesByMemberIdInput): Promise<CountNotesByMemberIdResponse> {
  const count = await db.note.count({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
  });

  return { count };
}
