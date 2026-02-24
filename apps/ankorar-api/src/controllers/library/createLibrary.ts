import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  createLibraryBody,
  createLibraryResponses,
} from "./createLibrary.gateway";

export const createLibraryRoute = Route.create({
  path: "/v1/libraries",
  method: "post",
  tags: ["Libraries"],
  summary: "Create a library",
  description: "Create a library for authenticated organization",
  body: createLibraryBody,
  response: createLibraryResponses,
  preHandler: [Route.canRequest("create:library")],
  handler: async (request, reply, { modules }) => {
    const { Libraries } = modules.library;
    const user = request.context.user;
    const organization = request.context.organization;

    const limits = getPlanLimits(user.stripe_price_id);
    if (limits.max_libraries !== null) {
      const { count } = await Libraries.fns.countByOrganizationId({
        organizationId: organization.id,
      });
      if (count >= limits.max_libraries) {
        throw new PlanLimitExceeded({
          message: `Seu plano permite no máximo ${limits.max_libraries} bibliotecas por organização. Faça upgrade para criar mais.`,
        });
      }
    }

    const { library } = await Libraries.create({
      organization_id: organization.id,
      name: request.body.name,
    });

    return reply
      .header("X-Library-Id", library.id)
      .status(201)
      .send({
        status: 201,
        data: null,
      });
  },
});
