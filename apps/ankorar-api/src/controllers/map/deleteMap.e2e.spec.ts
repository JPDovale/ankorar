import { db } from "@/src/infra/database/pool";
import { mapModule } from "@/src/models/map/MapModule";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[DELETE] /v1/maps/:map_id", () => {
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

      const { map } = await mapModule.Maps.create({
        member_id: member.id,
        title: "Mapa para excluir",
      });

      const response = await fetch(`http://localhost:9090/v1/maps/${map.id}`, {
        method: "DELETE",
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
        data: null,
      });

      const mapOnDb = await db.map.findFirst({
        where: {
          id: map.id,
          member_id: member.id,
        },
      });

      expect(mapOnDb).toMatchObject({
        id: map.id,
        member_id: member.id,
        title: "Mapa para excluir",
        deleted_at: expect.any(Date),
      });

      const listResponse = await fetch("http://localhost:9090/v1/maps", {
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

      const listBody = (await listResponse.json()) as any;

      expect(listResponse.status).toBe(200);
      expect(listBody.data.maps).toHaveLength(0);
    });
  });
});
