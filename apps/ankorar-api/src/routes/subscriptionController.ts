import { createCheckoutSessionRoute } from "../controllers/subscription/createCheckoutSession";
import { createCustomerPortalSessionRoute } from "../controllers/subscription/createCustomerPortalSession";
import { getUserSubscriptionRoute } from "../controllers/subscription/getUserSubscription";
import { listPlansRoute } from "../controllers/subscription/listPlans";
import { stripeWebhookRoute } from "../controllers/subscription/stripeWebhook";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const subscriptionController = Controller.create({
  name: "Subscription",
  routeConversor: Route.fastifyRouterConversor,
});

subscriptionController.appendRoute(listPlansRoute);
subscriptionController.appendRoute(createCheckoutSessionRoute);
subscriptionController.appendRoute(createCustomerPortalSessionRoute);
subscriptionController.appendRoute(getUserSubscriptionRoute);
subscriptionController.appendRoute(stripeWebhookRoute);

export { subscriptionController };
