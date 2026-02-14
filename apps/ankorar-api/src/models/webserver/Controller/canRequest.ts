import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { authModule } from "../../auth/AuthModule";

type CanRequestInput = string;

type CanRequestResponse = (
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) => void;

export function canRequest(feature: CanRequestInput): CanRequestResponse {
  return function canRequestHook(
    request: FastifyRequest,
    _reply: FastifyReply,
    done: HookHandlerDoneFunction,
  ) {
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
      return done();
    }

    throw new PermissionDenied();
  };
}
