import { cryptoModule } from "@/src/models/crypto/CryptoModule";
import { orchestrator } from "@/test/orchestrator";

const { ApiKeys } = cryptoModule;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/organizations/api_keys", () => {
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

      const response = await fetch(
        "http://localhost:9090/v1/organizations/api_keys",
        {
          method: "POST",
          headers: {
            Cookie: orchestrator.getCookieString({
              refreshToken: newSession.refreshToken.token,
              accessToken: newSession.accessToken.token,
              orgId: organization.id,
              memberId: member.id,
            }),
          },
        },
      );

      const body = (await response.json()) as any;

      expect(response.status).toBe(201);
      expect(body).toEqual({
        status: 201,
        data: {
          api_key: expect.any(String),
        },
      });

      const text = body.data.api_key;
      const { secret, prefix, env } = ApiKeys.fns.computeText({ text });
      const { apiKey } = await ApiKeys.fns.findByPrefix({ prefix });

      expect(secret).not.toEqual(apiKey.secret);
      expect(apiKey.toJson()).toEqual({
        env,
        prefix,
        secret: expect.any(String),
        updated_at: null,
        revoked_at: null,
        deleted_at: null,
        expires_at: null,
        organization_id: organization.id,
        last_used_at: expect.any(Date),
        created_at: expect.any(Date),
        id: expect.any(String),
        features: ["create:user:other"],
      });
    });
  });
});
