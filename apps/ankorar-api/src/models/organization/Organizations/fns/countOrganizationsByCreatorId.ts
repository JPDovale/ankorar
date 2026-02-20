import { db } from "@/src/infra/database/pool";

type CountOrganizationsByCreatorIdInput = {
  creatorId: string;
};

type CountOrganizationsByCreatorIdResponse = {
  count: number;
};

export async function countOrganizationsByCreatorId({
  creatorId,
}: CountOrganizationsByCreatorIdInput): Promise<CountOrganizationsByCreatorIdResponse> {
  const count = await db.organization.count({
    where: {
      creator_id: creatorId,
      deleted_at: null,
    },
  });

  return { count };
}
