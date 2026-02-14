import { db } from "@/src/infra/database/pool";
import { Member } from "../../Members/Member";
import { Organization } from "../Organization";

type FindOrganizationsByUserIdInput = {
  userId: string;
};

type FindOrganizationsByUserIdResponse = {
  organizations: Array<{ organization: Organization; member: Member }>;
};

export async function findOrganizationsByUserId({
  userId,
}: FindOrganizationsByUserIdInput): Promise<FindOrganizationsByUserIdResponse> {
  const membersOnDb = await db.member.findMany({
    where: {
      user_id: userId,
      deleted_at: null,
    },
    include: {
      org: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });

  const organizations = membersOnDb
    .filter((memberOnDb) => memberOnDb.org.deleted_at === null)
    .map((memberOnDb) => {
      const organization = Organization.create(
        {
          name: memberOnDb.org.name,
          creator_id: memberOnDb.org.creator_id,
          created_at: memberOnDb.org.created_at,
          updated_at: memberOnDb.org.updated_at,
        },
        memberOnDb.org.id,
      );

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

      return {
        organization,
        member,
      };
    });

  return { organizations };
}
