import { FastifyReply } from "fastify";
import { serialize } from "cookie";

type SetSessionCookiesInput = {
  accessToken: string;
  refreshToken: string;
  orgId: string;
  memberId: string;
  reply: FastifyReply;
};

type SetSessionCookiesResponse = void;

export function setSessionCookies({
  accessToken,
  refreshToken,
  orgId,
  memberId,
  reply,
}: SetSessionCookiesInput): SetSessionCookiesResponse {
  const setCookieRefresh = serialize("refresh_token", refreshToken, {
    path: "/",
    maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || "0", 10),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const setCookieAccess = serialize("access_token", accessToken, {
    path: "/",
    maxAge: parseInt(process.env.JWT_EXPIRES_IN_SECONDS || "0", 10),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const setCookieOrg = serialize("org_id", orgId, {
    path: "/",
    maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || "0", 10),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const setCookieMember = serialize("member_id", memberId, {
    path: "/",
    maxAge: parseInt(process.env.JWT_REFRESH_EXPIRES_IN_SECONDS || "0", 10),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  reply.header("Set-Cookie", [
    setCookieRefresh,
    setCookieAccess,
    setCookieOrg,
    setCookieMember,
  ]);
}
