import { InternalServerError } from "@/src/infra/errors/InternalServerError";
import { Member } from "../../organization/Member";
import { Organization } from "../../organization/Organization";
import { User } from "../../user/User";
import { availableFeatures } from "./fns/availableFeatures";

type CanInput = {
  user: User;
  organization: Organization;
  member: Member;
  feature: string;
};

type CanResponse = boolean;

export function can({
  feature,
  user,
  organization,
  member,
}: CanInput): CanResponse {
  if (!availableFeatures.includes(feature)) {
    throw new InternalServerError({
      cause: `Invalid feature: ${feature}`,
    });
  }

  if (
    member.user_id === user.id &&
    member.org_id === organization.id &&
    member.features.includes(feature)
  ) {
    return true;
  }

  return false;
}
