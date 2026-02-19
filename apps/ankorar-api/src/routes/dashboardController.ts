import { dashboardAiUsageRoute } from "../controllers/dashboard/aiUsage";
import { dashboardActivityRoute } from "../controllers/dashboard/activity";
import { dashboardOpenAiCostsRoute } from "../controllers/dashboard/openaiCosts";
import { dashboardChurnRoute } from "../controllers/dashboard/churn";
import { dashboardMrrRoute } from "../controllers/dashboard/mrr";
import { dashboardOverviewRoute } from "../controllers/dashboard/overview";
import { dashboardSubscriptionsRoute } from "../controllers/dashboard/subscriptions";
import { dashboardUsersRecentRoute } from "../controllers/dashboard/usersRecent";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const dashboardController = Controller.create({
  name: "Dashboard",
  routeConversor: Route.fastifyRouterConversor,
});

dashboardController.appendRoute(dashboardOverviewRoute);
dashboardController.appendRoute(dashboardUsersRecentRoute);
dashboardController.appendRoute(dashboardChurnRoute);
dashboardController.appendRoute(dashboardMrrRoute);
dashboardController.appendRoute(dashboardSubscriptionsRoute);
dashboardController.appendRoute(dashboardAiUsageRoute);
dashboardController.appendRoute(dashboardOpenAiCostsRoute);
dashboardController.appendRoute(dashboardActivityRoute);

export { dashboardController };
