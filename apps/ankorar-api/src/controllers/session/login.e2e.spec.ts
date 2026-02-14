import { dateModule } from "@/src/models/date/DateModule";
import { sessionModule } from "@/src/models/session/SessionModule";
import { orchestrator } from "@/test/orchestrator";
import { parse } from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/sessions", () => {
  describe("Anonymous user", () => {
    describe("With valid fields", () => {
      test("with invalid email", async () => {
        const response = await fetch("http://localhost:9090/v1/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "jonas@gmail.com",
            password: "12345678",
          }),
        });

        const body = (await response.json()) as any;

        expect(body).toEqual({
          error: {
            action: "Verifique seu email e senha e tente novamente.",
            message: "Credenciais incorretas.",
            name: "InvalidCredentials",
            status_code: 401,
          },
          status: 401,
        });
      });

      test("with invalid password", async () => {
        await orchestrator.createUser({
          email: "validemail@gmail.com",
          password: "12345678",
        });

        const response = await fetch("http://localhost:9090/v1/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "validemail@gmail.com",
            password: "incorrectPassword",
          }),
        });

        const body = (await response.json()) as any;

        expect(body).toEqual({
          error: {
            action: "Verifique seu email e senha e tente novamente.",
            message: "Credenciais incorretas.",
            name: "InvalidCredentials",
            status_code: 401,
          },
          status: 401,
        });
      });

      test("with valid email and password", async () => {
        const { user: newUser } = await orchestrator.createUser({
          email: "validaemail@gmail.com",
          password: "validPassword",
        });

        await orchestrator.activateUser(newUser.id);

        const response = await fetch("http://localhost:9090/v1/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "validaemail@gmail.com",
            password: "validPassword",
          }),
        });

        const body = (await response.json()) as any;

        expect(body).toEqual({
          data: null,
          status: 201,
        });

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

        const { session: createdSession } =
          await sessionModule.Sessions.fns.findValidByTokenAndUserId({
            token: parsedCookies.refresh_token.value,
            userId: newUser.id,
          });

        const today = dateModule.Date.nowUtcDate();

        today.setMilliseconds(0);
        today.setSeconds(0);

        const expires_at = createdSession.expires_at;

        expires_at.setMilliseconds(0);
        expires_at.setSeconds(0);

        const recalculatedExpirationTime = dateModule.Date.addSeconds(today, 604800);

        expect(recalculatedExpirationTime).toEqual(expires_at);
        expect(createdSession).toBeDefined();
        expect(createdSession.toJson()).toEqual({
          id: expect.any(String),
          user_id: newUser.id,
          refresh_token: parsedCookies.refresh_token.value,
          updated_at: null,
          created_at: expect.any(Date),
          expires_at: expect.any(Date),
        });
      });
    });
  });
});
