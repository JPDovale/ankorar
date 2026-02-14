import { db } from "@/src/infra/database/pool";
import { Member } from "../Member";

type FindMemberByIdInput = {
  id: string;
};

type FindMemberByIdResponse = {
  member: Member;
};

export async function findMemberById({
  id,
}: FindMemberByIdInput): Promise<FindMemberByIdResponse> {
  const memberOnDb = await db.member.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });

  if (!memberOnDb) {
    throw new Error("Member not found");
  }

  const member = Member.create(
    {
      features: memberOnDb.features,
      user_id: memberOnDb.user_id,
      org_id: memberOnDb.org_id,
      created_at: memberOnDb.created_at,
      updated_at: memberOnDb.updated_at,
      deleted_at: memberOnDb.deleted_at,
    },
    memberOnDb.id,
  );

  return { member };
}
