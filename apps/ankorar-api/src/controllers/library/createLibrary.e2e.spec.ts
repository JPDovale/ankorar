import { db } from "@/src/infra/database/pool";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/libraries", () => {
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

      const response = await fetch("http://localhost:9090/v1/libraries", {
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
          name: "  Biblioteca principal  ",
        }),
      });

      const body = (await response.json()) as any;

      expect(response.status).toBe(201);
      expect(body).toEqual({
        status: 201,
        data: null,
      });

      const libraryOnDb = await db.library.findFirst({
        where: {
          organization_id: organization.id,
          name: "Biblioteca principal",
          deleted_at: null,
        },
      });

      expect(libraryOnDb).toMatchObject({
        id: expect.any(String),
        organization_id: organization.id,
        name: "Biblioteca principal",
        created_at: expect.any(Date),
        updated_at: null,
        deleted_at: null,
      });
    });
  });
});
