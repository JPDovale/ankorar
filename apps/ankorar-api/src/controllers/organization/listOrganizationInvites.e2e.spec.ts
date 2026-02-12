import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/organizations/invites", () => {
  describe("Authenticated user", () => {
    test("list pending invites targeted to authenticated user id", async () => {
      const { user: ownerUser } = await orchestrator.createUser({
        email: "owner-org@gmail.com",
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
        email: "invitee-org@gmail.com",
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

      const response = await fetch(
        "http://localhost:9090/v1/organizations/invites",
        {
          method: "GET",
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
        data: {
          invites: [
            {
              id: expect.any(String),
              email: inviteeActivatedUser.email,
              status: "pending",
              created_at: expect.any(String),
              organization: {
                id: ownerOrganization.id,
                name: ownerOrganization.name,
              },
              invited_by_user: {
                id: ownerActivatedUser.id,
                name: ownerActivatedUser.name,
                email: ownerActivatedUser.email,
              },
            },
          ],
        },
      });
    });
  });
});
