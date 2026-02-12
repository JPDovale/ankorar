import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";
import { createApiKeyRoute } from "../controllers/organization/createApiKey";
import { upsertMemberRoute } from "../controllers/organization/upsertMember";

const organizationController = Controller.create({
  name: "Organization",
  routeConversor: Route.fastifyRouterConversor,
});

organizationController.appendRoute(createApiKeyRoute);
organizationController.appendRoute(upsertMemberRoute);

export { organizationController };
