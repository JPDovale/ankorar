import { PlanLimitExceeded } from "@/src/infra/errors/PlanLimitExceeded";
import { getPlanLimits } from "@/src/models/subscription/planConfig";
import { Route } from "@/src/infra/shared/entities/Route";
import {
  createLibraryBody,
  createLibraryResponses,
} from "./createLibrary.gateway";

export const createLibraryForOwnerRoute = Route.create({
  path: "/v1/libraries/for-owner",
  method: "post",
  tags: ["Libraries"],
  summary: "Create library for owner",
  description:
    "Create a library for the organization (using the owner's plan limits). Requires create:library:other.",
  body: createLibraryBody,
  response: createLibraryResponses,
  preHandler: [Route.canRequest("create:library")],
  handler: async (request, reply, { modules }) => {
    const { Libraries } = modules.library;
    const { Users } = modules.user;
    const organization = request.context.organization;

    const { user: ownerUser } = await Users.fns.findById({
      id: organization.creator_id,
    });

    const limits = getPlanLimits(ownerUser.stripe_price_id);
    if (limits.max_libraries !== null) {
      const { count } = await Libraries.fns.countByOrganizationId({
        organizationId: organization.id,
      });
      if (count >= limits.max_libraries) {
        throw new PlanLimitExceeded({
          message: `O plano do dono da organização permite no máximo ${limits.max_libraries} bibliotecas.`,
        });
      }
    }

    const { library } = await Libraries.create({
      organization_id: organization.id,
      name: request.body.name,
    });

    return reply.header("X-Library-Id", library.id).status(201).send({
      status: 201,
      data: null,
    });
  },
});
