import { db } from "@/src/infra/database/pool";
import { Session } from "../Session";

type PersistSessionInput = {
  session: Session;
};

type PersistSessionResponse = {
  session: Session;
};

export async function persistSession({
  session,
}: PersistSessionInput): Promise<PersistSessionResponse> {
  const data = {
    created_at: session.created_at,
    deleted_at: null,
    expires_at: session.expires_at,
    id: session.id,
    refresh_token: session.refresh_token,
    updated_at: session.updated_at,
    user_id: session.user_id,
  };

  if (session.isUpdatedRecently) {
    await db.session.update({
      where: {
        id: session.id,
      },
      data,
    });
  }

  if (session.isNewEntity) {
    await db.session.create({
      data,
    });
  }

  return { session };
}
