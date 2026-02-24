import { db } from "@/src/infra/database/pool";
import {
  getPlanLimits,
  getPlanMemberFeatures,
} from "@/src/models/subscription/planConfig";
import { findMembersByUserId } from "./findMembersByUserId";
import { persistMember } from "./persistMember";

const CREATE_ORGANIZATION_FEATURE = "create:organization" as const;

type UpdateMembersFeaturesForUserInput = {
  userId: string;
  stripePriceId: string | null;
};

type UpdateMembersFeaturesForUserResponse = void;

export async function updateMembersFeaturesForUser({
  userId,
  stripePriceId,
}: UpdateMembersFeaturesForUserInput): Promise<UpdateMembersFeaturesForUserResponse> {
  let planFeatures = getPlanMemberFeatures(stripePriceId);
  const limits = getPlanLimits(stripePriceId);

  if (
    limits.max_organizations_create > 0 &&
    !planFeatures.includes(CREATE_ORGANIZATION_FEATURE)
  ) {
    planFeatures = [...planFeatures, CREATE_ORGANIZATION_FEATURE];
  }

  const { members } = await findMembersByUserId({ userId });

  const ownerOrgIds = new Set(
    (
      await db.organization.findMany({
        where: { creator_id: userId, deleted_at: null },
        select: { id: true },
      })
    ).map((o) => o.id),
  );

  for (const member of members) {
    const featuresSet = new Set([
      ...(member.features ?? []),
      ...planFeatures,
    ]);
    if (ownerOrgIds.has(member.org_id)) {
      featuresSet.add("create:organization_invite");
    }
    member.features = [...featuresSet];
    await persistMember({ member });
  }
}
