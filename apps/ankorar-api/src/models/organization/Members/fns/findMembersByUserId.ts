import { db } from "@/src/infra/database/pool";
import { Member } from "../Member";

type FindMembersByUserIdInput = {
  userId: string;
};

type FindMembersByUserIdResponse = {
  members: Member[];
};

export async function findMembersByUserId({
  userId,
}: FindMembersByUserIdInput): Promise<FindMembersByUserIdResponse> {
  const membersOnDb = await db.member.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
  });

  const members = membersOnDb.map((memberOnDb) =>
    Member.create(
      {
        features: memberOnDb.features,
        user_id: memberOnDb.user_id,
        org_id: memberOnDb.org_id,
        created_at: memberOnDb.created_at,
        updated_at: memberOnDb.updated_at,
        deleted_at: memberOnDb.deleted_at,
      },
      memberOnDb.id,
    ),
  );

  return { members };
}
