import { Route } from "@/src/infra/shared/entities/Route";
import {
  listMapsByLibraryIdsQuerystring,
  listMapsByLibraryIdsResponses,
} from "./listMapsByLibraryIds.gateway";

export const listMapsByLibraryIdsRoute = Route.create({
  path: "/v1/libraries/for-owner/maps",
  method: "get",
  tags: ["Libraries"],
  summary: "List maps by library IDs (for owner)",
  description:
    "List maps from multiple libraries by their IDs for the organization owner (API key). Returns libraries with their maps. Only libraries belonging to the authenticated organization are returned. Query: library_ids=id1&library_ids=id2",
  querystring: listMapsByLibraryIdsQuerystring,
  response: listMapsByLibraryIdsResponses,
  preHandler: [Route.canRequest("read:library")],
  handler: async (request, reply, { modules }) => {
    const { Libraries } = modules.library;
    const { Members } = modules.organization;
    const organization = request.context.organization;

    const { member: ownerMember } = await Members.fns.findByUserIdAndOrgId({
      userId: organization.creator_id,
      orgId: organization.id,
    });

    const { libraries } =
      await Libraries.fns.findPreviewsByOrganizationId({
        organizationId: organization.id,
        memberId: ownerMember.id,
        libraryIds: request.query.library_ids,
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
