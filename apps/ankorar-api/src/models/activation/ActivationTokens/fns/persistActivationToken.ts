import { db } from "@/src/infra/database/pool";
import { ActivationToken } from "../ActivationToken";

interface PersistActivationTokenProps {
  activationToken: ActivationToken;
}

type PersistActivationTokenResponse = {
  activationToken: ActivationToken;
};

export async function persistActivationToken({
  activationToken,
}: PersistActivationTokenProps): Promise<PersistActivationTokenResponse> {
  const data = {
    created_at: activationToken.created_at,
    expires_at: activationToken.expires_at,
    id: activationToken.id,
    updated_at: activationToken.updated_at,
    used_at: activationToken.used_at,
    user_id: activationToken.user_id,
  };

  if (activationToken.isNewEntity) {
    await db.activationToken.create({ data });
  }

  if (activationToken.isUpdatedRecently) {
    await db.activationToken.update({
      where: { id: activationToken.id },
      data,
    });
  }

  return { activationToken };
}
