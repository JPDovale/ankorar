import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { userModule } from "@/src/models/user/UserModule";
import { CreateNoteProps, Note } from "./Note";
import { countNotesByMemberId } from "./fns/countNotesByMemberId";
import { persistNote } from "./fns/persistNote";

type CreateNoteInput = CreateNoteProps;

type CreateNoteResponse = {
  note: Note;
};

export async function createNote(
  props: CreateNoteInput,
): Promise<CreateNoteResponse> {
  const { Members } = organizationModule;
  const { member } = await Members.fns.findById({ id: props.member_id });
  const { user } = await userModule.Users.fns.findById({ id: member.user_id });
  const limits = getPlanLimits(user.stripe_price_id);

  if (limits.max_notes !== null) {
    const { count } = await countNotesByMemberId({ memberId: member.id });
    if (count >= limits.max_notes) {
      throw new PlanLimitExceeded({
        message: `O plano do membro permite no máximo ${limits.max_notes} notes por organização.`,
      });
    }
  }

  const note = Note.create(props);

  await persistNote({ note });

  return { note };
}
