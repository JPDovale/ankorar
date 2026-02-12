import { db } from "@/src/infra/database/pool";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[PATCH] /v1/organizations/invites/:invite_id/reject", () => {
  describe("Authenticated user", () => {
    test("reject pending invite", async () => {
      const { user: ownerUser } = await orchestrator.createUser({
        email: "owner-reject@gmail.com",
      });
      const {
        user: ownerActivatedUser,
        organization: ownerOrganization,
        member: ownerMember,
      } = await orchestrator.activateUser(ownerUser.id);
      const ownerSession = await orchestrator.createSession({
        user: ownerActivatedUser,
      });

      const { user: inviteeUser } = await orchestrator.createUser({
        email: "invitee-reject@gmail.com",
      });
      const {
        user: inviteeActivatedUser,
        organization: inviteeOrganization,
        member: inviteeMember,
      } = await orchestrator.activateUser(inviteeUser.id);
      const inviteeSession = await orchestrator.createSession({
        user: inviteeActivatedUser,
      });

      await fetch("http://localhost:9090/v1/organizations/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: orchestrator.getCookieString({
            refreshToken: ownerSession.refreshToken.token,
            accessToken: ownerSession.accessToken.token,
            orgId: ownerOrganization.id,
            memberId: ownerMember.id,
          }),
        },
        body: JSON.stringify({
          email: inviteeActivatedUser.email,
        }),
      });

      const inviteOnDb = await db.organizationInvite.findFirst({
        where: {
          organization_id: ownerOrganization.id,
          invited_user_id: inviteeActivatedUser.id,
          status: "pending",
          deleted_at: null,
        },
      });

      expect(inviteOnDb).toBeDefined();

      const response = await fetch(
        `http://localhost:9090/v1/organizations/invites/${inviteOnDb?.id}/reject`,
        {
          method: "PATCH",
          headers: {
            Cookie: orchestrator.getCookieString({
              refreshToken: inviteeSession.refreshToken.token,
              accessToken: inviteeSession.accessToken.token,
              orgId: inviteeOrganization.id,
              memberId: inviteeMember.id,
            }),
          },
        },
      );

      const body = (await response.json()) as any;

      expect(response.status).toBe(200);
      expect(body).toEqual({
        status: 200,
        data: null,
      });

      const rejectedInviteOnDb = await db.organizationInvite.findUnique({
        where: {
          id: inviteOnDb?.id,
        },
      });

      expect(rejectedInviteOnDb).toMatchObject({
        id: inviteOnDb?.id,
        status: "rejected",
        responded_at: expect.any(Date),
      });

      const newMemberOnDb = await db.member.findFirst({
        where: {
          org_id: ownerOrganization.id,
          user_id: inviteeActivatedUser.id,
          deleted_at: null,
        },
      });

      expect(newMemberOnDb).toBeNull();
    });
  });
});
