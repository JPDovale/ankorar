import { Route } from "@/src/infra/shared/entities/Route";
import { createMapBody, createMapResponses } from "./createMap.gateway";
import { mapModule } from "@/src/models/map/MapModule";

export const createMapRoute = Route.create({
  path: "/v1/maps",
  method: "post",
  tags: ["Maps"],
  summary: "Create a map",
  description: "Create a map for authenticated member",
  body: createMapBody,
  response: createMapResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Maps } = mapModule;
    const member = request.context.member;

    await Maps.create({
      member_id: member.id,
      title: request.body.title,
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
