import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { UserNotFound } from "@/src/infra/errors/UserNotFound";
import { parse as parseCookie } from "cookie";
import { FastifyRequest } from "fastify";
import { authModule } from "../../../auth/AuthModule";
import { cryptoModule } from "../../../crypto/CryptoModule";
import { organizationModule } from "../../../organization/OrganizationModule";
import { userModule } from "../../../user/UserModule";
import { injectAnonymousUser } from "./injectAnonymousUser";

type InjectAuthenticatedUserInput = {
  request: FastifyRequest;
};

type InjectAuthenticatedUserResponse = Promise<void>;

export async function injectAuthenticatedUser({
  request,
}: InjectAuthenticatedUserInput): InjectAuthenticatedUserResponse {
  const { Auth } = authModule;
  const { Crypto } = cryptoModule;
  const { Users } = userModule;
  const { Organizations, Members } = organizationModule;

  if (!request.headers.cookie) {
    throw new PermissionDenied();
  }

  const parsedCookies = parseCookie(request.headers.cookie);

  if (
    !parsedCookies.refresh_token ||
    !parsedCookies.access_token ||
    !parsedCookies.org_id ||
    !parsedCookies.member_id
  ) {
    throw new PermissionDenied();
  }

  const payload = Auth.fns.verifyToken({
    token: parsedCookies.access_token,
    type: "access",
  });

  const orgId = parsedCookies.org_id;
  const memberId = parsedCookies.member_id;

  Crypto.fns.verifyUUIDIsValid({ uuid: orgId });
  Crypto.fns.verifyUUIDIsValid({ uuid: memberId });

  if (!payload) {
    throw new PermissionDenied();
  }

  try {
    const { user } = await Users.fns.findById({
      id: payload.sub,
    });

    const { organization } = await Organizations.fns.findById({
      id: orgId,
    });

    const { member } = await Members.fns.findById({
      id: memberId,
    });

    request.context = {
      ...request.context,
      user,
      member,
      organization,
      refresh_token: parsedCookies.refresh_token,
      access_token: parsedCookies.access_token,
    };
  } catch (error) {
    if (error instanceof UserNotFound) {
      injectAnonymousUser({ request });
      return;
    }

    throw error;
  }
}
