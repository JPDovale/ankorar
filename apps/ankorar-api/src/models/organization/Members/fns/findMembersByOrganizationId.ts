import { db } from "@/src/infra/database/pool";
import { Member } from "../Member";

type FindMembersByOrganizationIdInput = {
  organizationId: string;
};

type MemberWithUser = {
  member: Member;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type FindMembersByOrganizationIdResponse = {
  members: MemberWithUser[];
};

export async function findMembersByOrganizationId({
  organizationId,
}: FindMembersByOrganizationIdInput): Promise<FindMembersByOrganizationIdResponse> {
  const membersOnDb = await db.member.findMany({
    where: {
      org_id: organizationId,
      deleted_at: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const members = membersOnDb.map((memberOnDb) => ({
    member: Member.create(
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
    user: {
      id: memberOnDb.user.id,
      name: memberOnDb.user.name,
      email: memberOnDb.user.email,
    },
  }));

  return { members };
}
