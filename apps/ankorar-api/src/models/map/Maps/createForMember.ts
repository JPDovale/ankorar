import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { userModule } from "@/src/models/user/UserModule";
import { countMapsByMemberId } from "./fns/countMapsByMemberId";
import { createMap } from "./createMap";
import { Map } from "./Map";

type CreateForMemberInput = {
  memberId: string;
  organizationId: string;
  title: string;
};

type CreateForMemberResponse = {
  map: Map;
};

export async function createForMember({
  memberId,
  organizationId,
  title,
}: CreateForMemberInput): Promise<CreateForMemberResponse> {
  const { Members } = organizationModule;
  const { member } = await Members.fns.findById({ id: memberId });

  if (member.org_id !== organizationId) {
    throw new MemberNotFound();
  }

  const { user } = await userModule.Users.fns.findById({ id: member.user_id });
  const limits = getPlanLimits(user.stripe_price_id);

  if (limits.max_maps !== null) {
    const { count } = await countMapsByMemberId({ memberId: member.id });
    if (count >= limits.max_maps) {
      throw new PlanLimitExceeded({
        message: `O plano do membro permite no máximo ${limits.max_maps} mapas por organização.`,
      });
    }
  }

  return createMap({
    member_id: member.id,
    title,
  });
}
