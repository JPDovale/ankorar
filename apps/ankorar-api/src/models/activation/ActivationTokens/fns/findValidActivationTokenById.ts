import { db } from "@/src/infra/database/pool";
import { ActivationTokenNotFound } from "@/src/infra/errors/ActivationTokenNotFound";
import { dateModule } from "../../../date/DateModule";
import { ActivationToken } from "../ActivationToken";

interface FindValidActivationTokenByIdProps {
  id: string;
}

type FindValidActivationTokenByIdResponse = {
  activationToken: ActivationToken;
};

export async function findValidActivationTokenById({
  id,
}: FindValidActivationTokenByIdProps): Promise<FindValidActivationTokenByIdResponse> {
  const activationTokenOnDb = await db.activationToken.findUnique({
    where: {
      id,
      used_at: null,
      expires_at: {
        gt: dateModule.Date.nowUtcDate(),
      },
    },
  });

  if (!activationTokenOnDb) {
    throw new ActivationTokenNotFound();
  }

  const activationToken = ActivationToken.create(
    {
      expires_at: activationTokenOnDb.expires_at,
      user_id: activationTokenOnDb.user_id,
      created_at: activationTokenOnDb.created_at,
      updated_at: activationTokenOnDb.updated_at,
      used_at: activationTokenOnDb.used_at,
    },
    activationTokenOnDb.id,
  );

  return { activationToken };
}
