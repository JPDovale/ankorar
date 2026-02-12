import { db } from "@/src/infra/database/pool";
import { orchestrator } from "@/test/orchestrator";
import { parse } from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[DELETE] /v1/sessions", () => {
  describe("Authenticated user", () => {
    test("with valid and existent session", async () => {
      const { user: newUser } = await orchestrator.createUser({
        email: "logout-user@gmail.com",
        password: "validPassword",
      });

      const {
        user: activatedUser,
        organization,
        member,
      } = await orchestrator.activateUser(newUser.id);

      const newSession = await orchestrator.createSession({
        user: activatedUser,
      });

      const response = await fetch("http://localhost:9090/v1/sessions", {
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

      const parsedCookies = parse(response.headers.getSetCookie(), {
        map: true,
      });

      expect(parsedCookies.refresh_token).toEqual({
        name: "refresh_token",
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
      });
      expect(parsedCookies.access_token).toEqual({
        name: "access_token",
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
      });
      expect(parsedCookies.org_id).toEqual({
        name: "org_id",
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
      });
      expect(parsedCookies.member_id).toEqual({
        name: "member_id",
        value: "",
        maxAge: 0,
        path: "/",
        httpOnly: true,
      });

      const sessionOnDb = await db.session.findFirst({
        where: {
          user_id: activatedUser.id,
          refresh_token: newSession.refreshToken.token,
        },
      });

      expect(sessionOnDb).toBeNull();
    });
  });
});
