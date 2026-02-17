import { Route } from "@/src/infra/shared/entities/Route";
import { listLibrariesResponses } from "./listLibraries.gateway";

export const listLibrariesRoute = Route.create({
  path: "/v1/libraries",
  method: "get",
  tags: ["Libraries"],
  summary: "List libraries",
  description: "List libraries from authenticated organization",
  response: listLibrariesResponses,
  preHandler: [Route.canRequest("read:organization")],
  handler: async (request, reply, { modules }) => {
    const { Libraries } = modules.library;
    const organization = request.context.organization;
    const member = request.context.member;

    const { libraries } =
      await Libraries.fns.findPreviewsByOrganizationId({
        organizationId: organization.id,
        memberId: member.id,
      });

    return reply.status(200).send({
      status: 200,
      data: {
        libraries: libraries.map((lib) => ({
          id: lib.id,
          name: lib.name,
          created_at: lib.created_at,
          updated_at: lib.updated_at,
          maps: lib.maps.map((map) => ({
            id: map.id,
            title: map.title,
            created_at: map.created_at,
            updated_at: map.updated_at,
            likes_count: map.likes_count,
            liked_by_me: map.liked_by_me,
            preview: map.preview,
            generated_by_ai: map.generated_by_ai,
          })),
        })),
      },
    });
  },
});
