import { deleteSessionByRefreshTokenAndUserId } from "./fns/deleteSessionByRefreshTokenAndUserId";

type LogoutSessionInput = {
  userId: string;
  refreshToken: string;
};

type LogoutSessionResponse = void;

export async function logoutSession({
  userId,
  refreshToken,
}: LogoutSessionInput): Promise<LogoutSessionResponse> {
  await deleteSessionByRefreshTokenAndUserId({
    userId,
    refreshToken,
  });
}
