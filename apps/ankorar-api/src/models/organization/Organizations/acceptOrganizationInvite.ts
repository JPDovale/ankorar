import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { db } from "@/src/infra/database/pool";
import { getPlanLimits, getPlanMemberFeatures } from "@/src/models/subscription/planConfig";
import { User } from "../../user/Users/User";
import { createMember } from "../Members/createMember";
import { findMembersByUserId } from "../Members/fns/findMembersByUserId";
import { persistMember } from "../Members/fns/persistMember";
import { Member } from "../Members/Member";
import { MemberAlreadyInOrganization } from "@/src/infra/errors/MemberAlreadyInOrganization";
import { OrganizationInvite } from "./OrganizationInvite";
import { findPendingOrganizationInviteByIdAndUserId } from "./fns/findPendingOrganizationInviteByIdAndUserId";
import { persistOrganizationInvite } from "./fns/persistOrganizationInvite";

type AcceptOrganizationInviteInput = {
  inviteId: string;
  user: User;
};

type AcceptOrganizationInviteResponse = {
  organizationInvite: OrganizationInvite;
};

export async function acceptOrganizationInvite({
  inviteId,
  user,
}: AcceptOrganizationInviteInput): Promise<AcceptOrganizationInviteResponse> {
  const limits = getPlanLimits(user.stripe_price_id);
  const { members } = await findMembersByUserId({ userId: user.id });
  if (members.length >= limits.max_organizations_join) {
    throw new PlanLimitExceeded({
      message: `Seu plano permite participar de no máximo ${limits.max_organizations_join} organizações. Faça upgrade para entrar em mais.`,
    });
  }

  const { organizationInvite } =
    await findPendingOrganizationInviteByIdAndUserId({
      id: inviteId,
      userId: user.id,
    });

  const memberOnDb = await db.member.findFirst({
    where: {
      org_id: organizationInvite.organization_id,
      user_id: user.id,
    },
  });

  if (memberOnDb && memberOnDb.deleted_at === null) {
    throw new MemberAlreadyInOrganization();
  }

  const planFeatures = getPlanMemberFeatures(user.stripe_price_id);

  if (memberOnDb && memberOnDb.deleted_at !== null) {
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

    member.markAsNotDeleted();
    member.features = planFeatures;
    await persistMember({ member });
  }

  if (!memberOnDb) {
    await createMember({
      user_id: user.id,
      org_id: organizationInvite.organization_id,
      features: planFeatures,
    });
  }

  organizationInvite.markAsAccepted();
  await persistOrganizationInvite({ organizationInvite });

  return { organizationInvite };
}
