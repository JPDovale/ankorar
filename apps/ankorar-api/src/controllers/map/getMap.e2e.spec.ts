import { mapModule } from "@/src/models/map/MapModule";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/maps/:map_id", () => {
  describe("Authenticated user", () => {
    test("with valid and existent map", async () => {
      const { user: newUser } = await orchestrator.createUser({});
      const {
        user: activatedUser,
        organization,
        member,
      } = await orchestrator.activateUser(newUser.id);

      const newSession = await orchestrator.createSession({
        user: activatedUser,
      });

      const mapContent = [
        {
          id: "node-1",
          text: "Mapa inicial",
        },
      ];

      const { map } = await mapModule.Maps.create({
        member_id: member.id,
        title: "Meu mapa mental",
        content: mapContent,
      });

      const response = await fetch(`http://localhost:9090/v1/maps/${map.id}`, {
        method: "GET",
        headers: {
          Cookie: orchestrator.getCookieString({
            refreshToken: newSession.refreshToken.token,
            accessToken: newSession.accessToken.token,
            orgId: organization.id,
            memberId: member.id,
          }),
        },
      });

      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body).toEqual({
        status: 200,
        data: {
          map: {
            id: map.id,
            title: "Meu mapa mental",
            content: mapContent,
            created_at: expect.any(String),
            updated_at: null,
          },
        },
      });
    });
  });
});
