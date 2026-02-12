import { db } from "@/src/infra/database/pool";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[POST] /v1/organizations/invites", () => {
  describe("Authenticated user", () => {
    test("with valid email", async () => {
      const { user: inviteeUser } = await orchestrator.createUser({
        email: "invitee.user@gmail.com",
      });
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
        "http://localhost:9090/v1/organizations/invites",
        {
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
            email: "invitee.user@gmail.com",
          }),
        },
      );

      const body = (await response.json()) as any;

      expect(response.status).toBe(201);
      expect(body).toEqual({
        status: 201,
        data: null,
      });

      const inviteOnDb = await db.organizationInvite.findFirst({
        where: {
          organization_id: organization.id,
          email: "invitee.user@gmail.com",
          status: "pending",
          deleted_at: null,
        },
      });

      expect(inviteOnDb).toMatchObject({
        id: expect.any(String),
        organization_id: organization.id,
        invited_by_user_id: activatedUser.id,
        invited_user_id: inviteeUser.id,
        email: "invitee.user@gmail.com",
        status: "pending",
        responded_at: null,
        deleted_at: null,
      });
    });
  });
});
