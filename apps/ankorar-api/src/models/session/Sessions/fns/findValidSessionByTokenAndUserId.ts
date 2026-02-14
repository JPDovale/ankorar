import { db } from "@/src/infra/database/pool";
import { SessionExpired } from "@/src/infra/errors/SessionExpired";
import { dateModule } from "../../../date/DateModule";
import { Session } from "../Session";

type FindValidSessionByTokenAndUserIdInput = {
  userId: string;
  token: string;
};

type FindValidSessionByTokenAndUserIdResponse = {
  session: Session;
};

export async function findValidSessionByTokenAndUserId({
  userId,
  token,
}: FindValidSessionByTokenAndUserIdInput): Promise<FindValidSessionByTokenAndUserIdResponse> {
  const sessionOnDb = await db.session.findFirst({
    where: {
      refresh_token: token,
      user_id: userId,
      expires_at: {
        gt: dateModule.Date.nowUtcDate(),
      },
    },
  });

  if (!sessionOnDb) {
    throw new SessionExpired();
  }

  const session = Session.create(
    {
      expires_at: sessionOnDb.expires_at,
      refresh_token: sessionOnDb.refresh_token,
      user_id: sessionOnDb.user_id,
      created_at: sessionOnDb.created_at,
      updated_at: sessionOnDb.updated_at,
    },
    sessionOnDb.id,
  );

  return { session };
}
