import { db } from "@/src/infra/database/pool";
import { MemberNotFound } from "@/src/infra/errors/MemberNotFound";
import { Member } from "../Member";
import { findMemberById } from "./findMemberById";
import { persistMember } from "./persistMember";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { MemberCannotBeRemoved } from "@/src/infra/errors/MemberCannotBeRemoved";

type RemoveMemberInput = {
  memberId: string;
  organizationId: string;
  organizationCreatorId: string;
};

type RemoveMemberResponse = {
  member: Member;
};

export async function removeMember({
  memberId,
  organizationId,
  organizationCreatorId,
}: RemoveMemberInput): Promise<RemoveMemberResponse> {
  const { member } = await findMemberById({ id: memberId });

  if (member.org_id !== organizationId) {
    throw new MemberNotFound();
  }

  const memberUser = await db.user.findFirst({
    where: { id: member.user_id },
  });

  if (!memberUser) {
    throw new UserNotFound();
  }

  if (memberUser.id === organizationCreatorId) {
    throw new MemberCannotBeRemoved();
  }

  member.markAsDeleted();
  await persistMember({ member });

  return { member };
}
