import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";
import { createApiKeyRoute } from "../controllers/organization/createApiKey";
import { upsertMemberRoute } from "../controllers/organization/upsertMember";
import { listUserOrganizationsRoute } from "../controllers/organization/listUserOrganizations";
import { createOrganizationInviteRoute } from "../controllers/organization/createOrganizationInvite";
import { listOrganizationInvitesRoute } from "../controllers/organization/listOrganizationInvites";
import { acceptOrganizationInviteRoute } from "../controllers/organization/acceptOrganizationInvite";
import { rejectOrganizationInviteRoute } from "../controllers/organization/rejectOrganizationInvite";

const organizationController = Controller.create({
  name: "Organization",
  routeConversor: Route.fastifyRouterConversor,
});

organizationController.appendRoute(createApiKeyRoute);
organizationController.appendRoute(upsertMemberRoute);
organizationController.appendRoute(listUserOrganizationsRoute);
organizationController.appendRoute(createOrganizationInviteRoute);
organizationController.appendRoute(listOrganizationInvitesRoute);
organizationController.appendRoute(acceptOrganizationInviteRoute);
organizationController.appendRoute(rejectOrganizationInviteRoute);

export { organizationController };
