import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { Route } from "@/src/infra/shared/entities/Route";
import { createMapBody, createMapResponses } from "./createMap.gateway";

export const createMapRoute = Route.create({
  path: "/v1/maps",
  method: "post",
  tags: ["Maps"],
  summary: "Create a map",
  description: "Create a map for authenticated member",
  body: createMapBody,
  response: createMapResponses,
  preHandler: [Route.canRequest("create:map")],
  handler: async (request, reply, { modules }) => {
    const { Maps } = modules.map;
    const { Libraries } = modules.library;
    const user = request.context.user;
    const member = request.context.member;
    const organization = request.context.organization;

    const limits = getPlanLimits(user.stripe_price_id);
    if (limits.max_maps !== null) {
      const { count } = await Maps.fns.countByMemberId({ memberId: member.id });
      if (count >= limits.max_maps) {
        throw new PlanLimitExceeded({
          message: `Seu plano permite no máximo ${limits.max_maps} mapas por organização. Faça upgrade para criar mais.`,
        });
      }
    }

    const { map } = await Maps.create({
      member_id: member.id,
      title: request.body.title,
    });

    if (request.body.library_id) {
      await Libraries.connectMap({
        id: request.body.library_id,
        organizationId: organization.id,
        mapId: map.id,
      });
    }

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
