import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { FastifyReply, FastifyRequest } from "fastify";
import { authModule } from "../../auth/AuthModule";

type CanRequestInput = string;

type CanRequestResponse = (
  request: FastifyRequest,
  reply: FastifyReply,
) => void;

export function canRequest(feature: CanRequestInput): CanRequestResponse {
  return function canRequestHook(request: FastifyRequest) {
    const { Auth } = authModule;
    const user = request.context.user;
    const member = request.context.member;
    const organization = request.context.organization;

    if (
      Auth.can({
        user,
        member,
        organization,
        feature,
      })
    ) {
      return;
    }

    throw new PermissionDenied();
  };
}
