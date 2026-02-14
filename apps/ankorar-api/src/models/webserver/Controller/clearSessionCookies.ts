import { FastifyReply } from "fastify";
import { serialize } from "cookie";

type ClearSessionCookiesInput = {
  reply: FastifyReply;
};

type ClearSessionCookiesResponse = void;

export function clearSessionCookies({
  reply,
}: ClearSessionCookiesInput): ClearSessionCookiesResponse {
  const clearRefresh = serialize("refresh_token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const clearAccess = serialize("access_token", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const clearOrg = serialize("org_id", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const clearMember = serialize("member_id", "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  reply.header("Set-Cookie", [clearRefresh, clearAccess, clearOrg, clearMember]);
}
