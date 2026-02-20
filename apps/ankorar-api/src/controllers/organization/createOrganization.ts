import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { getPlanLimits, getPlanMemberFeatures } from "@/src/models/subscription/planConfig";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  createOrganizationBody,
  createOrganizationResponses,
} from "./createOrganization.gateway";

export const createOrganizationRoute = Route.create({
  path: "/v1/organizations",
  method: "post",
  tags: ["Organizations"],
  summary: "Create organization",
  description:
    "Create a new organization for the authenticated user. Respects plan limit max_organizations_create.",
  body: createOrganizationBody,
  response: createOrganizationResponses,
  preHandler: [Route.canRequest("create:organization")],
  handler: async (request, reply, { modules }) => {
    const { Organizations, Members } = modules.organization;
    const user = request.context.user;

    const limits = getPlanLimits(user.stripe_price_id);
    const { count } = await Organizations.fns.countByCreatorId({
      creatorId: user.id,
    });

    if (count >= limits.max_organizations_create) {
      throw new PlanLimitExceeded({
        message: `Seu plano permite criar no máximo ${limits.max_organizations_create} organização(s). Faça upgrade para criar mais.`,
      });
    }

    const { organization } = await Organizations.create({
      name: request.body.name.trim(),
      creator_id: user.id,
    });

    const planFeatures = getPlanMemberFeatures(user.stripe_price_id);
    const { member } = await Members.create({
      user_id: user.id,
      org_id: organization.id,
      features: [...planFeatures, "create:organization_invite"],
    });

    return reply.status(201).send({
      status: 201,
      data: {
        organization_id: organization.id,
        name: organization.name,
      },
    });
  },
});
