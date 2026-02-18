import { defaultMemberFeatures } from "@/src/models/auth/Auth/fns/defaultMemberFeatures";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { userModule } from "@/src/models/user/UserModule";
import { orchestrator } from "@/test/orchestrator";

const { Users } = userModule;
const { Members } = organizationModule;

let api_key: string;
let org_id: string;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();

  const { user } = await orchestrator.createUser({});
  const { organization } = await orchestrator.activateUser(user.id);
  const { text } = await orchestrator.createApiKeyForOrganization({
    organization,
  });

  org_id = organization.id;
  api_key = text;
});

describe("[POST] /v1/organizations/members/upsert", () => {
  describe("Anonymous user", () => {
    describe("With valid fields", () => {
      test("with non existent ext id user", async () => {
        const response = await fetch(
          "http://localhost:9090/v1/organizations/members/upsert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: "jonas@gmail.com",
              name: " Jonas ",
              ext_id: "one_valid_external_id",
            }),
          },
        );

        const body = (await response.json()) as any;

        expect(response.status).toBe(403);
        expect(body).toEqual({
          status: 403,
          error: {
            action:
              "Verifique se você tem as permissões necessárias para executar essa função",
            message: "Usuário não tem permissão para executar essa função.",
            name: "PermissionDenied",
            status_code: 403,
          },
        });
      });
    });
  });

  describe("Authenticated with api key", () => {
    describe("With valid fields", () => {
      test("with non existent ext id user", async () => {
        const response = await fetch(
          "http://localhost:9090/v1/organizations/members/upsert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": api_key,
            },
            body: JSON.stringify({
              email: "jonas@gmail.com",
              name: " Jonas ",
              ext_id: "one_valid_external_id",
            }),
          },
        );

        const body = (await response.json()) as any;

        expect(body).toEqual({
          data: null,
          status: 201,
        });

        const { user } = await Users.fns.findByEmail({
          email: "jonas@gmail.com",
        });

        expect(user?.toJson()).toEqual({
          id: expect.any(String),
          name: "Jonas",
          email: "jonas@gmail.com",
          password: null,
          created_at: expect.any(Date),
          ext_id: "one_valid_external_id",
          updated_at: null,
          deleted_at: null,
        });

        const { member } = await Members.fns.findByUserIdAndOrgId({
          orgId: org_id,
          userId: user!.id,
        });

        expect(member.toJson()).toEqual({
          created_at: expect.any(Date),
          deleted_at: null,
          features: defaultMemberFeatures,
          id: expect.any(String),
          org_id: expect.any(String),
          updated_at: null,
          user_id: expect.any(String),
        });
      });

      test("with existent ext id user", async () => {
        const response = await fetch(
          "http://localhost:9090/v1/organizations/members/upsert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": api_key,
            },
            body: JSON.stringify({
              email: "jonas@gmail.com",
              name: " Jonas ",
              ext_id: "one_valid_external_id",
            }),
          },
        );

        const body = (await response.json()) as any;

        expect(body).toEqual({
          data: null,
          status: 201,
        });

        const { user } = await Users.fns.findByEmail({
          email: "jonas@gmail.com",
        });

        expect(user?.toJson()).toEqual({
          id: expect.any(String),
          name: "Jonas",
          email: "jonas@gmail.com",
          password: null,
          created_at: expect.any(Date),
          ext_id: "one_valid_external_id",
          updated_at: expect.any(Date),
          deleted_at: null,
        });

        const { member } = await Members.fns.findByUserIdAndOrgId({
          orgId: org_id,
          userId: user!.id,
        });

        expect(member.toJson()).toEqual({
          created_at: expect.any(Date),
          deleted_at: null,
          features: defaultMemberFeatures,
          id: expect.any(String),
          org_id: expect.any(String),
          updated_at: expect.any(Date),
          user_id: expect.any(String),
        });
      });

      test("with existent email", async () => {
        const response = await fetch(
          "http://localhost:9090/v1/organizations/members/upsert",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Api-Key": api_key,
            },
            body: JSON.stringify({
              email: "jonas@gmail.com",
              name: " Jonas ",
              ext_id: "other_valid_external_id",
            }),
          },
        );

        const body = (await response.json()) as any;

        expect(body).toEqual({
          error: {
            action: "Tente novamente com outro e-mail.",
            message: "Usuário já existe.",
            name: "UserAlreadyExists",
            status_code: 409,
          },
          status: 409,
        });
      });
    });
  });
});
