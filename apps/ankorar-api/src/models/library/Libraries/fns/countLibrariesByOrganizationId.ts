import { db } from "@/src/infra/database/pool";

type CountLibrariesByOrganizationIdInput = {
  organizationId: string;
};

type CountLibrariesByOrganizationIdResponse = {
  count: number;
};

export async function countLibrariesByOrganizationId({
  organizationId,
}: CountLibrariesByOrganizationIdInput): Promise<CountLibrariesByOrganizationIdResponse> {
  const count = await db.library.count({
    where: {
      organization_id: organizationId,
      deleted_at: null,
    },
  });

  return { count };
}
