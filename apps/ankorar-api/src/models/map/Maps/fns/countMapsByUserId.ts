import { db } from "@/src/infra/database/pool";

type CountMapsByUserIdInput = {
  userId: string;
};

type CountMapsByUserIdResponse = {
  count: number;
};

export async function countMapsByUserId({
  userId,
}: CountMapsByUserIdInput): Promise<CountMapsByUserIdResponse> {
  const count = await db.map.count({
    where: {
      member: {
        user_id: userId,
        deleted_at: null,
      },
      deleted_at: null,
    },
  });

  return { count };
}
