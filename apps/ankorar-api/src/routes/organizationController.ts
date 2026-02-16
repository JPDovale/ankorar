import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";
import { cancelOrganizationInviteRoute } from "../controllers/organization/cancelOrganizationInvite";
import { createApiKeyRoute } from "../controllers/organization/createApiKey";
import { upsertMemberRoute } from "../controllers/organization/upsertMember";
import { listUserOrganizationsRoute } from "../controllers/organization/listUserOrganizations";
import { createOrganizationInviteRoute } from "../controllers/organization/createOrganizationInvite";
import { listOrganizationInvitesRoute } from "../controllers/organization/listOrganizationInvites";
import { listOrganizationMembersRoute } from "../controllers/organization/listOrganizationMembers";
import { acceptOrganizationInviteRoute } from "../controllers/organization/acceptOrganizationInvite";
import { rejectOrganizationInviteRoute } from "../controllers/organization/rejectOrganizationInvite";
import { removeMemberRoute } from "../controllers/organization/removeMember";
import { listApiKeysRoute } from "../controllers/organization/listApiKeys";
import { switchOrganizationContextRoute } from "../controllers/organization/switchOrganizationContext";

const organizationController = Controller.create({
  name: "Organization",
  routeConversor: Route.fastifyRouterConversor,
});

organizationController.appendRoute(createApiKeyRoute);
organizationController.appendRoute(listApiKeysRoute);
organizationController.appendRoute(listOrganizationMembersRoute);
organizationController.appendRoute(removeMemberRoute);
organizationController.appendRoute(cancelOrganizationInviteRoute);
organizationController.appendRoute(upsertMemberRoute);
organizationController.appendRoute(listUserOrganizationsRoute);
organizationController.appendRoute(createOrganizationInviteRoute);
organizationController.appendRoute(listOrganizationInvitesRoute);
organizationController.appendRoute(acceptOrganizationInviteRoute);
organizationController.appendRoute(rejectOrganizationInviteRoute);
organizationController.appendRoute(switchOrganizationContextRoute);

export { organizationController };
