import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/libraries", () => {
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

      await fetch("http://localhost:9090/v1/libraries", {
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
          name: "Biblioteca A",
        }),
      });

      await fetch("http://localhost:9090/v1/libraries", {
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
          name: "Biblioteca B",
        }),
      });

      const response = await fetch("http://localhost:9090/v1/libraries", {
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
      expect(body.data.libraries).toHaveLength(2);
      expect(
        body.data.libraries.map((library: { name: string }) => library.name),
      ).toEqual(expect.arrayContaining(["Biblioteca A", "Biblioteca B"]));
    });
  });
});
