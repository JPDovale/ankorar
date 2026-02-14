import { db } from "@/src/infra/database/pool";
import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { Member } from "../Member";

type FindMemberByUserIdAndOrgIdInput = {
  userId: string;
  orgId: string;
};

type FindMemberByUserIdAndOrgIdResponse = {
  member: Member;
};

export async function findMemberByUserIdAndOrgId({
  orgId,
  userId,
}: FindMemberByUserIdAndOrgIdInput): Promise<FindMemberByUserIdAndOrgIdResponse> {
  const memberOnDb = await db.member.findFirst({
    where: {
      user_id: userId,
      org_id: orgId,
      deleted_at: null,
    },
  });

  if (!memberOnDb) {
    throw new MemberNotFound();
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
