import { db } from "@/src/infra/database/pool";
import { mapModule } from "@/src/models/map/MapModule";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[PUT] /v1/maps/:map_id/content", () => {
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
        title: "Meu mapa mental",
      });

      const updatedContent = [
        {
          id: "1",
          text: "Novo centro",
          type: "central",
          pos: {
            x: 20,
            y: 16,
          },
          sequence: 0,
          isVisible: true,
          parent: null,
          childrens: [],
          style: {
            h: 68,
            w: 308,
            color: "#0f172a",
            isBold: true,
            padding: {
              x: 96,
              y: 32,
            },
            fontSize: 24,
            isItalic: false,
            textAlign: "left",
            textColor: "#0f172a",
            wrapperPadding: 4,
            backgroundColor: "#ffffff",
          },
        },
      ];

      const response = await fetch(
        `http://localhost:9090/v1/maps/${map.id}/content`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: orchestrator.getCookieString({
              refreshToken: newSession.refreshToken.token,
              accessToken: newSession.accessToken.token,
              orgId: organization.id,
              memberId: member.id,
            }),
          },
          body: JSON.stringify({
            content: updatedContent,
          }),
        },
      );

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
          deleted_at: null,
        },
      });

      expect(mapOnDb).toMatchObject({
        id: map.id,
        member_id: member.id,
        title: "Novo centro",
        content: updatedContent,
        updated_at: expect.any(Date),
        deleted_at: null,
      });
    });
  });
});
