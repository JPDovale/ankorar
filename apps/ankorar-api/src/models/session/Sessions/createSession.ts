import { CreateSessionProps, Session } from "./Session";
import { persistSession } from "./fns/persistSession";

type CreateSessionInput = CreateSessionProps;

type CreateSessionResponse = {
  session: Session;
};

export async function createSession(
  props: CreateSessionInput,
): Promise<CreateSessionResponse> {
  const session = Session.create(props);
  await persistSession({ session });
  return { session };
}
