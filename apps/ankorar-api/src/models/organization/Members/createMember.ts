import { CreateMemberProps, Member } from "./Member";
import { persistMember } from "./fns/persistMember";

type CreateMemberInput = CreateMemberProps;

type CreateMemberResponse = {
  member: Member;
};

export async function createMember(
  props: CreateMemberInput,
): Promise<CreateMemberResponse> {
  const member = Member.create(props);

  await persistMember({ member });

  return { member };
}
