import { activateRoute } from "../controllers/activation/activate";
import { Controller } from "../infra/shared/entities/Controller";
import { Route } from "../infra/shared/entities/Route";

const activationController = Controller.create({
  name: "activation",
  routeConversor: Route.fastifyRouterConversor,
});

activationController.appendRoute(activateRoute);

export { activationController };
