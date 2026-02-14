import { db } from "@/src/infra/database/pool";
import { Member } from "../Member";

type PersistMemberInput = {
  member: Member;
};

type PersistMemberResponse = {
  member: Member;
};

export async function persistMember({
  member,
}: PersistMemberInput): Promise<PersistMemberResponse> {
  const data = {
    id: member.id,
    org_id: member.org_id,
    user_id: member.user_id,
    features: member.features,
    created_at: member.created_at,
    updated_at: member.updated_at,
    deleted_at: member.deleted_at,
  };

  if (member.isNewEntity) {
    await db.member.create({
      data,
    });
  }

  if (member.isUpdatedRecently) {
    await db.member.update({
      where: {
        id: member.id,
      },
      data,
    });
  }

  member.forceNotNew();

  return { member };
}
