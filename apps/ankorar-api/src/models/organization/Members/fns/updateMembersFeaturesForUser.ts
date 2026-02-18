import { db } from "@/src/infra/database/pool";
import { getPlanMemberFeatures } from "@/src/models/subscription/planConfig";
import { findMembersByUserId } from "./findMembersByUserId";
import { persistMember } from "./persistMember";

type UpdateMembersFeaturesForUserInput = {
  userId: string;
  stripePriceId: string | null;
};

type UpdateMembersFeaturesForUserResponse = void;

export async function updateMembersFeaturesForUser({
  userId,
  stripePriceId,
}: UpdateMembersFeaturesForUserInput): Promise<UpdateMembersFeaturesForUserResponse> {
  const planFeatures = getPlanMemberFeatures(stripePriceId);
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
    const features =
      ownerOrgIds.has(member.org_id)
        ? [...planFeatures, "create:organization_invite"]
        : [...planFeatures];
    member.features = features;
    await persistMember({ member });
  }
}
