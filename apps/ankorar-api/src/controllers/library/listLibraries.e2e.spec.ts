import { libraryModule } from "@/src/models/library/LibraryModule";
import { mapModule } from "@/src/models/map/MapModule";
import { organizationModule } from "@/src/models/organization/OrganizationModule";
import { orchestrator } from "@/test/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("[GET] /v1/libraries", () => {
  describe("Authenticated user", () => {
    test("returns libraries from organization with linked maps", async () => {
      const { user: newUser } = await orchestrator.createUser({});
      const {
        user: activatedUser,
        organization,
        member,
      } = await orchestrator.activateUser(newUser.id);

      const newSession = await orchestrator.createSession({
        user: activatedUser,
      });

      const { library: libraryWithMaps } = await libraryModule.Libraries.create({
        organization_id: organization.id,
        name: "Biblioteca A",
      });

      await libraryModule.Libraries.create({
        organization_id: organization.id,
        name: "Biblioteca B",
      });

      const { user: secondUser } = await orchestrator.createUser({});
      const { user: secondActivatedUser } = await orchestrator.activateUser(
        secondUser.id,
      );

      const { member: secondMemberOnOrganization } =
        await organizationModule.Members.create({
          user_id: secondActivatedUser.id,
          org_id: organization.id,
          features: ["read:session", "read:organization"],
        });

      const { map } = await mapModule.Maps.create({
        member_id: secondMemberOnOrganization.id,
        title: "Mapa compartilhado",
      });

      await libraryModule.Libraries.connectMap({
        id: libraryWithMaps.id,
        organizationId: organization.id,
        mapId: map.id,
      });

      const response = await fetch("http://localhost:9090/v1/libraries", {
        method: "GET",
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
      expect(body.status).toBe(200);
      expect(body.data.libraries).toHaveLength(2);

      const libraryA = body.data.libraries.find(
        (library: { name: string }) => library.name === "Biblioteca A",
      );
      const libraryB = body.data.libraries.find(
        (library: { name: string }) => library.name === "Biblioteca B",
      );

      expect(libraryA).toBeTruthy();
      expect(libraryB).toBeTruthy();

      expect(libraryA.maps).toHaveLength(1);
      expect(libraryA.maps[0]).toMatchObject({
        id: map.id,
        title: "Mapa compartilhado",
      });

      expect(libraryB.maps).toHaveLength(0);
    });
  });
});
