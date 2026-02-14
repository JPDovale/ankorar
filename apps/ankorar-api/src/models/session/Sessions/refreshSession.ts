import { SessionExpired } from "@/src/infra/errors/SessionExpired";
import { authModule } from "../../auth/AuthModule";
import { dateModule } from "../../date/DateModule";
import { Session } from "./Session";
import { AuthTokenResult } from "./types";
import { findValidSessionByTokenAndUserId } from "./fns/findValidSessionByTokenAndUserId";
import { persistSession } from "./fns/persistSession";

type RefreshSessionInput = {
  token: string;
};

type RefreshSessionResponse = {
  session: Session;
  accessToken: AuthTokenResult;
  refreshToken: AuthTokenResult;
};

export async function refreshSession({
  token,
}: RefreshSessionInput): Promise<RefreshSessionResponse> {
  const { Auth } = authModule;

  const payload = Auth.fns.verifyToken({
    token,
    type: "refresh",
  });

  const { session } = await findValidSessionByTokenAndUserId({
    token,
    userId: payload.sub,
  });

  if (!session) {
    throw new SessionExpired();
  }

  const accessToken = Auth.createAccessToken({
    userId: payload.sub,
    email: payload.email,
  });

  const refreshToken = Auth.createRefreshToken({
    userId: payload.sub,
    email: payload.email,
  });

  session.refresh_token = refreshToken.token;
  session.expires_at = dateModule.Date.addSeconds(
    dateModule.Date.nowUtcDate(),
    refreshToken.expiresIn,
  );

  await persistSession({ session });

  return {
    session,
    accessToken,
    refreshToken,
  };
}
