import { db } from "@/src/infra/database/pool";

type DeleteSessionByRefreshTokenAndUserIdInput = {
  userId: string;
  refreshToken: string;
};

type DeleteSessionByRefreshTokenAndUserIdResponse = void;

export async function deleteSessionByRefreshTokenAndUserId({
  userId,
  refreshToken,
}: DeleteSessionByRefreshTokenAndUserIdInput): Promise<DeleteSessionByRefreshTokenAndUserIdResponse> {
  await db.session.deleteMany({
    where: {
      user_id: userId,
      refresh_token: refreshToken,
    },
  });
}
