import { parse as parseCookie } from "cookie";
import { FastifyReply, FastifyRequest } from "fastify";
import { sessionModule } from "@/src/models/session/SessionModule";
import { setSessionCookies } from "../setSessionCookies";

const GET_USER_PATH = "/v1/users";

function isGetUserRequest(request: FastifyRequest): boolean {
  const path = request.url?.split("?")[0] ?? "";
  return request.method === "GET" && path === GET_USER_PATH;
}

/**
 * Se a rota for GET /v1/users e houver refresh_token no cookie, tenta renovar
 * a sessão e atualiza o header Cookie do request para que injectAuthenticatedUser
 * use o novo access_token (evitando throw por token expirado antes de injetar).
 * Também seta Set-Cookie na reply para o cliente receber os novos tokens.
 */
export async function refreshSessionBeforeInject({
  request,
  reply,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
}): Promise<void> {
  if (!isGetUserRequest(request) || !request.headers.cookie) {
    return;
  }

  const parsed = parseCookie(request.headers.cookie);
  const refreshToken = parsed.refresh_token;
  const orgId = parsed.org_id;
  const memberId = parsed.member_id;

  if (!refreshToken || !orgId || !memberId) {
    return;
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await sessionModule.Sessions.refresh({
        token: refreshToken,
      });

    setSessionCookies({
      accessToken: accessToken.token,
      refreshToken: newRefreshToken.token,
      orgId,
      memberId,
      reply,
    });

    const cookieParts = [
      `refresh_token=${encodeURIComponent(newRefreshToken.token)}`,
      `access_token=${encodeURIComponent(accessToken.token)}`,
      `org_id=${encodeURIComponent(orgId)}`,
      `member_id=${encodeURIComponent(memberId)}`,
    ];
    request.headers.cookie = cookieParts.join("; ");
  } catch {
    // Refresh falhou; não altera request/reply. injectAuthenticatedUser rodará
    // com os cookies atuais e poderá lançar PermissionDenied.
  }
}
