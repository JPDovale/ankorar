import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/maps", () => {
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

      await fetch("http://localhost:9090/v1/maps", {
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
          title: "mapa A",
        }),
      });

      await fetch("http://localhost:9090/v1/maps", {
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
          title: "mapa B",
        }),
      });

      const response = await fetch("http://localhost:9090/v1/maps", {
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
      expect(body.status).toBe(200);
      expect(body.data.maps).toHaveLength(2);
      expect(body.data.maps.map((map: { title: string }) => map.title)).toEqual(
        expect.arrayContaining(["mapa A", "mapa B"]),
      );
      expect(body.data.maps[0]).not.toHaveProperty("content");
      expect(body.data.maps[1]).not.toHaveProperty("content");
    });
  });
});
