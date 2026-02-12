import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/organizations", () => {
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

      const response = await fetch("http://localhost:9090/v1/organizations", {
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
          organizations: [
            {
              id: organization.id,
              name: organization.name,
              role: "Owner",
              member_id: member.id,
              features: member.features,
              is_current: true,
            },
          ],
        },
      });
    });
  });
});
