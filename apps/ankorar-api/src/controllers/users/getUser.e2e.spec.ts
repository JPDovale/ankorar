import { sessionModule } from "@/src/models/session/SessionModule";
import { orchestrator } from "@/test/orchestrator";
import parse from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/users", () => {
  describe("Authenticated user", () => {
    test("with non existent user", async () => {
      const { user: newUser } = await orchestrator.createUser({});
      const {
        user: activatedUser,
        organization,
        member,
      } = await orchestrator.activateUser(newUser.id);
      const newSession = await orchestrator.createSession({
        user: activatedUser,
      });
      await orchestrator.deleteUser({ user: activatedUser });

      const response = await fetch("http://localhost:9090/v1/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: orchestrator.getCookieString({
            refreshToken: newSession.refreshToken.token,
            accessToken: newSession.accessToken.token,
            orgId: organization.id,
            memberId: member.id,
          }),
        },
      });

      const body = (await response.json()) as any;

      expect(response.status).toBe(404);
      expect(body).toEqual({
        error: {
          action: "Tente novamente com outro e-mail.",
          message: "Usuário não encontrado.",
          name: "UserNotFound",
          status_code: 404,
        },
        status: 404,
      });
    });

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

      const response = await fetch("http://localhost:9090/v1/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
      expect(body.data.user).toEqual({
        created_at: expect.any(String),
        email: newUser.email,
        name: newUser.name,
        id: newUser.id,
        updated_at: null,
      });
      expect(Array.isArray(body.data.features)).toBe(true);

      const parsedCookies = parse(response.headers.getSetCookie(), {
        map: true,
      });

      expect(parsedCookies).toHaveProperty("access_token");
      expect(parsedCookies).toHaveProperty("refresh_token");
      expect(parsedCookies.access_token).toEqual({
        name: "access_token",
        value: expect.any(String),
        maxAge: 3600,
        path: "/",
        httpOnly: true,
      });
      expect(parsedCookies.refresh_token).toEqual({
        name: "refresh_token",
        value: expect.any(String),
        maxAge: 604800,
        path: "/",
        httpOnly: true,
      });
      expect(parsedCookies.org_id).toEqual({
        name: "org_id",
        value: expect.any(String),
        maxAge: 604800,
        path: "/",
        httpOnly: true,
      });
      expect(parsedCookies.member_id).toEqual({
        name: "member_id",
        value: expect.any(String),
        maxAge: 604800,
        path: "/",
        httpOnly: true,
      });

      const { session: updatedSession } =
        await sessionModule.Sessions.fns.findValidByTokenAndUserId({
          token: parsedCookies.refresh_token.value,
          userId: newUser.id,
        });

      expect(updatedSession.updated_at).toBeDefined();
      expect(updatedSession.expires_at).not.toEqual(
        newSession.session.expires_at,
      );
    });
  });
});
