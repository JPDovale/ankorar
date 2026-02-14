import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { authModule } from "../../auth/AuthModule";
import { dateModule } from "../../date/DateModule";
import { organizationModule } from "../../organization/OrganizationModule";
import { User } from "../../user/Users/User";
import { Session } from "./Session";
import { AuthTokenResult } from "./types";
import { createSession } from "./createSession";

type CreateSessionForUserInput = {
  user: User;
};

type CreateSessionForUserResponse = {
  session: Session;
  accessToken: AuthTokenResult;
  refreshToken: AuthTokenResult;
};

export async function createSessionForUser({
  user,
}: CreateSessionForUserInput): Promise<CreateSessionForUserResponse> {
  const { Auth } = authModule;
  const { Organizations, Members } = organizationModule;

  const { organization } = await Organizations.fns.findByCreatorId({
    id: user.id,
  });
  const { member } = await Members.fns.findByUserIdAndOrgId({
    orgId: organization.id,
    userId: user.id,
  });

  if (
    !Auth.can({
      user,
      member,
      organization,
      feature: "create:session",
    })
  ) {
    throw new PermissionDenied();
  }

  const accessToken = Auth.createAccessToken({
    userId: user.id,
    email: user.email,
  });

  const refreshToken = Auth.createRefreshToken({
    userId: user.id,
    email: user.email,
  });

  const { session } = await createSession({
    user_id: user.id,
    refresh_token: refreshToken.token,
    expires_at: dateModule.Date.addSeconds(
      dateModule.Date.nowUtcDate(),
      refreshToken.expiresIn,
    ),
    created_at: dateModule.Date.nowUtcDate(),
  });

  return {
    accessToken,
    refreshToken,
    session,
  };
}
