import { db } from "@/src/infra/database/pool";
import { libraryModule } from "@/src/models/library/LibraryModule";
import { mapModule } from "@/src/models/map/MapModule";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/libraries/:library_id/maps/:map_id/connect", () => {
  describe("Authenticated user", () => {
    test("with valid and existent map and library", async () => {
      const { user: newUser } = await orchestrator.createUser({});
      const {
        user: activatedUser,
        organization,
        member,
      } = await orchestrator.activateUser(newUser.id);

      const newSession = await orchestrator.createSession({
        user: activatedUser,
      });

      const { map } = await mapModule.Maps.create({
        member_id: member.id,
        title: "Mapa para vincular",
      });

      const { library } = await libraryModule.Libraries.create({
        organization_id: organization.id,
        name: "Biblioteca principal",
      });

      const response = await fetch(
        `http://localhost:9090/v1/libraries/${library.id}/maps/${map.id}/connect`,
        {
          method: "POST",
          headers: {
            Cookie: orchestrator.getCookieString({
              refreshToken: newSession.refreshToken.token,
              accessToken: newSession.accessToken.token,
              orgId: organization.id,
              memberId: member.id,
            }),
          },
        },
      );

      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body).toEqual({
        status: 200,
        data: null,
      });

      const mapLibraryOnDb = await db.mapLibrary.findUnique({
        where: {
          map_id_library_id: {
            map_id: map.id,
            library_id: library.id,
          },
        },
      });

      expect(mapLibraryOnDb).toMatchObject({
        map_id: map.id,
        library_id: library.id,
      });
    });
  });
});
