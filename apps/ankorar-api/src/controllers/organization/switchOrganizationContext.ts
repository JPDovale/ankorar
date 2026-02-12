import { PermissionDenied } from "@/src/infra/errors/PermissionDenied";
import { Route } from "@/src/infra/shared/entities/Route";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { webserverModule } from "@/src/models/webserver/WebserverModule";
import { safeCall } from "@/src/utils/safeCall";
import {
  switchOrganizationContextBody,
  switchOrganizationContextResponses,
} from "./switchOrganizationContext.gateway";

export const switchOrganizationContextRoute = Route.create({
  path: "/v1/organizations/context",
  method: "patch",
  tags: ["Organizations"],
  summary: "Switch organization context",
  description:
    "Switch current authenticated organization context and refresh org/member cookies",
  body: switchOrganizationContextBody,
  response: switchOrganizationContextResponses,
  preHandler: [Route.canRequest("read:session")],
  handler: async (request, reply) => {
    const { Organizations, Members } = organizationModule;
    const { Controller } = webserverModule;
    const user = request.context.user;
    const refreshToken = request.context.refresh_token;
    const accessToken = request.context.access_token;
    const nextOrganizationId = request.body.organization_id;

    const organizationResult = await safeCall(() =>
      Organizations.fns.findById({
        id: nextOrganizationId,
      }),
    );

    if (!organizationResult.success) {
      throw new PermissionDenied();
    }

    const memberResult = await safeCall(() =>
      Members.fns.findByUserIdAndOrgId({
        orgId: nextOrganizationId,
        userId: user.id,
      }),
    );

    if (!memberResult.success) {
      throw new PermissionDenied();
    }

    const { organization } = organizationResult.data;
    const { member } = memberResult.data;

    Controller.setSessionCookies({
      refreshToken,
      accessToken,
      orgId: organization.id,
      memberId: member.id,
      reply,
    });

    return reply.status(200).send({
      status: 200,
      data: null,
    });
  },
});
