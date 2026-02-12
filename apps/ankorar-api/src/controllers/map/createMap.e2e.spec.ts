import { db } from "@/src/infra/database/pool";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/maps", () => {
  describe("Authenticated user", () => {
    test("with valid and existent user", async () => {
      const { user: newUser } = await orchestrator.createUser({});
      const {
        user: activatedUser,
        organization,
        member,
      } = await orchestrator.activateUser(newUser.id);

      const newSession = await orchestrator.createSession({
        user: activatedUser,
      });

      const response = await fetch("http://localhost:9090/v1/maps", {
        method: "POST",
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
          title: "  qui 12/02 15:34  ",
        }),
      });

      const body = (await response.json()) as any;

      expect(response.status).toBe(201);
      expect(body).toEqual({
        status: 201,
        data: null,
      });

      const mapOnDb = await db.map.findFirst({
        where: {
          member_id: member.id,
          title: "qui 12/02 15:34",
          deleted_at: null,
        },
      });

      expect(mapOnDb).toMatchObject({
        id: expect.any(String),
        member_id: member.id,
        title: "qui 12/02 15:34",
        content: [
          {
            id: "1",
            pos: {
              x: 0,
              y: 0,
            },
            text: "qui 12/02 15:34",
            type: "central",
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
            sequence: 0,
            childrens: [],
            isVisible: true,
            parent: null,
          },
        ],
        created_at: expect.any(Date),
        updated_at: null,
        deleted_at: null,
      });
    });
  });
});
