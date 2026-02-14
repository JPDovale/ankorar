import { activationModule } from "@/src/models/activation/ActivationModule";
import { userModule } from "@/src/models/user/UserModule";
import { User } from "@/src/models/user/Users/User";
import { orchestrator } from "@/test/orchestrator";
import { parse } from "set-cookie-parser";
import { webserverModule } from "@/src/models/webserver/WebserverModule";
import { organizationModule } from "@/src/models/organization/OrganizationModule";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
  await orchestrator.deleteAllEmails();
});

describe("case: registration flow (all successful by api key)", () => {
  let createdUser: User;
  let activationTokenId: string;
  let accessTokenCookie: string;
  let refreshTokenCookie: string;
  let organizationId: string;
  let memberId: string;

  test("create user account", async () => {
    const response = await fetch("http://localhost:9090/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "jonas@gmail.com",
        password: "12345678",
        name: "Registration Flow",
      }),
    });

    const body = (await response.json()) as any;

    expect(body).toEqual({
      data: null,
      status: 201,
    });

    const { user: userOnDb } = await userModule.Users.fns.findByEmail({
      email: "jonas@gmail.com",
    });

    createdUser = userOnDb!;
    expect(userOnDb?.toJson()).toEqual({
      id: expect.any(String),
      name: "Registration Flow",
      email: "jonas@gmail.com",
      ext_id: null,
      password: expect.any(String),
      created_at: expect.any(Date),
      updated_at: null,
      deleted_at: null,
    });
  });

  test("receive confirmation email", async () => {
    const email = await orchestrator.getLastEmail();

    expect(email.sender).toBe("<contato@ankorar.com>");
    expect(email.recipients[0]).toBe("<jonas@gmail.com>");
    expect(email.subject).toBe("Ative sua conta no Ankorar");
    expect(email.body).toContain("Registration Flow");

    activationTokenId = orchestrator.extractUUID(email.body);

    expect(activationTokenId).toHaveLength(36);
    expect(email.body).toContain(
      `${webserverModule.Webserver.origin}/register/activate/${activationTokenId}`,
    );

    const { activationToken } =
      await activationModule.ActivationTokens.fns.findValidById({
        id: activationTokenId,
      });

    expect(activationToken.toJson()).toEqual({
      id: activationTokenId,
      user_id: createdUser.id,
      used_at: null,
      expires_at: expect.any(Date),
      created_at: expect.any(Date),
      updated_at: null,
    });
  });

  test("activate account", async () => {
    const response = await fetch(
      `http://localhost:9090/v1/activations/${activationTokenId}`,
      {
        method: "PATCH",
      },
    );

    expect(response.status).toEqual(200);

    const { user: activatedUser } = await userModule.Users.fns.findById({
      id: createdUser.id,
    });

    const { organization } =
      await organizationModule.Organizations.fns.findByCreatorId({
        id: activatedUser.id,
      });

    const { member } =
      await organizationModule.Members.fns.findByUserIdAndOrgId({
        orgId: organization.id,
        userId: activatedUser.id,
      });

    expect(member.features).toEqual([
      "create:session",
      "read:session",
      "create:api_key",
    ]);
  });

  test("login", async () => {
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
      data: null,
      status: 201,
    });

    const parsedCookies = parse(response.headers.getSetCookie(), {
      map: true,
    });

    accessTokenCookie = parsedCookies.access_token.value;
    refreshTokenCookie = parsedCookies.refresh_token.value;
    organizationId = parsedCookies.org_id.value;
    memberId = parsedCookies.member_id.value;
  });

  test("get logged user info", async () => {
    const response = await fetch("http://localhost:9090/v1/users", {
      method: "GET",
      headers: {
        Cookie: orchestrator.getCookieString({
          refreshToken: refreshTokenCookie,
          accessToken: accessTokenCookie,
          orgId: organizationId,
          memberId: memberId,
        }),
      },
    });

    const body = (await response.json()) as any;

    expect(body).toEqual({
      data: {
        user: {
          name: "Registration Flow",
          created_at: createdUser.created_at.toISOString(),
          email: "jonas@gmail.com",
          id: createdUser.id,
          updated_at: null,
        },
      },
      status: 200,
    });
  });
});
