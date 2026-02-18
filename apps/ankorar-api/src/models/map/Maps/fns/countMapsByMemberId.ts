import { db } from "@/src/infra/database/pool";

type CountMapsByMemberIdInput = {
  memberId: string;
};

type CountMapsByMemberIdResponse = {
  count: number;
};

export async function countMapsByMemberId({
  memberId,
}: CountMapsByMemberIdInput): Promise<CountMapsByMemberIdResponse> {
  const count = await db.map.count({
    where: {
      member_id: memberId,
      deleted_at: null,
    },
  });

  return { count };
}
