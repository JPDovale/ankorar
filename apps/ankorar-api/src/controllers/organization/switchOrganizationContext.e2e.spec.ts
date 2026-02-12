import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { orchestrator } from "@/test/orchestrator";
import { parse } from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[PATCH] /v1/organizations/context", () => {
  describe("Authenticated user", () => {
    test("switch current context when user is member of target organization", async () => {
      const { user: memberUser } = await orchestrator.createUser({
        email: "switch-member@gmail.com",
      });
      const {
        user: activatedMemberUser,
        organization: firstOrganization,
        member: firstMember,
      } = await orchestrator.activateUser(memberUser.id);
      const memberSession = await orchestrator.createSession({
        user: activatedMemberUser,
      });

      const { user: secondOrgOwnerUser } = await orchestrator.createUser({
        email: "switch-owner@gmail.com",
      });
      const { organization: secondOrganization } =
        await orchestrator.activateUser(secondOrgOwnerUser.id);

      const { member: secondOrganizationMember } =
        await organizationModule.Members.create({
          user_id: activatedMemberUser.id,
          org_id: secondOrganization.id,
          features: ["read:session", "read:organization"],
        });

      const response = await fetch(
        "http://localhost:9090/v1/organizations/context",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: orchestrator.getCookieString({
              refreshToken: memberSession.refreshToken.token,
              accessToken: memberSession.accessToken.token,
              orgId: firstOrganization.id,
              memberId: firstMember.id,
            }),
          },
          body: JSON.stringify({
            organization_id: secondOrganization.id,
          }),
        },
      );

      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body).toEqual({
        status: 200,
        data: null,
      });

      const parsedCookies = parse(response.headers.getSetCookie(), {
        map: true,
      });

      expect(parsedCookies.refresh_token).toBeDefined();
      expect(parsedCookies.access_token).toBeDefined();
      expect(parsedCookies.org_id).toMatchObject({
        value: secondOrganization.id,
      });
      expect(parsedCookies.member_id).toMatchObject({
        value: secondOrganizationMember.id,
      });
    });

    test("returns forbidden when user is not member of target organization", async () => {
      const { user: memberUser } = await orchestrator.createUser({
        email: "switch-member-forbidden@gmail.com",
      });
      const {
        user: activatedMemberUser,
        organization: firstOrganization,
        member: firstMember,
      } = await orchestrator.activateUser(memberUser.id);
      const memberSession = await orchestrator.createSession({
        user: activatedMemberUser,
      });

      const { user: secondOrgOwnerUser } = await orchestrator.createUser({
        email: "switch-owner-forbidden@gmail.com",
      });
      const { organization: secondOrganization } =
        await orchestrator.activateUser(secondOrgOwnerUser.id);

      const response = await fetch(
        "http://localhost:9090/v1/organizations/context",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: orchestrator.getCookieString({
              refreshToken: memberSession.refreshToken.token,
              accessToken: memberSession.accessToken.token,
              orgId: firstOrganization.id,
              memberId: firstMember.id,
            }),
          },
          body: JSON.stringify({
            organization_id: secondOrganization.id,
          }),
        },
      );

      const body = (await response.json()) as any;

      expect(response.status).toBe(403);
      expect(body).toEqual({
        status: 403,
        error: {
          name: "PermissionDenied",
          message: "Usuário não tem permissão para executar essa função.",
          action:
            "Verifique se você tem as permissões necessárias para executar essa função",
          status_code: 403,
        },
      });
    });
  });
});
