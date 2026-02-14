import { Route } from "@/src/infra/shared/entities/Route";
import { libraryModule } from "@/src/models/library/LibraryModule";
import { listLibrariesResponses } from "./listLibraries.gateway";

export const listLibrariesRoute = Route.create({
  path: "/v1/libraries",
  method: "get",
  tags: ["Libraries"],
  summary: "List libraries",
  description: "List libraries from authenticated organization",
  response: listLibrariesResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply) => {
    const { Libraries } = libraryModule;
    const organization = request.context.organization;

    const { libraries } = await Libraries.fns.findByOrganizationIdWithMaps({
      organizationId: organization.id,
    });

    return reply.status(200).send({
      status: 200,
      data: {
        libraries: libraries.map(({ library, maps }) => ({
          id: library.id,
          name: library.name,
          created_at: library.created_at,
          updated_at: library.updated_at,
          maps: maps.map((map) => ({
            id: map.id,
            title: map.title,
            created_at: map.created_at,
            updated_at: map.updated_at,
          })),
        })),
      },
    });
  },
});
