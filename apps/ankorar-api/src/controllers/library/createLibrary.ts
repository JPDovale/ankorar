import { Route } from "@/src/infra/shared/entities/Route";
import { libraryModule } from "@/src/models/library/LibraryModule";
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
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Libraries } = libraryModule;
    const organization = request.context.organization;

    await Libraries.create({
      organization_id: organization.id,
      name: request.body.name,
    });

    return reply.status(201).send({
      status: 201,
      data: null,
    });
  },
});
